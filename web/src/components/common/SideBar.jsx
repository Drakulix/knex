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

  isActive = (url) => { return url === this.props.location };


    fetchUser(){
      fetch("/api/users/"+this.state.myProfile,{credentials: 'include'})
                  .then( (response) => {
                      return response.json() })
                          .then( (json) => {

                              this.setState({data: json});
                          });
    };


  returnAdminState(){

    return this.state.isAdmin
  }


  isUserAdmin(){
   if(this.state.data === " " || this.state.data["roles"] === undefined){
     this.fetchUser()
   }

   var roles = this.state.data["roles"];
   var admin = false
   if (roles !== undefined){
     for(let role of roles){
       if(role === "admin"){
         admin = true;
         break;
       }


   }
   this.setState({isAdmin : admin});
   //this.state.isAdmin = false
 }
   return this.returnAdminState()
  //  alert(getMyEmail())
    //return this.state.profileInf && (this.state.profileInf.roles == 'admin');
  };

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

  isActive = (url) => { return url === this.props.location };

  render() {
    return (
        <div className="col-3 side-bar">
            <img className="logo-banner" src={logo} alt="logo"/>
            <ul className="list-group">
                <SideBarEntry name={this.state.menu.discoverProjects} to="/discovery" active={this.isActive("/discovery")} />
                <SideBarEntry name={this.state.menu.createProject} to="/createbylink" active={this.isActive("/createbylink")} />
                <SideBarEntry name={this.state.menu.queries} to="/queries" active={this.isActive("/queries")} />
                <SideBarEntry name={this.state.menu.bookmarks} to="/bookmarks" active={this.isActive("/bookmarks")} />
                <SideBarEntry name={this.state.menu.userprojects} to="/yourprojects" active={this.isActive("/yourprojects")} />
                <SideBarEntry name={this.state.menu.profile} to={'/profile/' + this.state.myProfile } active={this.isActive("/profile")} />
                <SideBarEntry
                  name={this.state.menu.adminArea}
                  to="/admin" active={this.isActive("/admin")}
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
