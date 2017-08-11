import React, { Component } from 'react'

export default class HeadLine extends Component {

  render(){
      return <div className = "headerCreation">
        <div className ="hidden-md-down">{this.props.title}</div></div>
  }
}
