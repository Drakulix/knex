import React, { Component } from 'react'
import DataTable from '../../common/DataTable'
import Backend from '../../common/Backend'

export default class ProfileProjects extends Component {

  constructor(props){
    super(props)
    this.state = {
      projects: [],
      loading: true
    }
    this.handler = this.handler.bind(this)
  }

  componentDidMount(){
    this.handler({})
  }

  handler (query){
    query = JSON.parse(JSON.stringify(query))
    query.archived = "false"
    query.authors = query.authors !== undefined ? query.authors: []
    query.authors.push(this.props.email)
    this.setState({loading: true})
    return Backend.search(query)
              .then ((data) => {this.setState({projects: data, loading: false}); return data;})
  }

  render(){
    return (
      <div>
        <DataTable
            columns= {['title', 'status', 'tags', 'authors',  '_id', 'bookmarked',
              (!this.props.profileExists) ? 'description' : '',
                  (!this.props.email === Backend.getMail() || Backend.isAdmin()) ?'archive': '']}
            handler = {this.handler}

            data = {this.state.projects}
            loading = {this.state.loading}
        />
      </div>
    )
  }
}
