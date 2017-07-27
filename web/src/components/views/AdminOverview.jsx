import React, { Component } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import ShowUsers from '../common/adminComponents/ShowUsers'
import RegisterUser from '../common/adminComponents/RegisterUser'
import ShowProjects from '../common/adminComponents/ShowProjects'
import Backend from '../common/Backend'
import Snackbar from 'material-ui/Snackbar'

export default class AdminOverview extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value : "1",
      userList : [],
      loading : false,
      snackbar : false,
      snackbarText :"",
    }
    this.handleUserUpdate = this.handleUserUpdate.bind(this)
    this.loadUsers = this.loadUsers.bind(this)
  }

  componentWillMount(){
    this.loadUsers()
  }

  handleUserUpdate(snackbarText){
    this.setState({snackbar : true,
    snackbarText : snackbarText})
    return this.loadUsers()
  }

  loadUsers(){
    this.setState({loading : true})
    return Backend.getUsers().then(function(data) {
      this.setState({
        userList : data,
        loading : false
      })
    }.bind(this))
  }

  handleChange = (value) => {
    this.setState({
      value : value,
      snackbar : false
    })
  }

  render() {
    return (
      <div className = "container">
        <Snackbar
          open={this.state.snackbar}
          message={this.state.snackbarText}
          autoHideDuration={10000}
        />
        <div className = "header">Admin area</div>
        <Tabs
          inkBarStyle = {{marginTop : -4, height : 4}}
          value = {this.state.value}
          onChange = {this.handleChange}
          style = {{marginBottom : "40px"}}
        >
          <Tab label = "Archived Projects" value = "1">
            <ShowProjects/>
          </Tab>
          <Tab label = "Manage Users" value = "2">
            <ShowUsers
              userList = {this.state.userList}
              handleUserUpdate = {this.handleUserUpdate}
              loading = {this.state.loading}/>
          </Tab>
          <Tab label = "Register user" value = "3">
            <RegisterUser
              handleUserUpdate = {this.handleUserUpdate}/>
          </Tab>
        </Tabs>
      </div>
    )
  }
}
