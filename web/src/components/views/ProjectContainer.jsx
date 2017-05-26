import React, { Component } from 'react';

class ProjectContainer extends Component{
  constructor(props){
    super(props);
    this.state={
      state:null
    };
  }

  render(){
    return(
      <div className="container">
        <div className="projecttitle">
          <p>
            {"Title: " + this.props.title}
          </p>
        </div>
        <div className="status">
          <p>
          {"Status: "+ this.props.status}
          </p>
        </div>
        <div className="author">
          <p>
            {"Authors: "+ this.props.authors}
          </p>
          <p>
            {"Date of creation: " + this.props.date_created}
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
            {"Description: "}
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
