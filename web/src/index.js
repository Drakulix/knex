import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';
import registerServiceWorker from './registerServiceWorker';
import './style/style.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


import {
  BrowserRouter,
  Route,

} from 'react-router-dom'


import history from './components/common/history'

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

const TopBarWithRouter = withRouter(TopBar);
const SideBarWithRouter = withRouter(SideBar);

const PageRoute = ({ component: Component, path, ...rest }) => (
  <Route {...rest} path={path} render={props => {
    const ComponentWithRouter = withRouter(Component);
    return (
      <div className="inner-content">
        <TopBarWithRouter />
        <div className="row">
          <SideBarWithRouter/>
          <div className="col-9 content">
            <ComponentWithRouter {...props} />
          </div>
        </div>
      </div>
    );
  }}/>
)

ReactDOM.render(
  <MuiThemeProvider  muiTheme={muiTheme}>
    <BrowserRouter history={history}>
      <div>
        <PageRoute site_path="/discovery" path="/discovery/:qID" component={SearchPage} />
        <PageRoute site_path="/discovery" path="/discovery/" component={SearchPage} />
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
        <Route path="/register" component={withRouter(SignUp)} />
        <Route exact path="/" component={withRouter(SignIn)} />
     </div>
    </BrowserRouter>
  </MuiThemeProvider>
, document.getElementById('root'))
registerServiceWorker()
