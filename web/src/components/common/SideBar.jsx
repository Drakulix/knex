import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../style/img/white_logo_title.svg';

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
      }
    };
  }

 isActive = (url) => { return url === this.props.location };

  //has to be updated if history is working
  render() {

    return (
        <div className="col-3 side-bar">
            <img className="logo-banner" src={logo} />
            <ul className="list-group">
                <SideBarEntry name={this.state.menu.discoverProjects} to="/discovery" active={this.isActive("/discovery")} />
                <SideBarEntry name={this.state.menu.createProject} to="/createbylink" active={this.isActive("/createbylink")} />
                <SideBarEntry name={this.state.menu.bookmarks} to="/bookmarks" active={this.isActive("/bookmarks")} />
                <SideBarEntry name={this.state.menu.userprojects} to="/yourprojects" active={this.isActive("/yourprojects")} />
                <SideBarEntry name={this.state.menu.profile} to="/profile" active={this.isActive("/profile")} />
                <SideBarEntry name={this.state.menu.adminArea} to="/admin" active={this.isActive("/admin")} />
            </ul>
        </div>
    );
  }
}

const SideBarEntry = ({to, name, active}) => {

    return (
        <li className={"list-group-item" + (active ? " active" : "")}>
            {active && (<div className="menu-indicator" />)}
            <Link to={to}>
                {name}
            </Link>
        </li>
    )
};
