import React, { Component } from 'react';
import {fetchProjectDetails, fetchJson} from '../common/Backend'
import { Link } from 'react-router-dom';

import ChipInput from 'material-ui-chip-input'
import Chip from 'material-ui/Chip'
import FlatButton from 'material-ui/RaisedButton';


const styles = {
  chip: {
    margin: 6,

  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};




const update_url='/update/'
export default class ProjectContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectInf:{},
    };
  }

  componentWillMount(){
    this.loadProjectInf(this.props.match.params.uuid);
  }

  componentWillReceiveProps(nextProps){
    this.loadProjectInf(nextProps)
  }

  componentDidMount(){
    this.loadProjectInf(this.props);
  }


  loadProjectInf(uuid) {

    this.setState({projectInf : {_id :"dsa", title:"test", status:"done",
date_creation : "12", date_update:"11", description : "lirum larum", authors:["aa,dd"],
tags:["av","dasda", "adsadas"], url:["fds","dasda", "adsadas"], authors :[{id:"33", name :"dda"}, {id:"32", name :"ddaa"}]
}});

/*    fetchProjectDetails(uuid).then(data => {
      this.setState({projectInf: data})
    });*/

  }


  render(){
    return(

<div className="container">
  <div className="innerContainer">
  <div className = "row headerCreation">

      <div className="col-8 ">
          <div> Project</div>
      </div>
    <div className="col-4">
      <button label="Comment" />
      <button label="Bookmark" />
      <button label="Edit" />
      <button label="Delete" />
    </div>

  </div>
    <div>
        <div className="profile-info">
          <div>Title</div>
        </div>
        <div>{this.state.projectInf.title}</div>
    </div>
        <br></br>
    <div className="row">
      <div className="col-4">
        <div>
          <div className="profile-info">Status</div>
          <div>{this.state.projectInf.status}</div>
        </div>
        <div>
          <div className="creation-date-elem">
            <div className="profile-info">Date of creation </div>
            <div>{this.state.projectInf.date_creation}</div>
          </div>
          <div>
            <div className="profile-info">Last time updated </div>
            <div> {this.state.projectInf.date_update}</div>
          </div>
        </div>
          <div>
            <div className="profile-info">Authors</div>
              <div style = {styles["wrapper"]}>
                {this.state.projectInf.authors.map(item => <Chip style= {styles["chip"]}>
                              <Link to={item.id} >{item.name}  </Link></Chip>)}
              </div>
          </div>
          <div>
            <div className="profile-info">URLS</div>
            <div style = {styles["wrapper"]}>
                      {this.state.projectInf.url.map(item => <Chip style= {styles["chip"]}>
                                <Link to={item} >{item}  </Link></Chip>)}
            </div>
          </div>
        </div>
        <div className="col-1"></div>
        <div className="col-7">
          <div>
            <div className="profile-info">Tags </div>
            <div style = {styles["wrapper"]}>
                  {this.state.projectInf.tags.map(item =>
                      <Chip style= {styles["chip"]}>
                        <Link to={item}>{item}</Link></Chip>)}
            </div>
          </div>
        <div>
          <div className="profile-info">Description</div>
          <div><a>{this.state.projectInf.description}</a></div>
        </div>
      </div>
    </div>
  </div>
</div>
    );
  }
}
