import React, { Component } from 'react'
import DataTable from '../../common/DataTable'
import Backend from '../../common/Backend'


export default class ShowProjects extends Component {

  render(){
    return (
      <div>
        <div className = "header-tab" style = {{textAlign : "center"}}>Archived projects</div>
        <DataTable columns = {['title', 'status', 'tags', 'authors', 'description', '_id', 'unarchive', 'delete']}
                  fetchHandler = {Backend.getBookmarks()} />
      </div>
    )
  }
}
