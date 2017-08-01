import React, { Component } from 'react'
import styles from '../Styles.jsx'
import Backend from '../Backend'
import IconButton from 'material-ui/IconButton'
import SharePane from './SharePane'
import Snackbar from 'material-ui/Snackbar'
import CommentSideBar from './CommentSideBar'
import ConfirmationPane from '../ConfirmationPane'
import Status from '../Status'
import history from '../history'

export default class ProjectControls extends Component{

  constructor(props) {
    super(props)

    this.state = {
      sharePane : false,
      commentBar : false,
      dialogOpen : false,
      snackbar : false,
      snackbarText : "",
      comments_count: 0,
      is_bookmark : this.props.projectInf.is_bookmark === "true" ? "false" : "true"
    }

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
    var project = this.props.projectInf;
    delete project.is_bookmark
    delete project.is_owner
    project['archived'] = false
    Backend.updateProject(this.props.projectInf._id, project).then(
    this.setState({
      dialogOpen : false,
      snackbar : true,
      snackbarText : `Project ${this.props.projectInf.title} unarchived`
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
    Backend.getProjectComments(this.props.projectInf._id).then(function(data) {
      var filteredData = this.transformArray(data)
      this.setState({
        comments_count : filteredData.length
      })
    }.bind(this))
  }

  componentWillMount(){
    this.loadComments()
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
      snackbarText : `Project ${this.props.projectInf.title} shared`
    })
  }

  handleDelete(){
    var project = this.props.projectInf;
    delete project.is_bookmark
    delete project.is_owner
    project['archived'] = true
    Backend.updateProject(this.props.projectInf._id, project).then(
    this.setState({
      dialogOpen : false,
      snackbar : true,
      snackbarText : `Project ${this.props.projectInf.title} archived`
    }))
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
    Backend.handleBookmark(this.props.projectInf._id, this.state.is_bookmark )
    .then(res => {
      this.setState({bookmark : this.state.is_bookmark === "true" ? "false" : "true" })
    })
    .then(() => {this.setState({snackbar :true,
      snackbarText : `Project bookmark${this.state.is_bookmark === "true" ? "ed" : " removed"}`})})
  }

  render(){
    return (
      <div>
        <SharePane  uuid = {this.props.projectInf}
                    handleSharedProject = {this.handleSharedProject}
                    open = {this.state.sharePane}
                    handleClosedSharePane = {this.handleClose}
        />
        <CommentSideBar handleUpdateComments = {this.handleUpdateComments}
                        value = {this.state.commentBar}
                        uuid = {this.props.projectInf.projectID}/>
        <ConfirmationPane open = {this.state.dialogOpen}
                          handleClose = {this.handleClose}
                          title = {`Do you want to archive project${this.props.projectInf.title}`}
                          confirmationLabel = {"Archive project"}
                          confirmAction = {this.handleDelete}
        />
        <Snackbar open = {this.state.snackbar}
                  message = {this.state.snackbarText}
                  autoHideDuration = {10000}
        />
        {!this.props.projectInf.archived ?
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
                        {this.state.is_bookmark === "true" ? "star" : "star_border"}
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
                      disabled = {! (this.props.isOwner || Backend.isAdmin())}
                      tooltipPosition = "top-center"
                      tooltip = "Edit project"
                      href = {`/update/${this.state.projectInf._id}`}
                      iconStyle = {{fontSize : '24px', marginTop:-5}}
                      >
                      <i className = "material-icons">mode_edit</i>
          </IconButton>
          <IconButton
                    onClick = {() => this.setState({dialogOpen : true})}
                    touch = {true}
                    style = {styles.largeIcon}
                    disabled = {! (this.props.isOwner || Backend.isAdmin())}
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
                    disabled = {! (this.props.isOwner || Backend.isAdmin())}
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
