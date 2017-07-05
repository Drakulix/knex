import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router'
import history from '../common/history'
import 'isomorphic-fetch';


export default class UploadByLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     sourceURL : "",
     redirect : false,
    };
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(e){
      e.preventDefault();
      var request = new Request(this.state.sourceURL,{
        method:'GET',
        mode: 'cors',
        header:{
        'Access-Control-Allow-Origin':'*'
        },
      });
      var that = this;
      fetch(request)
      .then(response => response.json())
      .then(
        function(){
          that.setState({
            redirect : true,
          });
        },
        function(exception){
          alert("Could not read file.\nParser returned:\n"+exception);
        }
      );
  };

  render() {
    if (this.state.redirect){
      return <Redirect to={'/create/'+encodeURIComponent(this.state.sourceURL)}/>;
    }
    return (
      <div className="container">
        <div className="header">Create Project from Manifest</div>
        <form onSubmit={this.submitForm}>
          <input className="enterUrl"
                 id="url"
                 type="text"
                 placeholder="enter url here (e.g. “http://soundloud.com/stuff/manifest.json”)"
                 onChange={event => this.setState({
                   sourceURL : event.target.value,
                 })}
                 value={this.state.sourceURL}></input>
        </form>
        <h1> {this.state.jsonIsValid}</h1>
        <div className="text">or</div>
        <Link to="/create">
          <button className="submit">Create New Project</button>
        </Link>
      </div>
    );
  }
}
