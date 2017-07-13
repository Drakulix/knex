import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import DataTable from '../common/DataTable'
import Dialog from 'material-ui/Dialog'



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
    this.state = {
      query : {searchString :"",
        shortName : "" },
        fetchURL : "/api/projects",
        open :false
      }
      this.handleFilterChange = this.handleFilterChange.bind(this)
      this.saveSearch = this.saveSearch.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleOpen = this.handleOpen.bind(this)
      this.handleCommentChange = this.handleCommentChange.bind(this)
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
    var vquery = this.state.query
    vquery["searchString"] = value
    var end = "/api/projects/search/"
    if(value === ""){
      this.setState({fetchURL : "/api/projects"})
    }
    else{
      this.setState({query : vquery})
      this.setState({fetchURL : end+"simple/?q=" + vquery["searchString"] + "*"})
    }
  }

  handleFilterChange(key, value){
    var query = this.state.query
    query[key] = value
    this.setState({query : query})
  }

  saveSearch(){
    this.setState({open: false})
    var temp = []
    var authors = this.state.query["authors"]
    for (var i in authors) {
      var string = authors[i]
      var name = string.substring(0, string.lastIndexOf("(")-1)
      var id = string.substring(string.lastIndexOf("(")+1, string.length-1)
      temp.push({"name" : name, "email" :id})
    }
    var query = this.state.query
    query["authors"] = temp
  }

  handleClose = () => {
    this.setState({open: false})
  }

  handleOpen = () => {
    this.setState({open: true})
  }

  handleCommentChange(event){
    const value = event.target.value
    var query = this.state.query
    query["shortName"] = value
    this.setState({query : query})
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
        disabled= {(this.state.query["shortName"] === "" ) ? true : false}
        />,
    ]

    return(
      <div className="container">
        <div className="innerContainer">
          <Dialog
            title="Add a title for your search"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.saveSearch}
            >
            <TextField value = {this.state.query.shortName}
              placeholder="Enter a title here ... "
              errorText={(this.state.query["shortName"] === "") ? "Please provide a title " : ""}
              onChange={this.handleCommentChange}
              ></TextField>
            </Dialog>
          <Headline />
          <div className="row" style={{textAlign:"center"}}>
            <div className="col-10">
              <TextField  style={{width:"100%"}}
                name="searchString"
                value={this.state.query.searchString}
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
