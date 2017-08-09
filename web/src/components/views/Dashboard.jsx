import React from 'react'
import TimeLine from '../common/userComponents/TimeLine'
import Backend from '../common/Backend'

export default class Dashboard extends React.Component {

  constructor(props){
    super(props)
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
                <div>
                  <hr></hr>
                  <News key = {notification._id}
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
        operation = "been invited by"
        break
      case 'register':
        operation = "register"
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
                        style = {{color: Styles.palette.primary1Color}}>You</Link> have </span>
              :
            <span><Link to = {`/profile/${this.props.value.creator}`}
                        style = {{color: Styles.palette.primary1Color}}>
              {this.props.names[this.props.value.creator]}</Link> has </span>
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
              <span style = {{fontStyle: 'italic' , color: Styles.palette.disabledColor}}>
                {this.props.value.date}
              </span>
            </span>
            : ""
          }
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
