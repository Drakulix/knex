import React, { Component } from 'react';
import ProjectContainer from '../views/ProjectContainer';
import TopBar from '../common/TopBar';
import data from '!json!../../data/test_data.json';

export default class ProjectDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: {
        discoverProjects: 'Discover Projects',
        createProject: 'Create New Project',
        adminArea: 'Admin Area'
      }
    };
  }

  render() {
    return (
      <div className="inner-content">
        <TopBar />
        <div className="row">
          <div className="col-2 side-bar">
              <ul className="list-group">
                <li className="list-group-item">
                  <p>
                    {this.state.menu.discoverProjects}
                  </p>
                </li>
                <li className="list-group-item">
                  <p className="menu-text">
                    {this.state.menu.createProject}
                  </p>
                </li>
                <li className="list-group-item">
                  <p className="menu-text">
                    {this.state.menu.adminArea}
                  </p>
                </li>
              </ul>
          </div>
          <div className="col-10">
            <ProjectContainer title={data.project_two.title}/>
          </div>
        </div>
      </div>
    );
  }
}
