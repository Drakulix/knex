import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './style/style.css';
import './style/fonts/font-awesome/css/font-awesome.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


import {
  BrowserRouter,
  Route,
} from 'react-router-dom'

import history from './components/common/history'

import SignIn from './components/pages/SignIn.jsx';
import SignUp from './components/pages/SignUp.jsx';

import AdminOverview from './components/views/AdminOverview';
import CreateProjectByPattern from './components/views/CreateProjectByPattern';
import CreateProjectByURL from './components/views/CreateProjectByURL';
import CreateProject from './components/views/CreateProjectView.jsx';
import ProfileContainer from './components/views/ProfileContainer.jsx';
import ProjectContainer from './components/views/ProjectContainer';
import SearchPage from './components/views/SearchPage';
import BookmarksTable from './components/views/BookmarksTable';
import UserProjects from './components/views/UserProjects.jsx';
import SavedQueries from './components/views/SavedQueries.jsx'

import TopBar from './components/common/TopBar';
import SideBar from './components/common/SideBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import styles from './components/common/Styles.jsx';


var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();



const muiTheme = getMuiTheme(styles);




const PageRoute = ({ component: Component, path, ...rest }) => (
  <Route {...rest} path={path} render={props => (
    (
      <div className="inner-content">
        <TopBar />
        <div className="row">
          <SideBar location={path} />
          <div className="col-9 content">
            <Component {...props} />
          </div>
        </div>
      </div>
    )
  )}/>
)

ReactDOM.render(
  <MuiThemeProvider  muiTheme={muiTheme}>
    <BrowserRouter history={history}>
      <div>
        <PageRoute path="/discovery" component={SearchPage} />
        <PageRoute path="/admin" component={AdminOverview} />
        <PageRoute exact path="/createNew" component={CreateProjectByPattern} />
        <PageRoute path="/createNew/:getURL" component={CreateProjectByURL} />
        <PageRoute path="/create" component={CreateProject} />
        <PageRoute path="/update/:uuid" component={CreateProjectByPattern} />
        <PageRoute path="/createbylink" component={CreateProject} />
        <PageRoute path="/project/:uuid" component={ProjectContainer} />
        <PageRoute path="/bookmarks" component={BookmarksTable} />
        <PageRoute path="/profile/:email" component={ProfileContainer} />
        <PageRoute path="/yourprojects" component={UserProjects} />
        <PageRoute path="/queries" component={SavedQueries} />
        <Route path="/register" component={SignUp} />
        <Route exact path="/" component={SignIn} />
     </div>
    </BrowserRouter>
  </MuiThemeProvider>
, document.getElementById('root'));
registerServiceWorker();
