import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../style/img/white_logo_title.svg';
import {getMyEmail, getUserInfo} from '../common/Authentication.jsx';

export default class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: {
        discoverProjects: 'Discover Projects',
        createProject: 'Create New Project',
        queries : "Saved Queries",
        bookmarks: 'Bookmarks',
        userprojects: 'Projects',
        profile: 'Profile',
        adminArea: 'Admin Area'
      },
      myProfile: getMyEmail(),
      data : "",
      isAdmin : false
    };
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
        this.setState({
          first_name: data.first_name, last_name: data.last_name, bio: data.bio,
          isAdmin : data.roles.indexOf("admin") !== -1
        });
      }
    }).catch(ex => {
      this.setState({profile_exists: false});
    });
  }

  isActive = (url) => { return url === this.props.location };

  render() {
    return (
      <div className="col-3 side-bar">
        <img className="logo-banner" src={logo} alt="logo"/>
        <ul className="list-group">
          <SideBarEntry icon="fa fa-search" name={this.state.menu.discoverProjects} to="/discovery" active={this.isActive("/discovery")} />
          <SideBarEntry icon="fa fa-plus-circle" name={this.state.menu.createProject} to="/createbylink" active={this.isActive("/createbylink")} />
          <SideBarEntry icon="fa fa-archive" name={this.state.menu.queries} to="/queries" active={this.isActive("/queries")} />
          <SideBarEntry icon="fa fa-star-half-o" name={this.state.menu.bookmarks} to="/bookmarks" active={this.isActive("/bookmarks")} />
          <SideBarEntry icon="fa fa-briefcase" name={this.state.menu.userprojects} to="/yourprojects" active={this.isActive("/yourprojects")} />
          <SideBarEntry icon="fa fa-user" name={this.state.menu.profile} to={'/profile/' + this.state.myProfile } active={this.isActive("/profile")} />
          <SideBarEntry
            icon="fa fa-cogs"
            name={this.state.menu.adminArea}
            to="/admin" active={this.isActive("/admin")}
            style={{display:(this.state.isAdmin) ? "block" : "none"}}/>
        </ul>
      </div>
    );
  }
}

const SideBarEntry = ({to, icon, name, active, style}) => {
  return (
    <Link to={to}  >
      <li className={"list-group-item " + (active ? "active" : "") } style={style}>
        {active && (<div className="menu-indicator" />)}
        <i className={icon} aria-hidden="true"></i>  {name}
      </li>
    </Link>
  )
};
