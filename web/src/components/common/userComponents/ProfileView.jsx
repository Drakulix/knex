import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Chip from 'material-ui/Chip'
import styles from '../../common/Styles.jsx'


export default class ProfileView extends Component {

  render(){
    return (
      <div className="row padding">
        <div className="col-9">
          <div className="profile-header">Name</div>
          <div className="profile-info">
            {this.props.profileInf.first_name} {this.props.profileInf.last_name}
          </div>
          <div className="profile-header">E-Mail</div>
          <div className="profile-info">
            {this.props.profileInf.email}
          </div>
          <div className="profile-header">Biography</div>
          <div className="profile-info" style={{width:"100%"}}>
            <table style={{tableLayout: "fixed", width: "80%" ,wordWrap: "break-word"}}><tbody><tr><td>
              {this.props.profileInf.bio}
            </td></tr></tbody></table>
          </div>
          <div>
            <div className="profile-header">Knowledge in</div>
            <div style = {styles["wrapper"]}>
              { this.props.topTenTags.map(item =>
                <Chip style= {styles["chip"]} key={item}>
                  <Link to={"/discovery/"+JSON.stringify({tags:[item]})} style= {styles["chipText"]} >{item}</Link></Chip>) }
            </div>
          </div>
        </div>
        <div className="col-3">
          <img src={"/api/users/"+this.props.profileInf.email+"/avatar"} width="200px" height="200px" alt="..." className="rounded-circle profile-icon" />
        </div>
      </div>
    )
  }
}
