import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../style/img/white_logo_title.svg';
import {login, isLoggedIn, logout, getCookie, setCookie, isAdmin, getMyEmail, getUserInfo} from '../common/Authentication.jsx';

export default class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: {
        discoverProjects: 'Discover Projects',
        createProject: 'Create New Project',
        bookmarks: 'Bookmarks',
        userprojects: 'Projects',
        profile: 'Profile',
        adminArea: 'Admin Area'
      },
      myProfile: getMyEmail()
    };
  }

  isUserAdmin(){
    return this.state.profileInf && (this.state.profileInf.roles == 'admin');
  }

  getAdminVisibility(){
    if( !this.isUserAdmin() ){
      return ({visibility: 'hidden'});
    }else{
      return ({});
    }
  }

  componentWillMount(){
    this.loadProfileInf(this.state.myProfile);
  }

  loadProfileInf(e) {
    getUserInfo(e).then(data => {
      this.setState({profileInf: data});
      if(!data){
        this.setState({profile_exists: false});
      }else{
        this.setState({first_name: data.first_name, last_name: data.last_name, bio: data.bio});
      }

    }).catch(ex => {
      this.setState({profile_exists: false});
    });

  }

  render() {

    return (
        <div className="col-3 side-bar">
            <img className="logo-banner" src={logo} />
            <ul className="list-group">
                <SideBarEntry name={this.state.menu.discoverProjects} to="/discovery" active={isActive("/discovery")} />
                <SideBarEntry name={this.state.menu.createProject} to="/createbylink" active={isActive("/createbylink")} />
                <SideBarEntry name={this.state.menu.bookmarks} to="/bookmarks" active={isActive("/bookmarks")} />
                <SideBarEntry name={this.state.menu.userprojects} to="/yourprojects" active={isActive("/yourprojects")} />
                <SideBarEntry name={this.state.menu.profile} to={'/profile/' + this.state.myProfile } active={isActive("/profile")} />
                <SideBarEntry
                  name={this.state.menu.adminArea}
                  to="/admin" active={isActive("/admin")}
                  style={this.getAdminVisibility()}
                />
            </ul>
        </div>
    );
  }
}

const SideBarEntry = ({to, name, active, style}) => {
    return (
        <li className={"list-group-item " + (active ? "active" : "") } style={style}>
            {active && (<div className="menu-indicator" />)}
            <Link to={to}  >
                {name}
            </Link>
        </li>
    )
};
