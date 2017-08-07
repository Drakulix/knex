import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import { Switch } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import './style/style.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


import {
  Route,
  Router
} from 'react-router-dom'


import history from './components/common/history'
import { init } from './components/common/Backend'

import SignIn from './components/pages/SignIn.jsx'
import SignUp from './components/pages/SignUp.jsx'

import AdminOverview from './components/views/AdminOverview'
import CreateProject from './components/views/CreateProject'
import CreateProjectByURL from './components/views/CreateProjectByURL'
import CreateProjectFromFile from './components/views/CreateProjectFromFile'
import CreateProjectChoice from './components/views/CreateProjectChoice'
import ProfileContainer from './components/views/ProfileContainer'
import ProjectContainer from './components/views/ProjectContainer'
import SearchPage from './components/views/SearchPage'
import BookmarksTable from './components/views/BookmarksTable'
import UserProjects from './components/views/UserProjects'
import SavedQueries from './components/views/SavedQueries'
import UserTrashcan from './components/views/UserTrashcan'
import UserList from './components/views/UserList'
import Dashboard from './components/views/Dashboard'

import TopBar from './components/common/TopBar'
import SideBar from './components/common/SideBar'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import styles from './components/common/Styles.jsx'



var injectTapEventPlugin = require("react-tap-event-plugin")
injectTapEventPlugin()
require('roboto-fontface/css/roboto/roboto-fontface.css');
require('bootstrap/dist/css/bootstrap.css');



const PageRoute = ({ component: Component, path, sitePath, ...rest }) => (
  <Route {...rest} path={path} render={props => {
    return (
      <div className="inner-content">
        <TopBar />
          <SideBar location={sitePath} />

        <div className="row">
            <div className ="hidden-lg-up col"/>
            <div className="col-10 content">
            <Component {...props} />
          </div>
          <div className ="hidden-lg-up col"/>

        </div>
      </div>
    );
  }}/>
)

init(() => {
  ReactDOM.render(
    <MuiThemeProvider  muiTheme={getMuiTheme(styles)}>
      <Router history={history}>
        <Switch>
          <PageRoute sitePath="/dashboard" path="/dashboard" component={Dashboard} />
          <PageRoute sitePath="/discovery" path="/discovery/:query" component={SearchPage} />
          <PageRoute sitePath="/discovery" path="/discovery/" component={SearchPage} />
          <PageRoute sitePath="/admin" path="/admin" component={AdminOverview} />
          <PageRoute sitePath="/createNew" exact path="/createNew" component={CreateProject} />
          <PageRoute sitePath="/createNew" path="/createByURL/:getURL" component={CreateProjectByURL} />
          <PageRoute sitePath="/createNew" path="/createFromFile/:data" component={CreateProjectFromFile} />
          <PageRoute sitePath="/update" path="/update/:uuid" component={CreateProject} />
          <PageRoute sitePath="/createbylink" path="/createbylink" component={CreateProjectChoice} />
          <PageRoute sitePath="/project" path="/project/:uuid" component={ProjectContainer} />
          <PageRoute sitePath="/bookmarks" path="/bookmarks" component={BookmarksTable} />
          <PageRoute sitePath="/profile" path="/profile/:email" component={ProfileContainer} />
          <PageRoute sitePath="/yourprofile"  path="/yourprofile" component={ProfileContainer} />
          <PageRoute sitePath="/yourprojects" path="/yourprojects" component={UserProjects} />
          <PageRoute sitePath="/queries" path="/queries" component={SavedQueries} />
          <PageRoute sitePath="/trashcan" path="/trashcan" component={UserTrashcan} />
          <PageRoute sitePath="/users" path="/users" component={UserList} />
          <Route path="/register" component={SignUp} />
          <Route exact path="/" component={SignIn} />
          <Route component={() => (<Redirect to="/"/>)} />
       </Switch>
      </Router>
    </MuiThemeProvider>
  , document.getElementById('root'))
  registerServiceWorker()
});
