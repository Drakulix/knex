import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import AutoComplete from 'material-ui/AutoComplete'
import RaisedButton from 'material-ui/RaisedButton';
import ChipInput from 'material-ui-chip-input';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import Snackbar from 'material-ui/Snackbar';
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import styles from '../common/Styles.jsx';



const statusString = [
  {id: "0" , text :"Done", value : "DONE"},
  {id: "1" , text :"In review", value : "IN_REVIEW"},
  {id: "2" , text :"In progress", value : "IN_PROGRESS"}];

  const log = (type) => console.log.bind(console, type);

  export default class UploadByPattern extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        projectID: this.props.match.params.getURL,
        projectInf:{},
        tags: [],
        authors: [],
        url: ['lll','lppp'],
        invalid : true,
        snackbar : false,
        value : "0",
        site_loaded: false,
        project_exists: false
      };
      this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount(){
      this.loadProjectInf(this.state.projectID);
    }


    fetchProjectInfo(uuid){
      var res;
      return fetch('/api/projects/' + uuid, {
        method: 'GET',
        mode: 'no-cors',
        credentials: 'include',
        headers: {
          "Accept": "application/json",
        }
      }).then(response => response.json()).catch(ex => {
        console.error('parsing failes', ex);
      });
    }

    loadProjectInf(uuid) {

        //TODO LOADAuthorsFromBackend

        var suggestedAuthors = [{email:"marko@knex.", name :"Marko"},
        {email:"victor@knex", name :"Victor"},{email:"cedric@knex", name :"Cedric"}];
        var suggestedAuthorsArray = []
        for (var i in suggestedAuthors) {
          suggestedAuthorsArray = suggestedAuthorsArray.concat([suggestedAuthors[i].name + " ("+suggestedAuthors[i].email+ ")"]);
        }

        //TODO LOADTagsFromBackend
        var suggestedTags = ["your", "tags", "here"];
 
      // Load Project info into state
      this.fetchProjectInfo(uuid).then(data => {
        this.setState({projectInf: data});
        if(!data){
          this.setState({project_exists: false});
        }else{
          this.setState({project_exists: true})
        }
        this.setState({site_loaded: true})
      }).catch(ex => {
        this.setState({project_exists: false});
        this.setState({site_loaded: true})
      });



        var authorArray = []
        for (var i in this.state.projectInf.authors) {
          authorArray = authorArray.concat([this.state.projectInf.authors[i].name + " ("+ this.state.projectInf.authors[i].email+ ")"]);
        }

        this.setState({
//          title :project.title,
//          status:project.status,
//          date  : new Date( project.date_creation.split("-")[0],
//          project.date_creation.split("-")[1]-1,
//          project.date_creation.split("-")[2],0,0,0,0),
//          description : project.description,
//          tags:project.tags,
//          url:project.url,
          authors: authorArray,
          suggestedAuthors: suggestedAuthorsArray,
          suggestedTags : suggestedTags,
//          value : stateValue[0].id
        });

    }


    handleRequestAdd (chip, name) {
      if(name === "authors" && this.state["suggestedAuthors"].indexOf(chip) == -1)
      return;
      if(name === "url" && chip.indexOf("http://") != 0)
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
        event.preventDefault();
        console.log(event);
        this.submit();
      }
      const name = event.target.name;
      const value = event.target.value;
      this.setState({
        [name]: value});
      }


      handleStatusChange = (event, index, value) => this.setState({value});


      handleChangeDate = (event, date) => {
        this.setState({
          date: date,
        });
      };

      onchangeUrls(){

      }

/*
      loadProjectInf(uuid) {


        //TODO LOADAuthorsFromBackend

        var suggestedAuthors = [{id:"marko@knex.", name :"Marko"},
        {id:"victor@knex", name :"Victor"},{id:"cedric@knex", name :"Cedric"}];
        var suggestedAuthorsArray = []
        for (var i in suggestedAuthors) {
          suggestedAuthorsArray = suggestedAuthorsArray.concat([suggestedAuthors[i].name + " ("+suggestedAuthors[i].id+ ")"]);
        }

        //TODO LOADTagsFromBackend
        var suggestedTags = ["your", "tags", "here"];


        //TODO LOADProjectFromBackend
        var project = {
          _id :"dsa",
          title:"Stream - 0-Follower Analysis",
          status:"DONE",
          date_creation :
          "2015-12-12", date_update:"11",
          description : "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
          tags:[
            "av","dasda",
            "adsadas"
          ],
          url:["http://google.com","http://github.org", "http://soundloud.com"],
          authors :[
            {
              id:"33", name :"dda"
            },
            {
              id:"32", name :"ddaa"
            }
          ]
        };



        var loadedStatus = project.status;
        var stateValue=  statusString.filter(
          function(data){return data.value === loadedStatus }
        );
        var authorArray = []
        for (var i in project.authors) {
          authorArray = authorArray.concat([project.authors[i].name + " ("+project.authors[i].email+ ")"]);
        }
        this.setState({
          title :project.title,
          status:project.status,
          date  : new Date( project.date_creation.split("-")[0],
          project.date_creation.split("-")[1]-1,
          project.date_creation.split("-")[2],0,0,0,0),
          description : project.description,
          tags:project.tags,
          url:project.url,
          authors: authorArray,
          suggestedAuthors: suggestedAuthorsArray,
          suggestedTags : suggestedTags,
          value : stateValue[0].id
        });
      }

*/
      submit(){
        var project = { "title"         : this.state["title"],
          "date_creation" : this.state["date"].getYear() + 1900 + "-"
          + (this.state["date"].getMonth() + 1) + "-"
          + this.state["date"].getDate(),
          "tags"          : this.state["tags"],
          "description"   : this.state["description"],
          "url"           : this.state["url"],
          "status"        : statusString[this.state["value"]].value,
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


        alert(this.state.authors)

        console.log(project);

        fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: project
        });



        this.setState({snackbar:true});

      }

      isInValid(){
        return      this.state["title"] === ''
        ||  this.state["date"] === ''
        ||  this.state["description"] == ''
        ||  this.state.authors.length == 0;
      }

      render() {
          if(!this.state.site_loaded && this.state.projectID){
            return (
              <div className="container">
                <div className="header"><CircularProgress size={80} thickness={5} /></div>
              </div>
            );
          }   
          if(!this.state.project_exists && this.state.projectID){
            return (
              <div className="container">
                <div className="header">Project Not Found</div>
              </div>
            );
          }else{
            return(
                <div className="container">
                  <div className="innerContainer">
                    <div className = "headerCreation" style={{width:"100%"}}>
                      {(this.state.projectID != undefined) ? "Edit project" : "Add new project"}
                    </div>
                    <form>
                      <div>
                        <div className="profile-info">Title</div>
                        <TextField  value={this.state.projectInf.title}
                          onChange={this.handleChange}
                          name="title"
                          hintText="Add title..."
                          style={{width:'100%'}}
                          errorText={(this.state.title=="") ? this.props.titleErrorText : ""}
                          />
                      </div>
                      <div className="row">
                        <div className="col-4">
                          <div className="row">
                            <div className="col-6">
                              <div className="profile-info">Creation date</div>
                              <div>
                                <DatePicker hintText="Pick a creation Date..."
                                  value={this.state.projectInf.date_creation}
                                  mode="landscape"
                                  onChange={this.handleChangeDate}
                                  style={{display: "inline"}}
                                  textFieldStyle={{width: '100%', marginTop:8}}
                                  errorText={(this.state.date=="") ? this.props.dateErrorText : ""}
                                  />
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="profile-info">Status</div>
                              <div>
                                <DropDownMenu  
                                  value={this.state.status}
                                  onChange={this.handleStatusChange}
                                  labelStyle={{width: '100%', paddingLeft:0}}
                                  underlineStyle={{width: '100%', marginLeft:0}}
                                  autoWidth={false}
                                  style={{width: '100%'}}
                                  >
                                  {statusString.map(item =><MenuItem value={item.id} primaryText={item.text} />)}
                                </DropDownMenu>
                              </div>
                            </div>
                          </div>
                          <div className="profile-info">Authors</div>
                          <ChipInput
                            dataSource={this.state.suggestedAuthors}
                            value={this.state.authors}
                            filter={AutoComplete.fuzzyFilter}
                            onChange={this.onChangeAuthors}
                            hintText='Add authors...'
                            errorText={(this.state.authors.length === 0) ? this.props.authorsErrorText : ""}
                            onRequestAdd={(chip) => this.handleRequestAdd(chip, "authors")}
                            onRequestDelete={(deletedChip) => this.handleRequestDelete(deletedChip, "authors")}
                            fullWidth
                            chipRenderer={({ value, isFocused, isDisabled, handleClick, handleRequestDelete }, key) => (
                              <Chip
                                key={key}
                                style= {styles["chip"]}
                                backgroundColor={styles.chip.background}
                                onTouchTap={handleClick}
                                onRequestDelete={handleRequestDelete}>
                                <span style={styles["chipText"]}> {value} </span>
                              </Chip>
                            )}/>
                            <div className="profile-info">Links</div>
                            <ChipInput
                              value={this.state.url}
                              onChange={this.onChangeUrls}
                              hintText='Add Links...'
                              onRequestAdd={(chip) => this.handleRequestAdd(chip, "url")}
                              onRequestDelete={(deletedChip) => this.handleRequestDelete(deletedChip, "url")}
                              fullWidth
                              chipRenderer={({ value, isFocused, isDisabled, handleClick, handleRequestDelete }, key) => (
                                <Chip
                                  key={key}
                                  style= {styles["chip"]}
                                  backgroundColor={styles.chip.background}
                                  onTouchTap={handleClick}
                                  onRequestDelete={handleRequestDelete}>
                                  <span style={styles["chipText"]}> {value} </span>
                                </Chip>
                              )}/>
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
                                fullWidth
                                chipRenderer={({ value, isFocused, isDisabled, handleClick, handleRequestDelete }, key) => (
                                  <Chip
                                    key={key}
                                    style= {styles["chip"]}
                                    backgroundColor={styles.chip.background}
                                    onTouchTap={handleClick}
                                    onRequestDelete={handleRequestDelete}>
                                    <span style={styles["chipText"]}> {value} </span>
                                  </Chip>
                                )}/>
                                <div className="profile-info">Description</div>
                                <TextField  value={this.state.projectInf.description}
                                  onChange={this.handleChange}
                                  name="description"
                                  hintText="Add description..."
                                  style={{width:'100%'}}
                                  multiLine={true}
                                  errorText={(this.state.description=="") ? this.props.descriptionErrorText : ""}
                                  />
                                <div className="row" style={{marginTop:100}}>
                                  <div className="col-10"></div>
                                  <div className="col-1" >
                                    <RaisedButton label="Submit"
                                      disabled={this.isInValid()}
                                      onClick={this.handleChange}
                                      primary={true}/>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <Snackbar
                          open={this.state.snackbar}
                          message="New project added!"
                          autoHideDuration={10000}
                          />
                      </div>
                    )
                  }
                }
              }

          UploadByPattern.defaultProps = {
            authorsErrorText: 'Please provide an author',
            titleErrorText: 'Please provide a title',
            dateErrorText: 'Please provide a creation date',
            descriptionErrorText: 'Please provide a description'
          }
