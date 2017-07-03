import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {fetchJson, sendJson} from '../common/Backend';
import  Table from './SearchTable';
import Chips, { Chip } from 'react-chips';

const defaultPageSize = 4;
const defaultSearchString = "advanced/?q=*";


const theme = {
  chipsContainer: {
    display: "flex",
    position: "relative",
    border: "1px solid #ccc",
    backgroundColor: '#fff',
    font: "13.33333px 'Open Sans', sans-serif",
    minHeight: 39,
    fontWeight: "normal",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "2.5px",
    ':focus': {
    	border: "1px solid #aaa",
    }
  },
  container:{
    flex: 1,
  },
  containerOpen: {

  },
  input: {
    border: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
    padding: 5,
    margin: 2.5
  },
  suggestionsContainer: {

  },
  suggestionsList: {
    position: 'absolute',
    border: '1px solid #ccc',
    zIndex: 10,
    left: 0,
    top: '100%',
    width: '100%',
    backgroundColor: '#fff',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  suggestion: {
    padding: '5px 15px'
  },
  suggestionHighlighted: {
    background: '#ddd'
  },
  sectionContainer: {

  },
  sectionTitle: {

  },
}


class Headline extends Component {
  render() {
    return(
      <div className="header" id="headerSearch">
        Looking for a Project?
      </div>
    );
  }
}

class Searchbar extends Component {
  //disables Enter Button
  onKeyPress(event) {
    if (event.which === 13) {
      event.preventDefault();
    }
  }
  render() {
    var searchString
    return(
      <div className="input-group">
        <input className="form-control" onKeyPress={this.onKeyPress} type="text" name="search" placeholder="Enter your query here..." ref='simplesearch' onChange={()=> this.props.getSearchString(this.refs.simplesearch.value)} />
      </div>
    );
  }
}

class AdvancedSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chips: []
    }
  }

  onChange = chips => {
    this.setState({ chips });
    this.props.changeStateTags({chips});
  }
  //View for advanced search, the onChange in the <input> parses the state all the way to the parent
  render() {
    return(
      <div className="panel panel-body" id="advancedSearch">
        <div className="row">
          <div className="col-md-6">
            <div className="input-group form-inline panel">
              <label for="projectName" className ="input-group-addon primary" id="labelProjectName">
                Project Name:
              </label>
              <input
                className="form-control full-width"
                type="text"
                id="projectName"
                name="projectName"
                onChange={(value) => this.props.changeStateName(value.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="input-group form-inline panel" id="dateStart">
              <label for="dateStart" className ="input-group-addon primary">
                Date from:
              </label>
              <input
                className="form-control"
                type="date"

                name="dateStart"
                onChange={(value) => this.props.changeStateFrom(value.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="input-group form-inline panel " id="dateEnd">
              <label for="DateEnd" className ="input-group-addon primary">
              To:
            </label>
              <input
                className="form-control"
                type="date"
                name="dateEnd"
                onChange={(value) => this.props.changeStateTo(value.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="input-group form-inline panel">
              <label className ="input-group-addon primary">
                Author:
              </label>
              <input
                className="form-control"
                type="search"
                id="author"
                name="author"
                onChange={(value) => this.props.changeStateAuthor(value.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6" id="tagInput">
            <div className="input-group form-inline panel">
              <label className ="input-group-addon primary">
                Tags:
              </label>
              <Chips
                placeholder={"Enter your tags"}
                value={this.state.chips}
                onChange={this.onChange}
                theme={theme}
                suggestions={[
                  "Annie Blas",
                  "Gricelda Look",  
                  "Roderick Crabb",  
                  "Akilah Sweatman",  
                  "Terri Vasbinder",
                  "Jaimee Daggett", 
                  "Meggan Truitt",
                  "Ricarda Schrage"  
                ]}
              />
            </div>
          </div>
        </div>

        <div className="row" >
          <div className="col-md-12" >
            <div className="input-group form-inline panel">
              <label className ="input-group-addon primary">
                Description:
              </label>
              <input
                className="form-control"
                type="text"
                id="description"
                name="description"
                onChange={(value) => this.props.changeStateDescription(value.target.value)}
              />
            </div>
          </div>
      </div>
      <div className="row" >
        <div className="col-md-2">
          <div className="input-group form-inline panel">
            <label className ="input-group-addon primary">
              Status:
            </label>
            <select
              className="form-control"
              id="dropdown_status"
              name="status"
              onChange={(value) => this.props.ChangeStateStatus(value.target.value)}
            >
              <option>DONE</option>
              <option>pending</option>
              <option>in progress</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    );
  }
}



class Search extends Component{
  constructor(props) {
    super(props);
    this.state = {
      expanded : false,
    };
  }

  /*
    Function to toggle between advanced and simplesearch
  */
  toggle() {
      this.setState({expanded: !this.state.expanded});
      this.props.changeStateAdvanced();
  }

  render() {
    if(this.state.expanded){
      return(
        <div>
          <div className="row">
            <form className="form-horizontal col-12">
              <AdvancedSearch
                changeStateName={(name) => this.props.changeStateName(name)}
                changeStateAuthor={(author) => this.props.changeStateAuthor(author)}
                changeStateFrom={(from) => this.props.changeStateFrom(from)}
                changeStateTo={(to) => this.props.changeStateTo(to)}
                ChangeStateStatus={(status) => this.props.ChangeStateStatus(status)}
                changeStateTags={(tags) => this.props.changeStateTags(tags)}
                changeStateDescription={(desc) => this.props.changeStateDescription(desc)}
              />
            </form>
            <a onClick={() => this.toggle()}  className="clickable-text col-md-2" id="minimize">
              <u>Minimize</u>
            </a>
          </div>
        </div>
      );
    } else {
      return(
        <div>
          <div className="row padding">
            <form className="form-horizontal col-12">
              <Searchbar getSearchString = {(str) => this.props.getSearchString(str)}  />
            </form>
          </div>
          <div className="row padding" id="advancedSearchToggle">
            <a onClick={() => this.toggle()} className="clickable-text padding text-right">
              <u>Advanced Search</u>
            </a>
          </div>
        </div>
      );
    }
  }
}

export default class SearchPage extends Component {
  constructor(){
    super();
    this.state = {
      currentPage: 0,
      filter_project_name: "",
      filter_author: "",
      filter_tags: ["Gricelda", "Munchkin"],
      filter_date_from: "1900-01-01",
      filter_date_to: "2050-06-06",
      filter_status: "",
      filter_description: "",
      searchString: "",
      advanced: false,
      simple_searchstring: "",
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

      if(this.state.filter_tags.length != 0){
        if(filter_set > 0){
          searchstring = searchstring.concat(" AND ");
          filter_set--;
        }
        searchstring = searchstring.concat("(tags: ");
        for(var i = 0;i<this.state.filter_tags.length;i++){
          searchstring = searchstring.concat(this.state.filter_tags[i], "*");
          if(i < this.state.filter_tags.length - 1){
            searchstring = searchstring.concat(" AND ");
          }
        }
        searchstring = searchstring.concat(")");
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
    this.setState({filter_tags: tags });
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
      <div className="inner-content">
        <div className="container">
          <div className="row">
            <div className="col">
                <Headline />
                <h1>{searchString}</h1>
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
                <hr className="horizontal-divider"/>
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
