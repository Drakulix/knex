import React, { Component } from 'react'
import 'react-table/react-table.css'
import DataTable from '../common/DataTable'
import Backend from '../common/Backend'

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
    this.handler()
  }

  handler (){
    this.setState({loading: true})
    return Backend.search({archived : "true",authors : [Backend.getMail()] })
              .then ((data) => {this.setState({projects : data, loading:false}); return data;})
  }

  render(){
      return (
        <div className = "container">
          <div className = "headerCreation">Your archived projects</div>
          <DataTable  columns = {['title', 'status', 'tags', 'authors', 'description', '_id', 'unarchive' ]}
                      handler = {this.handler}
                      data = {this.state.projects}
                      loading = {this.state.loading}
          />
        </div>
      )
    }
  }
