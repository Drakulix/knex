import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import CreateProjectLink from '../pages/CreateProjectLink.jsx';


export default class UploadByPattern extends React.Component {
  render(){
    return(
      <div className="container">
        <div className="innerContainer">
          <div className="headerCreation">Create New Project</div>
          <h3 className="caption">Project Name</h3>
          <input className="enterValue" type="text"  ></input>
          <h3 className="caption">Author Name</h3>
          <input className="enterValue" type="text"  ></input>
          <h3 className="caption">Team</h3>
          <select className="dropdown" name="Select Team" size="1">
            <option></option>
            <option></option>
            <option></option>
            <option></option>
            <option></option>
          </select>
          <h3 className="caption">Status</h3>
          <select className="dropdown " name="Select Team" size="1">
            <option>finished</option>
            <option>pending</option>
            <option>reviewed</option>
          </select>
          <h3 className="caption">Description</h3>
          <textarea className="enterDescription" type="text"  ></textarea>
          <h3 className="caption">Tags</h3>
          <input className="tags" type="text">
            {//To be filled
            }
          </input>
          <div className="buttons">
            <button className="saveButton" >Save</button>
              <Link to="/createbylink">
                <button className="cancelButton">Cancel</button>
              </Link>
          </div>
        </div>
      </div>
  )
  }
}
