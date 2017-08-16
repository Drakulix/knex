import React, { Component } from 'react'
import {
  Link,
  Redirect,
} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import logo from '../../style/img/black_logo_title_below.svg'
import Backend from '../common/Backend'
import Snackbar from 'material-ui/Snackbar'


export default class SignUp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      redirect : false,
      first_name : "",
      last_name : "",
      email : "",
      password : "",
      password_confirm : "",
      snackbar : false,
      snackbarText : 'Login failed'
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value,
      snackbar: false
    })
  }

  isValidEmailAddress() {
    var email = (this.state.email)
    if(email === undefined || email === "")
      return false
    else
      return email.match(/\S+@\S+\.\S+/)
  }

  isInValidInput(){
    return !this.isValidEmailAddress()
        || this.state.first_name === ""
        || this.state.last_name === ""
        || this.state.email === ""
        || this.state.password === ""
        || this.state.password !== this.state.password_confirm
  }

  handleRegister(event){
    event.preventDefault()
    Backend.register(this.state.first_name, this.state.last_name, this.state.email, this.state.password, this.state.password_confirm, ["user"]).then((success) => {
      if(success){
        Backend.login(this.state.email, this.state.password).then((success) => {
          if(success){
            this.setState({ redirect: true, })
          }else{
            this.setState({ redirect: false, snackbar: false })
          }
        })
      }
    })
  }


  render() {
    if (this.state.redirect) {
      return <Redirect to='/discovery'/>
    }

    return (
      <div style = {{textAlign : "center"}}>
        <Snackbar open = {this.state.snackbar}
                  message = {this.state.snackbarText}
                  autoHideDuration = {10000}/>
        <img className = "service-name hidden-md-down" src = {logo} alt = "Logo"/>
        <h2 className = "team-name hidden-md-down">brings light to the cloud</h2>
        <div className = "rectangle-sign">
          <h3 className = "sign-type-desc">Sign Up
          </h3>
          <form onSubmit = {this.handleRegister}>
            <div style = {{textAlign: 'center'}}>
              <TextField
                  type = "text"
                  style = {{width: 250}}
                  value = {this.state.first_name}
                  onChange = {this.handleInputChange}
                  hintText = "Enter your first name..."
                  errorText = {(this.state.first_name === "") ? "Field is required" : ""}
                  name= "first_name"
              />
            </div>
            <div style = {{textAlign: 'center'}}>
                <TextField
                  type = "text"
                  value = {this.state.last_name}
                  name = "last_name"
                  onChange = {this.handleInputChange}
                  hintText = "Enter your last name..."
                  style = {{width: 250}}
                  errorText = {(this.state.last_name === "") ? "Field is required" : ""}
              />
            </div>
            <div style = {{textAlign: 'center'}}>
                <TextField
                  type = "email"
                  value = {this.state.email}
                  onChange = {this.handleInputChange}
                  hintText = "Email"
                  name = "email"
                  style = {{width: 250}}
                  errorText = {(!this.isValidEmailAddress()) ? "Needs to be a valid email" : ""}
                />
            </div>
            <div style = {{textAlign: 'center'}}>
              <TextField
                  type = "password"
                  value = {this.state.password}
                  onChange = {this.handleInputChange}
                  hintText = "Password"
                  name = "password"
                  style = {{width: 250}}
                  errorText = {(this.state.password === "") ? "Field is required" : ""}
              />
            </div>
            <div style = {{textAlign: 'center'}}>
              <TextField
                type = "password"
                value = {this.state.password_confirm}
                onChange = {this.handleInputChange}
                hintText = "Confirm password"
                name = "password_confirm"
                style = {{width: 250}}
                errorText = {( this.state.password !== this.state.password_confirm ) ? "Passwords do not match" : "" }
                />
            </div>
            <div style = {{marginTop: 40, textAlign: 'center'}}>
              <RaisedButton
                  type = "Submit"
                  label = "Register"
                  disabled = {this.isInValidInput()}
                  primary = {true}
                  style = {{width: 250}}
                  required
                  />
            </div>
          </form>
        </div>
        <div style = {{marginTop : 30, marginBottom: 20}}>
          <Link to = "/" className = "register-info">
              You already have an account?<br/>Login here.
          </Link>
        </div>
      </div>
    )
  }
}
