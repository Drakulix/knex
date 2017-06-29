import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default class BookmarksTable extends React.Component {

  render() {
    const data = [{
      name: 'Contextual music information retrieval and recommendation',
      status: 'done',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      bookmark: 'yes'
    }]

    const columns = [{
      Header: 'Project Name',
      accessor: 'name'
    }, {
      Header: 'Status',
      accessor: 'status',
      width: 100
    }, {
      Header: 'Description',
      accessor: 'description',
      pivot: true
    }, {
      Header: 'Bookmark',
      accessor: 'bookmark',
      width: 100
    }]

    return (
      <div className="container">
        <div className="header">Your Bookmarks</div>
          <ReactTable
            data={data}
            columns={columns}
            filterable={true}
            defaultPageSize={5}
          />
        <div className="footer" />
    </div>
    );
  }
}
