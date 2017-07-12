import React, { Component } from 'react';
import 'react-table/react-table.css';
import DataTable from '../common/DataTable';
import {getMyEmail} from '../common/Authentication.jsx';

export default class UserProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render(){
    return (
      <div className="container">
        <div className="header">Your Projects</div>
        <DataTable
          columns= {['title', 'status', 'tags', 'authors', 'description', '_id', 'bookmarked']}
          fetchURL={"/api/projects/search/advanced/?q=authors.email:"+getMyEmail()}
          bookmarksSite = {"true"} />
      </div>
    );
  }
}
