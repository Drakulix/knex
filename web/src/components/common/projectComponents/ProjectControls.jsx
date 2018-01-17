import React, { Component } from 'react'
import Styles from '../Styles.jsx'
import Backend from '../Backend'
import IconButton from 'material-ui/IconButton'
import SharePane from './SharePane'
import Snackbar from 'material-ui/Snackbar'
import CommentSideBar from './CommentSideBar'
import ConfirmationPane from '../ConfirmationPane'
import Badge from 'material-ui/Badge'
import history from '../history'

import Edit from 'material-ui/svg-icons/editor/mode-edit'
import Comment from 'material-ui/svg-icons/communication/comment'
import Share from 'material-ui/svg-icons/social/share'
import Archive from 'material-ui/svg-icons/content/archive'
import Unarchive from 'material-ui/svg-icons/content/unarchive'
import StarBorder from 'material-ui/svg-icons/toggle/star-border'
import Star from 'material-ui/svg-icons/toggle/star'



export default class ProjectControls extends Component{

  constructor(props) {
    super(props)

    this.state = {
      sharePane: false,
      commentBar: false,
      dialogOpen: false,
      snackbar: false,
      snackbarText: '',
      comments_count: 0,
      is_bookmark: false
    }

    this.handleComment = this.handleComment.bind(this)
    this.handleBookmark = this.handleBookmark.bind(this)
    this.handleShare = this.handleShare.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleArchive = this.handleArchive.bind(this)
    this.handleSharedProject = this.handleSharedProject.bind(this)
    this.updateCommentCount = this.updateCommentCount.bind(this)
  }


  handleUnArchive(){
    var project = this.props.projectInf;
    project['archived'] = "false"
    Backend.archiveProject(this.props.projectID, "false").then(
    this.setState({
      dialogOpen: false,
      snackbar: true,
      sharePane: false,
      commentBar: false,
      snackbarText: `Project ${this.props.projectInf.title} unarchived`
    }))
  }

  updateCommentCount(count){
    this.setState({comments_count: count})
  }

  handleClose(){
    this.setState({
      dialogOpen: false,
      snackbar: false,
      sharePane: false,
      commentBar: false
    })
  }

  handleSharedProject(){
    this.handleClose()
    this.setState({
      snackbar: true,
      snackbarText: `Project ${this.props.projectInf.title} shared`
    })
  }

  handleArchive(){
    var project = this.props.projectInf;
    project['archived'] = "true"
    Backend.archiveProject(this.props.projectID, "true").then(
    this.setState({
      dialogOpen: false,
      snackbar: true,
      sharePane: false,
      commentBar: false,
      snackbarText: `Project ${this.props.projectInf.title} archived`
    }))
  }

  handleComment(event){
    this.handleClose()
    this.setState({
      commentBar: true,
    })
  }

  handleShare(event){
    this.handleClose()
    this.setState({
      sharePane: true,
    })
  }

  handleBookmark(event){
    event.preventDefault()
    this.handleClose()
    Backend.handleBookmark(this.props.projectID, this.props.projectsMeta.is_bookmark )
    .then(res => {
      this.props.updateBookmarkState(this.props.projectsMeta.is_bookmark ? false : true )
      this.setState({snackbar: true,
        snackbarText: `Project bookmark${this.props.projectsMeta.is_bookmark ? "ed": " removed"}`})
    })
  }

  render(){
    return (
      <div>
        <SharePane  uuid = {this.props.projectInf}
                    handleSharedProject = {this.handleSharedProject}
                    open = {this.state.sharePane}
                    handleClosedSharePane = {this.handleClose}
        />
        <CommentSideBar loadComments = {this.updateCommentCount}
                        open = {this.state.commentBar}
                        uuid = {this.props.projectID}/>
        <ConfirmationPane open = {this.state.dialogOpen}
                          handleClose = {this.handleClose}
                          title = {`Do you want to archive project${this.props.projectInf.title}`}
                          confirmationLabel = {"Archive project"}
                          confirmAction = {this.handleArchive}
        />
        <Snackbar open = {this.state.snackbar}
                  message = {this.state.snackbarText}
                  autoHideDuration = {10000}
        />
      {this.props.projectInf.archived === "false"?
          <div style = {{textAlign: "center"}} >
            <IconButton
                        onClick = {this.handleComment}
                        touch = {true}
                        style = {Styles.largeIcon}
                        tooltipPosition = "bottom-center"
                        tooltip = "Comment project"
                        iconStyle = {{fontSize: 24, color: Styles.palette.textColor}}
                        >
                        <Comment/>
                        <Badge   badgeContent = {this.state.comments_count} primary = {true}
                          badgeStyle = {{top: -30, height: 20, width: 20, display: (this.state.comments_count === 0) ? "none": "block"}} />
            </IconButton>
            <IconButton
                        onClick = {this.handleBookmark}
                        touch = {true}
                        style = {Styles.largeIcon}
                        tooltipPosition = "bottom-center"
                        tooltip = "Bookmark project"
                        iconStyle = {{fontSize: 24, color: Styles.palette.textColor}}
                        >
                        {this.props.projectsMeta.is_bookmark? <Star/>: <StarBorder/>}
            </IconButton>
            <IconButton
                        onClick = {this.handleShare}
                        touch = {true}
                        style = {Styles.largeIcon}
                        tooltipPosition = "bottom-center"
                        tooltip = "Share project"
                        iconStyle = {{fontSize: 24, color: Styles.palette.textColor}}
                        >
                        <Share/>
            </IconButton>
            <IconButton
                        style = {Styles.largeIcon}
                        disabled = {! (this.props.projectsMeta.is_owner || Backend.isAdmin())}
                        tooltipPosition = "bottom-center"
                        touch = {true}
                        tooltip = "Edit project"
                        onClick = {() => history.push(`/update/${this.props.projectID}`)}
                        iconStyle = {{height: 24, color: Styles.palette.textColor}}
                        >
                        <Edit/>
            </IconButton>
            <IconButton
                      onClick = {() => this.setState({
                        dialogOpen: true,
                        snackbar: false,
                        sharePane: false,
                        commentBar: false})}
                      touch = {true}
                      style = {Styles.largeIcon}
                      disabled = {! (this.props.projectsMeta.is_owner  || Backend.isAdmin())}
                      tooltipPosition = "bottom-center"
                      tooltip = "Archive project"
                      iconStyle = {{fontSize: 24, color: Styles.palette.textColor}}
                      >
                      <Archive/>
            </IconButton>
          </div>
           :
          <div style = {{textAlign: "center"}} >
            <IconButton
                      onClick = {() => this.handleUnArchive()}
                      touch = {true}
                      style = {Styles.largeIcon}
                      disabled = {! (this.props.projectsMeta.is_owner  || Backend.isAdmin())}
                      tooltipPosition = "bottom-center"
                      tooltip = "Unarchive project"
                      iconStyle = {{fontSize: 24, color: Styles.palette.textColor}}
                      >
                      <Unarchive/>
            </IconButton>
          </div>
        }
      </div>
    )
  }
}
