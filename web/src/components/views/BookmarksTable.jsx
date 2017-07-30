import React, { Component } from 'react'
import DataTable from '../common/DataTable'
import Backend from '../common/Backend'

export default class BookmarksTable extends Component {

  constructor(props){
    super(props)
    this.state = {
      projects : [],
      loading : true
    }
    this.handler = this.handler.bind(this)
  }

  componentDidMount(){
    this.handler()
  }

  handler (){
    this.setState({loading: true})
    return Backend.getBookmarks()
              .then ((data) => {this.setState({projects : data, loading:false}); return data;})
  }

  render(){
    return (
      <div className = "container">
        <div className = "headerCreation">Your bookmarks</div>
        <DataTable  columns = {['title', 'status', 'tags', 'authors', 'description', '_id', 'bookmarked']}
                    handler = {this.handler}
                    data = {this.state.projects}
                    loading = {this.state.loading}
                    isBookmarkTable = {true}
        />
      </div>
    )
  }
}
