import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import history from '../common/history'
import 'isomorphic-fetch';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import styles from '../common/Styles.jsx';



export default class UploadByLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     sourceURL : "",
    };
  }


  render() {
    return (
      <div className="container"style={{textAlign : 'center'}} >
        <div className="header">Create Project</div>
          <form>

            <div>
              <TextField value={this.state.title}
                  ID="url"
                  name="title"
                  hintText="enter url here (e.g. “http://soundloud.com/stuff/manifest.json”)"
                  style={{width:'430px',}}
                  onChange={event => this.setState({
                            sourceURL : event.target.value,
                           })}
                            value={this.state.sourceURL}
                           />
            </div>
            <div >
              <RaisedButton style={{width:'300px'}}
                          label="from online json"
                          primary={true}
                          onSubmit={() => {history.push("/create/"+encodeURIComponent(this.state.sourceURL))}}/>
            </div>
          </form>
        <div className="text" >or</div>
        <div>
          <RaisedButton
                    label="from local json"
                    labelPosition="before"
                    style={styles.uploadButton}
                    containerElement="label"
                    primary={true}
                    style={{width:'300px'}}>
                  <input type="file" style={styles.uploadInput} />
          </RaisedButton>
        </div>
        <div className="text" >or</div>
        <div>
          <RaisedButton label="with online formular"
                      href="/create/l"
                      primary={true}
                      style={{ width:'300px'}}
                        />
        </div>
      </div>
    );
  }
}
