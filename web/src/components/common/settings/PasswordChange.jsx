import React, { Component } from 'react'
import Snackbar from 'material-ui/Snackbar'
import Backend from '../../common/Backend'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'


export default class PasswordChange extends Component {

    constructor(props) {
      super(props)
      this.state = {
        email: props.email,
        pw_old: '',
        pw_new: '',
        pw_new_confirm: '',
        snackbar: false,
        snackbarText: '',
      }
      this.handlePwChangeSubmit = this.handlePwChangeSubmit.bind(this)
      this.handleInputChange = this.handleInputChange.bind(this)
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

  componentWillReceiveProps(props){
    this.setState({snackbar: false})
  }

  handlePwChangeSubmit(event){
    event.preventDefault()
    Backend.updatePassword(this.state.email, this.state.pw_old, this.state.pw_new).then((success) => {
      if(success){
        this.setState({
          snackbar: true,
          snackbarText: 'Password changed '
        })
      }else{
        this.setState({
          snackbar: true,
          snackbarText: 'Password change failed'
        })
      }
    })
  }


  render(){
    return (
      <div>
        <Snackbar
          open = {this.state.snackbar}
          message = {this.state.snackbarText}
          autoHideDuration = {10000}/>
          {(Backend.isAdmin()) ? "" :
            <div className = "row">
              <div className = "col-2 profile-info">Old password</div>
              <div className = "col-3">
                <TextField
                  value = {this.state.pw_old}
                  type = "password"
                  name = "pw_old"
                  fullWidth = {true}
                  hintText = "Your old password"
                  onChange = {this.handleInputChange}
                  style = {{marginBottom: (this.state.pw_old.length === 0) ? 0: 17} }
                  errorText = {this.state.pw_old.length === 0 ? "Password can not be empty": ""}
                />
              </div>
            </div>
          }
        <div className = "row">
          <div className = "col-2 profile-info">New password</div>
          <div className = "col-3">
            <TextField
              value = {this.state.pw_new}
              type = "password"
              name = "pw_new"
              fullWidth = {true}
              hintText = "Your new password"
              onChange = {this.handleInputChange}
              style = {{marginBottom: (this.state.pw_new.length === 0) ? 0: 17} }
              errorText = {this.state.pw_new.length === 0 ? "Password can not be empty": ""}
            />
          </div>
        </div>
        <div className = "row">
          <div className = "col-2 profile-info">Confirm password</div>
          <div className = "col-3">
            <TextField
              value = {this.state.pw_new_confirm}
              type = "password"
              name = "pw_new_confirm"
              fullWidth = {true}
              hintText = "Confirm password"
              onChange = {this.handleInputChange}
              style = {{marginBottom: (this.state.pw_new !== this.state.pw_new_confirm) ? 0: 17} }
              errorText = {this.state.pw_new !== this.state.pw_new_confirm ? "Passwords do not match": ""} />
            </div>
          </div>
        <div className = "row">
          <div className = "col-2"/>
          <div className = "col-3">
            <RaisedButton
              label = "Change Password"
              primary = {true}
              fullWidth = {true}
              onClick = {this.handlePwChangeSubmit}
              disabled= {(this.state.pw_new !== this.state.pw_new_confirm || this.state.pw_new === "" || !(Backend.isAdmin() || this.state.pw_old !== "")) ? true: false}
            />
          </div>
        </div>
      </div>
    )
  }
}
