import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import {register, getMyEmail, getUserInfo, changePassword, changeProfile} from '../common/Authentication.jsx';
import DataTable from '../common/DataTable';
import 'react-table/react-table.css';
import Snackbar from 'material-ui/Snackbar'
import ShowUsers from '../common/adminViews/ShowUsers'


export default class AdminOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{
      }],
      profile_exists : true,
      site: 'info',
      error: '',
      profileInf: {
        first_name : "",
        last_name : "",
        bio : ""
      },
      myProfileInf: {},
      email: "",
      first_name: '',
      last_name: '',
      bio: '',
      pw_old: '',
      pw_new: '',
      pw_new_confirm: '',
      is_admin: false,
      value: '1',
      profileReg: {
        first_name : "",
        last_name : "",
        email : "",
        password : "",
        password_confirm : "",
        role : ""
      }
    };
    this.handlePwOldChange = this.handlePwOldChange.bind(this);
    this.handlePwNewChange = this.handlePwNewChange.bind(this);
    this.handlePwNewConfChange = this.handlePwNewConfChange.bind(this);
    this.handlePwChangeSubmit = this.handlePwChangeSubmit.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleProfileChangeSubmit = this.handleProfileChangeSubmit.bind(this)
    this.handleChangeUser = this.handleChangeUser.bind(this)
    this.handleRegEmailChange = this.handleRegEmailChange.bind(this)
    this.handleRegFirstNameChange = this.handleRegFirstNameChange.bind(this)
    this.handleRegLastNameChange = this.handleRegLastNameChange.bind(this)
    this.handleRegPasswordChange = this.handleRegPasswordChange.bind(this)
    this.handleRegPasswordConfirmChange = this.handleRegPasswordConfirmChange.bind(this)
    this.handleRegRoleChange = this.handleRegRoleChange.bind(this)
    this.handleRegister = this.handleRegister.bind(this )
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };

  isUserAdmin(){
    return (this.state.is_admin);
  }

  handleChangeUser(event){
    event.preventDefault();
    this.loadProfileInf(this.state.email)
    this.loadMyProfileInf(getMyEmail())

  }
  handleSiteChange(value) {
    this.setState({site: value})
  }
  handleEmailChange(event) {
    this.setState({email: event.target.value})
  }

  handleRegEmailChange(event){

    this.setState({profileReg : {email : event.target.value,
       last_name : this.state.profileReg.last_name,
       first_name : this.state.profileReg.first_name,
       password : this.state.profileReg.password,
       password_confirm : this.state.profileReg.password_confirm,
       role : this.state.profileReg.role
     }})
  }
  handleRegFirstNameChange(event){
    this.setState({profileReg : {email : this.state.profileReg.email,
       last_name : this.state.profileReg.last_name,
       first_name : event.target.value,
       password : this.state.profileReg.password,
       password_confirm : this.state.profileReg.password_confirm,
       role : this.state.profileReg.role
     }})

  }
  handleRegLastNameChange(event){
    this.setState({profileReg : {email : this.state.profileReg.email,
       last_name : event.target.value,
       first_name : this.state.profileReg.first_name,
       password : this.state.profileReg.password,
       password_confirm : this.state.profileReg.password_confirm,
       role : this.state.profileReg.role
     }})
  }
  handleRegPasswordChange(event){
    this.setState({profileReg : {email : this.state.profileReg.email,
       last_name : this.state.profileReg.last_name,
       first_name : this.state.profileReg.first_name,
       password : event.target.value,
       password_confirm : this.state.profileReg.password_confirm,
       role : this.state.profileReg.role
     }})
  }
  handleRegPasswordConfirmChange(event){
    this.setState({profileReg : {email : this.state.profileReg.email,
       last_name : this.state.profileReg.last_name,
       first_name : this.state.profileReg.first_name,
       password : this.state.profileReg.password,
       password_confirm : event.target.value,
       role : this.state.profileReg.role
     }})
  }
  handleRegRoleChange(event, index, value){
    this.setState({profileReg : {email : this.state.profileReg.email,
       last_name : this.state.profileReg.last_name,
       first_name : this.state.profileReg.first_name,
       password : this.state.profileReg.password,
       password_confirm : this.state.profileReg.password_confirm,
       'role' : value
     }})
  }

  handleFirstNameChange(event) {
    this.setState({first_name: event.target.value});
  }

  handleLastNameChange(event) {
    this.setState({last_name: event.target.value});
  }

  handleBioChange(event) {
    this.setState({bio: event.target.value});
  }

  handlePwOldChange(event) {
    this.setState({pw_old: event.target.value});
  }

  handlePwNewChange(event) {
    this.setState({pw_new: event.target.value});
  }

  handlePwNewConfChange(event) {
    this.setState({pw_new_confirm: event.target.value});
  }

  handleRegister(event){
    event.preventDefault();
    if(this.state.password !== this.state.password_confirm){
      this.setState({
        snackbar : true,
        snackbarText :  'Passwords do not match'
      });
      return

    }
    if(this.state.password === ""){
      this.setState({
        snackbar : true,
        snackbarText :  'Password can not be empty'
      });
      return
    }
    register(this.state.profileReg.first_name, this.state.profileReg.last_name, this.state.profileReg.email, this.state.profileReg.password, this.state.profileReg.password_confirm, this.state.profileReg.role).then((success) => {

      if(success){
          this.setState({
          snackbar : true,
          snackbarText :  'Registration successfull!'
        });
      }else{
        this.setState({
          snackbar : true,
          snackbarText :  'Registration failed!'
        });
      }
    });
  }

  componentWillReceiveProps(nextProps){
    this.loadMyProfileInf(getMyEmail());
  }

  componentWillMount(){
    this.loadMyProfileInf(getMyEmail());
  }


  loadMyProfileInf(e) {
    getUserInfo(e).then(data => {
      this.setState({myProfileInf: data});
      if(!data){
        this.setState({profile_exists: false});
      }else{
        var admin = (data.roles === 'admin');
        this.setState({is_admin: admin});
      }
    }).catch(ex => {
      this.setState({profile_exists: false});
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
        snackbarText :  'New passwords do not match!'
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
          snackbarText :  'Profile changed!'
        });
      }else{
        this.setState({ error: 'Login failed' });
        this.setState({
          snackbar : true,
          snackbarText :  'Profile change failed'
        });
      }
    });
  }


    isValidEmailAddress(address) {
      if(address !== undefined){
        return !! address.match(/\S+@\S+\.\S+/);
      }
      return false
    }



  render() {


      return (
        <div className="container">
          <Snackbar
            open={this.state.snackbar}
            message={this.state.snackbarText}
            autoHideDuration={10000}
            />
          <div className="header">Admin Area</div>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            style={{marginBottom:"40px"}}
            >
            <Tab label="Manage Projects" value="1">


              <div className="header-tab">Manage Projects</div>

                  <DataTable columns= {['title', 'status', 'tags', 'authors', 'description', '_id',  'delete']}

          fetchURL="/api/projects"

                    ></DataTable>

                  <div className="footer" />





            </Tab>
            <Tab label="List Users" value="2">
              <ShowUsers/>
            </Tab>

            <Tab label="Edit Profile" value="3">
              <div className="row padding">
                <div className="col-9">
              <div className="header-tab">Edit User</div>

                  <form onSubmit={this.handleChangeUser}>

                      <TextField
                        hintText="Select an Email-address"
                      onChange={this.handleEmailChange}
                        />

                      <RaisedButton
                            type="Submit"
                            label="Select User"
                            primary={true}
                            style={{width: 250, marginTop:40}}


                          />
                  </form >

                    <form onSubmit={this.handleProfileChangeSubmit}>
                    <p className="profile-info_2">Information:</p>
                      <div className="form-group row">

                        <div className="col-10">

                        </div>
                      </div>
                    <p >
                      <TextField
                        hintText="First name"
                        onChange={this.handleFirstNameChange}
                        value={this.state.first_name}
                        />
                      <br />
                      <TextField
                        hintText="Last name "
                        onChange={this.handleLastNameChange}
                        value={this.state.last_name}
                        />
                    </p>

                    <TextField
                      hintText="Please tell us some about you!"
                      onChange={this.handleBioChange}
                      multiLine={true}
                      value={this.state.bio}
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

              <div className="row padding">
                <div className="col-9">
                <form onSubmit={this.handlePwChangeSubmit}>
<p className="profile-info_2">Password:</p>
                  <div className="form-group row">

                    <div className="col-10">

                    </div>
                  </div>

                  <div className="form-group row">

                    <div className="col-4">
                      <TextField
                        type="password"
                        hintText={this.state.first_name + "s New Password"}
                        onChange={this.handlePwNewChange}
                        />
                    </div>
                  </div>
                  <div className="form-group row">

                    <div className="col-4">
                      <TextField
                        type="password"
                        hintText={this.state.first_name + "s New Password Again"}
                        onChange={this.handlePwNewConfChange}
                        />
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
            </div>
            </Tab>
            <Tab label="Register User" value="4">
              <div className="header-tab">Register User</div>
              <div className="row">
                <div className="col-9">
                  <form onSubmit={this.handleRegister}>
                  {/*Input First Name*/}
                  <div >

                    <TextField
                      type="text"
                      value={this.state.profileReg.first_name}
                      onChange={this.handleRegFirstNameChange}
                      hintText="First Name"
                      errorText={(this.state.profileReg.firstname === "") ? "Field is requiered" : ""}

                    />
                  </div>
                  {/*Input Last Name*/}
                  <div >
                    <TextField
                      type="text"
                      value={this.state.profileReg.last_name}
                      onChange={this.handleRegLastNameChange}
                      hintText="Last Name"
                      errorText={(this.state.profileReg.lastname === "") ? "Field is requiered" : ""}

                    />
                  </div>
                  {/*Input Email*/}
                  <div>
                    <TextField
                      type="email"
                      value={this.state.profileReg.email}
                      onChange={this.handleRegEmailChange}
                      hintText="Email"
                      errorText={(!this.isValidEmailAddress(this.state.profileReg.email)) ? "Needs to be a valid email" : ""}

                    />
                  </div>

                  {/*Input password*/}
                  <div >
                    <TextField
                      type="password"
                      value={this.state.profileReg.password}
                      onChange={this.handleRegPasswordChange}
                      hintText="Password"
                      errorText={(this.state.profileReg.password === "") ? "Field is requiered" : ""}

                    />
                  </div>

                  {/*Input confirm password*/}
                  <div >

                    <TextField
                      type="password"
                      value={this.state.profileReg.password_confirm}
                      onChange={this.handleRegPasswordConfirmChange}
                      hintText="Confirm Password"
                      errorText={( this.state.profileReg.password !== this.state.profileReg.password_confirm ) ? "Passwords do not match" : "" }

                    />
                  </div>

                  <div >
                    <SelectField

                      floatingLabelText="Role"
                      value={this.state.profileReg.role}
                      onChange={this.handleRegRoleChange}
                    >
                      <MenuItem value={'user'} primaryText="User" />
                      <MenuItem value={'admin'} primaryText="Admin" />
                    </SelectField>
                  </div>

                    <RaisedButton
                      type="Submit"
                      label="Register"
                      primary={true}
                      style={{width: 250}}
                      required
                    />
                </form>
              </div>
            </div>
            </Tab>
          </Tabs>
        </div>
      )
    }
}
