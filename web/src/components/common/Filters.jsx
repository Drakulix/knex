import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import DatePicker from 'material-ui/DatePicker'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import { fetchJson } from '../common/Backend.jsx'

import ChipInputList from '../common/ChipInputList'

const statusString = [
  {text :<span className="badge badge-success">DONE</span>, value : "DONE"},
  {text :<span className="badge badge-info">IN_REVIEW</span>, value : "IN_REVIEW"},
  {text :<span className="badge badge-warning">IN_PROGRESS</span>, value : "IN_PROGRESS"},
  {text :"No filter", value : ""}
]

export default class Filters extends Component{

  constructor(props){
    super(props)
    var filters = (props.value === undefined) ? {} : props.value
    var date_from = (filters.filter_date_from !== undefined) ?
                              new Date( filters.filter_date_from.split("-")[0],
                                        filters.filter_date_from.split("-")[1]-1,
                                        filters.filter_date_from.split("-")[2],0,0,0,0)
                          : ""
    var date_to = (filters.filter_date_to !== undefined) ?
                              new Date( filters.filter_date_to.split("-")[0],
                                        filters.filter_date_to.split("-")[1]-1,
                                        filters.filter_date_to.split("-")[2],0,0,0,0)
                          : ""
    var authors = []
    if(filters.authors !== undefined){
      var dataAuthors = filters.authors
      for (var i in dataAuthors) {
        authors = authors.concat([dataAuthors[i].name + " ("+ dataAuthors[i].email+ ")"])
      }
    }

    this.state ={
      expanded : false,
      authors : authors,
      title : filters.title !== undefined ? filters.title : "",
      tags : filters.tags !== undefined ? filters.tags :[],
      status : filters.status !== undefined ? filters.status:"",
      date_from: date_from !== undefined ? date_from : '',
      date_to: date_to !== undefined ? date_to : '',
      filter_date_from :(filters.filter_date_from !== undefined) ? filters.filter_date_from:"",
      filter_date_to: (filters.filter_date_to !== undefined) ?filters.filter_date_to:"",
      description: filters.description !== undefined ? filters.description : "",
      searchString : filters.searchString !== undefined ? filters.searchString :"",
    }




    this.handleAuthorChange = this.handleAuthorChange.bind(this)
    this.handleTagChange = this.handleTagChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }


  componentDidMount() {
    //tipp: if you fetch server side data, this is the place where it should happen :)

    //gets all the exsiting tags from the backend
    fetchJson('/api/projects/tags').then(function(tags) {
      this.setState({
        suggestedTags: tags
      })
    }.bind(this))

    //gets all the authors from the backend
    fetchJson('/api/projects/authors').then(function(authors) {
      var suggestedAuthors = authors
      var suggestedAuthorsArray = []
      for (var i in suggestedAuthors) {
        suggestedAuthorsArray = suggestedAuthorsArray.concat([suggestedAuthors[i].name + " ("+suggestedAuthors[i].email+ ")"])
      }
      console.log(suggestedAuthorsArray)
      this.setState({
        suggestedAuthors: suggestedAuthorsArray
      })
    }.bind(this))


  }

  handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    this.setState({ [name]: value})
    this.props.onChange( [name], value)

  }


  dateToString(date){
    var mm = date.getMonth()+1
    var dd = date.getDate()
    return [date.getFullYear(),'-', ((mm > 9) ? '' :'0')+ mm, '-',
    ((dd> 9) ? '':'0')+ dd].join('')
  }

  handleChangeDateFrom = (event, date) => {
    this.setState({
      date_from: date,
      filter_date_from : this.dateToString(date)

    })
    this.props.onChange("filter_date_from",  this.dateToString(date))
  }

  handleChangeDateTill = (event, date) => {
    this.setState({
      date_to: date,
      filter_date_to :  this.dateToString(date)
    })
    this.props.onChange("filter_date_to", this.dateToString(date))
  }

  handleDateDelete = (event) => {
    if(event === "until"){
      this.setState({
        date_to: '',
        filter_date_to:  ''
      })
      this.props.onChange("filter_date_to", '')
    }else{
      this.setState({
        date_from: '',
        filter_date_from:  ''
      })
      this.props.onChange("filter_date_from", '')
    }
  }

  handleStatusChange = (event, index, value) => {
    this.setState({
      status:  value}
    )

    this.props.onChange("status", value)
  }



  handleAuthorChange(value) {
    this.setState({authors : value})
    this.props.onChange("authors" ,value)
  }


  handleTagChange(value) {
    this.setState({tags : value})
    this.props.onChange("tags" , value)
  }



  render(){
    return   <div style={{marginBottom:20}}>
    <Card>
      <CardHeader
        title="Filters"
        subtitle="Define filters for your search."
        actAsExpander={true}
        showExpandableButton={true}
      />
    <CardText expandable={true}>
        <div style={{ textAlign:"left", verticalAlign:"center", display:"block"}} >
          <div className="row">
            <div className="col-1 filter-label" style={{textAlign: "left"}}>Title</div>
            <div className="col-5" style={{marginLeft:-40}}>
              <TextField
                style={{width:"100%"}}
                name ="title"
                value={this.state.title}
                onChange={this.handleChange}
                type="text" placeholder="Enter exact title..."
                />
            </div>
            <div className="col-1 filter-label" style={{textAlign: "left"}}>Description</div>
            <div className="col-5">
              <TextField
                style={{width:"100%"}}
                name ="description"
                value={this.state.description}
                onChange={this.handleChange}
                type="text" placeholder="Enter exact description..."
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
            <div className="col-1 filter-label" style={{textAlign: "left" , marginLeft:2}}>From</div>
            <div className="col-1" style={{marginTop:2}}>
              <DatePicker hintText="Pick date"
                mode="landscape"
                name ="date_from"
                style={{marginLeft:-40}}
                underlineStyle={{width: '100%', marginLeft:0}}
                textFieldStyle={{width: '100%'}}
                value={this.state.date_from}
                onChange={this.handleChangeDateFrom}
                />
            </div>
            <div className="col-1 deleteDate" style={{marginTop:14}}>
              <button onClick={()=> this.handleDateDelete('from')}>x</button>
            </div>

            <div className="col-1 filter-label" style={{textAlign: "left"}}>Till</div>
            <div className="col-1" style={{marginTop:2}}>
              <DatePicker hintText="Pick date"
                mode="landscape"
                style={{marginLeft:-50}}
                name ="date_to"
                value={this.state.date_to}
                underlineStyle={{width: '90%', marginLeft:0}}
                textFieldStyle={{width: '90%'}}
                onChange={this.handleChangeDateTill}
                />
            </div>
            <div className="col-1 deleteDate" style={{marginTop:14, marginLeft:-25}}>
              <button onClick={() => this.handleDateDelete('until')}>x</button>
            </div>
            <div className="col-1 filter-label" style={{textAlign: "left", marginLeft:-16}} >Status</div>
            <div className="col-2" style={{marginTop:-3}}>
              <DropDownMenu
                onChange={this.handleStatusChange}
                value={this.state.status}
                labelStyle={{width: '100%', paddingLeft:0}}
                underlineStyle={{width: '100%', marginLeft:0}}
                autoWidth={false}
                style={{width: '100%'}}
                >
                {statusString.map(item =><MenuItem value={item.value} primaryText={item.text} />)}
              </DropDownMenu>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
    </CardText>
  </Card>

    </div>
  }
}
