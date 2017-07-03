import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import AutoComplete from 'material-ui/AutoComplete'
import PropTypes from 'prop-types'

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/RaisedButton';
import ChipInput from 'material-ui-chip-input'
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

const styles = {
  chip: {
    margin: 6,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};


const log = (type) => console.log.bind(console, type);

export default class UploadByPattern extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      _id:'',
      date: '',
      status: 'inprogress',
      title: '',
      description: '',
      tags: ["MA"],
      authors: [],
      urls: [],
      invalid : true,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    this.loadProjectInf(this.props.match.params.uuid);
  }

  handleRequestAdd (chip, name) {
    if(name == "authors" && this.state["suggestedAuthors"].indexOf(chip) == -1)
        return;
    if(name == "urls" && chip.indexOf("http://") != 0)
        return;
     this.setState({
       [name]: [...this.state[name], chip]
     })
   }

  handleRequestDelete (deletedChip, name) {
     this.setState({
         [name]: this.state[name].filter((c) => c !== deletedChip)
       })
  }

  handleChange(event) {
    if(typeof event.target.name  === "undefined"){
      this.submit();
    }
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value});
  }


  handleChangeDate = (event, date) => {
    this.setState({
      date: date,
    });
  };


  loadProjectInf(uuid) {
    var suggestedAuthors = [{id:"marko@knex.", name :"Marko"},
    {id:"victor@knex", name :"Victor"},{id:"cedric@knex", name :"Cedric"}];
    var suggestedAuthorsArray = []
    for (var i in suggestedAuthors) {
      suggestedAuthorsArray = suggestedAuthorsArray.concat([suggestedAuthors[i].name + " ("+suggestedAuthors[i].id+ ")"]);
    }
    var suggestedTags = ["your", "tags", "here"];

    //TODO LOAD

    this.setState(
      {_id :"dsa", title:"TestProject", status:"done",
        date: new Date(2012,11,11,0,0,0,0), description : "lirum larum",
        tags:["recommender","tags", "music"], urls:["http://test","http://git", "http://ggole"]
      });
    var authors = [{id:"33", name :"dda"},{id:"32", name :"ddaa"},{id:"323", name :"kk"}];
    var authorArray = []
    for (var i in authors) {
      authorArray = authorArray.concat([authors[i].name + " ("+authors[i].id+ ")"]);
    }

    this.setState({authors: authorArray});
    this.setState({suggestedAuthors: suggestedAuthorsArray});
    this.setState({suggestedTags : suggestedTags});
  }


  submit(){
    var project = { "title"         : this.state["title"],
                    "date_creation" : this.state["date"].getYear() + 1900 + "-"
                                    + (this.state["date"].getMonth() + 1) + "-"
                                    + this.state["date"].getDate(),
                    "tags"          : this.state["tags"],
                    "description"   : this.state["description"],
                    "url"           : this.state["urls"],
                    "status"        : this.state["status"],
                    "authors"        : []
                    };
    var authorArray = this.state["authors"];
    for (var i in authorArray) {
      var string = authorArray[i];
      var name = string.substring(0, string.lastIndexOf("(")-1);
      var id = string.substring(string.lastIndexOf("(")+1, string.length-1);
      project.authors = project.authors.concat([{"name" : name, "email" :id}]);
    }
    //TODO SEND
  }

  isInValid(){
    return this.state["title"] === ''
            ||  this.state["date"] === ''
            ||  this.state.authors.length == 0;
  }

  render() {
      return(
        <div className="container">
          <div className="innerContainer">
            <div className="headerCreation">Create New Project</div>
            <form>
              <div>
                <div className="profile-info">Title</div>
                <TextField  value={this.state.title}
                            onChange={this.handleChange}
                            name="title"
                            hintText="Add title..."
                            style={{width:'100%'}}
                            errorText={(this.state.title=="") ? this.props.titleErrorText : ""}
                            />
              </div>
              <br></br>
              <div className="row">
                <div className="col-4">
                  <div className="profile-info">Status</div>
                    <RadioButtonGroup name="status"
                                      defaultSelected="Done"
                                      valueSelected={this.state.status}
                                      onChange={this.handleChange}>
                    <RadioButton
                      value="done"
                      label="Done"
                      style={styles.radioButton}/>
                    <RadioButton
                      value="inprogress"
                      label="In progress"
                      style={styles.radioButton}/>
                  </RadioButtonGroup>
                  <div className="profile-info">Date</div>
                    <DatePicker hintText="Pick a creation Date..."
                                value={this.state.date}
                                mode="landscape"
                                onChange={this.handleChangeDate}
                                style={{width:'100%'}}
                                errorText={(this.state.date=="") ? this.props.dateErrorText : ""}
                                />
                  <div className="profile-info">Authors</div>
                    <ChipInput
                         dataSource={this.state.suggestedAuthors}
                         value={this.state.authors}
                         filter={AutoComplete.fuzzyFilter}
                         onChange={this.onChangeAuthors}
                         hintText='Add authors...'
                         errorText={(this.state.authors=="") ? this.props.authorsErrorText : ""}
                         onRequestAdd={(chip) => this.handleRequestAdd(chip, "authors")}
                         onRequestDelete={(deletedChip) => this.handleRequestDelete(deletedChip, "authors")}
                         fullWidth/>
                       <div className="profile-info">Links</div>
                    <ChipInput
                         value={this.state.urls}
                         onChange={this.onChangeUrls}
                         hintText='Add Links...'
                         onRequestAdd={(chip) => this.handleRequestAdd(chip, "urls")}
                         onRequestDelete={(deletedChip) => this.handleRequestDelete(deletedChip, "urls")}
                         fullWidth/>
                </div>
                <div className="col-1"></div>
                <div className="col-7">
                  <div className="profile-info"> Tags</div>
                    <ChipInput
                         dataSource={this.state.suggestedTags}
                         value={this.state.tags}
                         filter={AutoComplete.fuzzyFilter}
                         onRequestAdd={(chip) => this.handleRequestAdd(chip, "tags")}
                         onRequestDelete={(deletedChip) => this.handleRequestDelete(deletedChip, "tags")}
                         hintText='Add tags...'
                         fullWidth/>
                <div className="profile-info">Description</div>
                  <TextField  value={this.state.description}
                              onChange={this.handleChange}
                              name="description"
                              hintText="Add description..."
                              style={{width:'100%'}}
                              multiLine={true}/>
                </div>
                <div className="col-5"></div>
                <div className="col-1">
                  <FlatButton label="Submit" disabled={this.isInValid()} onClick={this.handleChange} />
                </div>
              </div>
              </form>
            </div>
          </div>
      )
  }
}

UploadByPattern.defaultProps = {
  authorsErrorText: 'Please provide an author',
  titleErrorText: 'Please provide a title',
  dateErrorText: 'Please provide a creation date'
}
