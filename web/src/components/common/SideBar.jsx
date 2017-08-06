import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../style/img/white_logo_title.svg'
import Backend from '../common/Backend'
import Styles from './Styles.jsx'


export default class SideBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menu: {
        discoverProjects: 'Discover projects',
        createProject: 'Create a new project',
        queries: "Your saved queries",
        bookmarks: 'Your Bookmarks',
        userprojects: 'Your projects',
        profile: 'Your profile',
        adminArea: 'Admin area',
        trashcan: "Your trash",
        people: "Search users"

      },
      myProfile: Backend.getMail(),
      data: "",
    }
  }

  isActive = (url) => { return url === this.props.location }

  render() {
    return (
        <div className = "col-3 side-bar">
            <img className = "logo-banner" src = {logo} alt = "logo"/>
            <ul className = "list-group">
                <SideBarEntry icon = "search" name = {this.state.menu.discoverProjects} to = "/discovery" active = {this.isActive("/discovery")} />
                <SideBarEntry icon = "people" name = {this.state.menu.people} to = {'/users/'} active = {this.isActive("/users")} />
                <SideBarEntry icon = "add_circle" name = {this.state.menu.createProject} to = "/createbylink" active = {this.isActive("/createbylink")} />
                <SideBarEntry icon = "archive" name = {this.state.menu.queries} to = "/queries" active = {this.isActive("/queries")} />
                <SideBarEntry icon = "star_half" name = {this.state.menu.bookmarks} to = "/bookmarks" active = {this.isActive("/bookmarks")} />
                <SideBarEntry icon = "work" name = {this.state.menu.userprojects} to = "/yourprojects" active = {this.isActive("/yourprojects")} />
                <SideBarEntry icon = "delete" name = {this.state.menu.trashcan} to = '/trashcan/' active = {this.isActive("/trashcan")} />
                <SideBarEntry icon = "account_circle" name = {this.state.menu.profile} to = {`/profile/${this.state.myProfile}`} active = {this.isActive("/profile")} />
                {Backend.isAdmin() ?  <SideBarEntry
                  icon = "settings"
                  name = {this.state.menu.adminArea}
                  to = "/admin" active = {this.isActive("/admin")}
                />
              : ""}
            </ul>
        </div>
    )
  }
}

const SideBarEntry = ({to, icon, icon2, name, active, style}) => {
    return (
        <Link to = {to}  >
        <li className = {`list-group-item ${active ? "active": ""}` } style = {{color: Styles.palette.alternateTextColor}}>
            {active && (<div className = "menu-indicator" style = {{backgroundColor: Styles.palette.primary1Color }}/>)}
            <div style = {{display: "inline", paddingTop: 3, float: "left", marginRight: 8}}>
              <i className = "material-icons" style = {{color: Styles.palette.alternateTextColor, fontSize: '20px',marginTop: -15}}>{icon}</i>
            </div>{name}
        </li>
        </Link>
    )
}
