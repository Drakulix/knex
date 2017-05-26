import React, { Component } from 'react';

class ProjectDetails extends Component {
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
        <div className="row">
          <div className="col-3 side-bar">
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
          <div className="col-9">
            {/* ProjectDiscovery */}
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectDetails;
