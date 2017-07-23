import React, { Component } from 'react';
import SavedQuery from "../common/SavedQuery"
import Backend from '../common/Backend'

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
      queries : []
    }
  }


  componentWillMount(){
    Backend.getSavedSearches().then(
      function (queries)  {
        this.setState({
          queries : queries
        })
      }.bind(this)
    )
  }

  render() {
    return(
      <div className="container">
        <div className="innerContainer">
          <Headline />
          <div>
            {
              this.state.queries.map(item =>
                <div key = {item.id}><SavedQuery savedSearch={item}></SavedQuery>
                <hr></hr>
                </div>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}
