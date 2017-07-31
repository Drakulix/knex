import React, { Component } from 'react';
import SavedQuery from "../common/SavedQuery"
import Backend from '../common/Backend'
import Snackbar from 'material-ui/Snackbar'
import Spinner from '../common/Spinner'


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
      snackbar : true,
      snackbarText : text
    })
    this.loadQueries()
  }


  componentWillMount(){
    this.loadQueries()
  }

  loadQueries(){
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
      <div className="container">
        <Spinner loading = {this.state.loading} text = {"Loading queries"}/>
        <div  style = {{display : (!this.state.loading ? "block" : "none")}}>
          <Snackbar
            open = {this.state.snackbar}
            message = {this.state.snackbarText}
            autoHideDuration = {10000}/>
          <div className="headerCreation" style={{width:"100%"}}>Your Saved Queries</div>
          <div>
            {this.state.queries.map(item =>
              <div key = {item.id}>
                <SavedQuery savedSearch={item}
                            snackbarHandler = {this.snackbarHandler}
                />
                <hr></hr>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
