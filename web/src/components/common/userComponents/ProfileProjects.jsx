import React, { Component } from 'react'
import DataTable from '../../common/DataTable'
import Backend from '../../common/Backend'

export default class ProfileProjects extends Component {


                  /*fetchURL = {"/api/projects/search/advanced/?q=(authors.email: " + this.props.profileInf.email + ")"}*/
  render(){
    return (
      <div>
        <DataTable
        fetchHandler = {Backend.search({archived : "false", authors : [this.props.email]})}
        columns= {['title', 'status', 'tags', 'authors', 'description', '_id',
                  (!this.props.email == Backend.getMail()) ? 'bookmarked':'',
                  (!this.props.email == Backend.getMail() || Backend.isAdmin()) ?'archive' : '',
                  (!this.props.email == Backend.getMail() || Backend.isAdmin()) ?'unarchive' :'']
        }
        />
      </div>
    )
  }
}
