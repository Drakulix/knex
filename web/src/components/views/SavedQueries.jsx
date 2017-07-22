import React, { Component } from 'react';
import SavedQuery from "../common/SavedQuery"
<<<<<<< HEAD
import Backend from '../common/Backend'
=======
import { get } from '../common/Backend'
>>>>>>> f5b8ae9d84b31bb9e00c894f7ccdfb34bda2af22

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
      queries:[]
    }
  }


  componentWillMount(){

    var queries = []
<<<<<<< HEAD
    Backend.getSavedSearches().then(function(data) {

      var datas = []

      if(data !== undefined){
        datas = data
      }
      for(let entry of datas){


        var content = [];
        content["authors"] = entry["meta"]["authors"]

        content["_id"] = entry["id"]
        content["tags"] = ["TAG"]
        if(entry["meta"]["title"] !== undefined) content["title"] = entry["meta"]["title"];
        if(entry["meta"]["value"] !== undefined) content["value"] = entry["meta"]["value"];
        if(entry["meta"]["status"] !== undefined) content["status"] = entry["meta"]["status"];
        if(entry["meta"]["filter_date_from"] !== undefined) content["filter_date_from"] = entry["meta"]["filter_date_from"];
        if(entry["meta"]["filter_date_to"] !== undefined) content["filter_date_to"] = entry["meta"]["filter_date_to"];
        if(entry["meta"]["description"] !== undefined) content["description"] = entry["meta"]["description"];
        if(entry["meta"]["searchString"] !== undefined) content["searchString"] = entry["meta"]["searchString"];
        if(entry["meta"]["shortName"] !== undefined) content["shortName"] = entry["meta"]["shortName"];
        if(entry["meta"]["userID"] !== undefined) content["userID"] = entry["meta"]["userID"];

        queries.push(
          content

        )
      }

<<<<<<< HEAD
<<<<<<< HEAD
=======
      get("api/users/saved_searches").then(function(data) {

        var datas = []

        if(data !== undefined){
          datas = data
        }
        for(let entry of datas){


          var content = [];
          content["authors"] = entry["meta"]["authors"]

          content["_id"] = entry["id"]
          content["tags"] = ["TAG"]
          if(entry["meta"]["title"] !== undefined) content["title"] = entry["meta"]["title"];
          if(entry["meta"]["value"] !== undefined) content["value"] = entry["meta"]["value"];
          if(entry["meta"]["status"] !== undefined) content["status"] = entry["meta"]["status"];
          if(entry["meta"]["filter_date_from"] !== undefined) content["filter_date_from"] = entry["meta"]["filter_date_from"];
          if(entry["meta"]["filter_date_to"] !== undefined) content["filter_date_to"] = entry["meta"]["filter_date_to"];
          if(entry["meta"]["description"] !== undefined) content["description"] = entry["meta"]["description"];
          if(entry["meta"]["searchString"] !== undefined) content["searchString"] = entry["meta"]["searchString"];
          if(entry["meta"]["shortName"] !== undefined) content["shortName"] = entry["meta"]["shortName"];
          if(entry["meta"]["userID"] !== undefined) content["userID"] = entry["meta"]["userID"];

       queries.push(
    content

       )
      }

<<<<<<< HEAD
    var queries =  [
      {
        authors : [{email:"admin@knex.com", name :"Max Mustermann"}]

>>>>>>> f5b8ae9d84b31bb9e00c894f7ccdfb34bda2af22
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        searchString : "D",
=======
>>>>>>> af1da7a... WIP
=======
        searchString : "RE",

>>>>>>> 2605f56... Filters prepared
=======
        searchString : "D",
>>>>>>> 3d1dc9d... further bug fixing
=======
        searchString : "D",
>>>>>>> f5b8ae9d84b31bb9e00c894f7ccdfb34bda2af22
        _id :"Empty", //REMOVE
        userID:"av" //REMOVE
      },
      {
      label : "TEST",
      tags : ["aa"],
      title : "a",
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      authors : [{email:"admin@knex.com", name :"Max Mustermann"}],
=======
      authors : [{email:"admin@knex.com", name :"Max Mustermanno"}],
>>>>>>> af1da7a... WIP
=======
      authors : [{email:"admin@knex.com", name :"Max Mustermann"}],
>>>>>>> 3d1dc9d... further bug fixing
=======
      authors : [{email:"admin@knex.com", name :"Max Mustermann"}],
>>>>>>> f5b8ae9d84b31bb9e00c894f7ccdfb34bda2af22
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
=======
<<<<<<< HEAD
>>>>>>> f7d84cc... saved search with real data

        var d = queries
        this.setState({
=======
      this.setState({
>>>>>>> 44597e1... Merge and BF
        queries : queries
      })
      console.log(this.state.queries)
=======
>>>>>>> f7d84cc96440d14494cdecf50497516ee160b907

        var d = queries
        this.setState({
        queries : queries
    })
        console.log(this.state.queries)
>>>>>>> f5b8ae9d84b31bb9e00c894f7ccdfb34bda2af22
    }.bind(this));
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
