import React, { Component } from 'react';
import DataTable from '../../common/DataTable'


export default class ShowProjects extends Component {

  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div>
        <div className="header-tab">Manage projects</div>
        <DataTable columns= {['title', 'status', 'tags', 'authors', 'description', '_id',  'delete']}
                      fetchURL="/api/projects"/>
      </div>
    )
  }
}
