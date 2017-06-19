import React, { Component } from 'react';
import UpdateProjectView from '../views/UpdateProjectView';
import TopBar from '../common/TopBar';
import { Link } from 'react-router-dom';

export default class UpdateProject extends Component {
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
                <li className="list-group-item">
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
            <UpdateProjectView />
          </div>
        </div>
      </div>
    );
  }
}
