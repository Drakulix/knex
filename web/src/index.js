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




const PageRoute = ({ component: Component, path, site_path, ...rest }) => (
  <Route {...rest} path={path} render={props => (
    (
      <div className="inner-content">
        <TopBar />
        <div className="row">
          <SideBar location={site_path} />
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
        <PageRoute site_path="/discovery" path="/discovery/:qID" component={SearchPage} />
        <PageRoute site_path="/discovery" path="/discovery/" component={SearchPage} />
        <PageRoute site_path="/admin" path="/admin" component={AdminOverview} />
        <PageRoute site_path="/createNew" exact path="/createNew" component={CreateProjectByPattern} />
        <PageRoute site_path="/createNew" path="/createNew/:getURL" component={CreateProjectByURL} />
        <PageRoute site_path="/create" path="/create" component={CreateProject} />
        <PageRoute site_path="/update" path="/update/:uuid" component={CreateProjectByPattern} />
        <PageRoute site_path="/createbylink" path="/createbylink" component={CreateProject} />
        <PageRoute site_path="/project" path="/project/:uuid" component={ProjectContainer} />
        <PageRoute site_path="/bookmarks" path="/bookmarks" component={BookmarksTable} />
        <PageRoute site_path="/profile" path="/profile/:email" component={ProfileContainer} />
        <PageRoute site_path="/yourprojects" path="/yourprojects" component={UserProjects} />
        <PageRoute site_path="/queries" path="/queries" component={SavedQueries} />
        <Route path="/register" component={SignUp} />
        <Route exact path="/" component={SignIn} />
     </div>
    </BrowserRouter>
  </MuiThemeProvider>
, document.getElementById('root'));
registerServiceWorker();
