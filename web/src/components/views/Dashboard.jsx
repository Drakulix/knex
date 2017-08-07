import React from 'react'

export default class Dashboard extends React.Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className = "container">
        <div className = "headerCreation">Your news</div>
        <hr></hr>
      </div>
    )
  }
}
