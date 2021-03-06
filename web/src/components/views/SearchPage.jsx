import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import AutoComplete from 'material-ui/AutoComplete'
import RaisedButton from 'material-ui/RaisedButton'
import DataTable from '../common/DataTable'
import Dialog from 'material-ui/Dialog'
import Backend from '../common/Backend'
import Snackbar from 'material-ui/Snackbar'
import Styles from '../common/Styles.jsx'
import Save from 'material-ui/svg-icons/content/save'
import HeadLine from '../common/HeadLine'


export default class SearchPage extends Component {
  constructor(props) {
    super(props)

    var query = this.props.match.params.query !== undefined ? JSON.parse(this.props.match.params.query) : {}
    query["archived"] = "false"
    this.state = {
        label : "",
        searchString : query.searchString === undefined ? "" : query.searchString,
        query : query,
        open : false,
        snackbar : false,
        snackbarText : "",
        loading : false,
        projects : [],
        suggestions : []
    }

    delete query.label
    delete query.searchString

    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.saveSearch = this.saveSearch.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleLabelChange = this.handleLabelChange.bind(this)
    this.handler = this.handler.bind(this)

  }

  componentDidMount(){
    this.handler(this.state.query)

  }

  handler(query){
    this.setState({loading : true})
    return Backend.search(query)
              .then ((data) => {this.setState({projects : data, loading : false}); return data;})
  }

  handleChange(searchText) {
    const value = searchText
    var query = JSON.parse(JSON.stringify(this.state.query))
    query['searchString'] = value

    this.setState({
      query : query,
      searchString : value
    })

    Backend.getProjectNgrams(value)
    .then((data) => {this.setState({suggestions : data})})
    this.handler(query)
  }

  handleFilterChange(key, value){
    var query = JSON.parse(JSON.stringify(this.state.query))
    if(value === undefined || value === "" || value.length === 0 ){
      delete query[key]
    } else {
      query[key] = value
    }
    this.setState({query : query})
  }

  saveSearch(){
    var toSaveQuery = JSON.parse(JSON.stringify(this.state.query))
    toSaveQuery["label"] = this.state.label
    Backend.saveSearch(toSaveQuery).then( function () {
      this.setState({open : false,
        snackbar : true,
        snackbarText : "Query saved",
        label : ""
      })}.bind(this)
    )
  }

  handleClose = () => {
    this.setState({
      open : false,
      snackbar : false,
    })
  }

  handleOpen = () => {
    this.setState({
      open : true,
      snackbar : false,
    })
  }

  handleLabelChange(event){
    event.preventDefault()
    const value = event.target.value
    this.setState({label : value})
  }

  render() {
    const actions = [
      <RaisedButton
        label = "Cancel"
        primary = {true}
        onTouchTap = {this.handleClose}
        />,
      <RaisedButton
        label = "Save"
        primary = {true}
        onTouchTap = {this.saveSearch}
        style = {{marginLeft : 20}}
        disabled= {(this.state.label === ""  || this.state.label === undefined) ? true : false}
        />,
    ]
    return(
      <div className = "container">
        <div className = "innerContainer">
          <Snackbar
            open = {this.state.snackbar}
            message = {this.state.snackbarText}
            autoHideDuration = {10000}/>
          <Dialog
            title = "Enter a label for your query"
            actions = {actions}
            modal = {false}
            open = {this.state.open}
            onRequestClose = {this.saveSearch}
            >
            <TextField value = {this.state.label}
              placeholder = "Enter label here ... "
              style = {{marginBottom : (this.state.label === "" || this.state.label === undefined) ? 0 : 17} }
              errorText = {(this.state.label === "" || this.state.label === undefined) ? "Please provide a label " : ""}
              onChange = {this.handleLabelChange}
              ></TextField>
            </Dialog>
          <HeadLine title = {"  Looking for a project?"}/>
          <div className = "row" style = {{textAlign : "center"}}>
            <div className = "col-10">
              <AutoComplete
                name = "searchString"
                fullWidth = {true}
                searchText = {this.state.searchString}
                dataSource = {this.state.suggestions}
                filter = {AutoComplete.fuzzyFilter}
                maxSearchResults = {10}
                placeholder = "Enter your query here..."
                onUpdateInput = {this.handleChange} />
            </div>
            <div className = "col-2">
              <RaisedButton style = {{width : "100%"}}
                label = {<span className = "hidden-md-down">Save search</span>}
                icon = {<Save style = {{color : Styles.palette.alternateTextColor, marginTop : -3}}/>}
                onClick = {this.handleOpen}
                primary = {true}/>
            </div>
          </div>
          <div style = {{marginTop : 20}}>
            <DataTable columns= {['title', 'status', 'tags', 'authors', 'description', '_id', 'date_creation' ,'bookmarked']}
              handleFilter= {this.handleFilterChange}
              predefinedFilter = {this.state.query}
              handler = {this.handler}
              data = {this.state.projects}
              loading = {this.state.loading}
              ></DataTable>
          </div>
        </div>
      </div>
    )
  }
}
