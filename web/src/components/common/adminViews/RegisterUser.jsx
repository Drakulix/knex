import React, { Component } from 'react';
import Snackbar from "material-ui/Snackbar"
import TextField from "material-ui/TextField"
import RaisedButton from "material-ui/RaisedButton"
import MenuItem from "material-ui/MenuItem"
import SelectField from "material-ui/SelectField"

import {register} from '../../common/Authentication.jsx';


export default class RegisterUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name : "",
      last_name : "",
      email : "",
      password : "",
      password_confirm : "",
      value : 0
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.isValidEmailAddress = this.isValidEmailAddress.bind(this);
    this.isInValidInput = this.isInValidInput.bind(this);
    this.handleRegRoleChange = this.handleRegRoleChange.bind(this);
  }

  handleRegRoleChange(event, index, value){
    this.setState({role : value})
  }

  handleInputChange(event) {
    const target = event.target;
    const value =  target.value;
    const name = target.name;
    this.setState({
      [name]: value,
      snackbar : false
    });
  }

  isValidEmailAddress() {
    var address = (this.state.email);
    if(address === "")
      return false
    if(address !== undefined){
      return !! address.match(/\S+@\S+\.\S+/);
    }
    return false
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

    register(this.state.first_name, this.state.last_name, this.state.email, this.state.password, this.state.password_confirm, this.state.role).then((success) => {
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

  render(){
    return (
      <div>
        <Snackbar
          open={this.state.snackbar}
          message={this.state.snackbarText}
          autoHideDuration={10000}
          />
        <div className="header-tab">Register user</div>
        <div className="row">
          <div className="col-9">
            <form onSubmit={this.handleRegister}>
              {/*Input First Name*/}
              <div>
                <TextField
                  type="text"
                  value={this.state.first_name}
                  onChange={this.handleInputChange}
                  hintText="Enter the first name..."
                  errorText={(this.state.first_name === "") ? "Field is required" : ""}
                  name= "first_name"
                  />
              </div>
              {/*Input Last Name*/}
              <div >
                <TextField
                  type="text"
                  value={this.state.last_name}
                  name="last_name"
                  onChange={this.handleInputChange}
                  hintText="Enter the given name..."
                  errorText={(this.state.last_name === "") ? "Field is required" : ""}

                  />
              </div>
              {/*Input Email*/}
              <div>
                <TextField
                  type="email"
                  value={this.state.email}
                  onChange={this.handleInputChange}
                  hintText="Email"
                  name="email"
                  errorText={(!this.isValidEmailAddress()) ? "Needs to be a valid email" : ""}

                  />
              </div>
              {/*Input password*/}
              <div >
                <TextField
                  type="password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  hintText="Password"
                  name="password"
                  errorText={(this.state.password === "") ? "Field is required" : ""}
                  />
              </div>

              {/*Input confirm password*/}
              <div >
                <TextField
                  type="password"
                  value={this.state.password_confirm}
                  onChange={this.handleInputChange}
                  hintText="Confirm password"
                  name="password_confirm"
                  errorText={( this.state.password !== this.state.password_confirm ) ? "Passwords do not match" : "" }
                  />
              </div>
              <div >
                <SelectField
                  floatingLabelText="Role"
                  value={this.state.role}
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
      </div>
    )
  }
}
