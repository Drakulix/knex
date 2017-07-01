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
        profile: 'Profile',
        adminArea: 'Admin Area'
      }
    };
  }

  render() {
    let isActive = (url) => { url === this.props.location };
    return (
        <div className="col-3 side-bar">
            <img className="logo-banner" src={logo} alt="logo banner"/>
            <ul className="list-group">
                <SideBarEntry name={this.state.menu.discoverProjects} to="/discovery" active={isActive("/discovery")} />
                <SideBarEntry name={this.state.menu.createProject} to="/createbylink" active={isActive("/createbylink")} />
                <SideBarEntry name={this.state.menu.bookmarks} to="/bookmarks" active={isActive("/bookmarks")} />
                <SideBarEntry name={this.state.menu.profile} to="/profile" active={isActive("/profile")} />
                <SideBarEntry name={this.state.menu.adminArea} to="/admin" active={isActive("/admin")} />
            </ul>
        </div>
    );
  }
}

const SideBarEntry = ({to, name, active}) => {
    return (
        <li className={"list-group-item " + (active ? "active" : "")}>
            {active && (<div className="menu-indicator" />)}
            <Link to={to}>
                {name}
            </Link>
        </li>
    )
};
