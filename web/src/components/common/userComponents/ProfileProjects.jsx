import React, { Component } from 'react'
import DataTable from '../../common/DataTable'
import Backend from '../../common/Backend'

export default class ProfileProjects extends Component {

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
    return Backend.search({archived : "false", authors : [this.props.email]})
              .then ((data) => {this.setState({projects : data, loading:false}); return data;})
  }

  render(){
    return (
      <div>
        <DataTable
            columns= {['title', 'status', 'tags', 'authors', 'description', '_id',
                  (!this.props.email === Backend.getMail()) ? 'bookmarked' : '',
                  (!this.props.email === Backend.getMail() || Backend.isAdmin()) ?'archive' : '',
                  (!this.props.email === Backend.getMail() || Backend.isAdmin()) ?'unarchive' :'']
                }
            handler = {this.handler}
            data = {this.state.projects}
            loading = {this.state.loading}
        />
      </div>
    )
  }
}
