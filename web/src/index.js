import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './style/style.css';
import './style/fonts/font-awesome/css/font-awesome.css';

import {
  BrowserRouter,
  Route,
  Link
} from 'react-router-dom'

import ProjectDetails from './components/pages/ProjectDetails';
import CreateProject from './components/pages/CreateProject';
import CreateProjectLink from './components/pages/CreateProjectLink';
import ProjectDiscovery from './components/pages/ProjectDiscovery';
import UserCollection from './components/pages/UserCollection';
import SignIn from './components/pages/SignIn.jsx';
import SignUp from './components/pages/SignUp.jsx';

ReactDOM.render(
<BrowserRouter>
  <div>
    <Route path="/discovery" component={ProjectDiscovery} /> {/* <-- Replace this component to get different startpages e.g. SignIn, ProjectDiscovery etc. */}
    <Route path="/create" component={CreateProject} />
    <Route path="/createbylink" component={CreateProjectLink} />
    <Route path="/projects" component={ProjectDetails} />
    <Route path="/collection" component={UserCollection} />
    <Route path="/register" component={SignUp} />
    <Route exact path="/" component={SignIn} />
 </div>
</BrowserRouter>
, document.getElementById('root'));
registerServiceWorker();
