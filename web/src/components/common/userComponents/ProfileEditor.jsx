import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import styles from '../../common/Styles'
import Backend from '../Backend'

export default class ProfileEditor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      first_name: props.profileInf.first_name,
      last_name: props.profileInf.last_name,
      bio: props.profileInf.bio,
      email : props.profileInf.email,
      pw_old: '',
      pw_new: '',
      pw_new_confirm: ''
    }
    this.handlePwChangeSubmit = this.handlePwChangeSubmit.bind(this)
    this.handleProfileChangeSubmit = this.handleProfileChangeSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.handleDeleteAvatar = this.handleDeleteAvatar.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value,
      snackbar : false
    })
  }

  handlePwChangeSubmit(event){
    event.preventDefault()
    Backend.updatePassword(this.state.email, this.state.pw_old, this.state.pw_new).then((success) => {
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
    Backend.updateProfile(this.state.email,
      this.state.first_name,
      this.state.last_name,
      this.state.bio ).then((success) => {
      if(success){
        this.props.profileChangeHandler("Profile updated", true)
      }else{
        this.props.profileChangeHandler("Profile update failed",false)
      }
    })
  }


  handleFile(event){
    var file = event.target.files[0]
    if (file.name.substring(file.name.lastIndexOf(".") + 1) === "png"){
      var data = new FormData()
      data.append('file', event.target.files[0])
      Backend.updateAvatar(this.state.email, data)
        .then(this.props.profileChangeHandler("Avatar changed",true))
    }
    else {
      this.props.profileChangeHandler("Invalid format for picture",false)
    }
  }

  handleDeleteAvatar(){
    Backend.deleteAvatar(this.state.email)
    .then(this.props.profileChangeHandler("Avatar deleted",true))
  }

  render(){
    return (
    <div>
      <div className = "row">
        <div className = "col-9">
          <form onSubmit = {this.handleProfileChangeSubmit}>
            <div className = "row">
              <div className = "profile-info col-3">First name</div>
              <div className = "col-3">
                <TextField
                      name = "first_name"
                      onChange = {this.handleInputChange}
                      value = {this.state.first_name}
                      hintText = "Enter your first name"
                      style = {{marginBottom : (this.state.first_name.length === 0) ? 0 : 17} }
                      errorText = {(this.state.first_name === "") ? "Field is required" : ""}
                      />
              </div>
            </div>
            <div className = "row">
              <div className = "profile-info col-3">Last name</div>
              <div className = "col-3">
              <TextField
                      name = "last_name"
                      onChange = {this.handleInputChange}
                      value = {this.state.last_name}
                      hintText = "Enter your last name"
                      style = {{marginBottom : (this.state.last_name.length === 0) ? 0 : 17} }
                      errorText = {(this.state.last_name === "") ? "Field is required" : ""}
                      />
              </div>
            </div>
            <div className = "row">
              <div className = "profile-info col-3">Biography</div>
              <div className = "col-9"><TextField
                    name = "bio"
                    hintText = "Something about you"
                    onChange = {this.handleInputChange}
                    multiLine = {true}
                    value = {this.state.bio}
                    rowsMax = {8}
                    errorText = {(this.state.bio.length > 255) ? "Text to long" : ""}
                    fullWidth = {true} />
              </div>
            </div>
            <div className = "row">
              <div className = "col-8"></div>
              <div className = "col-4">
                <RaisedButton
                    type = "Submit"
                    label = "Submit changes"
                    primary = {true}
                    fullWidth = {true}
                    disabled = {(this.state.last_name === "" || this.state.first_name === "" || this.state.bio.length >255) ? true : false}
                    />
              </div>
            </div>
          </form>
        </div>
        <div className = "col-3">
          <img  src = {`/api/users/${this.props.profileInf.email}/avatar?${new Date().getTime()}`}
                width = "200px"
                height = "200px"
                alt = "..."
                className = "rounded-circle profile-icon" />
            <FlatButton
                      label = "Upload new avatar"
                      containerElement = "label"
                      primary = {true}
                      fullWidth = {true}
                      >
                    <input type = "file" style = {styles.uploadInput}
                      onChange = {this.handleFile} accept = ".png"/>
            </FlatButton>
            <FlatButton
                      label = "Delete avatar"
                      containerElement = "label"
                      onClick = {this.handleDeleteAvatar}
                      primary = {true}
                      fullWidth = {true}
            />
        </div>
      </div>
      <div className = "row">
        <div className = "col-9">
          <form onSubmit = {this.handlePwChangeSubmit}>
            <div className = "row">
              <div className = "col-3 profile-info">Email</div>
              <div className = "col-9">
                <div className = "form-control-static">{ this.props.profileInf.email }</div>
              </div>
            </div>
            {(Backend.isAdmin()) ? "" :
            <div className = "row">
              <div className = "col-3 profile-info">Old password</div>
              <div className = "col-3">
                <TextField
                          value = {this.state.pw_old}
                          type = "password"
                          name = "pw_old"
                          hintText = "Your old password"
                          onChange = {this.handleInputChange}
                          style = {{marginBottom : (this.state.pw_old.length === 0) ? 0 : 17} }
                          errorText = {this.state.pw_old.length === 0 ? "Password can not be empty" :""}
                />
              </div>
            </div>
            }
            <div className = "row">
            <div className = "col-3 profile-info">New password</div>
            <div className = "col-3">
              <TextField
                          value = {this.state.pw_new}
                          type = "password"
                          name = "pw_new"
                          hintText = "Your new password"
                          onChange = {this.handleInputChange}
                          style = {{marginBottom : (this.state.pw_new.length === 0) ? 0 : 17} }
                          errorText = {this.state.pw_new.length === 0 ? "Password can not be empty" :""}
              />
            </div>
          </div>
          <div className = "row">
            <div className = "col-3 profile-info">Confirm password</div>
            <div className = "col-3">
              <TextField
                          value = {this.state.pw_new_confirm}
                          type = "password"
                          name = "pw_new_confirm"
                          hintText = "Confirm password"
                          onChange = {this.handleInputChange}
                          style = {{marginBottom : (this.state.pw_new !== this.state.pw_new_confirm) ? 0 : 17} }
                          errorText = {this.state.pw_new !== this.state.pw_new_confirm ? "Passwords do not match" :""} />
            </div>
          </div>
          <div className = "row">
            <div className = "col-8"></div>
            <div className = "col-4">
              <RaisedButton
                          type = "Submit"
                          label = "Change Password"
                          primary = {true}
                          fullWidth = {true}
                          disabled= {(this.state.pw_new !== this.state.pw_new_confirm || this.state.pw_new === "" || !(Backend.isAdmin() || this.state.pw_old !== "")) ? true : false}
                          />
            </div>
          </div>
          </form>
        </div>
      </div>
    </div>
    )
  }
}
