import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import { login, isLoggedIn, logout, getCookie, setCookie } from '../common/Authentication.jsx';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import Popover from 'material-ui/Popover';


const styles = {
  wrapper: {
    verticalAlign: 'middle',
    padding: '10px'
  },
  linkStyle:{
    marginTop: '3',
    color :'#000000'
  }
};


class TopBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      popoverOpen: false,
      logo: 'Company Logo',

      snackbar: false,
      popover : false,
      notifications: []

    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);

  }

  componentWillMount(){
    this.loadNotifications();
  }

  componentWillReceiveProps(){
    this.loadNotifications()
  }

  componentDidMount(){
    this.loadNotifications();
  }


  loadNotifications() {
    var notifications = [{text : "New Update on" , projectID: "ID", title:"Title"},
    {text : "New Project matching query" , projectID: "ID", title:"Title2"},
    {text : "New Comment on " , projectID: "ID", title:"Title"}];

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
          <div className="col-1">
            <div className="top-bar-text">
              <div style={{marginTop : "-32px"}}>
                  <Badge  badgeContent={this.state.notifications.length} primary={true}
                          badgeStyle={{top: 22, right: 22}}>
                    <IconButton tooltip="Log out" style={{color: 'white'}} onClick={this.handleNotificationClick}>
                      <i className="material-icons">notifications</i>
                    </IconButton>
                    <Popover
                              open={this.state.popover}
                              anchorEl={this.state.anchorEl}
                              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                              targetOrigin={{horizontal: 'left', vertical: 'top'}}
                              onRequestClose={this.handleRequestClose}>
                              <div style = {styles["wrapper"]}>
                                Notifications
                                    {this.state.notifications.map(notification =>
                                          <div>
                                            <hr></hr>
                                            <Link style={styles["linkStyle"]}
                                                  to={"/projects/"+notification.projectID}>
                                                  {notification.text} {notification.title}
                                            </Link>
                                      </div>)}
                              </div>

                    </Popover>
                  </Badge>



          </div>
            </div>
        </div>
          <div className="col-1" style={{marginTop:7}}>
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

export default TopBar;
