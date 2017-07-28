import React, { Component } from 'react'
import styles from '../common/Styles.jsx'
import Backend from '../common/Backend'
import history from '../common/history'
import IconButton from 'material-ui/IconButton'
import SharePane from '../common/SharePane'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'
import CommentSideBar from '../common/CommentSideBar'
import AuthorOutputList from '../common/chips/AuthorOutputList'
import TagOutputList from '../common/chips/TagOutputList'
import UrlOutputList from '../common/chips/UrlOutputList'
import ConfirmationPane from '../common/ConfirmationPane'
import Badge from '../common/Badge'


export default class ProjectContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      projectID : this.props.match.params.uuid,
      projectInf : {},
      sharePane : false,
      commentBar : false,
      project_exists : false,
      is_bookmark : false,
      canEdit : false,
      myEmail : Backend.getMail(),
      dialogOpen : false,
      snackbar : false,
      snackbarText : "",
      comments_count: 0
    }

    this.handleEdit = this.handleEdit.bind(this)
    this.handleComment = this.handleComment.bind(this)
    this.handleBookmark = this.handleBookmark.bind(this)
    this.handleShare = this.handleShare.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleSharedProject = this.handleSharedProject.bind(this)
    this.handleUpdateComments = this.handleUpdateComments.bind(this)
  }

  handleUpdateComments(event){
    this.loadComments();
  }

  handleUnArchive(){
    var project = this.state.projectInf;
    delete project.is_bookmark
    delete project.is_owner
    project['archived'] = false
    Backend.updateProject(this.state.projectID, project).then(
    this.setState({
      dialogOpen : false,
      snackbar : true,
      snackbarText : "Project " + project.title + " unarchived"
    }))
  }

  transformArray(dataArray) {
    var filteredDataArray = []
    for(let dataObject of dataArray) {
      filteredDataArray.push(dataObject)
    }
    return filteredDataArray
  }

  loadComments(){
    Backend.getProjectComments(this.state.projectID).then(function(data) {
      var filteredData = this.transformArray(data)
      this.setState({
        comments_count : filteredData.length
      })
    }.bind(this))
  }

  componentWillMount(){
    this.loadSiteInf(this.state.projectID)
    this.loadComments()
  }

  componentWillReceiveProps(nextProps){
    this.setState({projectID : nextProps.uuid})
    this.loadSiteInf(this.state.projectID)
  }

  handleEdit(event){
    event.preventDefault()
    history.push("/update/" + this.state.projectID)
  }

  handleClose(){
    this.setState({
      dialogOpen : false,
      snackbar : false,
      sharePane : false,
      commentBar : false
    })
  }

  handleSharedProject(){
    this.handleClose()
    this.setState({
      snackbar : true,
      snackbarText : `Project ${this.state.projectInf.title} shared`
    })
  }

  handleDelete(){
    var project = this.state.projectInf;
    delete project.is_bookmark
    delete project.is_owner
    project['archived'] = true
    Backend.updateProject(this.state.projectID, project).then(
    this.setState({
      dialogOpen : false,
      snackbar : true,
      snackbarText : "Project " + project.title + " archived"
    }))
  }

  loadSiteInf(uuid) {
    Backend.getProject(uuid).then(data => {
      var email = this.state.myEmail
      var isOwner = false
      for (let author in data.authors)
        isOwner = isOwner || data.authors[author].email === email
      this.setState({
        projectInf : data,
        project_exists : !!data,
        site_loaded : true,
        isOwner : isOwner
      })
    }).catch(ex => {
      this.setState({
        project_exists : false,
        site_loaded : true
      })
    })
  }

  handleComment(event){
    this.handleClose()
    this.setState({
      commentBar : true,
    })
  }

  handleShare(event){
    this.handleClose()
    this.setState({
      sharePane : true,
    })
  }

  handleBookmark(event){
    event.preventDefault()
    this.handleClose()
    // HORRIBLE  and strange initialstate
    if(new String(this.state.projectInf.is_bookmark) == "true"){
      Backend.deleteBookmark(this.state.projectID).then(res => {
        if(res){
          var projectInf = this.state.projectInf
          projectInf.is_bookmark = false
          this.setState({projectInf : projectInf})
        }
      })
    } else {
      Backend.addBookmark(this.state.projectID).then(res => {
        if(res){
          var projectInf = this.state.projectInf
          projectInf.is_bookmark = true
          this.setState({projectInf : projectInf})
        }
      })
    }
  }

  render(){
    if(!this.state.site_loaded){
      return (
        <div className = "container">
          <div className = "header"><CircularProgress size = {80} thickness = {5} /></div>
        </div>
      )
    }
    if(!this.state.project_exists){
      return (
        <div className = "container">
          <div className = "header">Project Not Found</div>
        </div>
      )
    }else{

      return(
        <div className = "container">
          <div className = "innerContainer">
            <SharePane  uuid = {this.state.projectID}
                        handleSharedProject = {this.handleSharedProject}
                        open = {this.state.sharePane}
                        handleClosedSharePane ={this.handleClose}
                        />
            <CommentSideBar handleUpdateComments={this.handleUpdateComments} value = {this.state.commentBar} uuid = {this.state.projectID}></CommentSideBar>
            <ConfirmationPane open = {this.state.dialogOpen}
                handleClose = {this.handleClose}
                title = {"Do you want to archive project " + this.state.projectInf.title}
                confirmationLabel = {"Archive project"}
                confirmAction = {this.handleDelete}
            />
            <Snackbar
              open = {this.state.snackbar}
              message = {this.state.snackbarText}
              autoHideDuration = {10000}/>
            <div className = "row headerCreation" style = {{width : "100%"}}>
              <div className = "col-12">
                <div>Project</div>
                <div style = {{fontSize : '20px'}}> {this.state.projectInf.title}</div>
                {this.state.projectInf.archived ? <i style = {{fontSize : '20px'}}>Archived project</i> : ""}
              </div>
            </div>
            <div className = "row">
              <div className = "col-5">
                <div className = "row">
                  <div className = "col-4">
                    <div className = "profile-info">Status</div>
                    <div><Badge value ={this.state.projectInf.status}/></div>
                  </div>
                  <div className = "col-4">
                    <div className = "profile-info">Creation date</div>
                    <div style={{marginTop:16}}>{this.state.projectInf.date_creation}</div>
                  </div>
                  <div className = "col-4">
                    <div className = "profile-info">Last update </div>
                    <div style={{marginTop:16}}> {this.state.projectInf.date_last_updated}</div>
                  </div>
                </div>
                <div style = {{marginTop : 30}}>
                  <div className = "profile-info">Authors</div>
                  <AuthorOutputList value = {this.state.projectInf.authors} />
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
                  <div><a>{this.state.projectInf.description}</a></div>
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
                        <Badge  badgeContent = {this.state.comments_count} primary = {true}
                          badgeStyle = {{top : -30, height : 20, width : 20}} />
              </IconButton>
              <IconButton
                        onClick = {this.handleBookmark}
                        touch = {true}
                        style = {styles.largeIcon}
                        tooltipPosition = "top-center"
                        tooltip = "Bookmark project"
                        disabled = {this.state.isOwner}
                        iconStyle = {{fontSize : '24px'}}
                        >
                        <i className = "material-icons">
                          {(new String(this.state.projectInf.is_bookmark) == "true") ? "star" : "star_border"}
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
                          onClick = {this.handleEdit}
                          iconStyle = {{fontSize : '24px'}}
                          >
                          <i className = "material-icons">mode_edit</i>
              </IconButton>
              <IconButton
                        onClick ={() => this.setState({dialogOpen : true})}
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
                        onClick ={() => this.handleUnArchive()}
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
        </div>
      )
    }
  }
}
