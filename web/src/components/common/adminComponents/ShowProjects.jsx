import React, { Component } from 'react'
import DataTable from '../../common/DataTable'
import Backend from '../../common/Backend'


export default class ShowProjects extends Component {

  render(){
    return (
      <div style = {{marginTop:20}}>
        <DataTable columns = {['title', 'status', 'tags', 'authors', 'description', '_id', 'unarchive', 'delete']}
                  fetchHandler = {Backend.search({archived : "true"})} />
      </div>
    )
  }
}
