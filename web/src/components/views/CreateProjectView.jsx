import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import history from '../common/history'
import 'isomorphic-fetch';
import FlatButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';




const styles = {
  uploadButton: {
    verticalAlign: 'middle',
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};


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
        <div className="header">Create Project</div>
        <div>
          <form >
            <div >
              <FlatButton style={{marginLeft: 'auto !important',
                position: 'relative !important',
                width:'300px',
                display  :'block !important'}}
                label="from online json"
                primary={true}
                onSubmit={() => {history.push("/create/"+encodeURIComponent(this.state.sourceURL))}}/>
            </div>
            <div>
              <TextField value={this.state.title}
                ID="url"
                name="title"
                hintText="enter url here (e.g. “http://soundloud.com/stuff/manifest.json”)"
                style={{width:'500px',}}
                onChange={event => this.setState({
                  sourceURL : event.target.value,
                })}
                value={this.state.sourceURL}
                />
            </div>
          </form>
        </div>
        <div className="text">or</div>
        <div>
          <FlatButton
            label="from local json"
            labelPosition="before"
            style={styles.uploadButton}
            containerElement="label"
            primary={true}
            style={{marginLeft: 'auto !important', position: 'relative !important', width:'300px', display  :'block !important'}}>
            <input type="file" style={styles.uploadInput} />
          </FlatButton>
        </div>
        <div className="text">or</div>
        <div>
          <FlatButton label="with online formular"
            href="/create/l"
            primary={true}
            style={{marginLeft: 'auto !important', position: 'relative !important', width:'300px', display  :'block !important'}}
            />
        </div>
      </div>
    );
  }
}
