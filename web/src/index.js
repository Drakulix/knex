import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './style/style.css';
import './style/fonts/font-awesome/css/font-awesome.css';

import {
  BrowserRouter,
  Route,
} from 'react-router-dom'

import ProjectDetails from './components/pages/ProjectDetails';
import CreateProject from './components/pages/CreateProject';
import CreateProjectLink from './components/pages/CreateProjectLink';
import ProjectDiscovery from './components/pages/ProjectDiscovery';
import SignIn from './components/pages/SignIn.jsx';
import SignUp from './components/pages/SignUp.jsx';
import AdminArea from './components/pages/AdminArea';

ReactDOM.render(
<BrowserRouter>
  <div>
    <Route path="/discovery" component={ProjectDiscovery} />
    <Route path="/admin" component={AdminArea} />
    <Route path="/create" component={CreateProject} />
    <Route path="/createbylink" component={CreateProjectLink} />
    <Route path="/projects" component={ProjectDetails} />
    <Route path="/register" component={SignUp} />
    <Route exact path="/" component={SignIn} />
 </div>
</BrowserRouter>
, document.getElementById('root'));
registerServiceWorker();
