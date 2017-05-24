import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import UploadByLink from './createProjectView.js';
import UploadByPattern from './createProjectByPattern.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state: null
    };
  }

  render() {
    return (
      <div>
        <h1>Wenn ihr das hier seht, läufts! (:</h1>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('.container'));
