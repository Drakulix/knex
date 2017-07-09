import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import logo from '../../style/img/black_logo_title_below.svg';
import {login, isLoggedIn, logout, getCookie, setCookie} from '../common/Authentication.jsx';

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
        <img className="service-name" src={logo}/>
        <h2 className="team-name">{teamName}</h2>
        <div className="rectangle-sign">
          <h3 className="sign-type-desc">Login</h3>
          <form onSubmit={this.handleSubmit}>
            {/*Input Email*/}
            <div className="input-group input-login">
              <TextField
                type="text"
                value={this.state.email}
                onChange={this.handleChangeEmail}
                hintText="Email"
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

                
              />
            </div>
            <div>
              <RaisedButton
                type="Submit"
                label="Login"
                primary={true}
                style={{width: 250, marginTop:40}}
                
              />
          </div>
          </form>
          <div>
<br/>
            <Link to="/register">
            <RaisedButton
              type="Submit"
              label="Register"
              primary={true}
              style={{width: 250}}
              required
            />
            </Link>
          </div>
        </div>

      </section>
    );
  }
}

SignIn.propTypes = {
  serviceName: React.PropTypes.string,
  teamName: React.PropTypes.string,
}

SignIn.defaultProps = {
  serviceName: 'Knex',
  teamName: 'brings light to the cloud'
};
