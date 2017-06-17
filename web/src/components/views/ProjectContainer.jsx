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
    this.loadProjectInf(this.props);
  }

  componentWillReceiveProps(nextProps){
    this.loadProjectInf(nextProps)
  }

  componentDidMount(){
    this.loadProjectInf(this.props);
  }

  loadProjectInf(props) {
    fetchProjectDetails(props.uuid).then(data => {
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

        <button className="btn btn-default star-edit-button">
          <span className="glyphicon glyphicon-star white"></span>
        </button>

        <Link to={`${update_url}${this.props.uuid}`}>


          <button className="btn btn-default star-edit-button">
            <span className="glyphicon glyphicon-pencil white"></span>
          </button>
        </Link>
        <button className="btn btn-default trash-button">
          <span className="glyphicon glyphicon-trash white"></span>
        </button>

        <div className="projectbox">

          <div className="list_project_info_title">
            <p>
              Authors: {authors_string}
            </p>
            <p>
              {"Date of creation: 2017-01-16"}
            </p>
            <p>
              {"Last time updated: " + date_update}
            </p>
            <p>
              {"Team: " }
            </p>
            <p>
              {"Tags: " + tag_string}
            </p>
            <p>
              {"Github:"}
            </p>
            <p>
              {url}
            </p>
            <p>
              {"Description:"}
            </p>
            <p>
              {description}
            </p>
            <p>
              {}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
