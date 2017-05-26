import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
  Route,
  Link
} from 'react-router-dom';

import TopBar from './components/common/TopBar';
import ProjectDetails from './components/pages/ProjectDetails';
import CreateProject from './components/pages/CreateProject';
import ProjectDiscovery from './components/pages/ProjectDiscovery';

ReactDOM.render((
   <HashRouter>
      <div>
        <Route exact path="/" component={ProjectDiscovery} />
          <Route path="create" component={CreateProject} />
          <Route path="details" component={ProjectDetails} />
      </div>
   </HashRouter>
), document.querySelector('.content'));
