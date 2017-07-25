import React, { Component } from 'react'
import DataTable from '../common/DataTable'
import Backend from '../common/Backend'

export default class BookmarksTable extends Component {

  render(){
    return (
      <div className = "container">
        <div className = "header">Your bookmarks</div>
        <DataTable  columns = {['title', 'status', 'tags', 'authors', 'description', '_id', 'bookmarked']}
                    fetchHandler = {Backend.getBookmarks()}
        />
      </div>
    )
  }
}
