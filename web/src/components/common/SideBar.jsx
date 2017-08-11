import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Backend from '../common/Backend'
import Styles from './Styles.jsx'
import logo from '../../style/img/white_logo_title.svg'


import Delete from 'material-ui/svg-icons/action/delete'
import Search from 'material-ui/svg-icons/action/search'
import Admin from 'material-ui/svg-icons/action/settings'
import Profile from 'material-ui/svg-icons/action/account-circle'
import Projects from 'material-ui/svg-icons/action/work'
import Bookmarks from 'material-ui/svg-icons/toggle/star-half'
import People from 'material-ui/svg-icons/social/people'
import Archive from 'material-ui/svg-icons/content/archive'
import Add from 'material-ui/svg-icons/content/add-circle'


const menuItemStyle = {color: Styles.palette.alternateTextColor, width: 20, height:20, marginTop: -15}


export default class SideBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menu: {
        discoverProjects: 'Discover projects',
        createProject: 'Create a project',
        queries: "Your saved queries",
        bookmarks: 'Your bookmarks',
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
      <div className = "side-bar">
        <div className = "hidden-md-down">
            <img className = "logo-banner" src = {logo} alt = "logo"/>
        </div>
        <ul className = "list-group">
          <SideBarEntry icon = {<Search style = {menuItemStyle}/>} name = {this.state.menu.discoverProjects} to = "/discovery" active = {this.isActive("/discovery")} />
          <SideBarEntry icon = {<People style = {menuItemStyle}/>} name = {this.state.menu.people} to = {'/users/'} active = {this.isActive("/users")} />
          <SideBarEntry icon = {<Add style = {menuItemStyle}/>} name = {this.state.menu.createProject} to = "/createbylink" active = {this.isActive("/createbylink")} />
          <SideBarEntry icon = {<Archive style = {menuItemStyle}/>} name = {this.state.menu.queries} to = "/queries" active = {this.isActive("/queries")} />
          <SideBarEntry icon = {<Bookmarks style = {menuItemStyle}/>} name = {this.state.menu.bookmarks} to = "/bookmarks" active = {this.isActive("/bookmarks")} />
          <SideBarEntry icon = {<Projects style = {menuItemStyle}/>} name = {this.state.menu.userprojects} to = "/yourprojects" active = {this.isActive("/yourprojects")} />
          <SideBarEntry icon = {<Delete style = {menuItemStyle}/>} name = {this.state.menu.trashcan} to = '/trashcan' active = {this.isActive("/trashcan")} />
          <SideBarEntry icon = {<Profile style = {menuItemStyle}/>} name = {this.state.menu.profile} to = {`/yourprofile`} active = {this.isActive("/yourprofile")} />
          {Backend.isAdmin() ?  <SideBarEntry
            icon = {<Admin style = {menuItemStyle}/>}
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
        <div style = {{ backgroundColor: active ? Styles.palette.primary1Color : "inherit", marginRight: 5, width: 5, height: '100%'}}></div>
          <div style = {{display: "inline", paddingTop: 3, float: "left", marginRight: 8}}>
            {icon}
          </div>
          <div className = "hidden-md-down">{name}</div>
      </li>
    </Link>
  )
}
