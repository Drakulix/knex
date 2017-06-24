import React, { Component } from 'react';
import Overview from '../views/AdminOverview';
import TopBar from '../common/TopBar';
import { Link } from 'react-router-dom';
import logo from '../../style/img/knex_logo_white.png';

export default class AdminArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: {
        discoverProjects: 'Discover Projects',
        createProject: 'Create New Project',
        bookmarks: 'Bookmarks',
        profile: 'Profile',
        adminArea: 'Admin Area'
      }
    };
  }

  render() {
    return (
      <div className="inner-content">
        <TopBar />
        <div className="row">
          <div className="col-3 side-bar">
            <img className="logo-banner" src={logo} />
            <ul className="list-group">
              <li className="list-group-item">
                <Link to="/discovery">
                  {this.state.menu.discoverProjects}
                </Link>
              </li>
              <li className="list-group-item">
                <Link to="/createbylink">
                  {this.state.menu.createProject}
                </Link>
              </li>
              <li className="list-group-item">
                <Link to="/collection">
                  {this.state.menu.bookmarks}
                </Link>
              </li>
              <li className="list-group-item">
                <Link to="/profile">
                  {this.state.menu.profile}
                </Link>
              </li>
              <li className="list-group-item active">
                <div className="menu-indicator" />
                <Link to="/admin">
                  {this.state.menu.adminArea}
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-9 content">
            <Overview />
          </div>
        </div>
      </div>
    );
  }
}
