import React, { Component } from 'react';
import ProfileContainer from '../views/ProfileContainer.jsx';
import TopBar from '../common/TopBar';
import { Link } from 'react-router-dom';
import {login, isLoggedIn, logout, getCookie, setCookie, isAdmin, getMyEmail, getUserInfo} from '../common/Authentication.jsx';
import logo from '../../style/img/white_logo_title.svg';

export default class ProfileDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: {
        discoverProjects: 'Discover Projects',
        createProject: 'Create New Project',
        bookmarks: 'Bookmarks',
        profile: 'Profile',
        adminArea: 'Admin Area'
      },
      myProfile: getMyEmail()
    };
  }

  getAdminVisibility(){
    if( !isAdmin() ){
      return ({visibility: 'hidden'});
    }else{
      return ({});
    }
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
                <Link to="/bookmarks">
                  {this.state.menu.bookmarks}
                </Link>
              </li>
              <li className="list-group-item active">
                <div className="menu-indicator" />
                <Link to={'/profile/' + this.state.myProfile }>
                  {this.state.menu.profile}
                </Link>
              </li>
              <li className="list-group-item" style={this.getAdminVisibility()}>
                <Link to="/admin">
                  {this.state.menu.adminArea}
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-9 content">
            <ProfileContainer email={this.props.match.params.email}/>
          </div>
        </div>
      </div>
    );
  }
}
