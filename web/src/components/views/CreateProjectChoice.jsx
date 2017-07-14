import React, { Component } from 'react'
import { Redirect } from 'react-router'
import 'isomorphic-fetch'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import styles from '../common/Styles.jsx'
import Snackbar from 'material-ui/Snackbar'

const JSON5 = require('json5')

export default class CreateProjectChoice extends Component {
  constructor(props) {
    super(props)
    this.state = {
     sourceURL : "",
     redirect : false,
     snackbar : false,
     snackbarText : "",
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
                snackbarText : "File uploaded"
              })
           } catch(e) {
             alert(e)
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
                snackbarText : "File uploaded"
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
        reader.onload = () => {
          try {
                JSON.parse(reader.result);
             } catch(e) {
             }
           }
        reader.readAsText(file);
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
                  alert(error)
                }
              }
            )
          } else {
            alert("Connection Error.\n Unable to find anything at the given URL")
          }
        }
      )
  }

  render() {
    if (this.state.redirect){
      return <Redirect to={'/createNew/'+encodeURIComponent(this.state.sourceURL)}/>
    }
    return (
      <div className="container"style={{textAlign : 'center'}} >
        <Snackbar
          open={this.state.snackbar}
          message={this.state.snackbarText}
          autoHideDuration={10000}
          />
        <div className="header">Create Project</div>
          <form onSubmit={this.submitForm}>
            <div>
              <TextField
                  name="title"
                  hintText="enter url here (e.g. “http://soundloud.com/stuff/manifest.json”)"
                  style={{width:'460px',}}
                  onChange={event => this.setState({sourceURL : event.target.value})}
                  value={this.state.sourceURL}/>
            </div>
            <div >
              <RaisedButton style={{width:'300px'}}
                          icon={<i className="material-icons" style={{color: "#ffffff", marginTop:-3}}>cloud_download</i>}
                          label="import online json"
                          primary={true}
                          type="submit"/>
            </div>
          </form>
        <div className="text" >or</div>
        <div>
          <RaisedButton
                    label="Upload local json"
                    icon={<i className="material-icons" style={{color: "#ffffff", marginTop:-3}}>file_upload</i>}
                    containerElement="label"
                    primary={true}
                    style={{width:'300px'}}>
                  <input type="file" style={styles.uploadInput} onChange={this.handleFile}/>
          </RaisedButton>
        </div>
        <div className="text" >or</div>
        <div>
          <RaisedButton label="Use online formular"
                      icon={<i className="material-icons" style={{color: "#ffffff", marginTop:-3}}>keyboard</i>}
                      href="/createNew/"
                      primary={true}
                      style={{ width:'300px'}}/>
        </div>
      </div>
    )
  }
