import React, { Component } from 'react';
import SavedQuery from "../common/SavedQuery"
import Backend from '../common/Backend'
import Snackbar from 'material-ui/Snackbar'
import Spinner from '../common/Spinner'
import RaisedButton from 'material-ui/RaisedButton'
import Filters from '../common/Filters'


export default class SavedQueries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queries : [],
      filteredQueries : [],
      snackbar : false,
      snackbarText : "",
      loading : true,
      userNames : {},
      filters : {}
    }
    this.snackbarHandler = this.snackbarHandler.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  snackbarHandler(text){
    this.loadQueries()
    .then(() => {
      this.setState({
        snackbar : true,
        snackbarText : text
      })
    })
  }


  componentWillMount(){
    this.loadQueries()
  }

  loadQueries(){
    this.setState({
      loading : true,
    })
    return Backend.getSavedSearches()
    .then((queries) => {
      queries.sort(function (a,b) {return a.query.label.localeCompare(b.query.label)})
      this.setState({
        queries : queries,
        filteredQueries : queries,
        loading : false
      })
      var authors  = []
      for (let query in queries){
        authors = authors.concat(queries[query].query.authors)
      }
      Backend.getUserNames(authors)
      .then ((userNames) => {
        this.setState({
          userNames : JSON.parse(userNames)
        })
      })
    })
  }

  handleFilterChange(key, value){
    var state = this.state.filters
    if(value === undefined || value === ""  || value.length === 0){
      delete state[key]
    }
    else  {
      state[key] = value
    }
    this.setState({filters : state,
      filteredQueries : this.filter(this.state.queries, state)
    })
  }

  filter(data, filters){
    var array = []
    for(let dataObject of data){
      var query = dataObject.query
      var discard = false
      for(let key of Object.keys(filters)){
        if(query[key] === undefined){
          discard = true
          break
        }
        var value = filters[key]
        if(key === "tags" || key === "authors"){
          var temp = query[key].join().toLowerCase()
          for(let item in value){
            if (temp.indexOf(value[item]) === -1){
              discard = true
              break
            }
          }
        }
        else{
          switch (key){
            case "date_to":
              discard = query.date_creation  > value
              break
            case "date_from":
              discard = query.date_creation  < value
              break
            default:
              discard = query[key].toLowerCase().indexOf(value.toLowerCase()) === -1
              break
          }
        }
        if(discard){
          break
        }
      }
      if(!discard){
        array.push(dataObject)
      }
    }
    return array
  }


  render() {
    return(
      <div className="container">
        <Spinner loading = {this.state.loading} text = {"Loading queries"}/>
        <div  style = {{display : (!this.state.loading ? "block" : "none")}}>
          <Snackbar
            open = {this.state.snackbar}
            message = {this.state.snackbarText}
            autoHideDuration = {10000}/>
          <div className = "headerCreation" style = {{width : "100%"}}>Your Saved Queries</div>
          <Filters  value = {this.state.filters}
                    title = {"Filter your queries by search fields"}
                    onChange = {this.handleFilterChange}/>
                  <div style = {{marginTop : 20, paddingLeft : 20, paddingRight : 20}}>
            {(this.state.queries.length === 0) ?
              <div style = {{textAlign : "center", fontSize : 24}} >
                <div>You don't have a saved query</div>
                <RaisedButton
                  style = {{marginTop : 35}}
                  label = {"Do you want to create one?"}
                  primary = {true}
                  href = "/discovery"
                />
              </div>
              : ""
            }
            {this.state.filteredQueries.map(item =>
              <SavedQuery key = {item.id}
                            savedSearch = {item}
                            userNames = {this.state.userNames}
                            snackbarHandler = {this.snackbarHandler}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}
