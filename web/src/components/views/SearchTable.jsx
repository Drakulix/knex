import React from 'react';
import { Link } from 'react-router-dom';
import {fetchJson} from '../common/Backend'

const defaultPageSize = 4;


export default class Table extends React.Component {
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
    var status_badge = null;
    if (result.status == 'DONE'){
      status_badge = <span className="badge badge-success">DONE</span>
    } else if (result.status == 'IN_PROGRESS') {
      status_badge = <span className="badge badge-warning">IN_PROGRESS</span>
    } else if (result.status == 'IN_REVIEW') {
      status_badge = <span className="badge badge-info">IN_REVIEW</span>
    } else {
      status_badge = status
    }
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
          <td className="td-center">{status_badge}</td>
          <td data-toggle="tooltip" title={description}> {shortenedDescription} </td>
          <td> {date_creation} </td>
          <td className="td-center"> {this.shuffleBookmarks()} </td>
        </tr>
    );
  }

  shuffleBookmarks() {
    var x = Math.floor((Math.random() * 2) + 1);
    if (x === 1) {
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
    if(this.state.lastString !== this.props.searchString){
        this.getData(this.props.searchString)
        this.setState({lastString: this.props.searchString})

    }
    if(this.state.results.length > 0){
      return(
        <div>
          <div className="row padding">
            <div className="col-2">
            Found Projects: {this.state.numberOfResults}
            </div>
          </div>
          <div className="row">
            <div className="table-container">
              <table className="table">
                <thead className="thead-default">
                  <tr>
                    <th className="col-xs-3">Project Name</th>
                    <th className="col-xs-2">Authors</th>
                    <th className="col-xs-1 th-center">Status</th>
                    <th className="col-xs-3">Description</th>
                    <th className="col-xs-2">Date</th>
                    <th className="col-xs-1 th-center">Fav</th>
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
          <div className="col-2">
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
        </div>
      );
    } else {
      return(
        <div
          className="header" id="noResults">
          No Results found!
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
