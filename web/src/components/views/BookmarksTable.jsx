import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { fetchJson } from '../common/Backend'
import DataTable from '../common/DataTable';


const FILTER_ATTRIBUTES = ['title', 'status', 'tags', 'description', '_id', 'bookmarked'];

export default class BookmarksTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }



render(){

    return (
      <div className="container">
        <div className="header">Your Bookmarks</div>



        <DataTable columns= {['title', 'status', 'tags', 'description', '_id', 'bookmarked', 'delete']}

fetchURL="/api/projects"
          ></DataTable>

        <div className="footer" />

  </div>
    );
  }
}
