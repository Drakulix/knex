import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import CreateProject from '../pages/CreateProject';


export default class UploadByLink extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="header">Create Project from Manifest</div>
        <input className="enterUrl" id="url" type="text" placeholder="enter url here (e.g. “http://soundloud.com/stuff/manifest.json”)" ></input>
        <div className="text">or</div>
        <Link to="/create">
          <button className="submit">Create New Project Page</button>
        </Link>
      </div>
    );
  }
}
