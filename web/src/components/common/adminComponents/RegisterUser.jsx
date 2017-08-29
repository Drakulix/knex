import React, { Component } from 'react'
import TextField from "material-ui/TextField"
import RaisedButton from "material-ui/RaisedButton"
import Backend from '../../common/Backend'
import Snackbar from 'material-ui/Snackbar'


export default class RegisterUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      first_name: "",
      last_name: "",
      email: (this.props.email !== undefined) ? this.props.email: "",
      password: "",
      password_confirm: "",
      role: 'user',
      snackbar: false,
      snackbarText: ""
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
    this.isValidEmailAddress = this.isValidEmailAddress.bind(this)
    this.isInValidInput = this.isInValidInput.bind(this)
    this.handleRegRoleChange = this.handleRegRoleChange.bind(this)
  }

  handleRegRoleChange(event, index, value){
    this.setState({role: value})
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value,
    })
  }

  componentWillReceiveProps(props){
    this.setState({snackbar: false})
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
    Backend.register(this.state.first_name, this.state.last_name, this.state.email, this.state.password, this.state.password_confirm, this.state.role)
    .then((success) => {
        if(success){
          this.setState({
            snackbar: true,
            snackbarText: 'Registration successfull!'
          })
        }else{
          this.setState({
            snackbar: true,
            snackbarText: 'Registration unsuccessfull!'
          })
        }
        if(this.props.handleUserUpdate !== undefined){
          this.props.handleUserUpdate()
        }
    })
  }

  render(){
    return (
      <div className = "container" style = {{textAlign: "left"}}>
        <Snackbar
                open = {this.state.snackbar}
                message = {this.state.snackbarText}
                autoHideDuration = {10000}
        />
        <form onSubmit = {this.handleRegister}>
          <div className = "row">
            <div className = "profile-info col-2">First name</div>
            <div className = "col-3">
              <TextField
                name = "first_name"
                onChange = {this.handleInputChange}
                fullWidth ={true}
                value = {this.state.first_name}
                hintText = "Enter the first name"
                style = {{marginBottom: (this.state.first_name.length === 0) ? 0: 17} }
                errorText = {(this.state.first_name.length === 0) ? "Field is required": ""}
                      />
            </div>
            <div className = "col-2"/>
            <div className = "profile-info col-2">Password</div>
            <div className = "col-3">
              <TextField
                type = "password"
                value = {this.state.password}
                fullWidth ={true}
                onChange = {this.handleInputChange}
                hintText = "Password"
                name = "password"
                style = {{marginBottom: (this.state.password === 0) ? 0: 17} }
                errorText = {(this.state.password.length === 0) ? "Field is required": ""}
                />
            </div>
          </div>
          <div className = "row">
            <div className = "profile-info col-2">Last name</div>
            <div className = "col-3">
              <TextField
                name = "last_name"
                onChange = {this.handleInputChange}
                value = {this.state.last_name}
                hintText = "Enter your last name"
                fullWidth ={true}
                style = {{marginBottom: (this.state.last_name.length === 0) ? 0: 17} }
                errorText = {(this.state.last_name.length === 0) ? "Field is required": ""}
              />
            </div>
            <div className = "col-2"/>
            <div className = "profile-info col-2">Confirm Password</div>
            <div className = "col-3">
              <TextField
                type = "password"
                value = {this.state.password_confirm}
                fullWidth ={true}
                onChange = {this.handleInputChange}
                hintText = "Confirm password"
                name = "password_confirm"
                style = {{marginBottom: (this.state.password !== this.state.password_confirm) ? 0: 17} }
                errorText = {( this.state.password !== this.state.password_confirm ) ? "Passwords do not match": "" }
                />
            </div>
          </div>
          <div className = "row">
            <div className = "profile-info col-2">Email</div>
            <div className = "col-3">
                <TextField
                  type = "email"
                  value = {this.state.email}
                  fullWidth ={true}
                  onChange = {this.handleInputChange}
                  hintText = "Email"
                  name = "email"
                  errorText = {(!this.isValidEmailAddress()) ? "Needs to be a valid email": ""}
                  />
            </div>
            <div className = "col-4"/>
            <div className = "col-3">
              <RaisedButton
                type = "Submit"
                label = "Register User"
                disabled = {this.isInValidInput()}
                primary = {true}
                fullWidth = {true}
                required
                />
            </div>
          </div>
        </form>
      </div>
    )
  }
}
