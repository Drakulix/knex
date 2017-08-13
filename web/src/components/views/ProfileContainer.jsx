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
import TimeLine from '../common/userComponents/TimeLine'

import RaisedButton from 'material-ui/RaisedButton'
import {Redirect} from 'react-router-dom'
import HeadLine from '../common/HeadLine'



export default class ProfileContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email : this.props.match.params.email === undefined ? Backend.getMail() : this.props.match.params.email,
      profile_exists : false,
      site_loaded : false,
      isMe : this.props.match.params.email === Backend.getMail(),
      profileInf : {},
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
    this.loadProfileInf(nextProps.match.params.email === undefined ? Backend.getMail() : nextProps.params.email)
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
        <Spinner text = {"Loading profile"}/>
      )
    }
    if(this.state.email === Backend.getMail() && this.props.match.url !== "/yourprofile"){
      return <Redirect to = "/yourprofile"/>
    }
    if( !this.state.profile_exists){
      return (
        <div className = "container">
          <div className = "row" style = {{marginTop : "100px", marginBottom : 100}}>
            <div className = "col-5 "></div>
            <div className = "col-2 " style = {{fontSize : "30px", height : 41, textAlign : "center"}}>
              Profile not found
            </div>
            <div className = "col-1"></div>
            <div className = "col-4">
              {Backend.isAdmin?
                <RaisedButton
                  fullWidth = {true}
                  label = {(this.state.showRegistration) ? "Hide registration" : "Do you want to register the user" }
                  primary = {true}
                  onClick = {() => this.setState ({showRegistration : !this.state.showRegistration})}/>
               : ""}
            </div>
          </div>
            {Backend.isAdmin ?
              <div style = {{textAlign : "center", marginBottom : 40, display : (this.state.showRegistration) ? "block" : "none" }}>
                <RegisterUser email = {this.props.match.params.email}
                              handleUserUpdate = {() => {history.push(`/profile/${this.props.match.params.email}`)}}/>
              </div>
             : "" }
            <ProfileProjects
              email = {this.state.email}
              profileExists = {false} />

        </div>
      )
    }
    else {
      return (
        <div className = "container">
          <HeadLine title = {"Profile details"}/>
          {!this.state.profileInf.active === "false" ? <i style = {{fontSize : '20px'}}>Inactive user</i> : ""}
          <div className = "row">
            <div className = "col-3">
            <ProfileView profileInf = {this.state.profileInf}
                        topTenTags = {this.state.topTenTags}
                        projectsContributed = {this.state.projectCount}/>
            </div>
            <div className = "col-9">
              <div style = {{fontWeight: 'bold', fontSize: 26}}>
                {this.state.profileInf.first_name} {this.state.profileInf.last_name}
              </div>
              <div style = {{marginBottom: 20}}>
                {this.state.profileInf.email}
              </div>
              <Tabs
            inkBarStyle = {{marginTop : -5, height : 5}}
            value = {this.state.value}
            onChange = {this.handleChange}
            contentContainerStyle = {{marginTop : 30, paddingLeft : 15, paddingRight : 15}}>
            <Tab
              label = "Timeline" value = "a">
              <TimeLine email = {this.state.email}/>
            </Tab>
            <Tab label = "Projects" value = "b">
              <ProfileProjects
                email = {this.state.email}
                profileExists = {true} />
            </Tab>
            {(Backend.isAdmin() || this.state.isMe)?
              <Tab label = "Edit Profile" value = "c">
                <ProfileEditor email = {this.state.email}
                  profileInf = {this.state.profileInf}
                  profileChangeHandler = {this.handleProfileChange}/>
              </Tab> : ""
            }

          </Tabs>
            </div>
          </div>
          <Snackbar
            open = {this.state.snackbar}
            message = {this.state.snackbarText}
            autoHideDuration = {10000}/>
        </div>
      )
    }
  }
}
