import React, { Component } from 'react'
import DataTable from '../../common/DataTable'

export default class ProfileProjects extends Component {
  
  render(){
    return (
      <div>
        <div  className="header-tab">Manage projects</div>
        <DataTable
                  fetchURL = {"/api/projects/search/advanced/?q=(authors.email: " + this.props.profileInf.email + ")"}
                  columns= {['title', 'status', 'tags', 'authors', 'description', '_id',
                    (!this.props.isMe) ? 'bookmarked':'',
                    (this.props.isMe || this.props.isAdmin) ? 'delete' : '']
                  }
                  isProfile = {true}
                  />
        <div className="footer" />
      </div>
    )
  }
}
