import React, { Component } from 'react'
import styles from '../common/Styles.jsx'
import Backend from '../common/Backend'
import IconButton from 'material-ui/IconButton'
import AuthorOutputList from '../common/chips/AuthorOutputList'
import TagOutputList from '../common/chips/TagOutputList'
import UrlOutputList from '../common/chips/UrlOutputList'
import Status from '../common/Status'
import Spinner from '../common/Spinner'
import ProjectControls from '../common/projectComponents/ProjectControls'


export default class ProjectContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      projectID : this.props.match.params.uuid,
      projectInf : {},
      project_exists : false,
      is_bookmark : false,
      canEdit : false,
      myEmail : Backend.getMail(),
      comments_count: 0
    }

    this.updateBookmarkState = this.updateBookmarkState.bind(this)

  }

  componentDidMount(){
    this.loadSiteInf()
  }

  updateBookmarkState(value) {
    var projectInf = this.state.projectInf
    projectInf.is_bookmark = value
    this.setState({projectInf : projectInf})
  }

  loadSiteInf() {
    Backend.getProject(this.state.projectID).then(data => {
      var email = this.state.myEmail
      var isOwner = false
      for (let author in data.authors)
        isOwner = isOwner || data.authors[author] === email
      this.setState({
        projectInf : data,
        project_exists : !!data,
        site_loaded : true,
        isOwner : isOwner
      })
      Backend.getUserNames(data.authors)
      .then ((userNames) => {
        this.setState({
          userNames : JSON.parse(userNames)
        })
      })
    })
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
          />
          <div className = "row headerCreation" style = {{width : "100%"}}>
            <div className = "col-12">
              <div>Project</div>
              <div style = {{fontSize : '20px'}}> {this.state.projectInf.title}</div>
                {this.state.projectInf.archived ? <i style = {{fontSize : '20px'}}>Archived project</i> : ""}
                <ProjectControls  projectInf = {this.state.projectInf}
                                  isOwner = {this.state.isOwner}
                                  projectID = {this.state.projectID}
                                  userNames = {this.state.userNames}
                                  updateBookmarkState = {this.updateBookmarkState} />
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
                  <div style = {{marginTop:16}}>{this.state.projectInf.date_creation}</div>
                </div>
                <div className = "col-4">
                  <div className = "profile-info">Last update </div>
                  <div style = {{marginTop:16}}> {this.state.projectInf.date_last_updated}</div>
                </div>
              </div>
              <div style = {{marginTop : 30}}>
                <div className = "profile-info">Authors</div>
                <AuthorOutputList value = {this.state.projectInf.authors} userNames = {this.state.userNames} />
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
              <div style = {{display : (this.state.projectInf.archived) ? "block" : "none"}}>
                <div className = "profile-info">Archived</div>
              </div>
            </div>
          </div>
          {!this.state.projectInf.archived ?
            <div style = {{textAlign : "center", marginTop : 75}} >
            <IconButton
                        onClick = {this.handleComment}
                        touch = {true}
                        style = {styles.largeIcon}
                        tooltipPosition = "top-center"
                        tooltip = "Comment project"
                        iconStyle = {{fontSize : '24px'}}
                        >
                        <i className = "material-icons">comment</i>
                        <Status  badgeContent = {this.state.comments_count} primary = {true}
                          badgeStyle = {{top : -30, height : 20, width : 20}} />
            </IconButton>
            <IconButton
                        onClick = {this.handleBookmark}
                        touch = {true}
                        style = {styles.largeIcon}
                        tooltipPosition = "top-center"
                        tooltip = "Bookmark project"
                        iconStyle = {{fontSize : '24px'}}
                        >
                        <i className = "material-icons">
                          {this.state.projectInf.is_bookmark === "true" ? "star" : "star_border"}
                        </i>
            </IconButton>
            <IconButton
                        onClick = {this.handleShare}
                        touch = {true}
                        style = {styles.largeIcon}
                        tooltipPosition = "top-center"
                        tooltip = "Share project"
                        iconStyle = {{fontSize : '24px'}}
                        >
                        <i className = "material-icons">share</i>
            </IconButton>
            <IconButton
                        touch = {true}
                        style = {styles.largeIcon}
                        disabled = {! (this.state.isOwner || Backend.isAdmin())}
                        tooltipPosition = "top-center"
                        tooltip = "Edit project"
                        href = {`/update/${this.state.projectID}`}
                        iconStyle = {{fontSize : '24px', marginTop:-5}}
                        >
                        <i className = "material-icons">mode_edit</i>
            </IconButton>
            <IconButton
                      onClick = {() => this.setState({dialogOpen : true})}
                      touch = {true}
                      style = {styles.largeIcon}
                      disabled = {! (this.state.isOwner || Backend.isAdmin())}
                      tooltipPosition = "top-center"
                      tooltip = "Archive project"
                      iconStyle = {{fontSize : '24px'}}
                      >
                      <i className = "material-icons">archive</i>
            </IconButton>
          </div>
              :
          <div style = {{textAlign : "center", marginTop : 75}} >
            <IconButton
                      onClick = {() => this.handleUnArchive()}
                      touch = {true}
                      style = {styles.largeIcon}
                      disabled = {! (this.state.isOwner || Backend.isAdmin())}
                      tooltipPosition = "top-center"
                      tooltip = "Unarchive project"
                      iconStyle = {{fontSize : '24px'}}
                      >
                      <i className = "material-icons">unarchive</i>
            </IconButton>
          </div>
        }
        </div>
      )
    }
  }
}
