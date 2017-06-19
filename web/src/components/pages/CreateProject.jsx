import React, { Component } from 'react';
import UploadByPattern from '../views/CreateProjectByPattern';
import TopBar from '../common/TopBar';
import { Link } from 'react-router-dom';

export default class CreateProject extends Component {
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
          <div className="col-3 side-bar">
              <ul className="list-group">
                <li className="list-group-item">
                  <Link to="/discovery">
                    {this.state.menu.discoverProjects}
                  </Link>
                </li>
                <li className="list-group-item active">
                  <div className="menu-indicator">
                  </div>
                  <Link to="/create">
                    {this.state.menu.createProject}
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="/admin">
                    {this.state.menu.adminArea}
                  </Link>
                </li>
              </ul>
          </div>
          <div className="col-9 content">
            <UploadByPattern />
          </div>
        </div>
      </div>
    );
  }
}
