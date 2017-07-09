import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {fetchJson, sendJson} from '../common/Backend';
import SavedQuery from "../common/SavedQuery"


class Headline extends Component {
  render() {
    return(
      <div className="headerCreation" id="headerSearch" style={{width:"100%"}}>
        Your saved queries
      </div>
    );
  }
}


export default class SavedQueries extends Component {
  constructor(props) {
    super(props);
    this.state = {queries:{}};

  }


  componentWillMount(){
    this.setState({
      queries :[
        { _id :"FDAF",
          authors : [{email:"marko@knex", name :"Marko"},
          {email:"marko@knex", name :"Marko"}
        ],
        title : "Test",
        tags : ["DDSA"],
        value : "0",
        status : "DONE",
        filter_date_from :"212",
        filter_date_to:"211",
        description:"ttt",
        searchString :"RE",
        shortName : "TEST",
        description :"Fd",
        userID:"av"
      },
      { _id :"FDAF",
        authors : [{email:"marko@knex", name :"Marko"},
        {email:"marko@knex", name :"Marko"}
      ],
      title : "Test",
      tags : ["DDSA"],
      value : "0",
      status : "DONE",
      filter_date_from :"212",
      filter_date_to:"211",
      description:"ttt",
      searchString :"RE",
      shortName : "TEST",
      description :"Fd",
      userID:"av"
      }]
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
              <div><SavedQuery value={item}></SavedQuery>
              <hr></hr>
            </div>
          )
        }

      </div>


    </div>
  </div>
);
}
}
