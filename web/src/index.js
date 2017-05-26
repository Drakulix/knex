import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
  Route,
  Link
} from 'react-router-dom';

import ProjectDetails from './components/pages/ProjectDetails';
import CreateProject from './components/pages/CreateProject';
import ProjectDiscovery from './components/pages/ProjectDiscovery';
import SignIn from './components/pages/SignIn.jsx';
import SignUp from './components/pages/SignUp.jsx';

ReactDOM.render((
   <HashRouter>
      <div>
        <Route exact path="/" component={ProjectDiscovery} /> {/* <-- Replace this component to get different startpages e.g. SignIn, ProjectDiscovery etc. */}
          <Route path="create" component={CreateProject} />
          <Route path="details" component={ProjectDetails} />
          <Route path="signin" component={SignIn} />
          <Route path="signup" component={SignUp} />
      </div>
   </HashRouter>
), document.querySelector('.content'));
