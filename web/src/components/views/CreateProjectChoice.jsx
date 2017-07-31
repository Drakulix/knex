import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import 'isomorphic-fetch'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import styles from '../common/Styles.jsx'
import Snackbar from 'material-ui/Snackbar'
import MultiFileUploader from '../common/MultiFileUploader'

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
    }
    this.submitForm = this.submitForm.bind(this)
    this.handleFile = this.handleFile.bind(this)
  }

  handleFile(event){
    var file = event.target.files[0]
    let reader = new FileReader();
    switch (file.name.substring(file.name.lastIndexOf(".")+1)){
      case "json":
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
      case "json5":
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
      default:
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
        method:'GET',
        mode: 'cors',
        header:{
        'Access-Control-Allow-Origin':'*'
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
      return <Redirect to = {'/createByURL/'+encodeURIComponent(this.state.sourceURL)}/>
    }
    if(this.state.uploaded){
      var data = encodeURIComponent(JSON5.stringify(this.state.data));
      return(<Redirect to = {
        '/createFromFile/'+data
      }/>);
    }
    return (
      <div className = "container"style = {{textAlign : 'center'}} >
        <Snackbar
          open = {this.state.snackbar}
          message = {this.state.snackbarText}
          autoHideDuration = {10000}
          />
        <MultiFileUploader open = {this.state.multiFileUploader}
          handleClose = {() => this.setState({multiFileUploader : false})}
          confirmAction = {() => this.setState({multiFileUploader : false})}
        />
        <div className = "headerCreation">Create a new project</div>
          <form onSubmit = {this.submitForm}>
            <div>
              <TextField
                  name = "title"
                  hintText = "enter url here (e.g. “http://soundloud.com/stuff/manifest.json”)"
                  style = {{width:'460px',}}
                  onChange = {event => this.setState({sourceURL : event.target.value})}
                  value = {this.state.sourceURL}/>
            </div>
            <div >
              <RaisedButton style = {{width:'300px'}}
                          icon = {<i className = "material-icons" style = {{color: "#ffffff", marginTop:-3}}>cloud_download</i>}
                          label = "import online json"
                          primary = {true}
                          type = "submit"/>
            </div>
          </form>
        <div className = "text" >or</div>
        <div>
          <RaisedButton
                    label = "Upload local json"
                    icon = {<i className = "material-icons" style = {{color: "#ffffff", marginTop:-3}}>file_upload</i>}
                    containerElement = "label"
                    primary = {true}
                    style = {{width:'300px'}}>
                  <input type = "file" style = {styles.uploadInput} onChange = {this.handleFile} />
          </RaisedButton>
        </div>
        <div className = "text" >or</div>
        <div>
          <Link to="/createNew">
            <RaisedButton label = "Use online formular"
                      icon = {<i className = "material-icons" style = {{color: "#ffffff", marginTop:-3}}>keyboard</i>}
                      primary = {true}
                      style = {{ width:'300px'}}/>
          </Link>
        </div>
        <div className = "text" >or</div>
        <div>

            <RaisedButton label = "Upload multiple files"
                      icon = {<i className = "material-icons" style = {{color: "#ffffff", marginTop:-3}}>playlist_add</i>}
                      primary = {true}
                      onClick = {() => this.setState({multiFileUploader : true})}
                      style = {{ width:'300px'}}/>

        </div>
      </div>
    )
  }
}
