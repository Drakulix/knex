import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import TopBar from './components/common/TopBar';
import SideBar from './components/common/SideBar';
import InnerContent from './components/common/Content'
import SearchPage from './components/common/SearchPage';

import UploadByLink from './components/views/CreateProjectView';
import UploadByPattern from './components/views/CreateProjectByPattern';


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
        <SideBar />
        <SearchPage />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('.content'));
