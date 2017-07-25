import React, { Component } from 'react'
import 'react-table/react-table.css'
import DataTable from '../common/DataTable'
import Backend from '../common/Backend'

export default class UserTrashcan extends Component {

render(){
    return (
      <div className = "container">
        <div className = "header">Your archived projects</div>
          <DataTable  columns = {['title', 'status', 'tags', 'authors', 'description', '_id', 'unarchive']}
            fetchHandler = {Backend.getBookmarks()} />


      </div>
    )
  }
}
