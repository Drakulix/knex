import React from 'react'

import CreateProject from './CreateProject'
import Moment from 'moment'


const JSON5 = require('json5')

export default class CreateProjectByURL extends React.Component {

  constructor(props) {
    super(props)
    var data = this.props.json;
    this.state = {
      json : data
    }
  }

  componentWillMount(){
    if(this.props.match.path ==="/createFromFile/:data"){
      var data = JSON5.parse(decodeURIComponent(this.props.match.params.data));
      if(data!=null){
        this.setState({
          date : data.date_creation != null ? Moment(data.date_creation, "YYYY-MM-DD").toDate() : null,
          projectInf : {
            title : data.title != null ? data.title : "",
            description : data.description != null ? data.description : "",
            authors : data.authors != null ? data.authors : [],
            date_creation : data.date_creation != null ? data.date_creation : "",
            status : data.status != null ? data.status : "",
            tags : data.tags != null ? data.tags : [],
            url : data.url != null ? data.url : []
          }
        })
      }
    }
  }

  render() {
    return(
      <CreateProject
        projectInf = {this.state.projectInf}
        date = {this.state.date}
        fromURL = {true}
      />
    )
  }
}
