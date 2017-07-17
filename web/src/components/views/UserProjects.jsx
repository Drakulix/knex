import React, { Component } from 'react'
import 'react-table/react-table.css'
import DataTable from '../common/DataTable'
import {getMyEmail} from '../common/Authentication.jsx'

export default class UserProjects extends Component {

render(){
    return (
      <div className = "container">
        <div className = "header">Your projects</div>
          <DataTable  columns = {['title', 'status', 'tags', 'authors', 'description', '_id', 'archive' ]}
                      fetchURL  = {"/api/projects/search/advanced/?q=authors.email:" + getMyEmail()}/>
      </div>
    )
  }
}
