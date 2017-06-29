import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './style/style.css';
import './style/fonts/font-awesome/css/font-awesome.css';

import {
  BrowserRouter,
  Route,
} from 'react-router-dom'

import history from './components/common/history'

import ProjectDetails from './components/pages/ProjectDetails';
import CreateProject from './components/pages/CreateProject';
import CreateProjectLink from './components/pages/CreateProjectLink';
import ProjectDiscovery from './components/pages/ProjectDiscovery';
import UserBookmarks from './components/pages/UserBookmarks';
import SignIn from './components/pages/SignIn.jsx';
import SignUp from './components/pages/SignUp.jsx';
import AdminArea from './components/pages/AdminArea';
import ProfileDetails from './components/pages/ProfileDetails.jsx';
import UpdateProject from './components/pages/UpdateProject';

ReactDOM.render(
<BrowserRouter history={history}>
  <div>
    <Route path="/discovery" component={ProjectDiscovery} />
    <Route path="/admin" component={AdminArea} />
    <Route path="/create/:getURL" component={CreateProject} />
    <Route exact path="/create" component={CreateProject} />
    <Route path="/update" component={UpdateProject} />
    <Route path="/createbylink" component={CreateProjectLink} />
    <Route path="/projects/:uuid" component={ProjectDetails} />
    <Route path="/bookmarks" component={UserBookmarks} />
    <Route path="/profile" component={ProfileDetails} />
    <Route path="/register" component={SignUp} />
    <Route exact path="/" component={SignIn} />
 </div>
</BrowserRouter>
, document.getElementById('root'));
registerServiceWorker();
