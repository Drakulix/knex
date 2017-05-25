import React, { Component } from 'react';

//Return Value Simulation

class Result extends Component{
  constructor(name, author, status, description, date, fav) {
    super();
    this.name = name;
    this.author = author;
    this.status = status;
    this.description = description;
    this.date = date;
    this.fav = fav;
  }
}

const result = new Result("Proj", "auth", "inactive", "desc1", "01.01.2000", "yes");
const result2 = new Result("Proj2", "auth2", "active", "desc2", "11.02.2016", "yes");
const result3 = new Result("Proj3", "auth", "inactive", "desc3", "01.01.2000", "no");
const results0 = [];
const results1 = [result];
const results2 = [result, result2];
const results3 = [result, result2, result3];

var results = results3

// Main Code

class Headline extends Component {
  render() {
    return(
      <div className="row">
        <h1 className="headline"> Looking for a Project? </h1>
      </div>
    );
  }
}

class Searchbar extends Component {
  render() {
    return(
      <div className="input-group searchbar">
        <input className="form-control" type="text" name="search"/>
        <span class="input-group-button">
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
        <div className="form-horizontal row">
          <div className="col-md-6 input-group">
            <span className ="input-group-addon">
              Project Name
            </span>
            <input class="form-control" type="text" id="projectName" name="projectName"/>
          </div>
          <div className="col-md-6 input-group">
            <span className ="input-group-addon">
              Author
            </span>
            <input class="form-control" type="search" id="author" name="author"/>
          </div>
          <div className="col-md-6 input-group">
            <span className ="input-group-addon">
              Tags
            </span>
            <input class="form-control" type="search" id="tags" name="tags"/>
          </div>
          <div className="col-md-3 input-group">
            <span className ="input-group-addon">
              From
            </span>
            <input class="form-control" type="date" id="dateStart" name="dateStart"/>
          </div>
          <div className="col-md-3 input-group">
            <span className ="input-group-addon">
              To
            </span>
            <input class="form-control" type="date" id="dateEnd" name="dateEnd"/>
          </div>
          <div className="col-md-6 input-group">
            <span className ="input-group-addon">
              Description
            </span>
            <input type="text" id="description" name="description"/>
          </div>
          <div className="col-md-6 input-group">
            <span className ="input-group-addon">
              Status
            </span>
            <input type="search" id="status" name="status"/>
          </div>
          <div className="input-group">
            <span class="input-group-button">
              <button className="btn btn-primary" type="submit">
                Search!
              </button>
            </span>
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
          <form className="form-horizontal">
            <AdvancedSearch/>
          </form>
          <div className="row">
            <div className="col-md-2"/>
            <div className="col-md-10">
              <a onClick={() => this.setState({expanded : false})}>Minimize</a>
            </div>
          </div>
        </div>
      );
    } else {
      return(
        <div>
          <div className="row">
            <form className="form-inline">
              <Searchbar/>
            </form>
          </div>
          <div className="row">
            <a onClick={() => this.setState({expanded : true})}>Advanced Search</a>
          </div>
        </div>
      );
    }
  }
}

class Table extends Component {

    renderLine(result){
      return(
          <tr>
            <td> <a href={result.name} >{result.name} </a> </td>
            <td> {result.author} </td>
            <td> {result.status} </td>
            <td> {result.description} </td>
            <td> {result.date} </td>
            <td> {result.fav} </td>
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
              <tr>
                <th className="col-md-3">Project</th>
                <th className="col-md-2">Author</th>
                <th className="col-md-1">Status</th>
                <th className="col-md-4">Description</th>
                <th className="col-md-1">Date</th>
                <th className="col-md-1">Fav</th>
              </tr>
              {this.renderLines(results)}
            </table>
          </div>
        );
      } else {
        return null;
      }
    }

  render() {
    return this.renderTable(results);
  }
}

class SearchPage extends Component {
  render() {
    return (
      <div class="inner-content">
        <div className="container">
          <div className="row">
            <div className="col-md-10 offset-md-2">
                <Headline />
                <Search />
                <Table />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchPage;
