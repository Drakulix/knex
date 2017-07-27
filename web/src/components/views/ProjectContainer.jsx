import React, { Component } from 'react'
import Badge from 'material-ui/Badge'
import Chip from 'material-ui/Chip'
import styles from '../common/Styles.jsx'
import Backend from '../common/Backend'
import history from '../common/history'
import IconButton from 'material-ui/IconButton'
import SharePane from '../common/SharePane'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'
import CommentSideBar from '../common/CommentSideBar'
import AuthorOutputList from '../common/chips/AuthorOutputList'
import TagOutputList from '../common/chips/TagOutputList'



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

    this.handleDelete = this.handleDelete.bind(this)
    this.handleSharedProject = this.handleSharedProject.bind(this)
    this.handleClosedSharePane = this.handleClosedSharePane.bind(this)
    this.handleUpdateComments = this.handleUpdateComments.bind(this)
  }

  handleUpdateComments(event){
    this.loadComments();
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

  handleEdit(){
    history.push("/update/" + this.state.projectID)
  }

  handleClosedSharePane(){
    this.setState({
      dialogOpen : false,
      snackbar : false,
      sharePane : false
    })
  }

  handleSharedProject(){
    this.setState({
      dialogOpen : false,
      snackbar : true,
      sharePane : false,
      snackbarText : `Project ${this.state.projectInf.title} shared`
    })
  }


  handleClose(){
    this.setState({
      dialogOpen : false,
      snackbar : false
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
    event.preventDefault()
    this.setState({
      sharePane : false,
      commentBar : true
    })
  }

  handleShare(event){
    event.preventDefault()
    this.setState({
      commentBar : false,
      sharePane : true
    })
  }

  handleBookmark(event){
    event.preventDefault()
    this.setState({
        commentBar : false,
        sharePane : false,
        snackbar : false
    })
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

  handleEdit(event){
    event.preventDefault()
    history.push('/update/'+  this.state.projectID)
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
      let status_badge = null
      if (this.state.projectInf.status === 'DONE'){
        status_badge = <span className = "badge badge-success">DONE</span>
      } else if (this.state.projectInf.status === 'IN_PROGRESS') {
        status_badge = <span className = "badge badge-warning">IN_PROGRESS</span>
      } else if (this.state.projectInf.status === 'IN_REVIEW') {
        status_badge = <span className = "badge badge-info">IN_REVIEW</span>
      } else {
        status_badge = this.state.projectInf.status
      }
      return(
        <div className = "container">
          <div className = "innerContainer">
            <SharePane  uuid = {this.state.projectID}
                        handleSharedProject = {this.handleSharedProject}
                        open = {this.state.sharePane}
                        handleClosedSharePane ={this.handleClosedSharePane}
                        />
            <CommentSideBar handleUpdateComments={this.handleUpdateComments} value = {this.state.commentBar} uuid = {this.state.projectID}></CommentSideBar>
            <ConfirmationPane open = {this.state.dialogOpen}
                              projectID = {this.state.projectID}
                              projectTitle = {this.state.projectInf.title}
                              handleDelete = {this.handleDelete}
                              handleClose = {this.handleClose}/>
            <Snackbar
              open = {this.state.snackbar}
              message = {this.state.snackbarText}
              autoHideDuration = {10000}/>
            <div className = "row headerCreation" style = {{width : "100%"}}>
              <div className = "col-12">
                <div>Project</div>
                <div style = {{fontSize : '20px'}}> {this.state.projectInf.title}</div>
              </div>
            </div>
            <div className = "row">
              <div className = "col-5">
                <div className = "row">
                  <div className = "col-4">
                    <div className = "profile-info">Status</div>
                    <div>{status_badge}</div>
                  </div>
                  <div className = "col-4">
                    <div className = "profile-info">Creation date</div>
                    <div>{this.state.projectInf.date_creation}</div>
                  </div>
                  <div className = "col-4">
                    <div className = "profile-info">Last update </div>
                    <div> {this.state.projectInf.date_last_updated}</div>
                  </div>
                </div>
                <div style = {{marginTop : 30}}>
                <div className = "profile-info">Authors</div>
                <AuthorOutputList value = {this.state.projectInf.authors} />
              </div>
              <div style = {{marginTop : 30}}>
                <div className = "profile-info">Links</div>
                <div style = {styles["wrapper"]}>
                  { this.state.projectInf.url.map(item => <Chip style= {styles["chip"]} key={item}>
                  <a href = {item} style= {styles["chipText"]}>{item}</a></Chip>) }
                  </div>
                </div>
              </div>
              <div className = "col-1"></div>
              <div className = "col-6">
                <div style = {{marginTop : 10}}>
                  <div className = "profile-info">Tags </div>
                  <TagOutputList value = {this.state.projectInf.tags} />
                </div>
                <div style = {{marginTop : 60}}>
                  <div className = "profile-info">Description</div>
                  <div><a>{this.state.projectInf.description}</a></div>
                </div>
                <div style = {{display : (this.state.projectInf.archived) ? "block" : "none"}}>
                  <div className = "profile-info">Archived</div>
                </div>
              </div>
            </div>
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
          </div>
        </div>
      )
    }
  }
}

  class ConfirmationPane extends Component {
    constructor(props) {
      super(props)
      this.state = {
        open: false
        }
      this.handleDelete = this.handleDelete.bind(this)
    }

    handleDelete(event){
      event.preventDefault()
      this.props.handleDelete()
    }


    componentWillReceiveProps(props){
      this.setState({open: props.dialogOpen})
    }

    render() {
      const actions = [
        <RaisedButton
          label = "Cancel"
          primary = {true}
          onTouchTap = {this.props.handleClose}
          />,
        <RaisedButton
          label="Archive project"
          primary = {true}
          onTouchTap = {this.handleDelete}
          style = {{marginLeft:20}}
          />,
      ]

      return (
        <Dialog
          title = {"Do you want to archive project: \n"+ this.props.projectTitle}
          actions = {actions}
          modal = {false}
          open = {this.props.open}
          onRequestClose = {this.props.handleClose}
          >
        </Dialog>
      )
    }
}
