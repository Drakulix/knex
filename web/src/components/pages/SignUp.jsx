import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import logo from '../../style/img/black_logo_title_below.svg';
import {login, isLoggedIn, logout,register} from '../common/Authentication.jsx';

export default class SignUp extends Component {

  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      redirect: false,
      error: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      password_confirm: '',
      role: 'user'
    };
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangePasswordConfirm = this.handleChangePasswordConfirm.bind(this);
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

  handleChangePasswordConfirm(event) {
    this.setState({password_confirm: event.target.value});
  }

  handleSubmit(event){
    event.preventDefault();
    register(this.state.firstname,this.state.lastname,this.state.email, this.state.password, this.state.password_confirm, this.state.role).then((success) => {

      if(success){
        alert("Registration successfull!");
        this.setState({ redirect: true });
      }else{
        this.setState({ redirect: false, error: 'Registration failed!' });
        alert("Registration failed!");
      }
    });
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
            <span className="input-group-addon">
              <span
                className="fa fa-envelope-o"
                aria-hidden="true"
              />
            </span>
            <input
              type="text"
              value={this.state.firstname}
              onChange={this.handleChangeFirstName} 
              className="form-control"
              placeholder="First Name"
              required autofocus
            />
          </div> 
          {/*Input Last Name*/}
          <div className="input-group input-login" id="email-signup">
            <span className="input-group-addon">
              <span
                className="fa fa-envelope-o"
                aria-hidden="true"
              />
            </span>
            <input
              type="text"
              value={this.state.lastname}
              onChange={this.handleChangeLastName} 
              className="form-control"
              placeholder="Last Name"
              required autofocus
            />
          </div>
          {/*Input Email*/}
          <div className="input-group input-login" id="email-signup">
            <span className="input-group-addon">
              <span
                className="fa fa-envelope-o"
                aria-hidden="true"
              />
            </span>
            <input
              type="email"
              value={this.state.email}
              onChange={this.handleChangeEmail} 
              className="form-control"
              placeholder="Email"
              required autofocus
            />
          </div>

          {/*Input password*/}
          <div className="input-group input-login">
            <span className="input-group-addon">
              <span
                className="fa fa-asterisk"
                aria-hidden="true" />
            </span>
            <input
              type="password"
              value={this.state.password}
              onChange={this.handleChangePassword} 
              className="form-control"
              placeholder="Password"
              required
            />
          </div>

          {/*Input confirm password*/}
          <div className="input-group input-login">
            <span className="input-group-addon">
              <span
                className="fa fa-asterisk"
                aria-hidden="true" />
            </span>
            <input
              type="password"
              value={this.state.password_confirm}
              onChange={this.handleChangePasswordConfirm} 
              className="form-control"
              placeholder="Confirm Password"
              required
            />
          </div>
            <input
              type="submit" 
              value="Register"
              className="btn btn-lg btn-primary sign-button"
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
