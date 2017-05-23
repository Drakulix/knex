import React, { Component } from 'react';

class SearchBar extends Component {
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
      <div className="container-fluid side-bar">
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
    );
  }
}

export default SearchBar;
