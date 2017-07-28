import React, { Component } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import CircularProgress from 'material-ui/CircularProgress'
import Backend from '../common/Backend'
import Snackbar from 'material-ui/Snackbar'

import ProfileView from '../common/userComponents/ProfileView'
import ProfileProjects from '../common/userComponents/ProfileProjects'
import ProfileEditor from '../common/userComponents/ProfileEditor'


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
      snackbarText : ""
    }
    this.handleProfileChange = this.handleProfileChange.bind(this)
  }

  handleChange = (value) => {
    this.setState({
      value : value,
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
        Backend.getTagsOfUser(e).then(tags => {
            this.setState({
              topTenTags : tags
            })
        }).then(
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
        <div className = "container">
          <div className = "header"><CircularProgress size = {80} thickness = {5} /></div>
        </div>
      )
    }
    if( !this.state.profile_exists){
      return (
        <div className = "container">
          <div className = "header">Profile not found</div>
        </div>
      )
    }
    else {
      return (
        <div className = "container">
          <div className = "header">Profile details</div>
          <Tabs
            inkBarStyle = {{marginTop : -5, height : 5}}
            value = {this.state.value}
            onChange = {this.handleChange}
            contentContainerStyle = {{marginTop: 30, paddingLeft:15, paddingRight:15}}
          >
            <Tab
              label = "Profile Info" value = "a">
              <ProfileView profileInf = {this.state.profileInf}
                          topTenTags = {this.state.topTenTags}/>
            </Tab>
            {(Backend.isAdmin() || this.state.isMe)?
              <Tab label = "Edit Profile" value = "b">
                <ProfileEditor email = {this.state.email}
                  profileInf = {this.state.profileInf}
                  profileChangeHandler = {this.handleProfileChange}/>
              </Tab> : ""
            }
            <Tab label = "Projects" value = "c">
              <ProfileProjects profileInf={this.state.profileInf} />
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
