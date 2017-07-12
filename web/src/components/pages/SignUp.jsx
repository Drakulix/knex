
import React, { Component } from 'react';
import {
  Link,
  Redirect,
} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import logo from '../../style/img/black_logo_title_below.svg';
import {register, getUserInfo, getMyEmail} from '../common/Authentication.jsx';


export default class SignUp extends Component {

  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      redirect: false,
      error: '',
      profileInf: {},
      firstname: '',
      firstname_error : 'Requiered',
      lastname_error : 'Requiered',
      email_error : 'Requiered',
      password_error : '',
      password_confirm_error : '',
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
    if(event.target.value === ''){
      this.setState({firstname_error: 'Requiered'});
    }else{
      this.setState({firstname_error: ''});
    }
    this.setState({firstname: event.target.value});
  }

  handleChangeLastName(event) {
    if(event.target.value === ''){
      this.setState({lastname_error: 'Requiered'});
    }else{
      this.setState({lastname_error: ''});
    }
    this.setState({lastname: event.target.value});
  }

  handleChangeEmail(event) {
    if(event.target.value === '' || !this.isValidEmailAddress(event.target.value)){
      this.setState({email_error: 'Not a valid email'});
    }else{
      this.setState({email_error: ''});
    }
    this.setState({email: event.target.value});
  }

  handleChangePassword(event) {
    if(event.target.value === ''){
      this.setState({password_error: 'Can not be empty!'});
    }else{
      this.setState({password_error: ''});
    }
    this.setState({password: event.target.value});
  }


  handleRoleChange(event, index, value) {
    this.setState({'role': value});
  }

  handleChangePasswordConfirm(event) {
    if(event.target.value !== this.state.password){
      this.setState({possword_confirm_error: 'Requiered'});
    }else{
      this.setState({password_confirm_error: ''});
    }
    this.setState({password_confirm: event.target.value});
  }

  handleSubmit(event){
    event.preventDefault();
    if(this.state.firstname_error === '' && this.state.lastname_error === '' &&this.state.email_error === '' && this.state.password_error === '' &&  this.state.password_confirm_error === ''){
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
    return this.state.profileInf && (this.state.profileInf.roles === 'admin');
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
        <img className="service-name" src={logo} alt="Logo"/>
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
              errorText={(this.state.firstname === "") ? "Field is requiered" : ""}

            />
          </div>
          {/*Input Last Name*/}
          <div className="input-group input-login" id="email-signup">
            <TextField
              type="text"
              value={this.state.lastname}
              onChange={this.handleChangeLastName}
              hintText="Last Name"
              errorText={(this.state.lastname === "") ? "Field is requiered" : ""}

            />
          </div>
          {/*Input Email*/}
          <div className="input-group input-login" id="email-signup">
            <TextField
              type="email"
              value={this.state.email}
              onChange={this.handleChangeEmail}
              hintText="Email"
              errorText={this.state.email_error}
               autofocus
            />
          </div>

          {/*Input password*/}
          <div className="input-group input-login">
            <TextField
              type="password"
              value={this.state.password}
              onChange={this.handleChangePassword}
              hintText="Password"
              errorText={(this.state.password === "") ? "Field is requiered" : ""}

            />
          </div>

          {/*Input confirm password*/}
          <div className="input-group input-login">

            <TextField
              type="password"
              value={this.state.password_confirm}
              onChange={this.handleChangePasswordConfirm}
              hintText="Confirm Password"
              errorText={( this.state.password !== this.state.password_confirm ) ? "Passwords do not match" : "" }

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
