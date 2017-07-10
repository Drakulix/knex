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
import Dialog from 'material-ui/Dialog';



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
        query : {searchString :"",
        shortName : "" },
        fetchURL : "/api/projects",
        open :false
      };
      this.handleFilterChange = this.handleFilterChange.bind(this);
      this.saveSearch = this.saveSearch.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleOpen = this.handleOpen.bind(this);
      this.handleCommentChange = this.handleCommentChange.bind(this);


    }


    componentWillMount(){
      if (this.props.match.params.qID !== undefined){
          //FETCH QUERY FROM DB with ID QID
          var query = {
shortName :"",
            authors : [],
            title : "Test",
            tags : ["DDSA"],
            value : "0",
            searchString :"fdsfds",
              status : "DONE",
              filter_date_from :"2009-1-4",
              filter_date_to:"2012-1-2",
              description:"ttt",
              shortName : "TEST",
              userID:"av",
              authors : [{email:"marko@knex", name :"Marko"},
              {email:"marko@knex", name :"Marko"}
            ]
        }
        this.setState({query: query});
      }
    }

    handleChange(event) {

      const value = event.target.value;
      var query = this.state.query;
      query["searchString"] = value;
      this.setState({query : query});



      //this.setState({fetchURL : "simple/?q="+this.state.searchString+"*"});
      var end = "/api/projects/search/"
      this.state.fetchURL = end+"simple/?q="+this.query["searchString"]+"*"


    }

    handleFilterChange(key, value){
      var query = this.state.query;
      query[key] = value;

      this.setState({query : query});

    }

    saveSearch(){
      this.setState({open: false});
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

    handleClose = () => {


      this.setState({open: false});
    };

    handleOpen = () => {
      this.setState({open: true});
    };



    handleCommentChange(event){

      const value = event.target.value;

      var query = this.state.query;
      query["shortName"] = value;
      this.setState({query : query});

    }

    render() {




      const actions = [
        <RaisedButton
          label="Cancel"
          primary={true}
          onTouchTap={this.handleClose}
          />,
        <RaisedButton
          label="Save"
          primary={true}
          onTouchTap={this.saveSearch}
          style={{marginLeft:20}}
          disabled= {(this.state.query["shortName"] === "" ) ? true : false}
          />,
      ];




      return(
        <div className="container">
          <div className="innerContainer">

                        <Dialog
                          title="Add a title for your search"
                          actions={actions}
                          modal={false}
                          open={this.state.open}
                          onRequestClose={this.saveSearch}
                          >
                          <TextField value = {this.state.query.shortName}
                                      placeholder="Enter a title here ... "
                                      errorText={(this.state.query["shortName"] === "") ? "Please provide a title " : ""}
                                      onChange={this.handleCommentChange}
                            ></TextField>

                        </Dialog>


            <Headline />
            <div className="row" style={{textAlign:"center"}}>
              <div className="col-10">
                <TextField  style={{width:"100%"}}
                  onKeyPress={this.onKeyPress}
                  name="searchString"
                  value={this.state.query.searchString}
                  placeholder="Enter your query here..."
                  onChange={this.handleChange} />
              </div>
              <div className="col-2">
                <RaisedButton style={{width:"100%"}}
                    label="Save search" onClick={this.handleOpen} primary={true}/>
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
