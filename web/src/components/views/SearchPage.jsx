import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {fetchJson, sendJson} from '../common/Backend'
//import  Table from 'SearchTable.jsx';

const defaultPageSize = 4;
const defaultSearchString = "advanced/?q=*";

class Headline extends Component {
  render() {
    return(
      <div className="header">
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
        <input className="form-control" onKeyPress={this.onKeyPress} type="text" name="search" ref='simplesearch' onChange={()=> this.props.getSearchString(this.refs.simplesearch.value)} />
      </div>
    );
  }
}

class AdvancedSearch extends Component {

  //View for advanced search, the onChange in the <input> parses the state all the way to the parent
  render() {
    return(
      <div className="panel panel-body">
        <div className="row">
          <div className="col-md-6">
            <div className="input-group form-inline panel">
              <span className ="input-group-addon primary">
                Project Name
              </span>
              <input
                className="form-control full-width"
                type="text"
                id="projectName"
                name="projectName"
                onChange={(value) => this.props.changeStateName(value.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group form-inline panel">
              <span className ="input-group-addon primary">
                Author
              </span>
              <input
                className="form-control"
                type="search"
                id="author"
                name="author"
                onChange={(value) => this.props.changeStateAuthor(value.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="form-inline panel">
            <div className="col-md-4">
              <div className="input-group form-inline panel">
                <span className ="input-group-addon primary">
                  Tags
                </span>
                <input
                  className="form-control"
                  type="text"
                  id="tags"
                  name="tags"
                  onChange={(value) => this.props.changeStateTags(value.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group form-inline panel">
                <span className ="input-group-addon primary">
                  From
                </span>
                <input
                  className="form-control"
                  type="date"
                  id="dateStart"
                  name="dateStart"
                  onChange={(value) => this.props.changeStateFrom(value.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group form-inline panel">
                <span className ="input-group-addon primary">
                  To
                </span>
                <input
                  className="form-control"
                  type="date"
                  id="dateEnd"
                  name="dateEnd"
                  onChange={(value) => this.props.changeStateTo(value.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="input-group form-inline panel">
              <span className ="input-group-addon primary">
                Description
              </span>
              <input
                className="form-control"
                type="text"
                id="description"
                name="description"
                onChange={(value) => this.props.changeStateDescription(value.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group form-inline panel">
              <span className ="input-group-addon primary">
                Status
              </span>
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

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results : [],
      pageSize : defaultPageSize,
      pageNumber : 0,
      numberOfResults : 0,
      dirty : false,
      hasPrev: false,
      hasNext: false,
      lastString: ""
    };

    // Get Data from Elasticsearch and put it in this.state.results
    var that = this;
    this.getData(this.state.searchString);
  }

/*
This function gets a searchString via props from parent class SearchPage
and gets the data from the backend. Data is stored in state.results
*/
    getData(searchString){
    var that = this;
    fetchJson('/api/projects/search/'+
             this.props.searchString +'&'+
              'offset='+ this.state.pageNumber+'&'+
              'count='+ this.state.pageSize)
    .then(function(data) {
      if(data != null){
        that.setState({
          numberOfResults : data.total,
          hasNext : data.total > defaultPageSize,
        });
        data = data.hits;
        var validatedData = [];
        for(var i = 0;i<data.length;i++){
          if (data[i]._source!=null&&
              data[i]._source.title!=null &&
              data[i]._source.authors!=null&&
              data[i]._source.date_creation!=null&&
              data[i]._source.description!=null&&
              data[i]._source.status!=null&&
              data[i]._id!=null){
                var export_data = data[i]._source
                export_data["_id"] = data[i]._id
                validatedData.push(export_data)
          }
        }
        that.setState({
           results : validatedData,
        });
      }
    });
  }

  fitLength(string, maxLength){
    if(string.length>maxLength){
      return string.substring(0, maxLength) + " ...";
    }
    else return string;
  }

  authorsArrayToNameString(authors){
    var names = [];
    for(var i = 0 ;i < authors.length;i++){
      names.push(authors[i].name);
    }
    return names.join(", ");
  }

  renderLine(result,index){
    var id = result._id;
    var title = result.title;
    var authors = result.authors;
    var description = result.description;
    var status = result.status;
    var date_creation = result.date_creation;

    authors = this.authorsArrayToNameString(authors);
    var shortenedDescription = this.fitLength(description, 100);
    return(
        <tr key ={"result"+index}>
          <td>
            <Link to={"/projects/" + id} className="table-project-name">
              <a className="table-project-name" >
                <u>{title}</u>
              </a>
            </Link>
          </td>
          <td> {authors}</td>
          <td> {status} </td>
          <td data-toggle="tooltip" title={description}> {shortenedDescription} </td>
          <td> {date_creation} </td>
          <td> {this.shuffleBookmarks()} </td>
        </tr>
    );
  }

  shuffleBookmarks() {
    var x = Math.floor((Math.random() * 2) + 1);
    if (x == 1) {
      return <i className="fa fa-bookmark" aria-hidden="true" />;
    }
    else {
      return <i className="fa fa-bookmark-o" aria-hidden="true" />;
    }
  }

  renderLines(results){
    var lines = [];
    for (var i = 0; i < results.length; i++) {
      lines.push(this.renderLine(results[i],i));
    }
    return(lines);
  }

  /*
   * Load a new Page.
   * Set changeIndex to the number of pages you want to go forward
   * or backward using positive or negative integers respectively.
   */
  newPage(changeIndex){
    var newPageIndex = this.state.pageNumber + (changeIndex * this.state.pageSize);

    if( newPageIndex>0){
      this.setState({
        dirty : true,
        pageNumber : newPageIndex,
      });
    } else {
      this.setState({
        dirty : true,
        pageNumber : 0,
      })
    }
  }

  renderNextButton(){
    if(this.state.hasNext){
      return(
        <span className="input-group-button">
          <button className="btn btn-secondary" onClick = {() => {this.newPage(1)}}>
            next
          </button>
        </span>
      );
    } else {
      return(
        <span className="input-group-button">
          <button className="btn btn-secondary disabled">
            next
          </button>
        </span>
      );
    }
  }

  renderPrevButton(){
    if(this.state.hasPrev){
      return(
        <span className="input-group-button">
          <button className="btn btn-secondary" onClick = {() => {this.newPage(-1)}}>
            prev
          </button>
        </span>
      );
    } else {
      return(
        <span className="input-group-button">
          <button className="btn btn-secondary disabled">
            prev
          </button>
        </span>
      );
    }
  }


  /*
  * This function renders the table
  * at the beginning data is fetched and it is checked if the searchstring has changed to know if its necessary to fetch new data
  */
  renderTable(){
    if(this.state.lastString != this.props.searchString){
        this.getData(this.props.searchString)
        this.setState({lastString: this.props.searchString})

    }
    if(this.state.results.length > 0){
      return(
        <div>
          <div className="row">
            <div className="col-2">
              <label htmlFor="n-results"> Show Results:&nbsp;</label>
              <select className="selectpicker"
                      id="n-results"
                      onChange={event => this.setState({
                         pageSize : parseInt(event.target.value, 10),
                         pageNumber : 0,
                         dirty : true,
                       })}
                      value={this.state.pageSize}>
                <option value="4">4</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
            <div>
              Number of Results: {this.state.numberOfResults}
            </div>
          </div>
          <div className="row">
            <div className="table-container">
              <table className="table">
                <thead className="thead-default">
                  <tr>
                    <th className="col-xs-3">Project Name</th>
                    <th className="col-xs-2">Authors</th>
                    <th className="col-xs-1">Status</th>
                    <th className="col-xs-3">Description</th>
                    <th className="col-xs-2">Date</th>
                    <th className="col-xs-1">Fav</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderLines(this.state.results)}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="centered-pagination">
                <div>
                  {this.renderPrevButton()}
                  {this.renderNextButton()}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return(
        <div
          className="noResults">
          <h3>No Results found!</h3>
        </div>
      );
    }
  }

  componentDidUpdate(){
    //Load current table page
    if(this.state.dirty){
      var that = this;
      this.setState({
        dirty : false,
      });

      fetchJson('/api/projects/search/'+
                this.props.searchString +'&'+
                'offset='+ this.state.pageNumber+'&'+
                'count='+ this.state.pageSize)
      .then(function(data) {
        if(data != null){
          that.setState({
            numberOfResults : data.total,
          });
          data = data.hits;
          var validatedData = [];
          for(var i = 0;i<data.length;i++){
            if (data[i]._source!=null&&
                data[i]._source.title!=null &&
                data[i]._source.authors!=null&&
                data[i]._source.date_creation!=null&&
                data[i]._source.description!=null&&
                data[i]._source.status!=null&&
                data[i]._id!=null){
                  var export_data = data[i]._source
                  export_data["_id"] = data[i]._id
                  validatedData.push(export_data)
            }
          }
          var hasNext = true;
          if(that.state.numberOfResults-(that.state.pageSize+that.state.pageNumber)<=0){
            hasNext = false;
          }
          var hasPrev = true;
          if(that.state.pageNumber===0){
            hasPrev = false;
          }
          that.setState({
             results : validatedData,
             hasPrev : hasPrev,
             hasNext : hasNext,
          });
        }
      });
    }
  }

  render() {
    return this.renderTable();
  }
}

class Search extends Component{
  constructor(props) {
    super(props);
    this.state = {expanded : false};
  }

  /*
    Function to toggle between advanced and simplesearch
  */
  toggle(){
      this.setState({expanded: !this.state.expanded});
      this.props.changeStateAdvanced();
  }

  render() {
    if(this.state.expanded){
      return(
        <div>
          <div className="row">
            <form className="form-horizontal col-md-12">
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
            <a onClick={() => this.toggle()}  className="clickable-text col-md-2">
              <u>Minimize</u>
            </a>
          </div>
        </div>
      );
    } else {
      return(
        <div>
          <div className="row">
            <form className="form-horizontal col-md-12">
              <Searchbar getSearchString = {(str) => this.props.getSearchString(str)}  />
            </form>
          </div>
          <div className="row padding">
            <a onClick={() => this.toggle()} className="clickable-text text-right">
              <u>Advanced Search</u>
            </a>
          </div>
        </div>
      );
    }
  }
}

/*
* Top level class which creates the searchquery and parses it to the table
*/

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
      if(this.state.filter_tags != ""){
        if(filter_set > 0){
          searchstring = searchstring.concat(" AND ");
          filter_set--;
        }
        searchstring = searchstring.concat("(tags: ", this.state.filter_tags, "*)");
      }

      if(this.state.filter_status!= ""){
        if(filter_set > 0){
          searchstring = searchstring.concat(" AND ");
          filter_set--;
        }
        searchstring = searchstring.concat("(status: ", this.state.filter_status, "*)");
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
                <hr className="hidden-divider"/>
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
