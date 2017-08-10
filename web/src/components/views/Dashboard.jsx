import React from 'react'
import TimeLine from '../common/userComponents/TimeLine'
import Backend from '../common/Backend'
<<<<<<< HEAD
=======
import { Link } from 'react-router-dom'
import Styles from '../common/Styles.jsx'
import Spinner from '../common/Spinner'
import IconButton from 'material-ui/IconButton'
import Moment from 'moment'


>>>>>>> 836282c... Now with Time now!

export default class Dashboard extends React.Component {

  constructor(props){
    super(props)
<<<<<<< HEAD
=======
    this.state = {
      notifications: [],
      username : {}
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
    Backend.getActions()
    .then((data) => {
      var users = data.map (notification => {return notification.user_id})
      users = users.concat(data.map (notification => {return notification.creator}))
      Backend.getUserNames(users)
      .then ((userNames) => {
        this.setState({
          userNames : JSON.parse(userNames)
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
>>>>>>> ce0fddf... Found 403 and Uploader bug... Still an ugly bug on titles....
  }

  render() {
    return (
      <div className = "container">
        <div className = "headerCreation">Your timeline</div>
<<<<<<< HEAD
          <TimeLine email = {Backend.getMail()}/>
=======
          <Spinner loading = {this.state.loading} text = {"Loading your news"} />
          <div style = {{width : "100%", display : (!this.state.loading ? "block" : "none")}}>
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
                    />

                </div>
              )
            }
          </div>
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
            <span><Link to = "/yourprofile"
                        style = {{color: Styles.palette.primary1Color}}>You</Link> </span>
              :
            <span><Link to = {`/profile/${this.props.value.creator}`}
                        style = {{color: Styles.palette.primary1Color}}>
              {this.props.names[this.props.value.creator]}</Link> </span>
          }
          <span>{operation}</span>
          {this.props.value.operation === "invite" ?
            <span> <Link to = {`/profile/${this.props.value.user_id}`}
                        style = {{color: Styles.palette.primary1Color}}>
              you </Link></span>
          : ""}
          {this.props.value.project_id !== "" ?
            <span>
              <span> project </span>
              <span>
                <Link to = {`/project/${this.props.value.project_id}`}
                      style = {{color: Styles.palette.primary1Color}}>
                      {this.props.titles[this.props.value.project_id]}
                </Link>
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
        <div className ="col-1" style ={{textAlign : "right"}}>
          <IconButton
                    onClick = {() => Backend.deleteNotification(this.props.value._id).then(this.props.refreshHandler())}
                    touch = {true}
                    style = {Styles.largeIcon}
                    tooltipPosition = "bottom-center"
                    tooltip = "Delete notification"
                    iconStyle = {{fontSize: '24px', color: Styles.palette.textColor}}
                    >
                    <i className = "material-icons">cancel</i>
          </IconButton>
        </div>
>>>>>>> 130bbef... Bug Fixing and Notifiaciton for archiving
      </div>
    )
  }
}
