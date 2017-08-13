import React, { Component } from 'react'
import SkillOutputList from '../../common/chips/SkillOutputList'


export default class ProfileView extends Component {

  render(){
    return (
      <div>
        <div style = {{marginBottom: 20}}>
          <img src = {`/api/users/${this.props.profileInf.email}/avatar?${Date.now()}`}
               alt = {this.props.profileInf.email}
               className = "rounded-circle profile-icon" />
        </div>
        <div style = {{marginBottom: 20}}>Projects contributed: {this.props.projectsContributed} </div>
        <div className = "bio-info" style = {{width: "100%", marginBottom: 20, wordWrap: "break-word"}}>
          {this.props.profileInf.bio}
        </div>
        <div>
          <SkillOutputList value = {this.props.topTenTags} />
        </div>
      </div>
    )
  }
}
