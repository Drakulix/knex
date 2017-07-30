import React, { Component } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import ManageUsers from '../common/adminComponents/ManageUsers'
import RegisterUser from '../common/adminComponents/RegisterUser'
import ManageProjects from '../common/adminComponents/ManageProjects'

export default class AdminOverview extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value : "1",
    }
  }

  handleChange = (value) => {
    this.setState({
      value : value,
    })
  }

  render() {
    return (
      <div className = "container">
        <div className = "headerCreation">Admin area</div>
        <Tabs
          inkBarStyle = {{marginTop : -4, height : 4}}
          value = {this.state.value}
          onChange = {this.handleChange}
          contentContainerStyle = {{marginTop: 30, paddingLeft:15, paddingRight:15}}
        >
          <Tab label = "Archived Projects" value = "1">
            <ManageProjects/>
          </Tab>
          <Tab label = "Manage Users" value = "2">
            <ManageUsers/>
          </Tab>
          <Tab label = "Register user" value = "3">
            <RegisterUser/>
          </Tab>
        </Tabs>
      </div>
    )
  }
}
