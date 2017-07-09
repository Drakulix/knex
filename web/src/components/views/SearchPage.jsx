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


      this.setState({fetchURL : "simple/?q="+this.state.searchString+"*"});



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
                ></DataTable>
            </div>
          </div>
        </div>
      );
    }
  }
