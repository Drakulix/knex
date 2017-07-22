import React, { Component } from 'react';
import SavedQuery from "../common/SavedQuery"


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
      queries:{}
    }
  }


  componentWillMount(){

//TODO LOAD


    var queries =  [
      {
        authors : [{email:"admin@knex.com", name :"Max Mustermann"}]

                    ,
        title : "Testd",
        tags : ["DDSA"],
        status : "DONE",
        date_from :"2009-12-07",
        date_to:"2015-05-06",
        description : "ttt",
        label : "TEST",
        _id :"FDAF", //REMOVE
        userID:"av" //REMOVE
      },
      {
        label : "Empty",
<<<<<<< HEAD
        searchString : "D",
=======
>>>>>>> af1da7a... WIP
        _id :"Empty", //REMOVE
        userID:"av" //REMOVE
      },
      {
      label : "TEST",
      tags : ["aa"],
      title : "a",
<<<<<<< HEAD
      authors : [{email:"admin@knex.com", name :"Max Mustermann"}],
=======
      authors : [{email:"admin@knex.com", name :"Max Mustermanno"}],
>>>>>>> af1da7a... WIP
      description :"a",
      status : "DONE",
      date_to : "2014-06-12",
      _id :"FDfAFs", //REMOVE
      userID:"av" //REMOVE
    },
      {
      authors : [{email:"marko@knex", name :"Marko"},
                    {email:"marko@knex", name :"Marko"}
                  ],
      title : "Test",
      tags : ["DDSA"],
      status : "DONE",
      date_from :"2009-12-07",
      date_to:"2015-05-06",
      description : "ttt",
      searchString : "RE",
      label : "TEST",
      _id :"FDAFs", //REMOVE
      userID:"av" //REMOVE
    }];

    this.setState({
    queries : queries
    })
  }

  render() {
    return(
      <div className="container">
        <div className="innerContainer">
          <Headline />
          <div>
            {
              this.state.queries.map(item =>
                <div key = {item._id}><SavedQuery query={item}></SavedQuery>
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
