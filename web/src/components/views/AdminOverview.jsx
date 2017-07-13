import React, { Component } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import ShowUsers from '../common/adminComponents/ShowUsers'
import RegisterUser from '../common/adminComponents/RegisterUser'
import ShowProjects from '../common/adminComponents/ShowProjects'


export default class AdminOverview extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: "1",
    }
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    })
  }

  render() {
    //TODO Chenge table to archived projects
      return (
        <div className="container">
          <div className="header">Admin area</div>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            style={{marginBottom:"40px"}}
            >
            <Tab label="Manage Projects" value="1">
              <ShowProjects/>
            </Tab>
            <Tab label="List Users" value="2">
              <ShowUsers/>
            </Tab>
            <Tab label="Register user" value="3">
              <RegisterUser/>
            </Tab>
          </Tabs>
        </div>
      )
    }
}
