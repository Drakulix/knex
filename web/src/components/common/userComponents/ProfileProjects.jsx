import React, { Component } from 'react'
import DataTable from '../../common/DataTable'
import Backend from '../../common/Backend'

export default class ProfileProjects extends Component {

  render(){
    return (
      <div>
        <div  className="header-tab">Manage projects</div>
        <DataTable
                  fetchURL = {"/api/projects/search/advanced/?q=(authors.email: " + this.props.profileInf.email + ")"}
                  columns= {['title', 'status', 'tags', 'authors', 'description', '_id',
                    (!this.props.profileInf.email == Backend.getMail()) ? 'bookmarked':'',
                    (this.props.profileInf.email == Backend.getMail() || Backend.isAdmin()) ? 'delete' : '']
                  }
                  isProfile = {true}
                  />
        <div className="footer" />
      </div>
    )
  }
}
