import React, { Component } from 'react'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import Moment from 'moment'
import AuthorInputList from '../common/chips/AuthorInputList'
import TagInputList from '../common/chips/TagInputList'
import {StatusInput }from '../common/Status'


export default class Filters extends Component{

  constructor(props){
    super(props)
    var filters = (props.value === undefined) ? {} : props.value

    this.state = {
      expanded : Object.keys(filters).length > 0,
      authors : filters.authors !== undefined ? filters.authors : [],
      title : filters.title !== undefined ? filters.title : "",
      tags : filters.tags !== undefined ? filters.tags : [],
      status : filters.status !== undefined ? filters.status : "",
      picker_date_from : (filters.date_from !== undefined) ? Moment(filters.date_from, "YYYY-MM-DD").toDate():null,
      picker_date_to : (filters.date_to !== undefined) ? Moment(filters.date_to, "YYYY-MM-DD").toDate():null,
      date_from : (filters.date_from !== undefined) ? filters.date_from : null,
      date_to : (filters.date_to !== undefined) ? filters.date_to : null,
      description : filters.description !== undefined ? filters.description : "",
      searchString : filters.searchString !== undefined ? filters.searchString : "",
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    this.setState({ [name] : value})
    this.props.onChange( [name], value)
  }

  handleChangeDateFrom = (event, date) => {
    this.setState({
      picker_date_from : date,
      date_from : Moment(date).format("YYYY-MM-DD")
    })
    this.props.onChange("date_from",  Moment(date).format("YYYY-MM-DD"))
  }

  handleChangeDateTill = (event, date) => {
    this.setState({
      picker_date_to : date,
      date_to : Moment(date).format("YYYY-MM-DD")
    })
    this.props.onChange("date_to", Moment(date).format("YYYY-MM-DD"))
  }

  handleDateDelete = (event) => {
    if(event === "until"){
      this.setState({
        picker_date_to : null,
        date_to : ""
      })
      this.props.onChange("date_to", undefined)
    }else{
      this.setState({
        picker_date_from : null,
        date_from : ""
      })
      this.props.onChange("date_from", undefined)
    }
  }

  handleStatusChange = (event, index, value) => {
    this.setState({
      status : value}
    )
    this.props.onChange("status", value)
  }

  render(){
    return (
      <div style = {{marginBottom : 20}}>
        <Card  expanded = {this.state.expanded} onExpandChange={() => this.setState({expanded : !this.state.expanded})}>
        <CardHeader
          title = {this.props.title}
          actAsExpander = {true}
          showExpandableButton = {true}
        />
        <CardText expandable = {true}>
          <div style = {{ textAlign : "left", verticalAlign : "center", display : "block"}} >
            <div className = "row">
              <div className = "col-1 filter-label" style = {{textAlign : "left"}}>Title</div>
              <div className = "col-5" style = {{marginLeft : -40}}>
                <TextField
                  style = {{width : "100%"}}
                  name  = "title"
                  value = {this.state.title}
                  onChange = {this.handleChange}
                  type = "text" placeholder = "Enter exact title..."
                  />
              </div>
              <IconButton style = {{color : 'gray', marginLeft : -30, visibility : (this.state.title !== '') ? "visible" : "hidden"}} onClick = {() => this.handleChange({target : {name :"title", value :""}})}>
                <i className = "material-icons">cancel</i>
              </IconButton>
              <div className = "col-1 filter-label" style = {{textAlign : "left"}}>Description</div>
              <div className = "col-5">
                <TextField
                  style = {{width : "100%"}}
                  name  = "description"
                  value = {this.state.description}
                  onChange = {this.handleChange}
                  type = "text" placeholder = "Enter exact description..."
                  />
              </div>
              <IconButton style = {{color : 'gray', marginLeft : -30, visibility : (this.state.description !== "") ? "visible" : "hidden"}} onClick = {() => this.handleChange({target : {name :"description", value :""}})}>
                <i className = "material-icons">cancel</i>
              </IconButton>
            </div>
            <div className = "row">
              <div className = "col-1 filter-label">Tags</div>
              <div  className = "col-5" style = {{marginLeft : -40}}>
                <TagInputList  onChange = {this.handleChange}
                                  filtered = {true}
                                  name = "tags"
                                  value = {this.state.tags}
                  />
              </div>
              <IconButton style = {{color : 'gray', marginLeft : -30, visibility : (this.state.tags.length !== 0) ? "visible" : "hidden"}} onClick = {() => this.handleChange({target : {name :"tags", value :[]}})}>
                <i className = "material-icons">cancel</i>
              </IconButton>
              <div className = "col-1 filter-label"> Authors</div>
              <div  className = "col-5">
                <AuthorInputList  onChange = {this.handleChange}
                                  filtered = {true}
                                  name = "authors"
                                  value = {this.state.authors}
                  />
              </div>
              <IconButton style = {{color : 'gray', marginLeft : -30, visibility : (this.state.authors.length !== 0) ? "visible" : "hidden"}} onClick = {() => this.handleChange({target : {name :"authors", value :[]}})}>
                <i className = "material-icons">cancel</i>
              </IconButton>
            </div>
            <div className = "row">
              <div className = "col-1 filter-label" style = {{textAlign : "left" , marginLeft : 2}}>From</div>
              <div className = "col-2" style = {{marginTop : 2}}>
                <DatePicker hintText = "Pick date"
                  mode = "landscape"
                  name  = "date_from"
                  style = {{marginLeft : -40}}
                  underlineStyle = {{width : '100%', marginLeft : 0}}
                  textFieldStyle = {{width : '100%'}}
                  value = {this.state.picker_date_from}
                  onChange = {this.handleChangeDateFrom}
                  />
              </div>
              <IconButton style = {{color : 'gray', marginLeft : -30, visibility : (this.state.picker_date_from != null) ? "visible" : "hidden"}} onClick = {()=> this.handleDateDelete('from')}>
                <i className = "material-icons">cancel</i>
              </IconButton>
              <div className = "col-1 filter-label" style = {{textAlign : "left", marginLeft : -20}}>To</div>
              <div className = "col-2" style = {{marginTop : 2}}>
                <DatePicker hintText = "Pick date"
                  mode = "landscape"
                  style = {{marginLeft : -50}}
                  name  = "date_to"
                  value = {this.state.picker_date_to}
                  underlineStyle = {{width : '90%', marginLeft : 0}}
                  textFieldStyle = {{width : '90%'}}
                  onChange = {this.handleChangeDateTill}
                  />
              </div>
              <IconButton style = {{color : 'gray', marginLeft : -60, visibility : (this.state.picker_date_to != null) ? "visible" : "hidden"}} onClick = {() => this.handleDateDelete('until')}>
                <i className = "material-icons" style = {{color : 'gray', marginLeft : -30}}>cancel</i>
              </IconButton>
              <div className = "col-1 filter-label" style = {{textAlign : "left", marginLeft : -12}} >Status</div>
              <div className = "col-2" style = {{marginTop : -3}}>
                <StatusInput onChange = {this.handleStatusChange}
                            value = {this.state.status}
                />
              </div>
              <IconButton style = {{color : 'gray', marginLeft : -20, visibility : (this.state.status !== "") ? "visible" : "hidden"}} onClick = {() => this.handleStatusChange(null,null,"")}>
                <i className = "material-icons" style = {{color : 'gray', marginLeft : -30}}>cancel</i>
              </IconButton>
              <div className = "col-1"></div>
            </div>
          </div>
      </CardText>
        </Card>
      </div>
    )
  }
}
