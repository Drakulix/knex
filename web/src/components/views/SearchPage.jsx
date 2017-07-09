import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {fetchJson, sendJson} from '../common/Backend';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem';

import ChipInputList from '../common/ChipInputList';
import DataTable from '../common/DataTable';


import Filters from '../common/Filters';


const defaultPageSize = 4;
const defaultSearchString = "advanced/?q=*";

const statusString = [
  {id: "0" , text :"Done", value : "DONE"},
  {id: "1" , text :"In review", value : "IN_REVIEW"},
  {id: "2" , text :"In progress", value : "IN_PROGRESS"}];



  class Headline extends Component {
    render() {
      return(
        <div className="headerCreation" id="headerSearch" style={{width:"100%"}}>
          Looking for a Project?
        </div>
      );
    }
  }


  export default class SearchPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        searchString :"",
        fetchURL : "/api/projects",

      };

      this.handleFilterChange = this.handleFilterChange.bind(this);
      this.saveSearch = this.saveSearch.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }


    componentWillMount(){
      var query = {
        searchString :"",
        authors : [],
        title : "Test",
        tags : ["DDSA"],
        value : "0",
          status : "DONE",
          date_from :"212",
          date_to:"211",
          description:"ttt",
          shortName : "TEST",
          userID:"av"
      }
      this.setState({query: query});
    }


    handleChange(event) {
      const name = event.target.name;
      const value = event.target.value;
      this.setState({ [name]: value});
      var query = this.state.query;
      query["searchString"] = value;
      this.setState({query : query});



      //this.setState({fetchURL : "simple/?q="+this.state.searchString+"*"});
      var end = "/api/projects/search/"
      this.state.fetchURL = end+"simple/?q="+this.state.searchString+"*"


    }

    handleFilterChange(key, value){
      var query = this.state.query;
      query[key] = value;

      this.setState({query : query});

    }

    saveSearch(){
      var temp = [];
      var authors = this.state.query["authors"];
      for (var i in authors) {
        var string = authors[i];
        var name = string.substring(0, string.lastIndexOf("(")-1);
        var id = string.substring(string.lastIndexOf("(")+1, string.length-1);
        temp.push({"name" : name, "email" :id});
      }
      var query = this.state.query;
      query["authors"] = temp;
    }

    render() {
      return(
        <div className="container">
          <div className="innerContainer">
            <Headline />
            <div className="row" style={{textAlign:"center"}}>
              <div className="col-10">
                <TextField  style={{width:"100%"}}
                  onKeyPress={this.onKeyPress}
                  name="searchString"
                  value={this.state.searchString}
                  placeholder="Enter your query here..."
                  onChange={this.handleChange} />
              </div>
              <div className="col-2">
                <RaisedButton style={{width:"100%"}}  label="Save search" onClick={this.saveSearch} primary={true}/>
              </div>
            </div>
            <div style={{marginTop:20}}>
              <DataTable columns= {['title', 'status', 'tags', 'authors', 'description', '_id', 'date_creation' ,'bookmarked']}
                fetchURL={this.state.fetchURL}
                handleFilter= {this.handleFilterChange}
                predefinedFilter = {this.state.query}
                ></DataTable>
            </div>
          </div>
        </div>
      );
    }
  }
