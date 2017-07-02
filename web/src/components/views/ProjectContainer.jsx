import React, { Component } from 'react';
import {fetchProjectDetails, fetchJson} from '../common/Backend'
import { Link } from 'react-router-dom';

const update_url='/update/'
export default class ProjectContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectInf: [],
    };
  }

  componentWillMount(){
    this.loadProjectInf(this.props.match.params.uuid);
  }

  componentWillReceiveProps(nextProps){
    this.loadProjectInf(nextProps)
  }

  loadProjectInf(uuid) {
    fetchProjectDetails(uuid).then(data => {
      this.setState({projectInf: data})
    });
  }


//

  render(){
    const { _id, authors, date_creation, date_update, description } = this.state.projectInf;
    const { status, tags, title, url} = this.state.projectInf;

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

    var tag_string = null;
    if (tags != null){
      var tag_container = []
      for (var i = 0; i < tags.length; i++){
        tag_container.push(tags[i])
      }
      tag_string = tag_container.join(", ")
    } else {
      tag_string = ''
    }
    return(
      <div className="container">
        <div className="projecttitle">
          <p>
            Title: {this.state.projectInf.title}
          </p>
        </div>
        <div className="status">
          <p>
          Status: {this.state.projectInf.status}
          </p>
        </div>
        <ul className="nav nav-tabs overviewbar">
          <li className="nav-item ">
            <p className="nav-link active" href="#">Overview</p>
          </li>
          <li className="nav-item ">
            <p className="nav-link" href="#">Comments</p>
          </li>
          <li className="nav-item ">
            <p className="nav-link" href="#">GitHub</p>
          </li>
        </ul>
        <div className="btn-group project-btn-group" role="group" aria-label="Basic example">
        <button className="btn btn-secondary">
        <span className="fa fa-star" aria-hidden="true"></span>
        </button>

        <Link to={`${update_url}${this.props.match.params.uuid}`}>
          <button className="btn btn-secondary">
          <i className="fa fa-pencil" aria-hidden="true"/>
          </button>
        </Link>
        <button className="btn btn-secondary trash-button">
          <i className="fa fa-trash-o" aria-hidden="true"/>

        </button>
        </div>

        <div className="projectbox">

          <div className="list_project_info_title">
            <div className="authors">
              <span className="sec-label">Authors:</span><br />
                <a>{authors_string}</a>
            </div>
            <div className="team">
              <span className="sec-label">Team: </span><br />
               <a>{"Knex"}</a>
            </div>
            <div className="tags-pb">
              <span className="sec-label">Tags: </span><br />
              <a> {tag_string}</a>
            </div>
            <div className="github">
                <div className="sec-label">Github: </div>
                <div className="github-link">
                <a className="github-link" href={url}>{url}</a>
                </div>
            </div>
            <div className="description-elem">
              <div className="sec-label desc-label">Description:</div>
              <a>{description}</a>
            </div>
            <div className="date-group">
              <div className="creation-date-elem">
                <span className="sec-label">Date of creation: </span> {"2017-01-16"}
              </div>
              <div className="update-date-elem">
                <span className="sec-label">Last time updated: </span> {date_update}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
