import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Redirect } from 'react-router';
import registerServiceWorker from './registerServiceWorker';
import './style/style.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


import {
  BrowserRouter,
  Route,

} from 'react-router-dom'


import history from './components/common/history'
import { init } from './components/common/Backend'

import SignIn from './components/pages/SignIn.jsx'
import SignUp from './components/pages/SignUp.jsx'

import AdminOverview from './components/views/AdminOverview'
import CreateProject from './components/views/CreateProject'
import CreateProjectByURL from './components/views/CreateProjectByURL'
import CreateProjectFromFile from './components/views/CreateProjectFromFile'
import CreateProjectChoice from './components/views/CreateProjectChoice.jsx'
import ProfileContainer from './components/views/ProfileContainer.jsx'
import ProjectContainer from './components/views/ProjectContainer'
import SearchPage from './components/views/SearchPage'
import BookmarksTable from './components/views/BookmarksTable'
import UserProjects from './components/views/UserProjects.jsx'
import SavedQueries from './components/views/SavedQueries.jsx'

import TopBar from './components/common/TopBar'
import SideBar from './components/common/SideBar'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import styles from './components/common/Styles.jsx'


var injectTapEventPlugin = require("react-tap-event-plugin")
injectTapEventPlugin()



const muiTheme = getMuiTheme(styles)


const PageRoute = ({ component: Component, path, sitePath, ...rest }) => (
  <Route {...rest} path={path} render={props => {
    return (
      <div className="inner-content">
        <TopBar />
        <div className="row">
          <SideBar location={sitePath} />
          <div className="col-9 content">
            <Component {...props} />
          </div>
        </div>
      </div>
    );
  }}/>
)

<<<<<<< HEAD
init(() => {
  ReactDOM.render(
    <MuiThemeProvider  muiTheme={muiTheme}>
      <BrowserRouter history={history}>
        <div>
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
          <PageRoute sitePath="/yourprojects" path="/yourprojects" component={UserProjects} />
          <PageRoute sitePath="/queries" path="/queries" component={SavedQueries} />
          <Route path="/register" component={SignUp} />
          <Route exact path="/" component={SignIn} />
          <Route component={() => (<Redirect to="/"/>)} />
       </div>
      </BrowserRouter>
    </MuiThemeProvider>
  , document.getElementById('root'))
  registerServiceWorker()
});
=======
ReactDOM.render(
  <MuiThemeProvider  muiTheme={muiTheme}>
    <BrowserRouter history={history}>
      <div>
        <PageRoute site_path="/discovery" path="/discovery/:query" component={SearchPage} />
        <PageRoute site_path="/discovery" path="/discovery/" component={SearchPage} exact />
        <PageRoute site_path="/admin" path="/admin" component={AdminOverview} />
        <PageRoute site_path="/createNew" exact path="/createNew" component={CreateProject} />
        <PageRoute site_path="/createNew" path="/createByURL/:getURL" component={CreateProjectByURL} />
        <PageRoute site_path="/createNew" path="/createFromFile/:data" component={CreateProjectFromFile} />
        <PageRoute site_path="/update" path="/update/:uuid" component={CreateProject} />
        <PageRoute site_path="/createbylink" path="/createbylink" component={CreateProjectChoice} />
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
, document.getElementById('root'))
registerServiceWorker()
>>>>>>> af1da7a... WIP
