import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../style/img/white_logo_title.svg'
import {getMyEmail, getUserInfo} from '../common/Authentication.jsx'

export default class SideBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menu : {
        discoverProjects : 'Discover projects',
        createProject : 'Create new project',
        queries : "Saved queries",
        bookmarks : 'Bookmarks',
        userprojects : 'Projects',
        profile : 'Profile',
        adminArea : 'Admin area'
      },
      myProfile : getMyEmail(),
      data : "",
      isAdmin : false
    }
  }

  componentWillMount(){
    this.loadProfileInf(this.state.myProfile)
  }

  loadProfileInf(e) {
    getUserInfo(e).then(data => {
      this.setState({profileInf : data})
      if(!data){
        this.setState({profile_exists : false})
      }else{
        this.setState({
          first_name : data.first_name, last_name : data.last_name, bio : data.bio,
          isAdmin : data.roles.indexOf("admin") !== -1
        })
      }
    }).catch(ex => {
      this.setState({profile_exists : false})
    })
  }

  isActive = (url) => { return url === this.props.location }

  render() {
    return (
        <div className = "col-3 side-bar">
            <img className = "logo-banner" src = {logo} alt = "logo"/>
            <ul className = "list-group">
                <SideBarEntry icon = "search" name = {this.state.menu.discoverProjects} to = "/discovery" active = {this.isActive("/discovery")} />
                <SideBarEntry icon = "add_circle" name = {this.state.menu.createProject} to = "/createbylink" active = {this.isActive("/createbylink")} />
                <SideBarEntry icon = "archive" name = {this.state.menu.queries} to = "/queries" active = {this.isActive("/queries")} />
                <SideBarEntry icon = "star_half" name = {this.state.menu.bookmarks} to = "/bookmarks" active = {this.isActive("/bookmarks")} />
                <SideBarEntry icon = "work" name = {this.state.menu.userprojects} to = "/yourprojects" active = {this.isActive("/yourprojects")} />
                <SideBarEntry icon = "account_circle" name = {this.state.menu.profile} to = {'/profile/' + this.state.myProfile } active = {this.isActive("/profile")} />
                <SideBarEntry
                  icon = "settings"
                  name = {this.state.menu.adminArea}
                  to = "/admin" active = {this.isActive("/admin")}
                  style = {{display : (this.state.isAdmin) ? "block" : "none"}}
                />
            </ul>
        </div>
    )
  }
}

const SideBarEntry = ({to, icon, icon2, name, active, style}) => {
    return (
        <Link to = {to}  >
        <li className = {"list-group-item " + (active ? "active" : "") } style = {style}>
            {active && (<div className = "menu-indicator" />)}
            <div style = {{display : "inline", paddingTop : 3, float : "left", marginRight : 8}}><i className = "material-icons" style = {{color : "#ffffff", fontSize : '20px',marginTop : -15}}>{icon}</i></div>{name}
        </li>
        </Link>
    )
}
