import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {fetchJson, sendJson} from '../common/Backend';
import  Table from './SearchTable';
import Chips, { Chip } from 'react-chips';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem';

import ChipInputList from '../common/ChipInputList';


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

  class Search extends Component{
    constructor(props) {
      super(props);
      this.state = {
        searchString :"",
        filters :{},
      };

      this.handleFilterChange = this.handleFilterChange.bind(this);
      this.saveSearch = this.saveSearch.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value});
        if(value ==""){
          delete this.state.filters[name];
      }else {
        this.state.filters[name] = value;
      }
      }

      handleFilterChange(key, value){
        var state = this.state["filters"];
        if(value == ""){
           delete state[key];
         }
        else        {state[key] = value;}
        this.setState({"filters" : state});
      }

      saveSearch(){
        alert(Object.keys(this.state.filters));
      }

      render() {
        return(
          <div>
            <div className="row" style={{textAlign:"center"}}>
              <div className="col-10">
                <TextField  style={{width:"100%"}}
                  onKeyPress={this.onKeyPress}
                  name="searchString"
                  placeholder="Enter your query here..."
                  onChange={this.handleChange} />
              </div>
              <div className="col-2">
                <RaisedButton style={{width:"100%"}}  label="Save search" onClick={this.saveSearch} primary={true}/>
              </div>
            </div>
            <div style={{marginTop:20}}>
            <Filters value={this.state.filters} onChange={this.handleFilterChange}></Filters>
            </div>
          </div>
        );
      }
    }

    export default class SearchPage extends Component {
      constructor(){
        super();
        this.state = {
          currentPage: 0,
          filter_project_name: "",
          filter_author: "",
          filter_tags: "",
          filter_date_from: "1900-01-01",
          filter_date_to: "2050-06-06",
          filter_status: "",
          filter_description: "",
          searchString: "",
          advanced: false,
          simple_searchstring: "",
          counter: 0,

        };
      }

      /*
      * The filter function is checking whitch filters are set and is building the searchquery
      */

      filter(){

        var searchstring="advanced/?q=";
        var filter_set = 0;

        if(this.state.filter_project_name != ""){
          searchstring = searchstring.concat("(title: ", this.state.filter_project_name, "*)");
          filter_set++;
        }

        if(this.state.filter_date_from !== "1900-01-01" || this.state.filter_date_to!== "2050-06-06"){
          if(filter_set > 0){
            searchstring = searchstring.concat(" AND ");
            filter_set--;
          }
          searchstring = searchstring.concat("(date_creation: [", this.state.filter_date_from, " TO " , this.state.filter_date_to, "])");
          filter_set++;
        }

        if(this.state.filter_author != ""){
          if(filter_set > 0){
            searchstring = searchstring.concat(" AND ");
            filter_set--;
          }
          searchstring = searchstring.concat("(authors.name: ", this.state.filter_author, "*)");
          filter_set++;
        }



        if(this.state.filter_status!= ""){
          if(filter_set > 0){
            searchstring = searchstring.concat(" AND ");
            filter_set--;
          }
          searchstring = searchstring.concat("(status: ", this.state.filter_status, ")");
          filter_set++;
        }

        if(this.state.filter_description!= ""){
          if(filter_set > 0){
            searchstring = searchstring.concat(" AND ");
            filter_set--;
          }
          searchstring = searchstring.concat("(description: ", this.state.filter_description, "*)");
          filter_set++;
        }

        if(this.state.filter_tags != ""){
          if(filter_set > 0){
            searchstring = searchstring.concat(" AND ");
            filter_set--;
          }
          searchstring = searchstring.concat(this.state.filter_tags);
          filter_set++;
        }

        return searchstring;
      }




      /*
      * various functions to get the state of the advanced search via the search element, the value of the input fields are
      * combined to get the searchquery string
      */
      changeStateAuthor(author){
        this.setState({filter_author: author });
      }

      //Sets Date to 1900-01-01 it date is empty to get filters working if one date field is set
      changeStateFrom(from){
        if(from == ""){
          this.setState({filter_date_from: "1900-01-01" });
        }else{
          this.setState({filter_date_from: from });
        }
      }

      //Sets Date to 2050-06-06 it date is empty to get filters working if one date field is set
      changeStateTo(to){
        if(to == ""){
          this.setState({filter_date_to: "2050-06-06" });
        }else{
          this.setState({filter_date_to: to });
        }
      }

      changeStateStatus(status){
        this.setState({filter_status: status});
      }

      changeStateName(name){
        this.setState({filter_project_name: name });
      }

      changeStateTags(tags){
        this.setState({filter_tags: tags});
      }

      changeStateAdvanced(){
        this.setState({advanced: !this.state.advanced})
      }

      changeStateDescription(desc){
        this.setState({filter_description: desc})
      }


      getSearchString(str){
        this.setState({simple_searchstring: str})
      }


      /*
      *This function builds the searchquery for the simplesearch
      */

      simplesearch(){
        var searchString = "simple/?q=";
        searchString = searchString.concat(this.state.simple_searchstring + "*");
        return searchString;
      }


      /*
      *The renderfunction is checking if advanced search or simple search is needed and is calling the function to create the searchString
      *which is given to the table class to get the data from the backend
      */
      render() {
        var searchString

        if(this.state.advanced){
          searchString = this.filter();
          if(searchString == "advanced/?q="){
            searchString = defaultSearchString;
          }
        }else{
          searchString = this.simplesearch();
          if(searchString == "simple/?q=*"){
            searchString = defaultSearchString;
          }
        }

        return (

          <div className="container">

            <div className="innerContainer">
              <div className="row">
                <div className="col">
                  <Headline />
                  <Search
                    changeStateName={(name) => this.changeStateName(name)}
                    changeStateAuthor={(author) => this.changeStateAuthor(author)}
                    changeStateFrom={(from) => this.changeStateFrom(from)}
                    changeStateTo={(to) => this.changeStateTo(to)}
                    ChangeStateStatus={(status) => this.changeStateStatus(status)}
                    changeStateTags={(tags) => this.changeStateTags(tags)}
                    changeStateDescription = {(desc) => this.changeStateDescription(desc)}
                    changeStateAdvanced = {(advanced) => this.changeStateAdvanced(advanced)}
                    getSearchString = {(str)=> this.getSearchString(str)}
                    />

                  <Table
                    searchString  = {searchString}
                    advanced = {this.state.advanced}
                    />
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
