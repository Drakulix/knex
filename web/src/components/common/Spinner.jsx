import CircularProgress from 'material-ui/CircularProgress'
import React, { Component } from 'react'


export default class Spinner extends Component {

  render(){
    return (
      <div className = "spinner" style = {{display: (this.props.loading ? "block": "none")}}>
        <div className = "headerCreation" style = {{width: "100%"}}>
          {this.props.text}
        </div>
        <CircularProgress style = {{MarginTop: 50}} size = {200} thickness = {5} />
      </div>
    )
  }
}
