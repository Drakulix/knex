import React, { Component } from 'react'
import Dialog from 'material-ui/Dialog'
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import Styles from '../common/Styles.jsx'
import Spinner from '../common/Spinner'
import Backend from '../common/Backend'
import history from '../common/history'


const JSON5 = require('json5')


export default class MultiFileUploader extends Component {

  constructor(props){
    super(props)
    this.state = {
      loading : false,
      files : [],
      spinnerText : "",
      snackbar : false,
      snackbarText : "File uploaded",

    }
    this.handleFile = this.handleFile.bind(this)
    this.uploadAllFiles = this.uploadAllFiles.bind(this)
  }

  uploadAllFiles(){
    this.setState({loading : true, spinnerText : "Uploading projects"})
    var files = this.state.files.map(file => {return file.project})
    Backend.addProject(files).then(
      history.push("/discovery")
    )
  }

  remove(id){
    var files = this.state.files.filter((c) => c.name !== id)
    this.setState({files : files, snackbar : false})
  }

  componentWillReceiveProps(props){
    if(props.open === false){
      this.setState({snackbar : false})
    }
  }

  handleFile(event){
    this.setState({loading : true})
    var file = event.target.files[0]
    let reader = new FileReader();
    switch (file.name.substring(file.name.lastIndexOf(".")+1)){
      case "json":
        reader.onload = function() {
        try {
              var json = JSON.parse(reader.result);
              var files = this.state.files
              files.push ({name : file.name, project : json})
              this.setState({
                snackbar : true,
                snackbarText : "File uploaded",
                files : files,
                loading : false
              })
           } catch(e) {
             this.setState({
               snackbar : true,
               snackbarText : "File is not a valid JSON file",
               loading : false
             })
           }
         }.bind(this)
        reader.readAsText(file);
        break
      case "json5":
        reader.onload = () => {
        try {
              var json5 = JSON5.parse(reader.result);
              var files = this.state.files
              files.push ({name : file.name, project : json5})
              this.setState({
                snackbar : true,
                snackbarText : "File uploaded",
                files : files,
                loading : false
              })
           } catch(e) {
             this.setState({
               snackbar : true,
               snackbarText : "File is not a valid JSON5 file",
               loading : false
             })
           }
         }
         reader.readAsText(file);
        break
      default:
        this.setState({
          snackbar : true,
          snackbarText : "File is not a JSON file"
        })
        break
    }
  }

  render() {
    const actions = [
      <RaisedButton
        label = "Cancel"
        primary = {true}
        buttonStyle = {{width : 160}}
        onTouchTap = {this.props.handleClose}
        disabled = {this.state.loading}
        />,
      <RaisedButton
        label = "Upload projects"
        primary = {true}
        buttonStyle = {{width : 160, marginLeft : 26, marginRight : 15}}
        onTouchTap = {this.uploadAllFiles}
        disabled = {this.state.loading || this.state.files.length === 0}
        />,
    ]
    return (<div>
      <Snackbar
        open = {this.state.snackbar}
        message = {this.state.snackbarText}
        autoHideDuration = {10000}
      />
      <Dialog
        actions = {actions}
        modal = {false}
        open = {this.props.open}
        onRequestClose = {this.props.handleClose}
        >
        <div className ="row">
          <div className="col-6">
            <h3>Upload multiple projects</h3>
          </div>
          <div className="col-6" style = {{marginLeft: 0}}>
            <RaisedButton
                      label = "add a file"
                      icon = {<i className = "material-icons" style = {{color: Styles.palette.alternateTextColor, marginTop:-3}}>file_upload</i>}
                      containerElement = "label"
                      primary = {true}
                      fullWidth = {true}
                      style = {{display : (this.state.loading) ? "none" : "block"}}>
                    <input type = "file" style = {Styles.uploadInput} onChange = {this.handleFile} />
            </RaisedButton>
          </div>
        </div>
        <Spinner loading = {this.state.loading} text = {"Uploading project"}/>
        <List style = {{display : (this.state.loading) ? "none" : "block"}}>
          {this.state.files.map(item =>
            <div  key = {item.name}>  <ListItem
                rightIcon = {<i className = "material-icons" style = {{color : 'gray'}}>cancel</i>}
                primaryText = {item.project.title}
                secondaryText = {item.name}
                onClick = {() => {this.remove(item.name)}}
              />
            </div>
          )}
        </List>
      </Dialog>
      </div>
    )
  }
}
