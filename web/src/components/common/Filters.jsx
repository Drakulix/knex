import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem';

import ChipInputList from '../common/ChipInputList';



const statusString = [
  {id: "0" , text :"Done", value : "DONE"},
  {id: "1" , text :"In review", value : "IN_REVIEW"},
  {id: "2" , text :"In progress", value : "IN_PROGRESS"}];

  export default class Filters extends React.Component{

    constructor(props){
      super(props);
      this.state ={
        expanded : false,
        authors : [],
        title : "",
        tags : [],
        status : "",
        date_from:"",
        date_till:"",
        filter_date_from :"",
        filter_date_to:"",
        description:"",
        searchString :"",
      }
      this.handleAuthorChange = this.handleAuthorChange.bind(this);
      this.handleTagChange = this.handleTagChange.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }


    componentWillMount(){
      this.setState({suggestedAuthors :["aaa", "bbb"]})    ;
      this.setState({suggestedTags :[        "multimedia indexing",
        "rich media",  
        "music information retrieval",  
        "Algorithms",  
        "Design",
        "Experimentation", 
        "Music information retrieval",
        "Web content mining",
        "Information systems",
        "Stream",
        "Mobile"  ]})    ;
      }



      handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value});
        this.props.onChange( [name], value);

      }

      handleChangeDateFrom = (event, date) => {
        this.setState({
          date_from: date,
          filter_date_from :  date.getYear() + 1900 + "-" + (date .getMonth() + 1) + "-"  + date.getDate()

        });

        this.props.onChange("filter_date_from",  date.getYear() + 1900 + "-" + (date .getMonth() + 1) + "-"  + date.getDate());

      };

      handleChangeDateTill = (event, date) => {
        this.setState({
          date_till: date,
          filter_date_to :  date.getYear() + 1900 + "-" + (date .getMonth() + 1) + "-"  + date.getDate()
        });

        this.props.onChange("filter_date_to",  date.getYear() + 1900 + "-" + (date .getMonth() + 1) + "-"  + date.getDate());

      };


      handleStatusChange = (event, index, value) => {
        this.setState({value : value,
          status:  statusString[value].value}
        );

        this.props.onChange("status", statusString[value].value);
      }



      handleAuthorChange(value) {
        this.setState({authors : value});
        this.props.onChange("authors" ,value);
      }


      handleTagChange(value) {
        this.setState({tags : value});
        this.props.onChange("tags" , value);
      }


      render(){
        return   <div style={{marginBottom:20}}>
          <div style={{display:(this.state.expanded) ? "none" : "block"}}>
          <div className="row" >
            <div className="col-10"></div>
            <div className="col-2" style={{textAlign:"center",marginTop: 0, marginBottom: 20}}>
              <RaisedButton  style={{width:"100%"}} onClick={() => this.setState({expanded: true})} label="Show filters" primary={true}/>
            </div>
          </div>
          </div>

          <div style={{ textAlign:"left", verticalAlign:"center", display:(this.state.expanded) ? "block" : "none"}} >
            <div className="row">
              <div className="col-1 filter-label" style={{textAlign: "left"}}>Title</div>
              <div className="col-5" style={{marginLeft:-40}}>
                <TextField
                  style={{width:"100%"}}
                  name ="title"
                  onChange={this.handleChange}
                  type="text" placeholder="Enter exact  title..."
                  />
              </div>
              <div className="col-1 filter-label" style={{textAlign: "left"}}>Description</div>
              <div className="col-5">
                <TextField
                  style={{width:"100%"}}
                  name ="description"
                  onChange={this.handleChange}
                  type="text" placeholder="Enter exact  description..."
                  />
              </div>
            </div>
            <div className="row">
              <div className="col-1 filter-label">Tags</div>
              <div  className="col-5" style={{marginLeft:-40}}>
                <ChipInputList suggestions = {this.state.suggestedTags}
                  onChange={this.handleTagChange}
                  filtered ={true}
                  value={this.state.tags}
                  hintText={'Add tags...'}
                  />
              </div>
              <div className="col-1 filter-label"> Authors</div>
              <div  className="col-5">
                <ChipInputList suggestions = {this.state.suggestedAuthors}
                  onChange={this.handleAuthorChange}
                  filtered ={true}
                  value={this.state.authors}
                  hintText={'Add authors...'}
                  />

              </div>
            </div>
            <div className="row">
              <div className="col-1 filter-label" style={{textAlign: "left"}}>From</div>
              <div className="col-2" style={{marginTop:3}}>
                <DatePicker hintText="Pick date from... "
                  mode="landscape"
                  name ="date_from"
                  style={{marginLeft:-40}}
                  underlineStyle={{width: '100%', marginLeft:0}}
                  textFieldStyle={{width: '100%'}}
                  value={this.state.date_from}
                  onChange={this.handleChangeDateFrom}
                  />
              </div>

              <div className="col-1 filter-label" style={{textAlign: "left"}}>Till</div>
              <div className="col-2" style={{marginTop:3}}>
                <DatePicker hintText="Pick date until..."
                  mode="landscape"
                  style={{marginLeft:-50}}
                  name ="date_till"
                  value={this.state.date_till}
                  underlineStyle={{width: '90%', marginLeft:0}}
                  textFieldStyle={{width: '90%'}}
                  onChange={this.handleChangeDateTill}
                  />
              </div>
              <div className="col-1 filter-label" style={{textAlign: "left", marginLeft:-43}} >Status</div>
              <div className="col-2" style={{marginTop:-3}}>
                <DropDownMenu
                  onChange={this.handleStatusChange}
                  value={this.state.value}
                  hintText="Pick a status..."
                  labelStyle={{width: '100%', paddingLeft:0}}
                  underlineStyle={{width: '100%', marginLeft:0}}
                  autoWidth={false}
                  style={{width: '100%'}}
                  >
                  {statusString.map(item =><MenuItem value={item.id} primaryText={item.text} />)}
                </DropDownMenu>
              </div>
              <div className="col-1"></div>
              <div className="col-2" style={{textAlign:"right",marginTop: 0, marginLeft: 43}}>
                  <RaisedButton  style={{width:"100%"}} onClick={() => this.setState({expanded: false})} label= "Hide filters" primary={true}/>
              </div>
            </div>
          </div>
        </div>
      }
}
