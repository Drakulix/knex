import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import DataTable from '../common/DataTable'
import Dialog from 'material-ui/Dialog'
import Backend from '../common/Backend'
import Snackbar from 'material-ui/Snackbar'


class Headline extends Component {
  render() {
    return(
      <div className="headerCreation" id="headerSearch" style={{width:"100%"}}>
        Looking for a project?
      </div>
    )
  }
}


export default class SearchPage extends Component {
  constructor(props) {
    super(props)

    var query  = this.props.match.params.query !== undefined ? JSON.parse(this.props.match.params.query) : {}

    this.state = {
        searchString : "",
        label : "",
        query : query,
        fetchURL : "/api/projects",
        open : false,
        snackbar : false,
        snackbarText : "",
      }


      this.handleFilterChange = this.handleFilterChange.bind(this)
      this.saveSearch = this.saveSearch.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleOpen = this.handleOpen.bind(this)
      this.handleLabelChange = this.handleLabelChange.bind(this)
    }


  componentWillMount(){
    if (this.props.match.params.qID !== undefined){
        //FETCH QUERY FROM DB with ID QID
      var query = {}
      this.setState({query: query})
    }
  }

  handleChange(event) {
    const value = event.target.value

    this.setState({searchString : value})


    if(value === ""){
      this.setState({fetchURL : "/api/projects"})
    }
    else{
      this.setState({fetchURL : "/api/projects"})
  //    this.setState({fetchURL : end+"simple/?q=" + vquery["searchString"] + "*"})
    }
  }

  handleFilterChange(key, value){
    var query = this.state.query
    if(value === undefined){
      delete query[key]
    } else {
      query[key] = value
    }
    this.setState({query : query})
  }

  saveSearch(){
    var temp = []
    var xquery = this.state.query
    xquery.searchString = this.state.searchString
    xquery.label = this.state.label
    var authors = this.state.query["authors"]
    for (var i in authors) {
      var string = authors[i]
      var name = string.substring(0, string.lastIndexOf("(")-1)
      var id = string.substring(string.lastIndexOf("(")+1, string.length-1)
      temp.push({"name" : name, "email" :id})
    }
    var query = this.state.query
    query["authors"] = temp

    Backend.searchAdvanced(this.state.query).then( function () {
      this.setState({open: false,
        snackbar : true,
        snackbarText : "Query saved"
      })
      alert(this.state.query.authors)}.bind(this)
    )
  }

  handleClose = () => {
    this.setState({
      open: false,
      snackbar : false
    })
  }

  handleOpen = () => {
    this.setState({
      open: true,
      snackbar : false
    })
  }

  handleLabelChange(event){
    const value = event.target.value
    this.setState({label : value})
  }

  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
        />,
      <RaisedButton
        label="Save"
        primary={true}
        onTouchTap={this.saveSearch}
        style={{marginLeft:20}}
        disabled= {(this.state.label === ""  || this.state.label === undefined) ? true : false}
        />,
    ]

    return(
      <div className="container">
        <div className="innerContainer">
          <Snackbar
            open = {this.state.snackbar}
            message = {this.state.snackbarText}
            autoHideDuration = {10000}/>
          <Dialog
            title="Enter a label for your query"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.saveSearch}
            >
            <TextField value = {this.state.label}
              placeholder="Enter label here ... "
              errorText={(this.state.label === "" || this.state.label === undefined) ? "Please provide a label " : ""}
              onChange={this.handleLabelChange}
              ></TextField>
            </Dialog>
          <Headline />
          <div className="row" style={{textAlign:"center"}}>
            <div className="col-10">
              <TextField  style={{width:"100%"}}
                name="searchString"
                value = {this.state.searchString}
                placeholder="Enter your query here..."
                onChange={this.handleChange} />
            </div>
            <div className = "col-2">
              <RaisedButton style = {{width:"100%"}}
                label="Save search"
                labelPosition="before"
                icon={<i className="material-icons" style={{color: "#ffffff", marginTop:-3}}>save</i>}
                onClick={this.handleOpen}
                primary={true}/>
            </div>
          </div>
          <div style={{marginTop:20}}>
            <DataTable columns= {['title', 'status', 'tags', 'authors', 'description', '_id', 'date_creation' ,'bookmarked']}
              fetchURL={this.state.fetchURL}
              handleFilter= {this.handleFilterChange}
              predefinedFilter = {this.state.query}
              ></DataTable>
          </div>
        </div>
      </div>
    )
  }
}
