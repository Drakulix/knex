import React from 'react'
import TimeLine from '../common/userComponents/TimeLine'
import Backend from '../common/Backend'

export default class Dashboard extends React.Component {

  constructor(props){
    super(props)
  }

  render() {
    return (
      <div className = "container">
        <div className = "headerCreation">Your timeline</div>
          <TimeLine email = {Backend.getMail()}/>
      </div>
    )
  }
}
