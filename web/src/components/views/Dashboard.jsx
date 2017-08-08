import React from 'react'
import TimeLine from '../common/userComponents/TimeLine'
import Backend from '../common/Backend'
import { Link } from 'react-router-dom'
import Styles from '../common/Styles.jsx'
<<<<<<< HEAD
import Spinner from '../common/Spinner'
import IconButton from 'material-ui/IconButton'
=======
>>>>>>> 0735b6c... GUI progress


export default class Dashboard extends React.Component {

  constructor(props){
    super(props)
<<<<<<< HEAD
<<<<<<< HEAD
=======
    this.state = {
      notifications: [],
      username : {}
=======
    this.state = {
      notifications: []
>>>>>>> 0735b6c... GUI progress
    }
  }

  componentDidMount(){
<<<<<<< HEAD
    this.setState({
      loading : true,
    })
    Backend.getActions()
    .then((data) => {
      Backend.getUserNames(data.map (notification => {return notification.user_id}))
      .then ((userNames) => {
        this.setState({
          userNames : JSON.parse(userNames)
        })
        Backend.getProjectTitels(data.map (notification => {return notification.project_id}))
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
>>>>>>> b589344... Fixed for Tests
=======
    Backend.getActions()
    .then((data) => {this.setState({notifications: data})})
>>>>>>> 0735b6c... GUI progress
  }

  render() {
    return (
      <div className = "container">
<<<<<<< HEAD
        <div className = "headerCreation">Your timeline</div>
          <TimeLine email = {Backend.getMail()}/>
=======
        <div className = "headerCreation">Your news</div>
<<<<<<< HEAD
          <Spinner loading = {this.state.loading} text = {"Loading your news"} />
          <div style = {{width : "100%", display : (!this.state.loading ? "block" : "none")}}>
            {
              this.state.notifications.map(notification =>
                <div>
                  <News key = {notification._id}
                      value = {notification}
                      names = {this.state.userNames}
                      titles = {this.state.projectTitles}/>
                    <hr></hr>
                </div>
              )
            }
          </div>
=======
        {
          this.state.notifications.map(notification =>
            <div>
              <News key = {notification._id}
                  value = {notification} />
                <hr></hr>
            </div>
          )
        }
>>>>>>> 0735b6c... GUI progress
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
<<<<<<< HEAD
      <div className = "row" style={{width: "100%"}}>
        <div className ="col-1">
=======
      <div className = "row">
        <div clasName ="col-4">
>>>>>>> 0735b6c... GUI progress
          <img src = {`/api/users/${this.props.value.user_id}/avatar`}
               style = {{marginTop : -8}}
            width = "60"
            height = "60"
            alt = {this.props.value.user_id}
            />
        </div>
<<<<<<< HEAD
        <div className ="col-10">
=======
        <div className ="col-8">
>>>>>>> 0735b6c... GUI progress
          {this.props.value.user_id === Backend.getMail() ?
            <span><Link to = "/yourprofile"
                        style = {{color: Styles.palette.primary1Color}}>You</Link> have </span>
              :
            <span><Link to = {`/profile/${this.props.value.user_id}`}
                        style = {{color: Styles.palette.primary1Color}}>
<<<<<<< HEAD
              {this.props.names[this.props.value.user_id]}</Link> has </span>
=======
              {this.props.value.user_id}</Link> has </span>
>>>>>>> 0735b6c... GUI progress
          }
          <span>{operation}</span>
          <span> project </span>
          <span>
            <Link to = {`/project/${this.props.value.project_id}`}
                  style = {{color: Styles.palette.primary1Color}}>
              {this.props.titles[this.props.value.project_id]}
            </Link>
          </span>
          <span> {reason} </span>
          {this.props.saved_search_id !== "" ? this.props.saved_search_id : ""}
          <div style = {{fontStyle: 'italic' , color: Styles.palette.disabledColor}}>
            {this.props.value.date}
          </div>
        </div>
<<<<<<< HEAD
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
>>>>>>> b589344... Fixed for Tests
=======
>>>>>>> 0735b6c... GUI progress
      </div>
    )
  }
}
