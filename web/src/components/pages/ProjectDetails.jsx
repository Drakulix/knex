import React, { Component } from 'react';
import ProjectContainer from '../views/ProjectContainer';
import TopBar from '../common/TopBar';
import data from '../../data/test_data.json';
import { Link } from 'react-router-dom';

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
                <Link to="/discovery">
                  {this.state.menu.discoverProjects}
                </Link>
              </li>
              <li className="list-group-item">
                <Link to="/create">
                  {this.state.menu.createProject}
                </Link>
              </li>
              <li className="list-group-item">
                <Link to="/projects">
                  {this.state.menu.adminArea}
                </Link>
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
