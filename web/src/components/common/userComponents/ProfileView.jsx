import React, { Component } from 'react'
import TagOutputList from '../../common/chips/TagOutputList'


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
        <div style = {{marginBottom: 20}}>
          <TagOutputList value = {this.props.topTenTags} />
        </div>
        <div className = "bio-info" style = {{width: "100%"}}>
          <table style = {{tableLayout: "fixed", width: "80%", wordWrap: "break-word"}}><tbody><tr><td>
          {this.props.profileInf.bio}
          </td></tr></tbody></table>
        </div>
      </div>
    )
  }
}
