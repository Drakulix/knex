import React, { Component } from 'react';
import { IndexLink, Link } from "react-router";


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
            <p className="top-bar-company">
              Company Name
            </p>
          </div>
          <div className="col">
            <form className="form-inline my-2 my-lg-0">

            </form>
          </div>
          <div className="col-1">
            <p className="top-bar-text">
              Collection
            </p>
          </div>
          <div className="col-1">
            <p className="top-bar-text">
              Profile
            </p>
          </div>
          <div className="col-1">
            <p className="top-bar-text">
              <i className="fa fa-power-off" aria-hidden="true"></i>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default TopBar;
