import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { logout } from '../common/Authentication.jsx';
import { Popover, PopoverTitle, PopoverContent } from 'reactstrap';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

class TopBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      popoverOpen: false,
      logo: 'Company Logo',
      count: 3
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.toggle = this.toggle.bind(this);
  }


  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
      count: 0
    });
  }

  handleLogout(event){
    event.preventDefault();
    logout().then((success) => {

      if(success){
        this.setState({ redirect: true });
      }else{
        this.setState({ redirect: false});
        alert("Logout failed");
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
              <div className="notification-container">
                <NotificationBadge count={this.state.count} effect={Effect.SCALE}/>
                <i id="Popover1" onClick={this.toggle} className="bell fa fa-bell" aria-hidden="true"></i>
              </div>
              <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
                <PopoverTitle>Notifications</PopoverTitle>
                <PopoverContent>
                  <div>
                    <a>A Project got updated</a>
                  </div>
                  <div>
                    <a>A Project got updated</a>
                  </div>
                  <div>
                    <a>Janette bookmarked a project</a>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
        </div>

          <div className="col-1">
            <p className="top-bar-text">
              <i className="fa fa-power-off" aria-hidden="true" onClick={this.handleLogout}></i>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default TopBar;
