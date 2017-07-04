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

import SignIn from './components/pages/SignIn.jsx';
import SignUp from './components/pages/SignUp.jsx';

import AdminOverview from './components/views/AdminOverview';
import CreateProjectByPattern from './components/views/CreateProjectByPattern';
import CreateProject from './components/views/CreateProjectView.jsx';
import ProfileContainer from './components/views/ProfileContainer.jsx';
import ProjectContainer from './components/views/ProjectContainer';
import SearchPage from './components/views/SearchPage';
import UpdateProject from './components/views/UpdateProjectView';
import BookmarksTable from './components/views/BookmarksTable';
import UserProjects from './components/views/UserProjects.jsx';

import TopBar from './components/common/TopBar';
import SideBar from './components/common/SideBar';

const PageRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => {
    return (
      <div className="inner-content">
        <TopBar />
        <div className="row">
          <SideBar location={props.location.pathname} />
          <div className="col-9 content">
            <Component {...props} />
          </div>
        </div>
      </div>
    )
  }}/>
)

ReactDOM.render(
<BrowserRouter history={history}>
  <div>
    <PageRoute path="/discovery" component={SearchPage} />
    <PageRoute path="/admin" component={AdminOverview} />
    <PageRoute path="/create/:getURL" component={CreateProjectByPattern} />
    <PageRoute exact path="/create" component={CreateProjectByPattern} />
    <PageRoute path="/update" component={UpdateProject} />
    <PageRoute path="/createbylink" component={CreateProject} />
    <PageRoute path="/projects/:uuid" component={ProjectContainer} />
    <PageRoute path="/bookmarks" component={BookmarksTable} />
    <PageRoute path="/profile" component={ProfileContainer} />
    <PageRoute path="/yourprojects" component={UserProjects} />
    <Route path="/register" component={SignUp} />
    <Route exact path="/" component={SignIn} />
 </div>
</BrowserRouter>
, document.getElementById('root'));
registerServiceWorker();
