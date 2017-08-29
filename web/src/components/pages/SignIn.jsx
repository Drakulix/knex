import React, { Component } from 'react'
import {
  Redirect,
} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import TextField from 'material-ui/TextField'
import logo from '../../style/img/black_logo_title_below.svg'
import Backend from '../common/Backend'



export default class SignIn extends Component {

  constructor(props) {
    super(props)
    // set the initial component state
    this.state = {
      redirect: false,
      error: '',
      email: Backend.getMail(),
      password: '',
      snackbar: false,
      snackbarText: 'Login failed'
    }

    this.handleChangeEmail = this.handleChangeEmail.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeEmail(event) {
    this.setState({email: event.target.value, snackbar: false})
  }

  handleChangePassword(event) {
    this.setState({password: event.target.value, snackbar: false})
  }

  handleSubmit(event){
    event.preventDefault()
    Backend.login(this.state.email, this.state.password).then((success) => {
      if(success){
        this.setState({ redirect: true })
      }else{
        this.setState({ redirect: false, snackbar: true })
      }
    })
  }

  render() {
    if (this.state.redirect || Backend.isLoggedIn() ) {
      return <Redirect to='/dashboard'/>
    }

    return (
      <div className = "sign-container">
        <Snackbar open = {this.state.snackbar}
                  message = {this.state.snackbarText}
                  autoHideDuration = {10000}/>
        <img className = "service-name hidden-md-down" src = {logo} alt = "Logo"/>
        <h2 className = "team-name hidden-md-down">brings light to the cloud</h2>
        <div className = "rectangle-sign">
          <h3 className = "sign-type-desc">Login</h3>
          <form onSubmit = {this.handleSubmit}>
            <div style = {{textAlign: 'center'}}>
                <TextField
                  type = "text"
                  value = {this.state.email}
                  onChange = {this.handleChangeEmail}
                  hintText = "Email"
                  style = {{width: 250}}
            />
            </div>
            <div style = {{textAlign: 'center'}}>
              <TextField
                  type = "password"
                  value = {this.state.password}
                  onChange = {this.handleChangePassword}
                  hintText = "Password"
                  style = {{width: 250}}
              />
            </div>
            <div style = {{marginTop: 40, textAlign: 'center'}}>
              <RaisedButton
                  type = "Submit"
                  label = "Login"
                  style = {{width: 250}}
                  primary = {true}
              />
            </div>
          </form>
          <div style = {{marginTop: 20, textAlign: 'center'}}>
            <RaisedButton
                type = "Submit"
                label = "Register"
                href = "/register"
                primary = {true}
                style = {{width: 250}}
            />
          </div>
        </div>
      </div>
    )
  }
}
