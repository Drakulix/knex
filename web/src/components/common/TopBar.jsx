import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import { login, isLoggedIn, logout, getCookie, setCookie } from '../common/Authentication.jsx';

import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import NotificationPane from '../common/NotificationPane'


const styles = {

  linkStyle:{
    color :'#000000'
  }
};


export default class TopBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      popoverOpen: false,
      logo: 'Company Logo',

      snackbar: false,
      popover : false,

    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);

  }

  componentWillMount(){
    this.loadNotifications();
  }



  loadNotifications() {
    var notifications = [{description : "New Update on" , link: "/projects/da", title:"Title",
id :"dsa"
    },
    {description : "New Project matching query" , link: "/projects/da", title:"Title2",

    id :"dsa"},
    {description : "New Comment on " , link: "/projects/da", title:"Title",
    id :"dsa"}];
    this.setState({notifications: notifications});
  }



  handleNotificationClick(event){
    event.preventDefault();
    this.setState({
      popover: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose(){
    this.setState({popover:false});
  }

  handleLogout(event){
    event.preventDefault();
    logout().then((success) => {
      if(success){
        this.setState({ redirect: true });
      }else{
        this.setState({ redirect: false});
        this.setState({snackbar:true})
      }
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to='/'/>;
    }
    return (
      <div className="container-fluid topbar">
        <div className="row">
          <div className="col-10">
          </div>
          <div className="col-1" style={{marginTop:2}}>
            <IconButton tooltip="Notifications" style={{color: 'white'}} onClick={this.handleNotificationClick}>
              <i className="material-icons">notifications</i>
              <Badge  badgeContent={this.state.notifications.length} primary={true}
                badgeStyle={{top:-30, height:20, width: 20}} />
            </IconButton>

            <NotificationPane value={this.state.popover}
                              anchorEl={this.state.anchorEl}
                              onRequestClose={this.handleRequestClose}
                              notifications={this.state.notifications}
              ></NotificationPane>


                        </div>

            <div className="col-1" style={{marginTop:2}}>
              <IconButton tooltip="Log out" style={{color: 'white'}} onClick={this.handleLogout}>
                <i className="material-icons">exit_to_app</i>
              </IconButton>
            </div>
          </div>
          <Snackbar
            open={this.state.snackbar}
            message="Log out failed!"
            autoHideDuration={10000}
          />
        </div>
      );
    }
  }
