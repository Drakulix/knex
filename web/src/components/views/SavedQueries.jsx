import React, { Component } from 'react';
import SavedQuery from "../common/SavedQuery"
import Backend from '../common/Backend'
import Snackbar from 'material-ui/Snackbar'
import CircularProgress from 'material-ui/CircularProgress'


class Headline extends Component {
  render() {
    return(
      <div className="headerCreation" id="headerSearch" style={{width:"100%"}}>
        Your Saved Queries
      </div>
    )
  }
}

export default class SavedQueries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queries : [],
      snackbar : false,
      snackbarText : "",
      loading : false
    }
    this.snackbarHandler = this.snackbarHandler.bind(this)
  }

  snackbarHandler(text){
    this.setState({
      snackbar : false,
      snackbarText : text
    })
  }


  componentWillMount(){
    this.setState({
      loading : true,
    })
    Backend.getSavedSearches().then(
      function (queries)  {
        this.setState({
          queries : queries,
          loading : false
        })
      }.bind(this)
    )
  }

  render() {
    return(
      <div>
        <div className = "container" style = {{display : (this.state.loading ? "block" : "none")}}>
          <div className = "header"><CircularProgress size = {80} thickness = {5} /></div>
        </div>
        <div className="container" style = {{display : (!this.state.loading ? "block" : "none")}}>
        <Snackbar
          open = {this.state.snackbar}
          message = {this.state.snackbarText}
          autoHideDuration = {10000}/>
        <div className="innerContainer">
          <Headline />
          <div>
            {
              this.state.queries.map(item =>
                <div key = {item.id}>
                  <SavedQuery savedSearch={item}
                              snackbarHandler = {this.snackbarHandler}
                  />
                <hr></hr>
                </div>
              )
            }
          </div>
        </div>
      </div>
      </div>
    )
  }
}
