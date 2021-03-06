import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import Badge from 'material-ui/Badge'
import IconButton from 'material-ui/IconButton'
import Snackbar from 'material-ui/Snackbar'
import NotificationPane from '../common/NotificationPane'
import Backend from '../common/Backend'
import Logout from 'material-ui/svg-icons/action/exit-to-app'
import Profile from 'material-ui/svg-icons/action/account-circle'
import Notification from 'material-ui/svg-icons/social/notifications'
import Settings from 'material-ui/svg-icons/action/settings'
import Styles from './Styles'
import history from './history'


export default class TopBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      popoverOpen: false,
      logo: 'Company Logo',
      notifications: [],
      snackbar: false,
      popover: false,
    }
    this.handleLogout = this.handleLogout.bind(this)
    this.handleNotificationClick = this.handleNotificationClick.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
    this.resolveNotification = this.resolveNotification.bind(this)
  }

  componentWillMount(){
    this.loadNotifications()
  }

  loadNotifications() {
    Backend.getNotifications().then(function (data) {
      this.setState({
          notifications: data
          })
      }.bind(this))
  }

  resolveNotification(notificationID){
    var list = this.state.notifications.filter((c) => c._id !== notificationID)
    this.setState({notifications: list,
                  popover: false})
    Backend.deactivateNotification(notificationID)
  }

  handleNotificationClick(event){
    event.preventDefault()
    this.setState({
      popover: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestClose(){
    this.setState({popover: false})
  }

  handleLogout(event){
    event.preventDefault()
    Backend.logout().then((success) => {
      if(success){
        this.setState({ redirect: true })
      }else{
        this.setState({ redirect: false})
        this.setState({snackbar: true})
      }
    })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to='/'/>
    }
    return (
      <div className = "topbar row">
        <div className = "col-12" style = {{marginTop: 2, textAlign: "right"}}>
          <IconButton tooltip = "Your profile"
            iconStyle = {{color: Styles.palette.alternateTextColor}}
            onClick = {() => {history.push('/yourprofile')}}
            >
            <Profile/>
          </IconButton>
          <div onClick = {() => {history.push('/yourprofile')}}
               style = {{color: Styles.palette.alternateTextColor,
                                verticalAlign: "middle",
                                display: "inline-block",
                                cursor: "pointer",
                                height: "100%", paddingTop: 4}}>
            {Backend.getName()}
          </div>
          <IconButton tooltip = "Notifications" iconStyle = {{color: Styles.palette.alternateTextColor}} onClick = {this.handleNotificationClick}>
            <Notification/>
            {this.state.notifications.length !== 0 ?
              <Badge  badgeContent = {this.state.notifications.length} primary = {true}
                  badgeStyle = {{top: -30, height: 20, width: 20}} />
                : ""
            }
          </IconButton>
          <IconButton tooltip = "Your settings"
            iconStyle = {{color: Styles.palette.alternateTextColor}}
            onClick = {() => {history.push('/settings')}}
            >
            <Settings/>
          </IconButton>
          <NotificationPane value = {this.state.popover}
                            anchorEl = {this.state.anchorEl}
                            onRequestClose = {this.handleRequestClose}
                            notifications = {this.state.notifications}
                            resolveNotification = {this.resolveNotification}/>
          <IconButton tooltip = "Log out" iconStyle = {{color: Styles.palette.alternateTextColor}} onClick = {this.handleLogout}>
            <Logout/>
          </IconButton>
        </div>
        <Snackbar
          open = {this.state.snackbar}
          message = "Log out failed!"
          autoHideDuration = {10000}/>
      </div>
    )
  }
}
