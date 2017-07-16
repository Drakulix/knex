import React, { Component } from 'react'
import DataTable from '../../common/DataTable'


export default class ShowProjects extends Component {

  render(){
    return (
      <div>
        <div className = "header-tab" style = {{textAlign : "center"}}>Manage projects</div>
        <DataTable columns = {['title', 'status', 'tags', 'authors', 'description', '_id',  'delete']}
                   fetchURL = "/api/projects"/>
      </div>
    )
  }
}
