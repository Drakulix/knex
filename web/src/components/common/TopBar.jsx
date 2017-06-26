import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import logo from '../../style/img/knex_logo_white_header.png';
import {login, isLoggedIn, logout, getCookie, setCookie} from '../common/Authentication.jsx';

class TopBar extends Component {
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      redirect: false,
      logo: 'Company Logo'
    };
    this.handleLogout = this.handleLogout.bind(this);
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
          <div className="col-3">
            <img className="logo-banner" src={logo}/>
          </div>
          <div className="col">
            <form className="form-inline my-2 my-lg-0">

            </form>
          </div>
          <div className="col-1">
            <Link to="/collection">
              <p className="top-bar-text">
                Collection
              </p>
            </Link>
          </div>
          <div className="col-1">
            <Link to="/profile">
              <p className="top-bar-text">
                Profile
              </p>
            </Link>
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
