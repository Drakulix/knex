import React, { Component } from 'react';
import SavedQuery from "../common/SavedQuery"
import Backend from '../common/Backend'
import Snackbar from 'material-ui/Snackbar'
import Spinner from '../common/Spinner'
import history from '../common/history'
import RaisedButton from 'material-ui/RaisedButton'


export default class SavedQueries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queries : [],
      snackbar : false,
      snackbarText : "",
      loading : false,
      userNames : {}
    }
    this.snackbarHandler = this.snackbarHandler.bind(this)
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
    Backend.getSavedSearches()
    .then((queries) => {
      this.setState({
        queries : queries,
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

  render() {
    return(
      <div className="container">
        <Spinner loading = {this.state.loading} text = {"Loading queries"}/>
        <div  style = {{display : (!this.state.loading ? "block" : "none")}}>
          <Snackbar
            open = {this.state.snackbar}
            message = {this.state.snackbarText}
            autoHideDuration = {10000}/>
          <div className="headerCreation" style={{width:"100%"}}>Your Saved Queries</div>
          <div>
            {(this.state.queries.length === 0) ?
              <div style = {{textAlign : "center", fontSize : 24}} >
                <div>You don't have a saved query</div>
                <RaisedButton
                    style = {{marginTop : 35}}
                   label = {"Do you want to create one?"}
                   primary = {true}
                   onClick = {() => history.push("/discovery")}
                />
              </div>
              : ""
            }
            {this.state.queries.map(item =>
              <div key = {item.id}>
                <SavedQuery savedSearch = {item}
                            userNames = {this.state.userNames}
                            snackbarHandler = {this.snackbarHandler}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
