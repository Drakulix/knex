import React, { Component } from 'react';
import {
  Link,
  Redirect
} from 'react-router-dom';
import logo from '../../style/img/black_logo_title_below.svg';
import {login, isLoggedIn, getCookie} from '../common/Authentication.jsx';
import PropTypes from 'prop-types';

export default class SignIn extends Component {

  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      redirect: false,
      error: '',
      email: getCookie('email'),
      password: '',
      remember: null
    };

    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeEmail(event) {
    this.setState({email: event.target.value});
  }

  handleChangePassword(event) {
    this.setState({password: event.target.value});
  }

  handleChangeRemember(event) {
    this.setState({remember: event.target.value});
  }

  handleSubmit(event){
    event.preventDefault();
    login(this.state.email, this.state.password).then((success) => {

      if(success){
        this.setState({ redirect: true });
      }else{
        this.setState({ redirect: false, error: 'Login failed' });
        alert("Login failed");
      }
    });


  }

  render() {
    const { teamName } = this.props;

    if (this.state.redirect || isLoggedIn() ) {
      return <Redirect to='/discovery'/>;
    }

    return (
      <section className="sign-container">

        {/*Information*/}
        <img className="service-name" src={logo} alt="knex logo"/>
        <h2 className="team-name">{teamName}</h2>
        <div className="rectangle-sign">
          <h3 className="sign-type-desc">Login</h3>
          <form onSubmit={this.handleSubmit}>
            {/*Input Email*/}
            <div className="input-group input-login">
              <span className="input-group-addon">
                <span
                  className="fa fa-envelope-o"
                  aria-hidden="true"
                />
              </span>
              <input
                type="text"
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
                  aria-hidden="true"
                />
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

              <input
                type="submit"
                value="Login"
                className="btn btn-lg btn-primary sign-button sign-button-text"
              />

          </form>
          <div>
            <Link to="/register">
              <button type="submit" className="btn btn-lg btn-primary sign-button sign-button-text">
                Register
              </button>
            </Link>
          </div>
        </div>

      </section>
    );
  }
}

SignIn.propTypes = {
  serviceName: PropTypes.string,
  teamName: PropTypes.string,
}

SignIn.defaultProps = {
  serviceName: 'Knex',
  teamName: 'brings light to the cloud'
};
