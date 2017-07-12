import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Chip from 'material-ui/Chip'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import {Tabs, Tab} from 'material-ui/Tabs';
import CircularProgress from 'material-ui/CircularProgress';
import {getMyEmail, getUserInfo, changePassword, changeProfile} from '../common/Authentication.jsx';
import { fetchJson } from '../common/Backend';
import DataTable from '../common/DataTable';
import Snackbar from 'material-ui/Snackbar'
import styles from '../common/Styles.jsx';


export default class ProfileContainer extends Component {
  constructor(props) {
    super(props);
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
    };

    this.handlePwChangeSubmit = this.handlePwChangeSubmit.bind(this);
    this.handleProfileChangeSubmit = this.handleProfileChangeSubmit.bind(this);
    this.loadProfileInf = this.loadProfileInf.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }


  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };

  isUserAdmin(){
    return (this.state.is_admin);
  }


  handleInputChange(event) {
    const target = event.target;
    const value =  target.value;
    const name = target.name;
    this.setState({
      [name]: value,
      snackbar : false
    });
 }


  handleSiteChange(value) {
    this.setState({site: value})
  }


  componentWillReceiveProps(nextProps){
    this.setState({email: nextProps.email});
    this.loadProfileInf(this.state.email);
  }


  componentWillMount(){
    this.loadProfileInf(this.state.email);
  }


  loadProfileInf(e) {
    getUserInfo(e).then(data => {
      this.setState({profileInf: data});
      if(!data){
        this.setState({profile_exists: false});
      }else{
        var admin = (data.roles === 'admin');
        this.setState({is_admin: admin});
        this.setState({first_name: data.first_name, last_name: data.last_name, bio: data.bio, bookmarks : data.bookmarks});
        this.setState({site_loaded: true})
      }
    }).catch(ex => {
      this.setState({profile_exists: false});
      this.setState({site_loaded: true})
    });


    fetchJson("/api/users/"+e+"/tags").then(data => {
          this.setState({
            topTenTags: data
          });
        });
    }


  getMenuEditStyle(){
    if(this.state.email !== getMyEmail() && !this.isUserAdmin()){
      return ({visibility: 'hidden'});
    }else{
      return ({});
    }
  }

  getEditSiteOldPasswordStyle(){
    if(this.isUserAdmin()){
      return ({visibility: 'hidden', display: 'none'});
    }else{
      return ({});
    }
  }

  handlePwChangeSubmit(event){
    event.preventDefault();
    if(this.state.pw_new !== this.state.pw_new_confirm){
      this.setState({
        snackbar : true,
        snackbarText :  'New passwords do not match'
      });
      return ;
    }
    changePassword(this.state.email, this.state.pw_old, this.state.pw_new).then((success) => {
      if(success){
        this.setState({
          snackbar : true,
          snackbarText :  'Password change success'
        });
      }else{
        this.setState({ error: 'Login failed' });
        this.setState({
          snackbar : true,
          snackbarText :  'Password change failed'
        });
      }
    });
  }

  handleProfileChangeSubmit(event){
    event.preventDefault();
    changeProfile(this.state.email, this.state.first_name, this.state.last_name, this.state.bio ).then((success) => {

      if(success){
        this.setState({profileInf: {bio: this.state.bio, first_name: this.state.first_name, last_name: this.state.last_name}});
        this.setState({
          snackbar : true,
          snackbarText :  'Profile changed'
        });
      }else{
        this.setState({ error: 'Profile change failed' });
        this.setState({
          snackbar : true,
          snackbarText :  'Profile change failed'
        });
      }
    });
  }

  getBio(){
    if(this.state.profileInf.bio){
      return (this.state.profileInf.bio.split('\n').map((item, key) => {return <span key={key}>{item}<br/></span>}));
      }else{
        return ' ';
      }
    }


  render() {
      if(!this.state.site_loaded){
        return (
          <div className="container">
            <div className="header"><CircularProgress size={80} thickness={5} /></div>
          </div>
        );
      }
      if( !this.state.profile_exists){
        return (
          <div className="container">
            <div className="header">Profile Not Found</div>
          </div>
        );
      }
      else {
        return (
          <div className="container">
            <div className="header">Profile Details</div>
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
                        {this.getBio()}
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
                      <p className="profile-header">Information:</p>
                      <p className="profile-info">
                        First Name:
                        <TextField
                          name="first_name"
                          onChange={this.handleInputChange}
                          defaultValue={this.state.profileInf.first_name}
                          />
                        <br />
                        Last Name:
                        <TextField
                          name="last_name"
                          onChange={this.handleInputChange}
                          defaultValue={this.state.profileInf.last_name}
                          />
                      </p>
                      <p className="profile-header">Biography:</p>
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
                    <p className="profile-icon-text">Change Avatar</p>
                  </div>
                </div>
                <div className="change-password">
                  <form onSubmit={this.handlePwChangeSubmit}>
                    <div className="form-group row">
                      <label className="col-2 col-form-label">Email</label>
                      <div className="col-10">
                        <p className="form-control-static">{ this.state.email }</p>
                      </div>
                    </div>
                    <div className="form-group row" style ={this.getEditSiteOldPasswordStyle()} >
                      <label for="inputPassword" className="col-2 col-form-label">Old Password</label>
                      <div className="col-4">
                        <TextField
                          type="password"
                          name="pw_old"
                          hintText="Your Old Password"
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
                          hintText="Your New Password"
                          onChange={this.handleInputChange}
                          />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label for="inputPassword" className="col-2 col-form-label">Confirm Password</label>
                      <div className="col-4">
                        <TextField
                          type="password"
                          name="pw_new_confirm"
                          hintText="Your New Password Again"
                          onChange={this.handleInputChange}
                          errorText ={this.state.pw_new !== this.state.pw_new_confirm ? "Passwords not matching" :""}                          />
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
                <div  className="header-tab">Manage Projects</div>
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
