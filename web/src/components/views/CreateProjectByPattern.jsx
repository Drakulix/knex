import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import AutoComplete from 'material-ui/AutoComplete'
import PropTypes from 'prop-types'

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import FlatButton from 'material-ui/RaisedButton';
import ChipInput from 'material-ui-chip-input'
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
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
      date: moment(),
      suggestedTags : ["your", "data", "here"],
      suggestedAuthors : ["your", "author", "here"],
      status: 'inprogress',
      title: '',
      description: '',
      tags: ["Add more Tags"],
      authors: [],
      urls: [],
      disabled : false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleRequestAdd (chip, name) {
     this.setState({
       [name]: [...this.state[name], chip]
     })
   }

  handleRequestDelete (deletedChip, name) {
     this.setState({
         [name]: this.state[name].filter((c) => c !== deletedChip)
       })
  }

  handleChange(event, value) {
    const name = event.target.name;
    this.setState({
      [name]: value});
  }

  onSubmit = ({formData}) => {

    fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    }),
    console.log(formData);
    alert("New Project added!");
  }

  loadJSON(){
    var request = new Request(this.state.sourceURL);
    var that = this;
    fetch(request)
    .then(response => response.json()).catch(ex => {
      console.error('parsing fails', ex);
    })
    .then(function(data) {
      that.setState({
        gotoCreateByPattern : true,
      });

    });
    return null
  }

  render() {
    return(
      <div className="container">
        <div className="innerContainer">
          <div className="headerCreation">Create New Project</div>
          <form>
            <div className="column"></div>
            <div>
              <div className="profile-info">Title</div>
              <TextField
                value={this.state.title}
                onChange={this.handleChange}
                name="title"
                hintText="Add title..."
                style={{width:'100%'}}/>
            </div>
            <br></br>
            <div className="row">
              <div className="col-4">
                <div className="profile-info">Status</div>
                <RadioButtonGroup
                  name="status"
                  defaultSelected="not_light"
                  valueSelected={this.state.status}
                  onChange={this.handleChange}>
                  <RadioButton
                    value="done"
                    label="Done"
                    style={styles.radioButton}/>
                  <RadioButton
                    value="inprogress"
                    label="In Progress"
                    style={styles.radioButton}/>
                    <RadioButton
                      value="pending"
                      label="Pending"
                      style={styles.radioButton}/>
                </RadioButtonGroup>
                <div className="profile-info">Date</div>
                <DatePicker
                  hintText="Pick a creation Date..."
                  mode="landscape"
                  style={{width:'100%'}}/>
                <div className="profile-info">Authors</div>
                <ChipInput
                  dataSource={this.state.suggestedAuthors}
                  value={this.state.authors}
                  filter={AutoComplete.fuzzyFilter}
                  onChange={this.onChangeAuthors}
                  hintText='Add authors...'
                  onRequestAdd={(chip) => this.handleRequestAdd(chip, "authors")}
                  onRequestDelete={(deletedChip) => this.handleRequestDelete(deletedChip, "authors")}
                  fullWidth/>
                <div className="profile-info">URL</div>
                <ChipInput
                  value={this.state.urls}
                  onChange={this.onChangeUrls}
                  hintText='Add Urls...'
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
                <TextField
                  value={this.state.description}
                  onChange={this.handleChange}
                  name="description"
                  hintText="Add description..."
                  style={{width:'100%'}}
                  multiLine={true}/>
              </div>
              <div className="col-5"></div>
              <div className="col-1">
                <FlatButton label="Submit" />
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
