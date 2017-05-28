import React, { Component } from 'react';
import data from '../../data/test_data.json';
//Return Value Simulation

class Result extends Component{
  constructor(name, author, status, description, date, fav, tags) {
    super();
    this.name = name;
    this.author = author;
    this.status = status;
    this.description = description;
    this.date = date;
    this.fav = fav;
    this.tags=tags;
  }


}

const result_one = new Result(data.project_one.title, data.project_one.authors, data.project_one.status, data.project_one.description, data.project_one.date_created, "yes", data.project_one.tags);
const result_two  = new Result(data.project_two.title, data.project_two.authors, data.project_two.status, data.project_two.description, data.project_two.date_created, "yes", data.project_two.tags);
const result_three = new Result(data.project_three.title, data.project_three.authors, data.project_three.status, data.project_three.description, data.project_three.date_created, "yes", data.project_three.tags);
const result_four = new Result(data.project_four.title, data.project_four.authors, data.project_four.status, data.project_four.description, data.project_four.date_created, "yes", data.project_four.tags);
const result_five = new Result(data.project_five.title, data.project_five.authors, data.project_five.status, data.project_five.description, data.project_five.date_created, "yes", data.project_five.tags);
const result_six = new Result(data.project_six.title, data.project_six.authors, data.project_six.status, data.project_six.description, data.project_six.date_created, "yes", data.project_six.tags);

const results = [result_one];
results.push(result_two);
results.push(result_three);
results.push(result_four);
results.push(result_five);
results.push(result_six);



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
    console.log(document.getElementById('projectName').value);
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
    this.state = {expanded : false, filter_project_name: "", filter_author: "", filter_tags: "",filter_from: "", filter_to: "", filter_description: "", filter_status: ""};
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
    constructor(props) {
      super(props);
      this.state = {
      state:null
      }
    };

    filterProjectName(results){
      var filtered_results=[];
      for(var i=0; i<results.length;i++){
        if(results[i].name.includes(this.props.project_name))
          filtered_results.push(results[i]);
      }
      return (filtered_results );
    };

    filterAuthors(results){
      var filtered_results=[];
      for(var i=0; i<results.length;i++){
        if(results[i].author.includes(this.props.authors))
          filtered_results.push(results[i]);
      }
      return (filtered_results);
    };

    filterTags(results){
      var filtered_results=[];
      for(var i=0; i<results.length;i++){
        if(results[i].tags.includes(this.props.tags))
          filtered_results.push(results[i]);
      }
      return (filtered_results);
    };

    filterStatus(results){
      var filtered_results=[];
      for(var i=0; i<results.length;i++){
        if(results[i].status.includes(this.props.status))
          filtered_results.push(results[i]);
      }
    return (filtered_results);
    };
    filterDate(results){


      var fromDate= new Date(Number(this.props.from.substring(0,4)), Number(this.props.from.substring(5,7))-1, Number(this.props.from.substring(8,10)));
      console.log(fromDate);
      var toDate= new Date(Number(this.props.to.substring(0,4)), Number(this.props.to.substring(5,7))-1, Number(this.props.to.substring(8,10)));
      var date_creation;
      var filtered_results=[];
      for(var i=0; i<results.length;i++){

        date_creation= new Date(Number(results[i].date.substring(0,4)), Number(results[i].date.substring(5,7))-1, Number(results[i].date.substring(8,10)));
        if(date_creation.getTime()>=fromDate.getTime() && date_creation.getTime()<=toDate.getTime())
          filtered_results.push(results[i]);
      }
    return (filtered_results);
    };

    renderLine(result){
      return(
          <tr>
            <td> <a className="table-project-name" href={result.name} ><u>{result.name}</u></a> </td>
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
                <th className="col-3">Project</th>
                <th className="col-2">Author</th>
                <th className="col-1">Status</th>
                <th className="col-4">Description</th>
                <th className="col-1">Date</th>
                <th className="col-1">Fav</th>
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
    if(this.props.project_name != null){
      var filtered_results=this.filterProjectName(results);
      return this.renderTable(filtered_results);
    }
    if(this.props.from != null && this.props.to!= null){
    var filtered_results=this.filterDate(results);
    return this.renderTable(filtered_results);
    }
    if(this.props.authors != null){
      var filtered_results=this.filterAuthors(results);
      return this.renderTable(filtered_results);
    }
    if(this.props.tags != null){
      var filtered_results=this.filterTags(results);
      return this.renderTable(filtered_results);
    }
    if(this.props.status!= null){
      var filtered_results=this.filterStatus(results);
      return this.renderTable(filtered_results);
    }
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
                <Table status="In progress"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
