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
import CreateProject from './components/views/CreateProjectView.jsx';
import ProfileContainer from './components/views/ProfileContainer.jsx';
import ProjectContainer from './components/views/ProjectContainer';
import SearchPage from './components/views/SearchPage';
import UpdateProject from './components/views/UpdateProjectView';
import BookmarksTable from './components/views/BookmarksTable';
import UserProjects from './components/views/UserProjects.jsx';

import TopBar from './components/common/TopBar';
import SideBar from './components/common/SideBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();



const muiTheme = getMuiTheme({
  datePicker: {
    selectColor: '#ff5000',
  },
  flatButton: { primaryTextColor: '#ff5000' },

  palette : {primary1Color : '#ff5000'}
});




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
    <PageRoute path="/create/:getURL" component={CreateProjectByPattern} />
    <PageRoute exact path="/create" component={CreateProject} />
    <PageRoute path="/update" component={UpdateProject} />
    <PageRoute path="/createbylink" component={CreateProject} />
    <PageRoute path="/projects" component={ProjectContainer} />
    <PageRoute path="/bookmarks" component={BookmarksTable} />
    <PageRoute path="/profile" component={ProfileContainer} />
    <Route path="/register" component={SignUp} />
    <Route exact path="/" component={SignIn} />
 </div>
</BrowserRouter></MuiThemeProvider>
, document.getElementById('root'));
registerServiceWorker();
