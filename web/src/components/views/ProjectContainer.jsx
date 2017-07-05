
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import injectTapEventPlugin from "react-tap-event-plugin";
import MenuItem from 'material-ui/MenuItem';
import logo from '../../style/img/black_logo_title_below.svg';
import {login, isLoggedIn, logout,register, isAdmin, getUserInfo, getMyEmail} from '../common/Authentication.jsx';

injectTapEventPlugin();

export default class SignUp extends Component {

  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      redirect: false,
      error: '',
      profileInf: {},
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      password_confirm: '',
      role: 'user',
      myProfile: getMyEmail()
    };
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangePasswordConfirm = this.handleChangePasswordConfirm.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeFirstName(event) {
    this.setState({firstname: event.target.value});
  }

  handleChangeLastName(event) {
    this.setState({lastname: event.target.value});
  }

  handleChangeEmail(event) {
    this.setState({email: event.target.value});
  }

  handleChangePassword(event) {
    this.setState({password: event.target.value});
  }


  handleRoleChange(event, index, value) {
    this.setState({'role': value});
  }

  handleChangePasswordConfirm(event) {
    this.setState({password_confirm: event.target.value});
  }

  handleSubmit(event){
    event.preventDefault();
    if(this.state.password != this.state.password_confirm){
      alert("Passwords do not match");
      return;
    }
    register(this.state.firstname, this.state.lastname, this.state.email, this.state.password, this.state.password_confirm, this.state.role).then((success) => {

      if(success){
        alert("Registration successfull!");
        this.setState({ redirect: true });
      }else{
        this.setState({ redirect: false, error: 'Registration failed!' });
        alert("Registration failed!");
      }
    });
  }

  isValidEmailAddress(address) {
    return !! address.match(/\S+@\S+\.\S+/);
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

  componentDidMount(){
    this.loadProfileInf(this.state.myProfile);
  }

  isUserAdmin(){
    return this.state.profileInf && (this.state.profileInf.roles == 'admin');
  }

  getRoleStyle(){
    if(!this.isUserAdmin()){
      return {visibility: 'hidden', display: 'none'};
    }else{
      return {};
    }
  }

  render() {
    const { teamName } = this.props;

    if (this.state.redirect) {
      return <Redirect to='/'/>;
    }

    return (
      <section className="sign-container">

        {/*Information*/}
        <img className="service-name" src={logo}/>
        <h2 className="team-name">{teamName}</h2>
        <div className="rectangle-sign">
          <h3 className="sign-type-desc">Sign Up
          </h3>
          <form onSubmit={this.handleSubmit}>
          {/*Input First Name*/}
          <div className="input-group input-login" id="email-signup">

            <TextField
              type="text"
              value={this.state.firstname}
              onChange={this.handleChangeFirstName}
              hintText="First Name"
              errorText={(this.state.firstname == "") ? "Field is requiered" : ""}
              required autofocus
            />
          </div>
          {/*Input Last Name*/}
          <div className="input-group input-login" id="email-signup">
            <TextField
              type="text"
              value={this.state.lastname}
              onChange={this.handleChangeLastName}
              hintText="Last Name"
              errorText={(this.state.lastname == "") ? "Field is requiered" : ""}
              required autofocus
            />
          </div>
          {/*Input Email*/}
          <div className="input-group input-login" id="email-signup">
            <TextField
              type="email"
              value={this.state.email}
              onChange={this.handleChangeEmail}
              hintText="Email"
              errorText={(!this.isValidEmailAddress(this.state.email)) ? "Needs to be a valid email" : ""}
              required autofocus
            />
          </div>

          {/*Input password*/}
          <div className="input-group input-login">
            <TextField
              type="password"
              value={this.state.password}
              onChange={this.handleChangePassword}
              hintText="Password"
              errorText={(this.state.password == "") ? "Field is requiered" : ""}
              required
            />
          </div>

          {/*Input confirm password*/}
          <div className="input-group input-login">

            <TextField
              type="password"
              value={this.state.password_confirm}
              onChange={this.handleChangePasswordConfirm}
              hintText="Confirm Password"
              errorText={( this.state.password != this.state.password_confirm ) ? "Passwords do not match" : "" }
              required
            />
          </div>
          <div >
            <SelectField
              style={this.getRoleStyle()}
              floatingLabelText="Role"
              value={this.state.role}
              onChange={this.handleRoleChange}
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

        <div>
          <Link to="/">
            <a href="#" className="register-info">
              You already have an account?<br/>Login here.
            </a>
          </Link>
        </div>

      </section>
    );
  }
}

SignUp.propTypes = {
  serviceName: React.PropTypes.string,
  teamName: React.PropTypes.string,
}

SignUp.defaultProps = {
  serviceName: 'Knex',
  teamName: 'brings light to the cloud'
};
