import React, { Component } from 'react';
import DataTable from '../common/DataTable';


export default class BookmarksTable extends Component {
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

fetchURL="/api/bookmarks"
bookmarksSite = {"true"}
          ></DataTable>

        <div className="footer" />

  </div>
    );
  }
}
