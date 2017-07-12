import React, { Component } from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router-dom';

const styles = {
  linkStyle:{
    color :'#000000',
  }
};

export default class NotificationPane extends Component {
  constructor(props) {
    super(props);
    this.resolveNotification = this.resolveNotification.bind(this);
  }
  
  resolveNotification(notificationID){
    this.props.resolveNotification(notificationID);
  }

  render() {
    return (
      <Popover
        height={200}
        open={this.props.value}
        anchorEl={this.props.anchorEl}
        anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        canAutoPosition={true}
        onRequestClose={this.props.onRequestClose}>
        <Menu>
          {this.props.notifications.map(notification =>
            <MenuItem >
              <Link style={styles["linkStyle"]}
                onClick={()=>this.resolveNotification(notification.id)}
                to={notification.link}>
                <div style={{marginBottom:-25}}>{notification.title}</div>
                <div style={{fontSize:"12px"}}> {notification.description}</div>
              </Link>
            </MenuItem>)}
          </Menu>
        </Popover>
      );
    }
  }
