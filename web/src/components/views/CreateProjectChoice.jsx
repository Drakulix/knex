import 'isomorphic-fetch'
import React, { Component } from 'react'
import Dialog from 'material-ui/Dialog'
import { Redirect } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import TextField from 'material-ui/TextField'
import MultiFileUploader from '../common/MultiFileUploader'
import Styles from '../common/Styles.jsx'
import HeadLine from '../common/HeadLine'


import Keyboard from 'material-ui/svg-icons/hardware/keyboard'
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import CloudUpload from 'material-ui/svg-icons/file/cloud-upload'
import MultiUpload from 'material-ui/svg-icons/av/playlist-add'


const JSON5 = require('json5')

export default class CreateProjectChoice extends Component {
  constructor(props) {
    super(props)
    this.state = {
     sourceURL : "",
     redirect : false,
     snackbar : false,
     snackbarText : "",
     data : null,
     uploaded : false,
     multiFileUploader : false,
     urlDialog : false
    }
    this.submitForm = this.submitForm.bind(this)
    this.handleFile = this.handleFile.bind(this)
  }

  handleFile(event){
    var file = event.target.files[0]
    let reader = new FileReader();
    switch (file.name.substring(file.name.lastIndexOf(".") + 1)){
      case "json" :
        reader.onload = () => {
        try {
              var json = JSON.parse(reader.result);
              this.setState({
                snackbar : true,
                snackbarText : "File uploaded",
                data : json,
                uploaded : true,
              })
           } catch(e) {
             this.setState({
               snackbar : true,
               snackbarText : "File is not a valid JSON file"
             })
           }
         }
        reader.readAsText(file);
        break
      case "json5" :
        reader.onload = () => {
        try {
              var json5 = JSON5.parse(reader.result);
              this.setState({
                snackbar : true,
                snackbarText : "File uploaded",
                data : json5,
                uploaded : true,
              })
           } catch(e) {
             this.setState({
               snackbar : true,
               snackbarText : "File is not a valid JSON5 file"
             })
           }
         }
         reader.readAsText(file);
        break
      default :
        this.setState({
          snackbar : true,
          snackbarText : "File is not a JSON file"
        })
        break
    }
  }



  submitForm(e){
      e.preventDefault()
      var request = new Request(this.state.sourceURL,{
        method : 'GET',
        mode : 'cors',
        header : {
        'Access-Control-Allow-Origin' : '*'
        },
      })
      var that = this
      fetch(request)
      .then(
        function(response){
          if(response.ok){
            response.text().then(
              function(text){
                try{
                  JSON5.parse(text)
                  that.setState({
                    redirect : true,
                  })
                } catch (error) {
                  that.setState({
                    snackbar : true,
                    snackbarText : error,
                  });
                }
              }
            )
          } else {
            that.setState({
              snackbar : true,
              snackbarText : "Connection Error.\n Unable to find anything at the given URL",
            });
          }
        }
      )
  }

  render() {
    if (this.state.redirect){
      return <Redirect to = {`/createByURL/${encodeURIComponent(this.state.sourceURL)}`}/>
    }
    if(this.state.uploaded){
      var data = encodeURIComponent(JSON5.stringify(this.state.data));
      return(<Redirect to = {`/createFromFile/${data}`
      }/>);
    }
    const actions = [
      <RaisedButton
        label = "Cancel"
        primary = {true}
        onClick = {() => this.setState({urlDialog : false})}
        />,
      <RaisedButton
        label = "Import File"
        primary = {true}
        onClick = {this.submitForm}
        style = {{marginLeft : 20}}
        />,
    ]
    return (
      <div className = "container" style = {{textAlign : 'center'}} >
        <Snackbar
          open = {this.state.snackbar}
          message = {this.state.snackbarText}
          autoHideDuration = {10000}
          />
        <Dialog
          title = {"Enter the projects URL"}
          actions = {actions}
          modal = {false}
          open = {this.state.urlDialog}
          >
          <TextField
              name = "title"
              hintText = "enter url here (e.g. “http://soundloud.com/stuff/manifest.json”)"
              fullWidth = {true}
              onChange = {event => this.setState({sourceURL : event.target.value})}
              value = {this.state.sourceURL}/>
        </Dialog>
        <MultiFileUploader open = {this.state.multiFileUploader}
          handleClose = {() => this.setState({multiFileUploader : false})}
          confirmAction = {() => this.setState({multiFileUploader : false})}
        />
        <HeadLine title = {"Create a new project"}/>
        <div className = "row">
          <div className ="col-4"></div>
          <div className ="col-2">
            <RaisedButton
              icon = {<CloudUpload style = {{height : '50%', width : '50%', color : Styles.palette.alternateTextColor, marginTop : -3}}/>}
              primary = {true}
              style = {{ width : 120, height : 120}}
              onClick = {() => this.setState({urlDialog : true})}/>
            <div className = "text hidden-md-down">Import online Json</div>
          </div>
          <div className ="col-2">
            <RaisedButton
              icon = {<FileUpload style = {{height : '50%', width : '50%', color : Styles.palette.alternateTextColor, marginTop : -3}}/>}
              containerElement = "label"
              primary = {true}
              style = {{ width : 120, height : 120}}>
              <input type = "file" style = {Styles.uploadInput} onChange = {this.handleFile} />
            </RaisedButton>
            <div className = "text hidden-md-down">Upload local Json</div>
          </div>
        </div>
        <div className = "row" style = {{marginTop : 60}}>
          <div className ="col-4"></div>
          <div className = "col-2">
              <RaisedButton
                icon = {<MultiUpload style = {{marginLeft : '15%', height : '50%', width :'50%', color : Styles.palette.alternateTextColor, marginTop : -3}}/>}
                primary = {true}
                onClick = {() => this.setState({multiFileUploader : true})}
                style = {{ width : 120, height : 120, marginRight: 10}}/>
              <div className = "text hidden-md-down">Upload multiple files</div>
          </div>
          <div className = "col-2">
            <RaisedButton
                icon = {<Keyboard style = {{height : '50%', width : '50%', color : Styles.palette.alternateTextColor, marginTop : -3}}/>}
                primary = {true}
                href = "/createNew"
                style = {{ width : 120, height : 120}}/>
            <div className = "text hidden-md-down">Use online formular</div>
          </div>
        </div>
      </div>
    )
  }
}
