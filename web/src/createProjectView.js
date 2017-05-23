import React from 'react';
import ReactDOM from 'react-dom';
import UploadByPattern from './createProjectByPattern.js';


export default class UploadByLink extends React.Component {
  render() {
    return (
      <div className="content">
        <div className="header">Create Project from Manifest</div>
        <input className="enterUrl" id="url" type="text" placeholder="enter url here (e.g. “http://soundloud.com/stuff/manifest.json”)" ></input>
        <div className="text">Or</div>
        <button className="submit" onClick={() => changeView(<UploadByPattern />) }>Create New Project Page</button>
      </div>


    );
  }
}

function changeView(element){
  ReactDOM.render(
    //<UploadByLink />,
    element,
    document.getElementById('root')
  );
}
