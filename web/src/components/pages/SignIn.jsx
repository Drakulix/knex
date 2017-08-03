import React, { Component } from 'react'
import {
  Link,
  Redirect,
} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import logo from '../../style/img/black_logo_title_below.svg'
import Backend from '../common/Backend'

export default class SignIn extends Component {

  constructor(props) {
    super(props)
    // set the initial component state
    this.state = {
      redirect : false,
      error : '',
      email : Backend.getMail(),
      password : '',
    }

    this.handleChangeEmail = this.handleChangeEmail.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeEmail(event) {
    this.setState({email : event.target.value})
  }

  handleChangePassword(event) {
    this.setState({password : event.target.value})
  }

  handleSubmit(event){
    event.preventDefault()
    Backend.login(this.state.email, this.state.password).then((success) => {
      if(success){
        this.setState({ redirect : true })
      }else{
        this.setState({ redirect : false, error : 'Login failed' })
        alert("Login failed")
      }
    })
  }

  render() {
    if (this.state.redirect || Backend.isLoggedIn() ) {
      return <Redirect to='/discovery'/>
    }

    return (
      <section className = "sign-container">

        {/*Information*/}
        <img className = "service-name" src = {logo} alt = "Logo"/>
        <h2 className = "team-name">brings light to the cloud</h2>
        <div className = "rectangle-sign">
          <h3 className = "sign-type-desc">Login</h3>
          <form onSubmit = {this.handleSubmit}>
            {/*Input Email*/}
            <div className = "input-group input-login">
              <TextField
                type = "text"
                value = {this.state.email}
                onChange = {this.handleChangeEmail}
                hintText = "Email"
              />
            </div>
            {/*Input password*/}
            <div className = "input-group input-login">
              <TextField
                type = "password"
                value = {this.state.password}
                onChange = {this.handleChangePassword}
                hintText = "Password"
              />
            </div>
            <div>
              <RaisedButton
                type = "Submit"
                label = "Login"
                primary = {true}
                style = {{width : 250, marginTop : 40}}
              />
          </div>
          </form>
          <div>
            <br/>
            <Link to = "/register">
            <RaisedButton
              type = "Submit"
              label = "Register"
              primary = {true}
              style = {{width : 250}}
              required
            />
            </Link>
          </div>
        </div>
      </section>
    )
  }
}
