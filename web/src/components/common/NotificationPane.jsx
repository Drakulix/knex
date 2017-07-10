import React, { Component } from 'react';

import { login, isLoggedIn, logout, getCookie, setCookie } from '../common/Authentication.jsx';


import { fetchJson, fetchDelete,fetchNotification } from '../common/Backend';

import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
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
    this.state = {
      notifications: props.notifications
    };
    this.resolveNotification = this.resolveNotification.bind(this);

  }


  resolveNotification(notificationID){
    fetchDelete("api/users/notifications/"+ notificationID);
  }


componentWillReceiveProps(props){

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
                {this.state.notifications.map(notification =>
                  <MenuItem >
                    <Link style={styles["linkStyle"]}
                      onClick={()=>this.resolveNotification(notification.id)}
                      to={notification.link}>
                      <div style={{marginBottom:-25}}>
                      {notification.title}</div>
                    <div style={{fontSize:"12px"}}> {notification.description}
                    </div>
                    </Link>
                  </MenuItem>)}
                </Menu>
              </Popover>
          );
    }
  }
