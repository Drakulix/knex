import React, { Component } from 'react'
import 'react-table/react-table.css'
import DataTable from '../common/DataTable'
import Backend from '../common/Backend'

export default class UserProjects extends Component {

render(){
    return (
      <div className = "container">
      <div className = "header">Your projects</div>
        <DataTable  columns = {['title', 'status', 'tags', 'authors', 'description', '_id', 'archive' ]}
                      fetchHandler = {Backend.getBookmarks()} />
      </div>
    )
  }
}
