import React, { Component } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import CircularProgress from 'material-ui/CircularProgress'
import {getMyEmail, getUserInfo} from '../common/Authentication.jsx'
import { fetchJson } from '../common/Backend'
import Snackbar from 'material-ui/Snackbar'

import ProfileView from '../common/userComponents/ProfileView'
import ProfileProjects from '../common/userComponents/ProfileProjects'
import ProfileEditor from '../common/userComponents/ProfileEditor'


export default class ProfileContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: this.props.match.params.email,
      profile_exists : true,
      site_loaded: false,
      isAdmin: false,
      isMe : false,
      profileInf: {},
      value: 'a',
      topTenTags :[]
    }

    this.handleProfileChange = this.handleProfileChange.bind(this)
    this.loadMyAdmin()
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    })
  }

  isUserAdmin(){
    return (this.state.isAdmin)
  }

  componentWillReceiveProps(nextProps){
    this.setState({email: nextProps.email})
    this.loadProfileInf(this.state.email)
  }

  componentWillMount(){
    this.loadProfileInf(this.state.email)
  }

  loadMyAdmin() {
    getUserInfo(getMyEmail()).then(data => {
      this.setState({profileInf: data})
      if(data){
        this.setState({
          isAdmin : data.roles.indexOf("admin") !== -1
        })
      }
    })
  }

  loadProfileInf(e) {
    getUserInfo(e).then(data => {
      this.setState({profileInf: data})
      if(!data){
        this.setState({profile_exists: false})
      }else{
        this.setState({
          first_name: data.first_name,
          last_name: data.last_name,
          bio: data.bio,
          site_loaded: true,
          isMe : data.email === getMyEmail()
        })
      }
    }).catch(ex => {
      alert(ex)
      this.setState({profile_exists: false,
        site_loaded: true})
      })

      fetchJson("/api/users/"+e+"/tags").then(data => {
        this.setState({
          topTenTags: data
        })
      })
    }

  handleProfileChange(snackbarText){
    this.setState({value : "a",
        snackbar : true,
        snackbarText: snackbarText
    })
    this.loadProfileInf(this.state.email)
  }

  render() {
    if(!this.state.site_loaded){
      return (
        <div className="container">
          <div className="header"><CircularProgress size={80} thickness={5} /></div>
        </div>
      )
    }
    if( !this.state.profile_exists){
      return (
        <div className="container">
          <div className="header">Profile not found</div>
        </div>
      )
    }
    else {
      return (
        <div className="container">
          <div className="header">Profile details</div>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            style={{marginBottom:"40px"}}>
            <Tab
              label="Profile Info" value="a">
              <ProfileView profileInf={this.state.profileInf}
                          topTenTags={this.state.topTenTags}/>
            </Tab>
            {(this.state.isAdmin || this.state.isMe)?
              <Tab label="Edit Profile" value="b">
                <ProfileEditor email={this.state.email}
                  profileInf = {this.state.profileInf}
                  profileChangeHandler = {this.handleProfileChange}/>
              </Tab> : ""
            }
            <Tab label="Projects" value="c">
              <ProfileProjects profileInf={this.state.profileInf}
                isMe={this.state.isMe}
                isAdmin={this.state.isAdmin}/>
            </Tab>
          </Tabs>
          <Snackbar
            open={this.state.snackbar}
            message={this.state.snackbarText}
            autoHideDuration={10000}/>
        </div>
      )
    }
  }
}
