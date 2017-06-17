import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import {fetchProjectDetails, fetchJson,updateProjectDetails} from '../common/Backend'
import UpdateProject from '../pages/UpdateProject.jsx';
import Form from "../libraries/react-jsonschema-form";
import { Redirect } from 'react-router-dom';
import 'isomorphic-fetch';


export default class UpdateProjectView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      projectInf: [],
      myid: window.location.href.substring(29,65),
      authors_string: null,
      tag_string: null,
      check: null
    };
      this.handleSaveButton = this.handleSaveButton.bind(this);
      this.handleChangeTitle = this.handleChangeTitle.bind(this);
      this.handleChangeDescription = this.handleChangeDescription.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.loadProjectInf(nextProps)
  }

  componentDidMount(){
    this.loadProjectInf(this.props);
  }
  handleSaveButton(){
    updateProjectDetails("PUT",this.state.projectInf,this.state.myid);
  }
  handleChangeTitle(event) {

    this.state.projectInf.title=event.target.value;
    this.forceUpdate();
    console.log(this.state.projectInf.title);

  }
  handleChangeDescription(event) {
    this.state.projectInf.description=event.target.value;
    this.forceUpdate();

  }
  loadProjectInf(props) {

    fetchProjectDetails(this.state.myid).then(data => {
      console.log(data);

      this.setState({projectInf: data})
    });
    if ( this.state.projectInf.authors!= null){
      var author_container = [];
      for (var i = 0; i < this.state.projectInf.authors.length; i++){
        author_container.push(this.state.projectInf.autors[i].name);
      }
      this.state.authors_string = author_container.join(", ")
    } else {
      this.state.authors_string = ''
    }
    console.log("authors: " +this.state.authors_string);

    if ( this.state.projectInf.tags != null){
      var tag_container = []
      for (var i = 0; i < this.state.projectInf.tags.length; i++){
        tag_container.push(this.state.projectInf.tags[i])
      }
      this.state.tag_string = tag_container.join(", ")
    } else {
      this.state.tag_string = ''
    }
  }

  render(){

    return(
      <div className="container">
        <div className="innerContainer">
          <div className="headerCreation">Update projects</div>
          <h3 className="caption">Project Name</h3>
            <input className="enterValue" type="text" value={this.state.projectInf.title} onChange={this.handleChangeTitle} ></input>
          <h3 className="caption">Author Name</h3>
          <input className="enterValue" type="text" value={this.state.author_string}></input>
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
          <textarea className="enterDescription" type="text" value= {this.state.projectInf.description} onChange={this.handleChangeDescription} ></textarea>
          <h3 className="caption">Tags</h3>
          <input className="tags" type="text" value={this.state.tag_string} />


          <div className="buttons">
            <button className="saveButton" onClick={this.handleSaveButton}>Update</button>

            <button className="cancelButton">Cancel</button>

          </div>
        </div>
      </div>
    )
  }
}
