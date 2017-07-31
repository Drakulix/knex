import React, { Component } from 'react'
import DataTable from '../../common/DataTable'
import Backend from '../../common/Backend'


export default class ShowProjects extends Component {
  constructor(props){
    super(props)
    this.state = {
      projects : [],
      loading : true
    }
    this.handler = this.handler.bind(this)
  }

  componentDidMount(){
    this.handler({})
  }

  handler (query){
    query = JSON.parse(JSON.stringify(query))
    query.archived = "true"
    this.setState({loading: true})
    return Backend.search(query)
              .then ((data) => {this.setState({projects : data, loading:false}); return data;})
  }

  render(){
    return (
      <DataTable  columns = {['title', 'status', 'tags', 'authors', 'description', '_id', 'unarchive', 'delete' ]}
                    handler = {this.handler}
                    data = {this.state.projects}
                    loading = {this.state.loading}
      />
    )
  }
}
