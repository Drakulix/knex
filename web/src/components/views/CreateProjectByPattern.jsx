import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import CircularProgress from 'material-ui/CircularProgress'
import ChipInputList from '../common/ChipInputList'
import {fetchJson } from '../common/Backend.jsx'


const statusString = [
  {text :<span className="badge badge-success">DONE</span>, value : "DONE"},
  {text :<span className="badge badge-info">IN_REVIEW</span>, value : "IN_REVIEW"},
  {text :<span className="badge badge-warning">IN_PROGRESS</span>, value : "IN_PROGRESS"},
]

export default class UploadByPattern extends Component {


  constructor(props) {
    super(props)
    if(props.fromURL){
      this.state = {
        projectInf:props.projectInf,
        status :  props.status,
        authors: props.authors,
        suggestedAuthors: [],
        suggestedTags : [],
        invalid : true,
        snackbar : false,
        site_loaded: false,
        project_exists: false,
      }
    } else {
      this.state = {
        projectID: this.props.match.params.uuid,
        projectInf:{
          status: "IN_PROGRESS",
          title :"",
          description: "",
          date_creation: "2012-12-12",
          tags: [],
          url: []
        },
        authors: [],
        invalid : true,
        snackbar : false,
        site_loaded: false,
        project_exists: false,
      }
    }

    this.handleUpload = this.handleUpload.bind(this)
    this.handleURLChange = this.handleURLChange.bind(this)
    this.handleAuthorChange = this.handleAuthorChange.bind(this)
    this.handleTagChange = this.handleTagChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
  }


  handleAuthorChange(value) {
    this.setState({authors : value})
    var authors = []
    for (var i in value) {
      var string = value[i]
      var name = string.substring(0, string.lastIndexOf("(")-1)
      var id = string.substring(string.lastIndexOf("(")+1, string.length-1)
      authors.push({"name" : name, "email" :id})
    }

    this.setState({projectInf: {authors : value}})
  }

  handleTagChange(value) {
    this.setState({projectInf: {tags:value}})
  }

  handleURLChange(value) {
    this.setState({projectInf: {url :value}})
  }

  handleTitleChange(event,value) {
    this.setState({projectInf: {title:value}})
  }

  handleDescriptionChange(event,value) {
    this.setState({projectInf: {description : value}})
  }

  handleStatusChange = (event, index, value) => {
    this.setState({projectInf: {status:value}})
  }

  handleChangeDate = (event, date) => {
    var mm = date.getMonth()+1
    var dd = date.getDate()
    var dateString =  [date.getFullYear(),'-', ((mm > 9) ? '' :'0')+ mm, '-', ((dd> 9) ? '':'0')+ dd].join('')
    this.setState({
      date: date,
      projectInf: {date_creation:dateString}
    })
  }

  componentWillMount(){
    if(this.state.projectID !== undefined){
      this.loadProjectInf(this.state.projectID)
    }
  }

  fetchProjectInfo(uuid){
    return fetch('/api/projects/' + uuid, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
      headers: {
        "Accept": "application/json",
      }
    }).then(response => response.json()).catch(ex => {
      console.error('parsing failes', ex)
    })
  }

  loadProjectInf(uuid) {
    // Load Project info into state
    this.fetchProjectInfo(uuid).then(data => {
      this.setState({projectInf: data})
      if(!data){
        this.setState({project_exists: false})
      }else{
        this.setState({project_exists: true})
      }
      var authorArray = []
      var authors = data.authors
      for (var i in data.authors) {
        authorArray = authorArray.concat([data.authors[i].name + " ("+ data.authors[i].email+ ")"])
      }
      this.setState({
        projectInf: data,
        authors : authors,
        date: new Date( data.date_creation.split("-")[0],
        data.date_creation.split("-")[1]-1,
        data.date_creation.split("-")[2],0,0,0,0)
      })
      this.setState({site_loaded: true})
    }).catch(ex => {
      this.setState({project_exists: false})
      this.setState({site_loaded: true})
    })
  }

  handleUpload(event){
    event.preventDefault()
    console.log(event)
    this.submit()
  }

  submit(){
    var data = JSON.stringify(this.state.projectInf)
    var xhr = new XMLHttpRequest()
    xhr.withCredentials = true
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText)
      }
    })
    xhr.open("POST", "/api/projects")
    xhr.setRequestHeader("content-type", "application/json")
    xhr.send(data)
    this.setState({snackbar:true})
  }

  isInValid(){
    return      this.state.projectInf.title === ''
    ||  this.state.projectInf.date_creation === ''
    ||  this.state.projectInf.description === ''
//    ||  this.state.projectInf.authors.length === 0
  //  ||  this.state.projectInf.url.length === 0
    ||  this.state.projectInf.status === 0
  }

  componentDidMount(){
    /* Some bug resets this.state.status initialy to [].
    * This happens inbetween the end of componentWillMount()
    * and the beginning of the first time the component renders.
    * This is a temporary workaround until the issue is resolved.
    * Please don't remove this unless you know how to fix it.
    */

    fetchJson('/api/projects/tags').then(function(tags) {
      this.setState({
        suggestedTags: tags
      })
    }.bind(this))

    //gets all the authors from the backend
    fetchJson('/api/users').then(function(authors) {
      var suggestedAuthors = authors
      var suggestedAuthorsArray = []
      for (var i in suggestedAuthors) {
        suggestedAuthorsArray = suggestedAuthorsArray.concat([
          suggestedAuthors[i].first_name + " "
          +suggestedAuthors[i].last_name +
          " ("+suggestedAuthors[i].email+ ")"])
<<<<<<< HEAD
=======
        date: date,
        projectInf: projectInf
      });
    };

    componentWillMount(){

          //TODO LOADAuthorsFromBackend

          var suggestedAuthors = [{email:"marko@knex", name :"Marko"},
                {email:"victor@knex", name :"Victor"},{email:"cedric@knex", name :"Cedric"}];
          var suggestedAuthorsArray = []
          for (var i in suggestedAuthors) {
            suggestedAuthorsArray = suggestedAuthorsArray.concat([suggestedAuthors[i].name + " ("+suggestedAuthors[i].email+ ")"]);
          }

          //TODO LOADTagsFromBackend
          var suggestedTags = ["your", "tags", "here"];


          if(this.state.projectID !== undefined){
               this.loadProjectInf(this.state.projectID);
          }

          this.setState({
              suggestedAuthors: suggestedAuthorsArray,
              suggestedTags : suggestedTags,
          });
        }

        fetchProjectInfo(uuid){
          return fetch('/api/projects/' + uuid, {
            method: 'GET',
            mode: 'no-cors',
            credentials: 'include',
            headers: {
              "Accept": "application/json",
            }
          }).then(response => response.json()).catch(ex => {
            console.error('parsing failes', ex);
          });
        }

      loadProjectInf(uuid) {
        // Load Project info into state
        this.fetchProjectInfo(uuid).then(data => {
          this.setState({projectInf: data});
          if(!data){
            this.setState({project_exists: false});
          }else{
            this.setState({project_exists: true})
          }
          var authorArray = []
          var authors = data.authors
          for (var i in data.authors) {
            authorArray = authorArray.concat([data.authors[i].name + " ("+ data.authors[i].email+ ")"]);
          }

          var status = data.status;
          var stateValue=  statusString.filter(
          function(stateField){return status === stateField }
          );

          this.setState({
            projectInf: data,
            date: new Date( data.date_creation.split("-")[0],
                            data.date_creation.split("-")[1]-1,
                            data.date_creation.split("-")[2],0,0,0,0),
            status : stateValue,
            authors : authors

          });

          //this feature is disabled (see below in the rendermethod)
          this.setState({site_loaded: true})

>>>>>>> 00aa20e... Hasty Hotfix for edit projects
=======
>>>>>>> c906a10... Fixed minor BUG
        }
        console.log(suggestedAuthorsArray)
        this.setState({
          suggestedAuthors: suggestedAuthorsArray
        })
      }.bind(this))
      if(this.props.fromURL&&(this.state.status!==this.props.status)){
        this.setState({status : this.props.status})
      }
    }

    render() {
      if(!this.state.site_loaded && this.state.projectID){
        return (
          <div className="container">
            <div className="header"><CircularProgress size={80} thickness={5} /></div>
          </div>
        )
      }
      if(!this.state.project_exists && this.state.projectID){
        return (
          <div className="container">
            <div className="header">Project Not Found</div>
          </div>
        )
      }else{
        return(
          <div className="container">
            <div className="innerContainer">
              <div className = "headerCreation" style={{width:"100%"}}>
                {(this.state.projectID !== undefined) ? "Edit project" : "Add new project"}
<<<<<<< HEAD
=======

      submit(){
        var data = JSON.stringify(this.state.projectInf);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            console.log(this.responseText);
          }
        });

        xhr.open("POST", "/api/projects");
        xhr.setRequestHeader("content-type", "application/json");

        xhr.send(data);
        // sendJson("POST", "/api/projects", this.state.projectInf)
        this.setState({snackbar:true});
        }

        isInValid(){
          return      this.state.projectInf["title"] === ''
          ||  this.state.projectInf["date_creation"] === ''
          ||  this.state.projectInf["description"] === ''
          ||  this.state.authors.length === 0
          ||  this.state.status.length === 0;
        }

        componentDidMount(){
          /* Some bug resets this.state.status initialy to [].
           * This happens inbetween the end of componentWillMount()
           * and the beginning of the first time the component renders.
           * This is a temporary workaround until the issue is resolved.
           * Please don't remove this unless you know how to fix it.
           */
           if(this.props.fromURL&&(this.state.status!==this.props.status)){
             this.setState({status : this.props.status});
           }



           fetchJson('/api/projects/tags').then(function(tags) {
             this.setState({
               suggestedTags: tags
             });
           }.bind(this));

           //gets all the authors from the backend
           fetchJson('/api/users').then(function(authors) {
             var suggestedAuthors = authors;
             var suggestedAuthorsArray = []
             for (var i in suggestedAuthors) {
               suggestedAuthorsArray = suggestedAuthorsArray.concat([
                                          suggestedAuthors[i].first_name + " "
                                          +suggestedAuthors[i].last_name +
                                          " ("+suggestedAuthors[i].email+ ")"]);
             }
             console.log(suggestedAuthorsArray);
             this.setState({
               suggestedAuthors: suggestedAuthorsArray
             });
           }.bind(this));

        }

        render() {
          /*
           * using this.state.site_loaded here will crash the entire page.
           * dont bring it back, before it no longer does that!
          if(!this.state.site_loaded && this.state.projectID){
            return (
              <div className="container">
                <div className="header"><CircularProgress size={80} thickness={5} /></div>
              </div>
            );
          }*/
          if(!this.state.project_exists && this.state.projectID){
            return (
              <div className="container">
                <div className="header"><CircularProgress size={80} thickness={5} /></div>
>>>>>>> 00aa20e... Hasty Hotfix for edit projects
=======
>>>>>>> c906a10... Fixed minor BUG
              </div>
              <form>
                <div>
                  <div className="profile-info">Title</div>
                  <TextField  value={this.state.projectInf.title}
                    onChange={this.handleTitleChange}
                    hintText="Add title..."
                    style={{width:'100%'}}
                    errorText={(this.state.projectInf.title==="") ? this.props.titleErrorText : ""}
                    />
                </div>
                <div className="row">
                  <div className="col-4">
                    <div className="row">
                      <div className="col-6">
                        <div className="profile-info">Creation date</div>
                        <div>
                          <DatePicker hintText="Pick a creation Date..."
                            value={this.state.date}
                            mode="landscape"
                            onChange={this.handleChangeDate}
                            style={{display: "inline"}}
                            textFieldStyle={{width: '100%', marginTop:8}}
                            errorText={(this.state.date==="") ? this.props.dateErrorText : ""}
                            />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="profile-info">Status</div>
                        <div>
                          <DropDownMenu
                            value={this.state.projectInf.status}
                            onChange={this.handleStatusChange}
                            labelStyle={{width: '100%', paddingLeft:0}}
                            underlineStyle={{width: '100%', marginLeft:0}}
                            autoWidth={false}
                            style={{width: '100%'}}
                            errorText={(this.state.projectInf.status==="") ? this.props.statusErrorText : ""}
                            >
                            {statusString.map(item =><MenuItem value={item.value} primaryText={item.text} />)}
                          </DropDownMenu>
                        </div>
                      </div>
                    </div>
                    <div className="profile-info">Authors</div>
                    <ChipInputList suggestions = {this.state.suggestedAuthors}
                      onChange={this.handleAuthorChange}
                      filtered ={true}
                      value={this.state.authors}
                      hintText={'Add authors...'}
                      errorText={(this.state.authors.length === 0) ? this.props.authorsErrorText : ""}
                      />
                    <div className="profile-info">Links</div>
                    <ChipInputList
                      value={this.state.projectInf.url}
                      onChange={this.handleURLChange}
                      errorText={(
true
                      //  this.state.projectInf.url.length === 0
                      ) ? this.props.urlErrorText : ""}
                      hintText='Add Links...'/>
                  </div>
                  <div className="col-1"></div>
                  <div className="col-7">
                    <div className="profile-info"> Tags</div>
                    <ChipInputList suggestions = {this.state.suggestedTags}
                      onChange={this.handleTagChange}
                      value={this.state.projectInf.tags}
                      hintText={'Add tags...'}
                      />
                    <div className="profile-info">Description</div>
                    <TextField  value={this.state.projectInf.description}
                      onChange={this.handleDescriptionChange}
                      hintText="Add description..."
                      style={{width:'100%'}}
                      multiLine={true}
                      errorText={(this.state.projectInf.description==="") ? this.props.descriptionErrorText : ""}
                      />
                    <div className="row" style={{marginTop:100}}>
                      <div className="col-10"></div>
                      <div className="col-1" >
                        <RaisedButton label="Submit"
                          disabled={this.isInValid()}
                          onClick={this.handleUpload}
                          primary={true}/>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <Snackbar
              open={this.state.snackbar}
              message="New project added!"
              autoHideDuration={10000}
              />
          </div>
        )
      }
    }
  }

  UploadByPattern.defaultProps = {
    authorsErrorText: 'Please provide at least one author',
    titleErrorText: 'Please provide a title',
    dateErrorText: 'Please provide a creation date',
    descriptionErrorText: 'Please provide a description',
    statusErrorText: 'Please provide a status',
    urlErrorText: 'Please provide at least one url'
  }
