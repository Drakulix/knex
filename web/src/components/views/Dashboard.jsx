import React from 'react'
import Backend from '../common/Backend'
import { Link } from 'react-router-dom'
import Styles from '../common/Styles.jsx'
import Spinner from '../common/Spinner'
import IconButton from 'material-ui/IconButton'


export default class Dashboard extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      notifications: [],
      username : {}
    }
  }

  componentDidMount(){
    this.setState({
      loading : true,
    })
    Backend.getActions()
    .then((data) => {
      var users = data.map (notification => {return notification.user_id})
      Backend.getUserNames(users)
      .then ((userNames) => {
        this.setState({
          userNames : JSON.parse(userNames),
          notifications: data
        })
      })
      .then (
        this.setState({
          loading : false,
        })
      )
    })
  }

  render() {
    return (
      <div className = "container">
        <div className = "headerCreation">Your news</div>
          <Spinner loading = {this.state.loading} text = {"Loading your news"} />
          <div style = {{width : "100%", display : (!this.state.loading ? "block" : "none")}}>
            {
              this.state.notifications.map(notification =>
                <div>
                  <News key = {notification._id}
                      value = {notification}
                      names = {this.state.userNames} />
                    <hr></hr>
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
          <img src = {`/api/users/${this.props.value.user_id}/avatar`}
               style = {{marginTop : -8}}
            width = "60"
            height = "60"
            alt = {this.props.value.user_id}
            />
        </div>
        <div className ="col-10">
          {this.props.value.user_id === Backend.getMail() ?
            <span><Link to = "/yourprofile"
                        style = {{color: Styles.palette.primary1Color}}>You</Link> have </span>
              :
            <span><Link to = {`/profile/${this.props.value.user_id}`}
                        style = {{color: Styles.palette.primary1Color}}>
              {this.props.names[this.props.value.user_id]}</Link> has </span>
          }
          <span>{operation}</span>
          <span> project </span>
          <span>
            <Link to = {`/project/${this.props.value.project_id}`}
                  style = {{color: Styles.palette.primary1Color}}>
              {this.props.value.project_id}
            </Link>
          </span>
          <span> {reason} </span>
          {this.props.saved_search_id !== "" ? this.props.saved_search_id : ""}
          <div style = {{fontStyle: 'italic' , color: Styles.palette.disabledColor}}>
            {this.props.value.date}
          </div>
        </div>
        <div className ="col-1" style ={{textAlign : "right"}}>
          <IconButton
                    onClick = {() => Backend.deleteNotification(this.props.value._id)}
                    touch = {true}
                    style = {Styles.largeIcon}
                    tooltipPosition = "bottom-center"
                    tooltip = "Delete notification"
                    iconStyle = {{fontSize: '24px', color: Styles.palette.textColor}}
                    >
                    <i className = "material-icons">cancel</i>
          </IconButton>
        </div>
      </div>
    )
  }
}
