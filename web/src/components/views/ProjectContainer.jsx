import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Chip from 'material-ui/Chip'
import styles from '../common/Styles.jsx'
import {get, post, del} from '../common/Backend'
import IconButton from 'material-ui/IconButton'
import SharePane from '../common/SharePane'
import CircularProgress from 'material-ui/CircularProgress'
import CommentSideBar from '../common/CommentSideBar.jsx'
import {getMyEmail, getUserInfo} from '../common/Authentication.jsx'


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
      myEmail : getMyEmail(),
      isAdmin : false
    }

    this.handleEdit = this.handleEdit.bind(this)
    this.handleComment = this.handleComment.bind(this)
    this.handleBookmark = this.handleBookmark.bind(this)
    this.handleShare = this.handleShare.bind(this)
    this.handleDelete = this.handleDelete.bind(this)


    getUserInfo(getMyEmail()).then(data => {
      if(data){
        this.setState({
          isAdmin : data.roles.indexOf("admin") !== -1
        })
      }
    })
  }

  componentWillMount(){
    this.loadSiteInf(this.state.projectID)
  }

  componentWillReceiveProps(nextProps){
    this.setState({projectID : nextProps.uuid})
    this.loadSiteInf(this.state.projectID)

  }

  loadSiteInf(uuid) {
    get('/api/projects/' + uuid).then(data => {
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
        sharePane : false
    })
    // HORRIBLE  and strange initialstate
    if(new String(this.state.projectInf.is_bookmark) == "true"){
      del ("/api/users/bookmarks/"+this.state.projectID).then(res => {
        if(res){
          var projectInf = this.state.projectInf
          projectInf.is_bookmark = false
          this.setState({projectInf : projectInf})
        }
      })
    } else {
      post('/api/users/bookmarks/' + this.state.projectID).then(res => {
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
    window.location = '/update/'+  this.state.projectID
  }

  handleDelete(event){
    event.preventDefault()
    del("/api/projects/"+this.state.projectID)
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
            <SharePane value = {this.state.sharePane} uuid = {this.state.projectID}></SharePane>
            <CommentSideBar value = {this.state.commentBar} uuid = {this.state.projectID}></CommentSideBar>
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
                <div style = {styles["wrapper"]}>
                  {
                    this.state.projectInf.authors.map(item =>
                      <Chip style= {styles["chip"]}>
                        <Link to = {"/profile/"+item.email} style= {styles["chipText"]}>{item.name}</Link>
                      </Chip>
                    )
                  }
                </div>
              </div>
              <div style = {{marginTop : 30}}>
                <div className = "profile-info">Links</div>
                <div style = {styles["wrapper"]}>
                  { this.state.projectInf.url.map(item => <Chip style= {styles["chip"]}>
                  <a href = {item} style= {styles["chipText"]}>{item}</a></Chip>) }
                  </div>
                </div>
              </div>
              <div className = "col-1"></div>
              <div className = "col-6">
                <div style = {{marginTop : 10}}>
                  <div className = "profile-info">Tags </div>
                  <div style = {styles["wrapper"]}>
                    { this.state.projectInf.tags.map(item =>
                      <Chip style= {styles["chip"]}>
                        <Link to = {"/discovery?tag = " +item} style= {styles["chipText"]} >{item}</Link></Chip>) }
                  </div>
                </div>
                <div style = {{marginTop : 30}}>
                  <div className = "profile-info">Description</div>
                  <div><a>{this.state.projectInf.description}</a></div>
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
              <Link to = {"/update/" + this.state.projectID}  >
                <IconButton
                          touch = {true}
                          style = {styles.largeIcon}
                          disabled = {! (this.state.isOwner || this.state.isAdmin)}
                          tooltipPosition = "top-center"
                          tooltip = "Edit project"
                          iconStyle = {{fontSize : '24px'}}
                          >
                          <i className = "material-icons">mode_edit</i>
                </IconButton>
              </Link>
              <IconButton
                        onClick = {this.handleDelete}
                        touch = {true}
                        style = {styles.largeIcon}
                        disabled = {! (this.state.isOwner || this.state.isAdmin)}
                        tooltipPosition = "top-center"
                        tooltip = "Delete project"
                        iconStyle = {{fontSize : '24px'}}
                        >
                        <i className = "material-icons">delete</i>
              </IconButton>
            </div>
          </div>
        </div>
      )
    }
  }
}
