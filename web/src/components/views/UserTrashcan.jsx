import React, { Component } from 'react'
import 'react-table/react-table.css'
import DataTable from '../common/DataTable'
import Backend from '../common/Backend'
import HeadLine from '../common/HeadLine'

export default class UserTrashcan extends Component {

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
    this.setState({loading : true})
    query = JSON.parse(JSON.stringify(query))
    query.archived = "true"
    query.authors = query.authors !== undefined ? query.authors : []
    query.authors.push(Backend.getMail())
    return Backend.search(query)
              .then ((data) => {this.setState({projects : data, loading : false});return data;})
  }

  render(){
      return (
        <div className = "container">
          <HeadLine title = {"Your archived projects"}/>
          <DataTable  columns = {['title', 'status', 'tags', 'authors', 'description', '_id', 'unarchive' ]}
                      handler = {this.handler}
                      data = {this.state.projects}
                      loading = {this.state.loading}
          />
        </div>
      )
    }
  }
