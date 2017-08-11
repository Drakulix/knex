import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import Badge from 'material-ui/Badge'
import IconButton from 'material-ui/IconButton'
import Snackbar from 'material-ui/Snackbar'
import NotificationPane from '../common/NotificationPane'
import Backend from '../common/Backend'
import Logout from 'material-ui/svg-icons/action/exit-to-app'
import Notification from 'material-ui/svg-icons/social/notifications'
import Styles from './Styles'

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
    var list = this.state.notifications.filter((c) => c.id !== notificationID)
    this.setState({notifications: list,
                  popover: false})
    Backend.deleteNotification(notificationID)
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
      <div className = "container-fluid topbar">
        <div style = {{marginTop: 2, textAlign: "right"}}>
          <IconButton tooltip = "Notifications" iconStyle = {{color: Styles.palette.alternateTextColor}} onClick = {this.handleNotificationClick}>
            <Notification/>
            { this.state.notifications.length !== 0 ?
              <Badge  badgeContent = {this.state.notifications.length} primary = {true}
                  badgeStyle = {{top: -30, height: 20, width: 20}} />
             : ""
            }
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
