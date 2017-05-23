import React, { Component } from 'react';

class ProjectContainer extends Component{
  constructor(props){
    super(props);

    this.state={
      project: {
        title: "This wonderful title",
        authors: "John Do",
        status: "In progress",
        date_created: "2017-01-16",
        date_last_updated: "2017-03-27",
        team: "The best team ever",
        tags: "tag1,tag2,tag3",
        git_url: "https://github.com/Drakulix/knex",
        description: "Let's write an wonderful descriptiom. There was one time Derp, he wanted to eat a lot. He was hungry all the time, he ate all the time but he didn't get fat. Derpina, on the other hand, drank a lot but never got drunk.",
        future_work: "This is future work. I don't know what to write here, but it would be cool to see how Derp\'s and Derpina\'s kids would be like... can you imagine?",
        related_projects: "If you want to see more related_projects, go check 9gag... I am pretty sure that you will find what you are looking for. Good luck!!!"


      }
    }
  }

  render(){
    return(
      <div className="inner-content">
        <div className="projecttitle">
          <p>
            {"Title: " + this.state.project.title}
          </p>
        </div>
        <div className="status">
          <p>
          {"Status: "+ this.state.project.status}
          </p>
        </div>
        <div className="author">
          <p>
            {"Authors: "+ this.state.project.authors}
          </p>
          <p>
            {"Date of creation: " + this.state.project.date_created}
          </p>
          <p>
            {"Last time updated: " + this.state.project.date_last_updated}
          </p>
          <p>
            {"Team: " + this.state.project.team}
          </p>
          <p>
            {"Tags: " + this.state.project.tags}
          </p>
          <p>
            {"Git URL:"}
          </p>
          <p>
            {this.state.project.git_url}
          </p>
          <p>
            {"Description: "}
          </p>
          <p>
            {this.state.project.description}
          </p>
          <p>
            {"Future work: "}
          </p>
          <p>
            {this.state.project.future_work}
          </p>
          <p>
            {"Related Projects: "}
          </p>
          <p>
            {this.state.project.related_projects}
          </p>
        </div>
      </div>


    );
  }
}

export default ProjectContainer;
