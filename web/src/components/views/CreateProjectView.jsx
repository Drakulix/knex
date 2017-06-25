import React from 'react';
import { Link } from 'react-router-dom';
import history from '../common/history'
import 'isomorphic-fetch';


export default class UploadByLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     sourceURL : "",
    };
  }

  render() {
    return (
      <div className="container">
        <div className="header">Create Project from Manifest</div>
        <form onSubmit={() => {history.push("/create/"+encodeURIComponent(this.state.sourceURL))}}>
          <input className="enterUrl"
                 id="url"
                 type="text"
                 placeholder="enter url here (e.g. “http://soundloud.com/stuff/manifest.json”)"
                 onChange={event => this.setState({
                    sourceURL : event.target.value,
                 })}
                 value={this.state.sourceURL}></input>
        </form>
        <div className="text">or</div>
        <Link to="/create">
          <button className="submit">Create New Project Page</button>
        </Link>
      </div>
    );
  }
}
