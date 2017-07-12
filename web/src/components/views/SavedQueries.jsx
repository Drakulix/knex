import React, { Component } from 'react';
import SavedQuery from "../common/SavedQuery"


class Headline extends Component {
  render() {
    return(
      <div className="headerCreation" id="headerSearch" style={{width:"100%"}}>
        Your Saved Queries
      </div>
    );
  }
}


export default class SavedQueries extends Component {
  constructor(props) {
    super(props);
    this.state = {queries:{}
    };
  }


  componentWillMount(){

//TODO LOAD


    var queries =  [
        { _id :"FDAF",
          authors : [{email:"marko@knex", name :"Marko"},
          {email:"marko@knex", name :"Marko"}
        ],
        title : "Test",
        tags : ["DDSA"],
        value : "0",
        status : "DONE",
        filter_date_from :"2009-12-07",
        filter_date_to:"2015-05-06",
        description:"ttt",
        searchString :"RE",
        shortName : "TEST",
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
      filter_date_from :"2012-12-12",
      filter_date_to:"2011-05-11",
      searchString :"RE",
      shortName : "TEST",
      description :"Fd",
      userID:"av"
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
