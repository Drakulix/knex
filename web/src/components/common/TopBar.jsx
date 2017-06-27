import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import { login, isLoggedIn, logout, getCookie, setCookie } from '../common/Authentication.jsx';
import { Popover, PopoverTitle, PopoverContent } from 'reactstrap';

class TopBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      popoverOpen: false,
      logo: 'Company Logo'
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.toggle = this.toggle.bind(this);
  }


  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
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
            <i id="Popover1" onClick={this.toggle} className="bell fa fa-bell" aria-hidden="true"></i>
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
