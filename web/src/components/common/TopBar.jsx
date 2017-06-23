import React, { Component } from 'react';
import { Link } from "react-router-dom";
import logo from '../../style/img/knex_logo_white_header.png';


class TopBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logo: 'Company Logo'
    };
  }

  render() {
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
            <Link to="/bookmarks">
              <p className="top-bar-text">
                Bookmarks
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
              <Link to="/">
                <i className="fa fa-power-off" aria-hidden="true"></i>
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default TopBar;
