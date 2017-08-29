import React, { Component } from 'react'
import Backend from '../common/Backend'
import AuthorOutputList from '../common/chips/AuthorOutputList'
import TagOutputList from '../common/chips/TagOutputList'
import UrlOutputList from '../common/chips/UrlOutputList'
import Status from '../common/Status'
import Spinner from '../common/Spinner'
import ProjectControls from '../common/projectComponents/ProjectControls'
import HeadLine from '../common/HeadLine'


export default class ProjectContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      projectID: this.props.match.params.uuid,
      projectInf: {},
      project_exists: false,
      is_bookmark: false,
      canEdit: false,
      myEmail: Backend.getMail(),
      meta: {
        authors: {},
        is_bookmark : false
      }
    }

    this.updateBookmarkState = this.updateBookmarkState.bind(this)
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.match.params.uuid !== this.state.projectID){
      this.setState({projectID: nextProps.match.params.uuid})
      this.loadSiteInf(nextProps.match.params.uuid)
    }
  }

  componentDidMount(){
    this.loadSiteInf(this.state.projectID)
  }

  updateBookmarkState(value) {
    var meta = this.state.meta
    meta.is_bookmark = value
    this.setState({meta : meta})
  }

  loadSiteInf(uuid) {
    Backend.getProjectMetaData(uuid).then(meta => {
      this.setState({meta : meta})
    })
    .then(
      Backend.getProject(uuid).then(data => {
        var email = this.state.myEmail
        this.setState({
          projectInf : data,
          project_exists : !!data,
          site_loaded : true,
        })
      }).catch(ex => {
        this.setState({
          project_exists : false,
          site_loaded : true
        })
      })
    )
  }

  render(){




    if(!this.state.site_loaded){
      return (
        <Spinner loading = {true} text = {"Loading project"} />
      )
    }
    if(!this.state.project_exists){
      return (
        <div className = "container">
          <div className = "headerCreation">Project Not Found</div>
        </div>
      )
    }else{

      return(
        <div className = "container">
          <HeadLine title = {"Project"}/>
          <div className = "row" style = {{width : "100%"}}>
            <div className = "col-12">
              <div style = {{textAlign: "center"}}>
                <div style = {{fontSize : '20px'}}> {this.state.projectInf.title}</div>
                {this.state.projectInf.archived  === "true"? <i style = {{fontSize : '20px'}}>Archived project</i> : ""}
              </div>
              <div style = {{marginTop : 20}}>
                <ProjectControls  projectInf = {this.state.projectInf}
                                  projectsMeta = {this.state.meta}
                                  projectID = {this.state.projectID}
                                  updateBookmarkState = {this.updateBookmarkState} />
              </div>
            </div>
          </div>
          <div className = "row">
            <div className = "col-5">
              <div className = "row">
                <div className = "col-4">
                  <div className = "profile-info">Status</div>
                    <Status value = {this.state.projectInf.status}/>
                </div>
                <div className = "col-4">
                  <div className = "profile-info">Creation date</div>
                  <div style = {{marginTop : 16}}>{this.state.projectInf.date_creation}</div>
                </div>
                <div className = "col-4">
                  <div className = "profile-info">Last update </div>
                  <div style = {{marginTop : 16}}> {this.state.projectInf.date_last_updated}</div>
                </div>
              </div>
              <div style = {{marginTop : 30}}>
                <div className = "profile-info">Authors</div>
                <div style = {{marginLeft : -16}}>
                  <AuthorOutputList value = {this.state.projectInf.authors} userNames = {this.state.meta.authors} />
                </div>
              </div>
              <div style = {{marginTop : 30}}>
              <div className = "profile-info">Links</div>
                <UrlOutputList value = {this.state.projectInf.url} />
              </div>
            </div>
            <div className = "col-1"></div>
            <div className = "col-6">
              <div>
                <div className = "profile-info">Tags </div>
                <TagOutputList value = {this.state.projectInf.tags} />
              </div>
              <div style = {{marginTop : 50}}>
                <div className = "profile-info">Description</div>
                <div>{this.state.projectInf.description}</div>
              </div>
              {this.state.projectInf.archived === "true" ?
                  <div className = "profile-info">Archived</div>
              : ""}
            </div>
          </div>
        </div>
      )
    }
  }
}
