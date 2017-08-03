import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import Badge from 'material-ui/Badge'
import IconButton from 'material-ui/IconButton'
import Snackbar from 'material-ui/Snackbar'
import NotificationPane from '../common/NotificationPane'
import Backend from '../common/Backend'

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
        <div className = "row">
          <div className = "col-10">
          </div>
          <div className = "col-1" style = {{marginTop: 2}}>
            <IconButton tooltip = "Notifications" style = {{color: 'white', marginLeft: 80}} onClick = {this.handleNotificationClick}>
              <i className = "material-icons">notifications</i>
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
          </div>
          <div className = "col-1" style = {{marginTop: 2}}>
            <IconButton tooltip = "Log out" style = {{color: 'white'}} onClick = {this.handleLogout}>
              <i className = "material-icons">exit_to_app</i>
            </IconButton>
          </div>
        </div>
        <Snackbar
          open = {this.state.snackbar}
          message = "Log out failed!"
          autoHideDuration = {10000}/>
      </div>
    )
  }
}
