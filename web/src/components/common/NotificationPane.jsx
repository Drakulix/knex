import React, { Component } from 'react'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import { Link } from 'react-router-dom'
import Styles from './Styles.jsx'


const notificationText = {
  'create':   "A project you are author was uploaded.",
  'archive':  "A project you are author was archived.",
  'share':    "A project was shared to you.",
  'comment':  "A project was commented.",
  'update':    "A project was updated.",
  'bookmark': "One of your projects was bookmarked.",
}


export default class NotificationPane extends Component {

  constructor(props) {
    super(props)
    this.resolveNotification = this.resolveNotification.bind(this)
  }

  resolveNotification(notificationID){
    this.props.resolveNotification(notificationID)
  }

  render() {
    return (
      <Popover
        height = {200}
        open = {this.props.value}
        anchorEl = {this.props.anchorEl}
        anchorOrigin = {{horizontal: 'middle', vertical: 'bottom'}}
        targetOrigin = {{horizontal: 'left', vertical: 'top'}}
        canAutoPosition = {true}
        onRequestClose = {this.props.onRequestClose}>
        <Menu>
          {this.props.notifications.map(notification =>
            <MenuItem key = {notification._id}>
              <Link style = {{color: Styles.palette.textColor}}
                    onClick = {()=>this.resolveNotification(notification._id)}
                    to = {`/project/${notification.project_id}`}>
              {notificationText[notification.operation]}
              </Link>
           </MenuItem>
         )}
        </Menu>
      </Popover>
    )
  }
}
