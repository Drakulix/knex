import React from 'react'
import Backend from '../common/Backend'

export default class Dashboard extends React.Component {

  constructor(props){
    super(props)
    this.state = {}
    Backend.getNotifications()
    .then((data) => {alert(data)})
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
