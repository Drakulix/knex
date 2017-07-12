import React, { Component } from 'react';
import { Redirect } from 'react-router'
import 'isomorphic-fetch';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import styles from '../common/Styles.jsx';


const JSON5 = require('json5');

export default class UploadByLink extends Component {
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
      .then(
        function(response){
          if(response.ok){
            response.text().then(
              function(text){
                try{
                  JSON5.parse(text);
                  that.setState({
                    redirect : true,
                  });
                } catch (error) {
                  alert(error);
                }
              }
            );
          } else {
            alert("Connection Error.\n Unable to find anything at the given URL");
          }
        }
      )
  };

  render() {
    if (this.state.redirect){
      return <Redirect to={'/createNew/'+encodeURIComponent(this.state.sourceURL)}/>;
    }
    return (
      <div className="container"style={{textAlign : 'center'}} >
        <div className="header">Create Project</div>
          <form onSubmit={this.submitForm}>
            <div>
              <TextField
                  ID="url"
                  name="title"
                  hintText="enter url here (e.g. “http://soundloud.com/stuff/manifest.json”)"
                  style={{width:'460px',}}
                  onChange={event => this.setState({
                            sourceURL : event.target.value,
                           })}
                  value={this.state.sourceURL}
                           />
            </div>
            <div >
              <RaisedButton style={{width:'300px'}}
                          icon={<i className="fa fa-link" style={{color: "#ffffff"}} aria-hidden="true"></i>}
                          label="Upload online json"
                          primary={true}
                          type="submit"/>
            </div>
          </form>
        <div className="text" >or</div>
        <div>
          <RaisedButton
                    label="Upload local json"
                    icon={<i className="fa fa-upload" style={{color: "#ffffff"}} aria-hidden="true"></i>}
                    containerElement="label"
                    primary={true}
                    style={{width:'300px'}}>
                  <input type="file" style={styles.uploadInput} />
          </RaisedButton>
        </div>
        <div className="text" >or</div>
        <div>
          <RaisedButton label="Use online formular"
                      icon={<i className="fa fa-pencil-square-o" style={{color: "#ffffff"}} aria-hidden="true"></i>}
                      href="/createNew/"
                      primary={true}
                      style={{ width:'300px'}}
                        />
        </div>
      </div>
    );
  }
}
