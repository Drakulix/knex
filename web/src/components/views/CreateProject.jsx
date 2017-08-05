import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import UrlInputList from '../common/chips/UrlInputList'
import Backend from '../common/Backend'
import Moment from 'moment'
import history from '../common/history'
import AuthorInputList from '../common/chips/AuthorInputList'
import TagInputList from '../common/chips/TagInputList'
import {StatusInput} from '../common/Status'
import Spinner from '../common/Spinner'

export default class CreateProject extends Component {

  constructor(props) {
    super(props)
    if(props.fromURL){
      this.state = {
        projectInf : props.projectInf,
        date : props.date,
        snackbar : false,
        site_loaded : true,
        project_exists : false,
      }
    } else {
      this.state = {
        projectID : this.props.match.params.uuid,
        projectInf : {
          status : "IN_PROGRESS",
          title : "",
          description : "",
          date_creation : Moment().format("YYYY-MM-DD"),
          tags : [],
          url : [],
          authors : [Backend.getMail()],
        },
        date : Moment().toDate(),
        snackbar : false,
        site_loaded : true,
        project_exists : false,
      }
    }

    this.handleUpload = this.handleUpload.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
  }

  handleChange(event) {
    const name = event.target.name
    var value = event.target.value
    var projectInf = this.state.projectInf
    projectInf[name] = value
    this.setState({ projectInf : projectInf})
  }

  handleStatusChange = (event, index, value) => {
    var projectInf = this.state.projectInf
    projectInf.status = value
    this.setState({projectInf : projectInf})
  }

  handleChangeDate(event, date) {
    var projectInf = this.state.projectInf
    projectInf.date_creation = Moment(date).format("YYYY-MM-DD")
    this.setState({
      date : date,
      projectInf : projectInf
    })
  }

  componentWillMount(){
    if(this.state.projectID !== undefined){
      this.setState({site_loaded : false})
      this.loadProjectInf(this.state.projectID)
    }
  }

  loadProjectInf(uuid) {
    Backend.getProject(uuid).then(data => {
      this.setState({projectInf : data})
      if(!data){
        this.setState({ project_exists : false,
                        site_loaded : true,})
      }else{
          this.setState({
          project_exists : true,
          site_loaded : true,
          projectInf : data,
          date : Moment(data.date_creation, "YYYY-MM-DD").toDate()
        })
      }
    })
  }

  handleUpload(event){
    event.preventDefault()
    this.setState({site_loaded : false})
    var projectInf = this.state.projectInf
    delete projectInf.is_bookmark
    delete projectInf.is_owner
    if( this.state.projectID === undefined){
      Backend.addProject(projectInf)
      .then((id) =>{
        history.push(`/project/${JSON.parse(id)[0]}`)
      })
    }
    else{
      Backend.updateProject(this.state.projectID, projectInf).then(
        history.push(`/project/${this.state.projectID}`)
      )
    }
  }

  isInValid(){
    return      this.state.projectInf.title === ''
    ||  this.state.projectInf.date_creation === ''
    ||  this.state.projectInf.description === ''
    ||  this.state.projectInf.authors.length === 0
    ||  this.state.projectInf.url.length === 0
    ||  this.state.projectInf.status === 0
  }

  componentDidMount(){
    if(this.props.fromURL&&(this.state.status!==this.props.status)){
      this.setState({status : this.props.status})
    }
  }

  render() {
    if(!this.state.site_loaded ){
      return (
        <Spinner loading = {true} text = {"Loading Project"}/>
      )
    }
    if(!this.state.project_exists && this.state.projectID){
      return (
        <div className = "container">
          <div className = "headerCreation">Project Not Found</div>
        </div>
      )
    }else{
      return(
        <div className = "container">
          <Snackbar
            open = {this.state.snackbar}
            message = {(this.state.projectID === undefined) ? "New project added" : "Project updated"}
            autoHideDuration = {10000}
          />
          <div className = "headerCreation" style = {{width : "100%"}}>
            {(this.state.projectID !== undefined) ? "Edit project" : "Create a new project"}
          </div>
          <form>
            <div className = "profile-info">Title</div>
            <div className = "row">
              <div className = "col-10">
                <TextField  value = {this.state.projectInf.title}
                  name = "title"
                  onChange = {this.handleChange}
                  hintText = "Add title..."
                  fullWidth = {true}
                  style = {{marginBottom : (this.state.projectInf.title === "") ? 0 : 17} }
                  errorText = {(this.state.projectInf.title === "") ?
                                "Please provide a title" : ""}
                  />
              </div>
              <div className = "col-2">
                <RaisedButton label = {this.state.projectID === undefined ? "create Project" : "Submit changes"}
                                disabled = {this.isInValid()}
                                onClick = {this.handleUpload}
                                fullWidth = {true}
                                primary = {true}/>
              </div>
            </div>
            <div className = "row">
              <div className = "col-4">
                <div className = "row">
                  <div className = "col-6">
                    <div className = "profile-info">Creation date</div>
                    <div>
                      <DatePicker hintText = "Pick a creation Date..."
                        value = {this.state.date}
                        mode = "landscape"
                        onChange = {this.handleChangeDate}
                        style = {{display : "inline"}}
                        textFieldStyle = {{width : '100%', marginTop : 8}}
                        errorText = {(this.state.date === "") ?
                                    "Please provide a creation date" : ""}
                        />
                    </div>
                  </div>
                  <div className = "col-6">
                    <div className = "profile-info">Status</div>
                    <div>
                      <StatusInput onChange = {this.handleStatusChange}
                                  value = {this.state.projectInf.status}
                                  />
                    </div>
                  </div>
                </div>
                <div className = "profile-info">Authors</div>
                <AuthorInputList  onChange = {this.handleChange}
                                  name = "authors"
                                  filtered = {true}
                                  value = {this.state.projectInf.authors}
                                  style = {{marginBottom : (this.state.projectInf.authors.length === 0) ? 0 : 17} }
                                  errorText = {(this.state.projectInf.authors.length === 0) ?
                                        "Please provide at least one author" : ""}
                />
                <div className = "profile-info">Links</div>
                <UrlInputList name = "url"
                              value = {this.state.projectInf.url}
                              onChange = {this.handleChange}
                              style = {{marginBottom : (this.state.projectInf.url.length === 0) ? 0 : 17} }
                              errorText = {(this.state.projectInf.url.length === 0
                                        ) ? "Please provide at least one url" : ""}
                />


              </div>
              <div className = "col-1"></div>
              <div className = "col-7">
                <div className = "profile-info"> Tags</div>
                <TagInputList onChange = {this.handleChange}
                              name = "tags"
                              value = {this.state.projectInf.tags}
                />
                <div className = "profile-info" style = {{marginTop : 12}}>Description</div>
                <TextField  value = {this.state.projectInf.description}
                            onChange = {this.handleChange}
                            name = "description"
                            hintText = "Add description..."
                            style = {{ marginTop : 6,   marginBottom : (this.state.projectInf.description === "") ? 0 : 17} }
                            multiLine = {true}
                            fullWidth = {true}
                            errorText = {(this.state.projectInf.description === "") ?
                                  "Please provide a description" : ""}
                />
              </div>
            </div>
          </form>
        </div>
      )
    }
  }
}
