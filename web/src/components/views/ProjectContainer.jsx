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
    const { _id, authors, date_creation, date_update, description } = this.state.projectInf;
    const { status, tags, title, url} = this.state.projectInf;
    var status_badge = null;
    if (status == 'DONE'){
      status_badge = <span className="badge badge-success">DONE</span>
    } else if (status == 'IN_PROGRESS') {
      status_badge = <span className="badge badge-warning">IN_PROGRESS</span>
    } else if (status == 'IN_REVIEW') {
      status_badge = <span className="badge badge-info">IN_REVIEW</span>
    } else {
      status_badge = status
    }

    var authors_string = null;
    if (authors != null){
      var author_container = []
      for (var i = 0; i < authors.length; i++){
        author_container.push(authors[i].name);
      }
      authors_string = author_container.join(", ")
    } else {
      authors_string = ''
    }
    if (tags != null){
      var tag_container = []
      for (var i = 0; i < tags.length; i++){
        tag_container.push(<span className="badge badge-default">{tags[i]}</span>)
      }
    } else {
      tag_container = ''
    }
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
