import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {changePassword, changeProfile} from '../../common/Authentication.jsx'


export default class ProfileEditor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      first_name: props.profileInf.first_name,
      last_name: props.profileInf.last_name,
      bio: props.profileInf.bio,
      email : props.profileInf.email,
      pw_old: props.profileInf.password,
      pw_new: '',
      pw_new_confirm: '',
    }
    this.handlePwChangeSubmit = this.handlePwChangeSubmit.bind(this)
    this.handleProfileChangeSubmit = this.handleProfileChangeSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value =  target.value
    const name = target.name
    this.setState({
      [name]: value,
      snackbar : false
    })
  }

  handlePwChangeSubmit(event){
    event.preventDefault()
    changePassword(this.state.email, this.state.pw_old, this.state.pw_new).then((success) => {
      if(success){
        this.setState({
          snackbar : true,
          snackbarText :  'Password change success'
        })
      }else{
        this.setState({
          snackbar : true,
          snackbarText :  'Password change failed'
        })
      }
    })
  }

  handleProfileChangeSubmit(event){
    event.preventDefault()
    changeProfile(this.state.email,
      this.state.first_name,
      this.state.last_name,
      this.state.bio ).then((success) => {
      if(success){
        this.props.profileChangeHandler("Profile changed")
      }else{
        this.props.profileChangeHandler("Profile change failed")
      }
    })
  }


  render(){
    return (
    <div>
      <div className="row">
        <div className="col-9">
          <form onSubmit={this.handleProfileChangeSubmit}>
            <div className="profile-header">Information:</div>
            <div className="row">
              <div className="profile-info col-3">First name:</div>
              <div className="col-3">
                <TextField
                      name="first_name"
                      onChange={this.handleInputChange}
                      value={this.state.first_name}
                      hintText="Enter your first name"
                      errorText={(this.state.first_name === "") ? "Field is required" : ""}
                      />
              </div>
            </div>
            <div className="row">
              <div className="profile-info col-3">Last name: </div>
              <div className="col-3">
              <TextField
                      name="last_name"
                      onChange={this.handleInputChange}
                      value={this.state.last_name}
                      hintText="Enter your last name"
                      errorText={(this.state.last_name === "") ? "Field is required" : ""}
                      />
              </div>
            </div>
            <div className="row">
              <div className="profile-info col-3">Biography:</div>
              <div className="col-9"><TextField
                    name="bio"
                    hintText="Something about you"
                    onChange={this.handleInputChange}
                    multiLine={true}
                    value={this.state.bio}
                    rowsMax={8}
                    fullWidth={true} />
              </div>
            </div>
            <div className="row">
              <div className="col-8"></div>
              <div className="col-4">
                <RaisedButton
                    type="Submit"
                    label="Submit changes"
                    primary={true}
                    style={{width: "100%"}}
                    disabled={(this.state.last_name === "" || this.state.first_name === "") ? true : false}
                    />
              </div>
            </div>
          </form>
        </div>
        <div className="col-3">
          <img src="http://www.freeiconspng.com/uploads/profile-icon-9.png" width="200px" height="200px" alt="..." className="rounded-circle profile-icon" />
          <div className="profile-icon-text">Change avatar</div>
        </div>
      </div>
      <div className="change-password">
        <form onSubmit={this.handlePwChangeSubmit}>
          <div className="form-group row">
            <label className="col-2 col-form-label">Email</label>
            <div className="col-10">
              <div className="form-control-static">{ this.props.profileInf.email }</div>
            </div>
          </div>
          <div className="form-group row">
            <label for="inputPassword" className="col-2">New Password</label>
            <div className="col-4">
              <TextField
                          value={this.state.pw_new}
                          type="password"
                          name="pw_new"
                          hintText="Your new password"
                          onChange={this.handleInputChange}
                          />
            </div>
          </div>
          <div className="form-group row">
            <label for="inputPassword" className="col-2">Confirm password</label>
            <div className="col-4">
              <TextField
                          value={this.state.pw_new_confirm}
                          type="password"
                          name="pw_new_confirm"
                          hintText="Confirm password"
                          onChange={this.handleInputChange}
                          errorText ={this.state.pw_new !== this.state.pw_new_confirm ? "Passwords do not match" :""} />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-10">
              <RaisedButton
                          type="Submit"
                          label="Change Password"
                          primary={true}
                          disabled= {(this.state.pw_new !== this.state.pw_new_confirm || this.state.pw_new === "") ? true : false}
                          />
            </div>
          </div>
        </form>
      </div>
    </div>
    )
  }
}
