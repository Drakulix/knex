import React, { Component } from 'react';
import { Link } from 'react-router';

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
      <div className="side-bar-container">
        <ul className="menu-list">
          <li className="menu-item">
            <p class="menu-text">
              {this.state.menu.discoverProjects}
            </p>
          </li>
          <li className="menu-item">
            <p class="menu-text">
              {this.state.menu.createProject}
            </p>
          </li>
          <li className="menu-item">
            <p class="menu-text">
              {this.state.menu.adminArea}
            </p>
          </li>
        </ul>
      </div>
    );
  }
}

export default SearchBar;
