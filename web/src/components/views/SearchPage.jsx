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
        label : "",
        searchString : query.searchString === undefined ? "" : query.searchString,
        query : query,
        open : false,
        snackbar : false,
        snackbarText : "",
      }

      delete query.label
      delete query.searchString

      this.handleFilterChange = this.handleFilterChange.bind(this)
      this.saveSearch = this.saveSearch.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleOpen = this.handleOpen.bind(this)
      this.handleLabelChange = this.handleLabelChange.bind(this)
    }

  handleChange(event) {
    const value = event.target.value
    var query = this.state.query
    query['searchString'] = value
    this.setState({
      query : query,
      load : true,
      searchString : value
    })
  }

  handleFilterChange(key, value){
    var query = JSON.parse(JSON.stringify(this.state.query))
    if(value === undefined || value === "" || value.length === 0 ){
      delete query[key]
    } else {
      query[key] = value
    }
    this.setState({query : query, load : true})
  }

  saveSearch(){
    var toSaveQuery = JSON.parse(JSON.stringify(this.state.query))
    toSaveQuery["label"] = this.state.label
    Backend.saveSearch(toSaveQuery).then( function () {
      this.setState({open: false,
        load : false,
        snackbar : true,
        snackbarText : "Query saved",
        label : ""
      })}.bind(this)
    )
  }

  handleClose = () => {
    this.setState({
      open: false,
      snackbar : false,
      load : false,
    })
  }

  handleOpen = () => {
    this.setState({
      open: true,
      snackbar : false,
      load : false,
    })
  }

  handleLabelChange(event){
    event.preventDefault()
    const value = event.target.value
    this.setState({label : value, load:false})
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
              handleFilter= {this.handleFilterChange}
              predefinedFilter = {this.state.query}
              fetchHandler = {Backend.search(this.state.query)}
              remoteFilters = {true}
              load = {this.state.load}
              ></DataTable>
          </div>
        </div>
      </div>
    )
  }
}
