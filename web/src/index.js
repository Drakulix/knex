import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import TopBar from './components/common/TopBar';
import CreateProject from './components/pages/CreateProject';
import ProjectDetails from './components/pages/ProjectDetails';


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state: null
    };
  }

  render() {
    return (
      <div>
        <TopBar />
        <ProjectDetails />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('.content'));
