import React, { Component } from 'react';

class ProjectContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state:null
    };
  }

  render(){
    return(
      <div className="container">
        <div className="projecttitle">
          <p>
            {"Title: Contextual music information retrieval and recommendation: State of the art and challenges"}
          </p>
        </div>
        <div className="status">
          <p>
          {"Status: In progress"}
          </p>
        </div>
        <div className="author">
          <p>
            {"Authors: Marius Kaminskas"}
          </p>
          <p>
            {"Date of creation: 2017-01-16"}
          </p>
          <p>
            {"Last time updated: " + this.props.date_last_updated}
          </p>
          <p>
            {"Team: " + this.props.team}
          </p>
          <p>
            {"Tags: " + this.props.tags}
          </p>
          <p>
            {"Git URL:"}
          </p>
          <p>
            {this.props.git_url}
          </p>
          <p>
            {"Description: test"}
          </p>
          <p>
            {this.props.description}
          </p>
          <p>
            {"Future work: "}
          </p>
          <p>
            {this.props.future_work}
          </p>
          <p>
            {"Related Projects: "}
          </p>
          <p>
            {this.props.related_projects}
          </p>
        </div>
      </div>
    );
  }
}

export default ProjectContainer;
