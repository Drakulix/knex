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
      var users = data.map (notification => {return notification.user_id})
      users = users.concat(data.map (notification => {return notification.creator}))
      Backend.getUserNames(users)
      .then ((userNames) => {
        this.setState({
          userNames : userNames
        })
        Backend.getProjectTitels(data.filter(notification => {return notification.project_id !== ""
        }).map (notification => {return notification.project_id}))
        .then ((projectTitles) =>{
          this.setState({
            projectTitles : projectTitles,
            notifications: data
          })
        })
        .then (
          this.setState({
            loading : false,
          })
        )
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
                    names = {this.state.userNames}
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

class News extends React.Component {

  render () {
    var operation = ""
    switch(this.props.value.operation){
      case 'create':
        operation = "uploaded"
        break
      case 'archive':
        operation = "archived"
        break
      case 'unarchive':
          operation = "unarchived"
        break
      case 'share':
        operation = "shared"
        break
      case 'comment':
        operation = "commented"
        break
      case 'update':
        operation = "updated"
        break
      case 'bookmark':
        operation = "bookmarked"
        break
      case 'invite':
        operation = "was invited by"
        break
      case 'invitation':
        operation = "invited"
        break
      case 'register':
        operation = "register"
        break
      default:
        break
    }
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
                {this.props.names[this.props.value.creator]}
            </span>
          }
          <span> {operation} </span>
          {this.props.value.operation === "invite" || this.props.value.operation === "invitation"?
            <span onClick ={() => {history.push(`/profile/${this.props.value.user_id}`)}}
                    style = {{color: Styles.palette.primary1Color, cursor: 'pointer'}}>
                you
            </span>
          : ""}
          {this.props.value.project_id !== "" ?
            <span>
              <span> project </span>
              <span>
                <span onClick ={() => {history.push(`/project/${this.props.value.project_id}`)}}
                        style = {{color: Styles.palette.primary1Color, cursor: 'pointer'}}>
                    {this.props.titles[this.props.value.project_id]}
                </span>
              </span>
              <span> {reason} </span>
              {this.props.saved_search_id !== "" ? this.props.saved_search_id : ""}
            </span>
            : ""
          }
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
