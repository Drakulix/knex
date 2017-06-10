import React, { Component } from 'react';
import {fetchProjectDetails, fetchJson} from '../common/Backend'

export default class ProjectContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectInf: []
    };
  }

  componentWillReceiveProps(nextProps){
    this.loadProjectInf(nextProps)
  }

  componentDidMount(){
    this.loadProjectInf(this.props);
  }

  loadProjectInf(props) {
    fetchProjectDetails(props.uuid).then(data => {
      console.log(data);
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
            Title: {title}
          </p>
        </div>
        <div className="status">
          <p>
          Status: {status}
          </p>
        </div>
        <div className="author">
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
    );
  }
}
