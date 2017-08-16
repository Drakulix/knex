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
      email: props.profileInf.email,
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
      snackbar: false
    })
  }

  handlePwChangeSubmit(event){
    event.preventDefault()
    Backend.updatePassword(this.state.email, this.state.pw_old, this.state.pw_new).then((success) => {
      if(success){
          this.props.profileChangeHandler("Password changed", true)
      }else{
        this.setState({
          snackbar: true,
          snackbarText: 'Password change failed'
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
        .then(this.props.profileChangeHandler("Avatar changed", true))
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
      <div className = "row" style = {{marginTop: 100}}>
      <div className = "col-3">
        <RaisedButton
            label =  {<span>Submit Changes</span>}
            primary = {true}
            style = {{width: 160}}
            onClick = {this.handleProfileChangeSubmit}/>
      </div>
      <div className = "col-1"/>
      <div className = "col-4" style = {{fontSize: 30, height: 41, textAlign: 'center'}}>
        Edit profile
      </div>
      {!this.props.profileInf.active === "false" ?
        <div className = "row">
          <div className = "col-4"/>
          <div className = "col-4"><i style = {{fontSize : '20'}}> Inactive user</i></div>
          <div className = "col-4"/>
        </div>
        : ""}
      </div>
      <div className = "row" style = {{marginTop: 20}}>
        <div className = "col-3">
          <div style = {{marginBottom: 20, width: 180}}>
            <img  src = {`/api/users/${this.props.profileInf.email}/avatar?${Date.now()}`}
                   alt = {this.props.profileInf.email}
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
        <div className = "col-9">
          <div className = "row">
            <div className = "profile-info col-3">First name</div>
            <div className = "col-6">
              <TextField
                    name = "first_name"
                    onChange = {this.handleInputChange}
                    value = {this.state.first_name}
                    fullWidth = {true}
                    hintText = "Enter your first name"
                    style = {{marginBottom: (this.state.first_name.length === 0) ? 0: 17} }
                    errorText = {(this.state.first_name === "") ? "Field is required": ""}
                    />
            </div>
          </div>
          <div className = "row">
            <div className = "profile-info col-3">Last name</div>
            <div className = "col-6">
              <TextField
                    name = "last_name"
                    onChange = {this.handleInputChange}
                    value = {this.state.last_name}
                    fullWidth = {true}
                    hintText = "Enter your last name"
                    style = {{marginBottom: (this.state.last_name.length === 0) ? 0: 17} }
                    errorText = {(this.state.last_name === "") ? "Field is required": ""}
                    />
            </div>
          </div>
          <div className = "row">
            <div className = "profile-info col-3">Biography</div>
            <div className = "col-6">
              <TextField
                    name = "bio"
                    hintText = "Something about you"
                    onChange = {this.handleInputChange}
                    multiLine = {true}
                    value = {this.state.bio}
                    rowsMax = {8}
                    errorText = {(this.state.bio.length > 255) ? "Text to long": ""}
                    fullWidth = {true} />
            </div>
          </div>
          <hr></hr>
          <div className = "row">
            <div className = "col-3 profile-info">Email</div>
              <div className = "col-9">
                <div style = {{marginTop: 10}}>{ this.props.profileInf.email }</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
