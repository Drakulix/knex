import React, { Component } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import Backend from '../common/Backend'
import Snackbar from 'material-ui/Snackbar'
import history from '../common/history'
import Spinner from '../common/Spinner'
import ProfileView from '../common/userComponents/ProfileView'
import ProfileProjects from '../common/userComponents/ProfileProjects'
import ProfileEditor from '../common/userComponents/ProfileEditor'
import RegisterUser from '../common/adminComponents/RegisterUser'
import RaisedButton from 'material-ui/RaisedButton'


export default class ProfileContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email : this.props.match.params.email,
      profile_exists : false,
      site_loaded : false,
      isMe : this.props.match.params.email === Backend.getMail(),
      profileInf: {},
      value : 'a',
      topTenTags : [],
      snackbar : false,
      snackbarText : "",
      projectCount : 0,
      showRegistration : false
    }
    this.handleProfileChange = this.handleProfileChange.bind(this)
  }

  handleChange = (value) => {
    this.setState({
      value : value,
      snackbar : false
    })
  }

  componentWillReceiveProps(nextProps){
    this.loadProfileInf(this.state.email)
  }

  componentWillMount(){
    this.loadProfileInf(this.state.email)
  }

  loadProfileInf(e) {
    Backend.getProfile(e).then(data => {
      if(!data){
        this.setState({
          profile_exists : false,
          site_loaded : true
        })
      }else{
        Backend.getTagsOfUser(e)
        .then(tags => {this.setState({topTenTags : tags})})
        .then(
          Backend.getUsersProjects(e)
          .then(count =>{this.setState({projectCount : count.length})})
        )
        .then(
          this.setState({
            profileInf : data,
            profile_exists : true,
            site_loaded : true,
          })
        )
      }
    }).catch(ex => {
      this.setState({
        profile_exists : false,
        site_loaded : true
      })
    })
  }

  handleProfileChange(snackbarText, success){
    this.setState({
      value : success ? 'a' : 'b',
      snackbar : true,
      snackbarText : snackbarText
    })
    this.loadProfileInf(this.state.email)
  }

  render() {
    if(!this.state.site_loaded){
      return (
        <Spinner loading = {true} text = {"Loading profile"}/>
      )
    }
    if( !this.state.profile_exists){
      return (
        <div className = "container">
          <div className = "row" style={{marginTop: "100px", marginBottom: 100}}>
            <div className = "col-5 "></div>
            <div className = "col-2 " style ={{fontSize : "30px", height:41, textAlign: "center"}}>
              Profile not found
            </div>
            <div className = "col-2"></div>
            <div className = "col-3">
              {Backend.isAdmin?
                <RaisedButton
                  fullWidth={true}
                  label = {(this.state.showRegistration) ? "Hide registration" : "Do you want to register user" }
                  primary = {true}
                  onClick = {() => this.setState ({showRegistration : !this.state.showRegistration})}/>
                :""}
            </div>
          </div>
            {Backend.isAdmin ?
              <div style ={{textAlign : "center", marginBottom : 40, display : (this.state.showRegistration) ? "block" : "none" }}>
                <RegisterUser email = {this.props.match.params.email}
                              handleUserUpdate = {() => {history.push("/profile/"+this.props.match.params.email)}}/>
              </div>
              :  "" }
            <ProfileProjects
              email = {this.state.email} />

        </div>
      )
    }
    else {
      return (
        <div className = "container">
          <div className = "headerCreation">Profile details</div>
          {!this.state.profileInf.active === "false" ? <i style = {{fontSize : '20px'}}>Inactive user</i> : ""}
          <Tabs
            inkBarStyle = {{marginTop : -5, height : 5}}
            value = {this.state.value}
            onChange = {this.handleChange}
            contentContainerStyle = {{marginTop: 30, paddingLeft:15, paddingRight:15}}
          >
            <Tab
              label = "Profile Info" value = "a">
              <ProfileView profileInf = {this.state.profileInf}
                          topTenTags = {this.state.topTenTags}
                          projectsContributed = {this.state.projectCount}/>
            </Tab>
            {(Backend.isAdmin() || this.state.isMe)?
              <Tab label = "Edit Profile" value = "b">
                <ProfileEditor email = {this.state.email}
                  profileInf = {this.state.profileInf}
                  profileChangeHandler = {this.handleProfileChange}/>
              </Tab> : ""
            }
            <Tab label = "Projects" value = "c">
              <ProfileProjects
                email = {this.state.email} />
            </Tab>
          </Tabs>
          <Snackbar
            open = {this.state.snackbar}
            message = {this.state.snackbarText}
            autoHideDuration = {10000}/>
        </div>
      )
    }
  }
}
