import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Chip from 'material-ui/Chip'
import styles from '../../common/Styles.jsx'


export default class ProfileView extends Component {

  render(){
    return (
      <div className="row padding">
        <div className="col-9">
          <div className="profile-header">Information:</div>
          <div className="profile-info">
            {this.props.profileInf.first_name} {this.props.profileInf.last_name}
          </div>
          <div className="profile-header">Biography:</div>
          <div className="profile-info" style={{width:"100%"}}>
            <table style={{tableLayout: "fixed", width: "80%" ,wordWrap: "break-word"}}><tr><td>
              {this.props.profileInf.bio}
            </td></tr></table>
          </div>
          <div>
            <div className="profile-header">Tags </div>
            <div style = {styles["wrapper"]}>
              { this.props.topTenTags.map(item =>
                <Chip style= {styles["chip"]}>
                  <Link to={"/discovery?tag=" +item} style= {styles["chipText"]} >{item}</Link></Chip>) }
            </div>
          </div>
        </div>
        <div className="col-3">
          <img src="http://www.freeiconspng.com/uploads/profile-icon-9.png" width="200px" height="200px" alt="..." className="rounded-circle profile-icon" />
        </div>
      </div>
    )
  }
}
