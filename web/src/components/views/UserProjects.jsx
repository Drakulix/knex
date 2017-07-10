import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { fetchJson } from '../common/Backend'
import DataTable from '../common/DataTable';


export default class UserProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }



render(){

    return (
      <div className="container">
        <div className="header">Your Bookmarks</div>



        <DataTable columns= {['title', 'status', 'tags', 'authors', 'description', '_id', 'bookmarked']}

fetchURL="/api/projects"
bookmarksSite = {"true"}
          ></DataTable>

        <div className="footer" />

  </div>
    );
  }
}
