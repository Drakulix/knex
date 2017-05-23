import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TopBar from './components/common/TopBar';
import SideBar from './components/common/SideBar';
import InnerContent from './components/common/Content';

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
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('.content'));
