import React from 'react'
import Moment from 'moment'
import Snackbar from 'material-ui/Snackbar'
import CreateProject from './CreateProject'



const JSON5 = require('json5')

export default class CreateProjectByURL extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      done : false,
      snackbar: false,
      snackbarText: ''
    }
  }

  componentWillMount(){
  //Load form data from JSON file
  if(this.props.match.params.getURL !== undefined){
    var URL = encodeURI(decodeURIComponent(this.props.match.params.getURL))
    var request = new Request(URL,{
      method : 'GET',
      mode : 'cors',
      header : {
      'Access-Control-Allow-Origin':'*'
      },
    })
    fetch(request)
    .then(
      function(response){
        if(response.ok) {
          response.text().then(
            function(text){
              try {
                var data = JSON5.parse(text)
                this.setState({
                  date : data.date_creation != null ? Moment(data.date_creation, "YYYY-MM-DD").toDate() : null,
                  projectInf : {
                    title : data.title != null ? data.title : "",
                    description : data.description != null ? data.description : "",
                    authors : data.authors != null ? data.authors : [],
                    date_creation : data.date_creation != null ? data.date_creation : "",
                    status : data.status != null ? data.status : "",
                    tags : data.tags != null ? data.tags : [],
                    url : data.url != null ? data.url : []
                  }
                })
              } catch (error) {
                this.setState ({snackbarText: error, snackbar:true})
              }
            }
          )
        } else {
          this.setState ({snackbarText: "Connection Error.\n Unable to find anything at the given URL", snackbar:true})
        }
      },
      function(exception){
        this.setState ({snackbarText: `Connection Error : \n${exception}`, snackbar:true})
      }
    )
  }
}

  render() {
    if(this.state.done){
      return(
        <div>
          <Snackbar open = {this.state.snackbar}
                    message = {this.state.snackbarText}
                    autoHideDuration = {10000}/>
          <CreateProject
              projectInf = {this.state.projectInf}
              date = {this.state.date}
              fromURL = {true}
          />
        </div>
      )
    } else {
      return(<div/>)
    }
  }
}
