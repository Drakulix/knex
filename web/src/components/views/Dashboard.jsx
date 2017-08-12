import React from 'react'
import TimeLine from '../common/userComponents/TimeLine'
import Backend from '../common/Backend'
import HeadLine from '../common/HeadLine'


export default class Dashboard extends React.Component {

  constructor(props){
    super(props)
  }

  render() {
    return (
      <div className = "container">
        <HeadLine title = {"Your timeline"}/>
          <TimeLine email = {Backend.getMail()}/>
      </div>
    )
  }
}
