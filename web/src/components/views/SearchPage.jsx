import React, { Component } from 'react';
import {fetchJson, sendJson} from '../common/Backend'

// Main Code

class Headline extends Component {
  render() {
    return(
      <div className="row">
        <div className="header-title">
          <h1>Looking for a Project?</h1>
        </div>
      </div>
    );
  }
}

class Searchbar extends Component {
  render() {
    return(
      <div className="input-group">
        <input className="form-control" type="text" name="search"/>
        <span className="input-group-button">
          <button className="btn btn-primary" type="submit">
            Search!
          </button>
        </span>
      </div>
    );
  }
}

class AdvancedSearch extends Component {
  render() {
    return(
      <div className="panel panel-body">
        <div className="row">
          <div className="col-md-6">
            <div className="input-group form-inline panel">
              <span className ="input-group-addon primary">
                Project Name
              </span>
              <input className="form-control full-width" type="text" id="projectName" name="projectName"/>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group form-inline panel">
              <span className ="input-group-addon primary">
                Author
              </span>
              <input className="form-control" type="search" id="author" name="author"/>
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
                <input className="form-control" type="text" id="tags" name="tags"/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group form-inline panel">
                <span className ="input-group-addon primary">
                  From
                </span>
                <input className="form-control" type="date" id="dateStart" name="dateStart"/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group form-inline panel">
                <span className ="input-group-addon primary">
                  To
                </span>
                <input className="form-control" type="date" id="dateEnd" name="dateEnd"/>
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
              <input className="form-control" type="text" id="description" name="description"/>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group form-inline panel">
              <span className ="input-group-addon primary">
                Status
              </span>
              <input className="form-control" type="text" id="status" name="status"/>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="input-group form-inline panel">
              <span className="input-group-button primary">
                <button className="btn btn-primary " type="submit">
                  Search!
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


class Search extends Component {

  constructor() {
    super();
    this.state = {expanded : false};
  }

  render() {
    if(this.state.expanded){
      return(
        <div>
          <div className="row">
            <form className="form-horizontal col-md-12">
              <AdvancedSearch/>
            </form>
            <a onClick={() => this.setState({expanded : false})}  className="clickable-text col-md-2">
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
              <Searchbar/>
            </form>
          </div>
          <div className="row padding">
            <a onClick={() => this.setState({expanded : true})} className="clickable-text text-right">
              <u>Advanced Search</u>
            </a>
          </div>
        </div>
      );
    }
  }
}

class Table extends Component {

    constructor() {
      super();

      var that = this;

      this.state = {
        projects : [],
      }
      sendJson('POST', '/api/projects/search', {
        "query": {
          "match_all": {}
        }
      })
      .then(function(data) {
        if(data != null){
          that.setState({
             projects : data.hits.hits,
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
      return names.join();
    }

    renderLine(result){

      var title = result._source.title;
      var authors = result._source.authors;
      var description = result._source.description;
      var status = result._source.status;
      var date_creation = result._source.date_creation;

      var authorNames = this.authorsArrayToNameString(result._source.authors);
      var shortenedDescription = this.fitLength(description, 100);

      return(
          <tr>
            <td className="col-md-2"> {title} </td>
            <td className="col-md-2"> {authorNames}</td>
            <td className="col-md-2" data-toggle="tooltip" title={description}> {shortenedDescription} </td>
            <td className="col-md-2"> {date_creation} </td>
            <td className="col-md-2"> {status} </td>
          </tr>
      );
    }

    renderLines(results){
      var lines = [];
      for (var i = 0; i < results.length; i++) {
        lines.push(this.renderLine(results[i]));
      }
      return(lines);
    }

    renderTable(results){
      if(results.length>0){
        return(
          <div className="row">
            <table className="table table-hover">
              <tbody>
                <tr>
                  <th className="col-2">Project</th>
                  <th className="col-2">Author</th>
                  <th className="col-2">Description</th>
                  <th className="col-2">Date</th>
                  <th className="col-2">Status</th>
                </tr>
                {this.renderLines(results)}
              </tbody>
            </table>
          </div>
        );
      } else {
        return null;
      }
    }

  render() {
    return this.renderTable(this.state.projects);
  }
}

export default class SearchPage extends Component {
  render() {
    return (
      <div className="inner-content">
        <div className="container">
          <div className="row">
            <div className="col">
                <Headline />
                <hr className="hidden-divider"/>
                <Search />
                <hr className="horizontal-divider"/>
                <Table />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
