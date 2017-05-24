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
      <h1 classname = "headline"> Looking for a Project? </h1>
    );
  }
}

class Searchbar extends Component {
  render() {
    return(
      <div>
        <input type="text" name="search"/>
        <input type="submit"/>
      </div>
    );
  }
}

class AdvancedSearch extends Component {
  render() {
    return(
      <div>
        <label for="projectName"> Project Name:
          <input type="text" id="projectName" name="projectName"/>
        </label>
        <label for="author"> Author:
          <input type="search" id="author" name="author"/>
        </label>
        <label for="tags"> Tags:
          <input type="search" id="tags" name="tags"/>
        </label>
        <label for="dateStart"> From:
          <input type="date" id="dateStart" name="dateStart"/>
        </label>
        <label for="dateEnd"> To:
          <input type="date" id="dateEnd" name="dateEnd"/>
        </label>
        <label for="description"> Description:
          <input type="text" id="description" name="description"/>
        </label>
        <label for="status"> Status:
          <input type="search" id="status" name="status"/>
        </label>
        <input type="submit"/>
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
          <form className="searchform">
            <AdvancedSearch/>
          </form>
          <a onClick={() => this.setState({expanded : false})}>Minimize</a>
        </div>
      );
    } else {
      return(
        <div>
          <form className="searchform">
            <Searchbar/>
          </form>
          <a onClick={() => this.setState({expanded : true})}>Advanced Search</a>
        </div>
      );
    }
  }
}

class Table extends Component {

    renderLine(result){
      return(
          <tr>
            <td> {result.name} </td>
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
          <table>
            <tr>
              <th>Project</th>
              <th>Author</th>
              <th>Status</th>
              <th>Description</th>
              <th>Date</th>
              <th>Fav</th>
            </tr>
            {this.renderLines(results)}
          </table>
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
      <div className="inner-content">
        <div className="headline">
          <Headline />
        </div>
        <div className="search">
          <Search />
        </div>
        <div className="table">
          <Table />
        </div>
      </div>
    );
  }
}


export default SearchPage;
