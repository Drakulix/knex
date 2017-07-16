import React, { Component } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import ShowUsers from '../common/adminComponents/ShowUsers'
import RegisterUser from '../common/adminComponents/RegisterUser'
import ShowProjects from '../common/adminComponents/ShowProjects'
import Snackbar from "material-ui/Snackbar"
import {get} from '../common/Backend'



export default class AdminOverview extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value : "1",
      userList : []
    }
    this.handleUserUpdate = this.handleUserUpdate.bind(this)
    this.loadUsers = this.loadUsers.bind(this)
  }

  componentWillMount(){
    this.loadUsers()
  }

  loadUsers(){
    get("/api/users").then(function(data) {
      this.setState({
        userList : data,
      })
    }.bind(this))
  }

  handleChange = (value) => {
    this.setState({
      value : value,
    })
  }

  handleUserUpdate(){
    this.loadUsers()
  }



  render() {
    //TODO Chenge table to archived projects
    return (
      <div className = "container">
        <div className = "header">Admin area</div>
        <Tabs
          inkBarStyle = {{marginTop : -4, height : 4}}
          value = {this.state.value}
          onChange = {this.handleChange}
          style = {{marginBottom : "40px"}}
          >
          <Tab label = "Manage Projects" value = "1">
            <ShowProjects/>
          </Tab>
          <Tab label = "List Users" value = "2">
            <ShowUsers
              userList = {this.state.userList}
              handleUserUpdate = {this.handleUserUpdate}/>
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
