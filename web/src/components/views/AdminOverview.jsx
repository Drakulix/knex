import React, { Component } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import DataTable from '../common/DataTable'
import ShowUsers from '../common/adminViews/ShowUsers'
import RegisterUser from '../common/adminViews/RegisterUser'

export default class AdminOverview extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: 1,
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
              <div className="header-tab">Manage projects</div>
                  <DataTable columns= {['title', 'status', 'tags', 'authors', 'description', '_id',  'delete']}
                              fetchURL="/api/projects"/>
                  <div className="footer" />
            </Tab>
            <Tab label="List Users" value="2">
              <ShowUsers/>
            </Tab>
            <Tab label="Register user" value="3">
              <RegisterUser></RegisterUser>
            </Tab>
          </Tabs>
        </div>
      )
    }
}
