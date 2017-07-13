import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Chip from 'material-ui/Chip'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import {Tabs, Tab} from 'material-ui/Tabs'
import CircularProgress from 'material-ui/CircularProgress'
import {getMyEmail, getUserInfo, changePassword, changeProfile} from '../common/Authentication.jsx'
import { fetchJson } from '../common/Backend'
import DataTable from '../common/DataTable'
import Snackbar from 'material-ui/Snackbar'
import styles from '../common/Styles.jsx'


export default class ProfileContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profile_exists : true,
      site: 'info',
      site_loaded: false,
      error: '',
      profileInf: {},
      myProfileInf: {},
      email: this.props.match.params.email,
      first_name: '',
      last_name: '',
      bio: '',
      pw_old: '',
      pw_new: '',
      pw_new_confirm: '',
      is_admin: false,
      value: 'a',
      bookmarks : '',
      topTenTags :[]
    }

    this.handlePwChangeSubmit = this.handlePwChangeSubmit.bind(this)
    this.handleProfileChangeSubmit = this.handleProfileChangeSubmit.bind(this)
    this.loadProfileInf = this.loadProfileInf.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }


  handleChange = (value) => {
    this.setState({
      value: value,
    })
  }

  isUserAdmin(){
    return (this.state.is_admin)
  }


  handleInputChange(event) {
    const target = event.target
    const value =  target.value
    const name = target.name
    this.setState({
      [name]: value,
      snackbar : false
    })
  }


  handleSiteChange(value) {
    this.setState({site: value})
  }


  componentWillReceiveProps(nextProps){
    this.setState({email: nextProps.email})
    this.loadProfileInf(this.state.email)
  }


  componentWillMount(){
    this.loadProfileInf(this.state.email)
  }


  loadProfileInf(e) {
    getUserInfo(e).then(data => {
      this.setState({profileInf: data})
      if(!data){
        this.setState({profile_exists: false})
      }else{
        var admin = (data.roles === 'admin')
        this.setState({is_admin: admin})
        this.setState({first_name: data.first_name, last_name: data.last_name, bio: data.bio, bookmarks : data.bookmarks})
        this.setState({site_loaded: true})
      }
    }).catch(ex => {
      this.setState({profile_exists: false})
      this.setState({site_loaded: true})
    })


    fetchJson("/api/users/"+e+"/tags").then(data => {
      this.setState({
        topTenTags: data
      })
    })
  }



  getEditSiteOldPasswordStyle(){
    if(this.isUserAdmin()){
      return ({visibility: 'hidden', display: 'none'})
    }else{
      return ({})
    }
  }

  handlePwChangeSubmit(event){
    event.preventDefault()
    if(this.state.pw_new !== this.state.pw_new_confirm){
      this.setState({
        snackbar : true,
        snackbarText :  'Passwords do not match'
      })
      return
    }
    changePassword(this.state.email, this.state.pw_old, this.state.pw_new).then((success) => {
      if(success){
        this.setState({
          snackbar : true,
          snackbarText :  'Password change success'
        })
      }else{
        this.setState({ error: 'Login failed' })
        this.setState({
          snackbar : true,
          snackbarText :  'Password change failed'
        })
      }
    })
  }

  handleProfileChangeSubmit(event){
    event.preventDefault()
    changeProfile(this.state.email, this.state.first_name, this.state.last_name, this.state.bio ).then((success) => {

      if(success){
        this.setState({profileInf: {bio: this.state.bio, first_name: this.state.first_name, last_name: this.state.last_name}})
        this.setState({
          snackbar : true,
          snackbarText :  'Profile changed'
        })
      }else{
        this.setState({ error: 'Profile change failed' })
        this.setState({
          snackbar : true,
          snackbarText :  'Profile change failed'
        })
      }
    })
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
            style={{marginBottom:"40px"}}
            >
            <Tab
              label="Profile Info" value="a">
              <div className="row padding">
                <div className="col-9">
                  <div className="profile-header">Information:</div>
                  <div className="profile-info">
                    {this.state.profileInf.first_name} {this.state.profileInf.last_name}
                  </div>
                  <div className="profile-header">Biography:</div>
                  <div className="profile-info" style={{width:"100%"}}>
                    <table style={{tableLayout: "fixed", width: "80%" ,wordWrap: "break-word"}}><tr><td>
                      {this.state.profileInf.bio}
                    </td></tr></table>
                  </div>
                  <div>
                    <div className="profile-header">Tags </div>
                    <div style = {styles["wrapper"]}>
                      { this.state.topTenTags.map(item =>
                        <Chip style= {styles["chip"]}>
                          <Link to={"/discovery?tag=" +item} style= {styles["chipText"]} >{item}</Link></Chip>) }
                          </div>
                        </div>
                      </div>
                      <div className="col-3">
                        <img src="http://www.freeiconspng.com/uploads/profile-icon-9.png" width="200px" height="200px" alt="..." className="rounded-circle profile-icon" />
                      </div>
                    </div>
                  </Tab>
                  <Tab label="Edit Profile" value="b">
                    <div className="row">
                      <div className="col-9">
                        <form onSubmit={this.handleProfileChangeSubmit}>
                          <div className="profile-header">Information:</div>
                          <div className="profile-info">
                            First name:
                            <TextField
                              name="first_name"
                              onChange={this.handleInputChange}
                              defaultValue={this.state.profileInf.first_name}
                              />
                            <br />
                            Last name:
                            <TextField
                              name="last_name"
                              onChange={this.handleInputChange}
                              defaultValue={this.state.profileInf.last_name}
                              />
                          </div>
                          <div className="profile-header">Biography:</div>
                          <TextField
                            name="bio"
                            hintText="Something about you"
                            onChange={this.handleInputChange}
                            multiLine={true}
                            defaultValue={this.state.profileInf.bio}
                            rows={8}
                            rowsMax={4}
                            fullWidth={true}
                            /><br />
                          <RaisedButton
                            type="Submit"
                            label="Change Profile"
                            primary={true}
                            />
                        </form>
                      </div>
                      <div className="col-3">
                        <img src="http://www.freeiconspng.com/uploads/profile-icon-9.png" width="200px" height="200px" alt="..." className="rounded-circle profile-icon" />
                        <div className="profile-icon-text">Change avatar</div>
                      </div>
                    </div>
                    <div className="change-password">
                      <form onSubmit={this.handlePwChangeSubmit}>
                        <div className="form-group row">
                          <label className="col-2 col-form-label">Email</label>
                          <div className="col-10">
                            <div className="form-control-static">{ this.state.email }</div>
                          </div>
                        </div>
                        <div className="form-group row" style ={this.getEditSiteOldPasswordStyle()} >
                          <label for="inputPassword" className="col-2 col-form-label">Old Password</label>
                          <div className="col-4">
                            <TextField
                              type="password"
                              name="pw_old"
                              hintText="Your old password"
                              onChange={this.handleInputChange}
                              />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label for="inputPassword" className="col-2 col-form-label">New Password</label>
                          <div className="col-4">
                            <TextField
                              type="password"
                              name="pw_new"
                              hintText="Your new password"
                              onChange={this.handleInputChange}
                              />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label for="inputPassword" className="col-2 col-form-label">Confirm password</label>
                          <div className="col-4">
                            <TextField
                              type="password"
                              name="pw_new_confirm"
                              hintText="Confirm password"
                              onChange={this.handleInputChange}
                              errorText ={this.state.pw_new !== this.state.pw_new_confirm ? "Passwords do not match" :""} />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-10">
                            <RaisedButton
                              type="Submit"
                              label="Change Password"
                              primary={true}
                              />
                          </div>
                        </div>
                      </form>
                    </div>
                  </Tab>
                  <Tab    label="Your Projects" value="c">
                    <div  className="header-tab">Manage projects</div>
                    <DataTable
                      fetchURL = {"/api/projects/search/advanced/?q=(authors.email: " + this.state.email + ")"}
                      columns= {['title', 'status', 'tags', 'authors', 'description', '_id', 'bookmarked']}
                      isProfile = {true}
                      ></DataTable>
                    <div className="footer" />
                  </Tab>
                </Tabs>

                <Snackbar
                  open={this.state.snackbar}
                  message={this.state.snackbarText}
                  autoHideDuration={10000}
                  />
              </div>
            )}
          }
        }
