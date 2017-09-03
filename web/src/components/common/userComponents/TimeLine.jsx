import React from 'react'
import Backend from '../Backend'
import Styles from '../Styles.jsx'
import Spinner from '../Spinner'
import IconButton from 'material-ui/IconButton'
import Moment from 'moment'
import history from '../history'
import Cancel from 'material-ui/svg-icons/navigation/cancel'



export default class TimeLine extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      notifications: [],
      username: {},
      loading: true
    }
    this.load = this.load.bind(this)
  }

  componentDidMount(){
    this.load()
  }

  load(){
    this.setState({
      loading : true,
    })
    var notificationPromise = null
    if (this.props.email === Backend.getMail()){
      notificationPromise = Backend.getActions()
    }
    else {
      notificationPromise = Backend.getNotificationsOfUser(this.props.email)
    }
    notificationPromise
    .then((data) => {
       this.setState({
         notifications: data,
        loading : false,
      })
    })
  }

  render() {
    return (
      <div>
        {(this.state.loading) ? <Spinner text = {"Loading your news"} />
        :
        <div style = {{width : "100%"}}>
          {(this.state.notifications.length === 0) ?
            <div style={{fontSize: 20, textAlign: "center"}}><hr></hr>Nothing new</div> : ""}
          {
            this.state.notifications.map(notification =>
              <div key = {notification._id}>
                <hr></hr>
                <News
                    value = {notification}
                    titles = {this.state.projectTitles}
                    refreshHandler = {this.load}
                    email = {this.props.email}
                  />
                </div>
            )
          }
        </div>
      }
      </div>
    )
  }
}


const operationText = {
   'create':     "uploaded",
   'archive':    "archived",
   'unarchive':  "unarchived",
   'share':      "shared",
   'comment':    "commented",
   'update':     "updated",
   'bookmark':   "bookmarked",
   'invite':     "was invited by",
   'invitation': "invited",
   'register':   "register",
}

class News extends React.Component {

  render () {
    var reason = ""
    switch(this.props.value.reason){
      case 'author':
        reason = "you are author of"
        break
      case 'comment':
        reason = "you commented"
        break
      case 'bookmark':
        reason = "you have bookmarked"
        break
      case 'search':
        reason = "matching your search"
        break
      default:
        reason = ""
        break
    }
    return (
      <div className = "row" style={{width: "100%"}}>
        <div className ="col-1">
          <img src = {`/api/users/${this.props.value.creator}/avatar`}
               style = {{marginTop : -8}}
            width = "60"
            height = "60"
            alt = {this.props.value.user_id}
            />
        </div>
        <div className ="col-10">
          {this.props.value.creator === Backend.getMail() ?
            <span onClick ={() => {history.push('/yourprofile')}}
                  style = {{color: Styles.palette.primary1Color, cursor: 'pointer'}}>
              You
            </span>
              :
            <span onClick ={() => {history.push(`/profile/${this.props.value.creator}`)}}
                    style = {{color: Styles.palette.primary1Color, cursor: 'pointer'}}>
                {this.props.value.creator_name}
            </span>
          }
          <span> {operationText[this.props.value.operation]} </span>
          {this.props.value.project_id !== null ?
            <span>
              <span> project </span>
              <span>
                <span onClick ={() => {history.push(`/project/${this.props.value.project_id}`)}}
                        style = {{color: Styles.palette.primary1Color, cursor: 'pointer'}}>
                    {this.props.value.project_title}
                </span>
              </span>
              <span> {reason} </span>
              {this.props.saved_search_id !== null ? this.props.saved_search_id : ""}
            </span>
            : ""
          }
          {this.props.value.operation === "invite" || this.props.value.operation === "invitation"?
            <span onClick ={() => {history.push(`/profile/${this.props.value.user_id}`)}}
                    style = {{color: Styles.palette.primary1Color, cursor: 'pointer'}}>
                {this.props.value.user_id === Backend.getMail() ? "you" : ""}
            </span>
          : ""}
          <div style = {{fontStyle: 'italic' , color: Styles.palette.disabledColor}}>
            {Moment(this.props.value.date).from(new Moment())}
          </div>
        </div>
        {this.props.email === Backend.getMail() ?
          <div className ="col-1" style ={{textAlign : "right"}}>
            <IconButton
                      onClick = {() => Backend.deleteNotification(this.props.value._id).then(this.props.refreshHandler())}
                      touch = {true}
                      style = {Styles.largeIcon}
                      tooltipPosition = "bottom-center"
                      tooltip = "Delete notification"
                      iconStyle = {{fontSize: '24px', color: Styles.palette.disabledColor}}
                      >
                      <Cancel />
            </IconButton>
          </div>
        : ""}
      </div>
    )
  }
}
