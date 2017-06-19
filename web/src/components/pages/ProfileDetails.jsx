/*import React, { Component } from 'react';
import ProfileContainer from '../views/ProfileContainer.jsx';
import TopBar from '../common/TopBar';
import { Link } from 'react-router-dom';

export default class ProfileDetails extends Component {
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
                <Link to="/createbylink">
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
          <div className="col-10">
            <ProfileContainer />
          </div>
        </div>
      </div>
    );
  }
}
*/