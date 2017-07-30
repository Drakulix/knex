import React, { Component } from 'react'
import Backend from '../common/Backend'
import { Link } from 'react-router-dom'
import Spinner from '../common/Spinner'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import TagInputList from '../common/chips/TagInputList'
import SkillOutputList from '../common/chips/SkillOutputList'


export default class ShowUsers extends Component {

  constructor(props){
    super(props)
    this.state = {
      loading : false,
      expanded : true,
      userList : [],
      filteredList : [],
      projectCounts : [],
      name : "",
      email : "",
      tags : {}
    }
    this.handleChange = this.handleChange.bind(this)
  }


  componentWillMount(){
    this.loadUsers()
  }

  loadUsers(){
    this.setState({loading : true,
      open : false,
      snackbar : false
    })
    Backend.getUsers()
    .then((data) => {
      data = data.sort(function compare (a,b){
        var a_first = (a.first_name !== undefined) ? a.first_name.toLowerCase() : ""
        var b_first = (b.first_name !== undefined) ? b.first_name.toLowerCase() : ""
        var a_last = (a.last_name !== undefined) ? a.last_name.toLowerCase() : ""
        var b_last = (b.last_name !== undefined) ? b.last_name.toLowerCase() : ""
        return a_first === b_first  ? a_last.localeCompare(b_last) : a_first.localeCompare(b_first)
      })
      for(let user in data){
        var userID = data[user].email
        Backend.getTags(userID)
        .then((data) => {
        //  this.state.tags[userID] = data
                    // this.setState({
          //   tags : tags
          // })
        })
      }
      this.setState({
        userList : data,
        loading : false,
        filteredList : data,
      })
    })
    .then(() => {return  Backend.getProjectsForAllUsers()})
    .then((count) => {this.setState({projectCounts : count})})
    .then (() => this.filter ("default", ""))
  }

  handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    this.setState({ [name] : value})
    this.filter(name, value)
  }

  filter(name, value){
    var temp = []
    for(let dataObject of this.state.userList) {
      var discard = true
      var userName = (dataObject.first_name + " " + dataObject.last_name).toLowerCase()
      value = value.toLowerCase()
      switch (name) {
        case "email":
          discard = value !== "" && dataObject.email.indexOf(value) === -1
          discard = discard || (this.state.name !== "" && userName.indexOf(this.state.name) === -1)
          break
        case "name":
          discard = value !== "" && userName.indexOf(value) === -1
          discard = discard || (this.state.email !== "" && dataObject.email.indexOf(this.state.email) === -1)
          break
        case "tags":

          discard = false
          break
        default:
          discard = false
          break
        }
        if(!discard)
          temp.push(dataObject)
      }
    this.setState({
      filteredList : temp
    })
  }

  render(){
    return (
      <div className = "container">
        <Spinner loading = {this.state.loading} text ={"Loading users"} />
        <div style = {{display : (!this.state.loading ? "block" : "none")}}>
          <div style = {{marginBottom : 20, width:"100%"}}>
            <div className = "headerCreation">Looking for a user?</div>
            <Card  onExpandChange = {() => this.setState({expanded : !this.state.expanded})}>
              <CardHeader
                  title = "Filter"
                  subtitle = "Define filters for your list"
                  actAsExpander = {true}
                  showExpandableButton = {true}
              />
              <CardText expandable = {true}>
                <div className = "row">
                  <div className = "col-1 filter-label">Name</div>
                  <div className = "col-3">
                    <TextField style = {{width : '100%'}}
                        value = {this.state.name}
                        name = "name"
                        onChange = {this.handleChange}
                        type = "text" placeholder = "Enter username..."
                    />
                  </div>
                  <div className = "col-1 filter-label">Email</div>
                  <div className = "col-3">
                    <TextField style = {{width : '100%'}}
                        value = {this.state.email}
                        name = "email"
                        onChange = {this.handleChange}
                        type = "text" placeholder = "Enter email adress..."
                    />
                  </div>
                  <div className = "col-1 filter-label">Expertise</div>
                  <div className = "col-3">
                    <TagInputList  onChange = {this.handleChange}
                                      filtered = {true}
                                      name = "tags"
                                      value = {this.state.tags}/>
                  </div>
                </div>
              </CardText>
            </Card>
            <div style={{marginTop:20}} >
                {this.state.filteredList.map((user) => (
                    <div key={user.email} style={{width : 350, float:"left", marginRight: 20, marginBottom : 20}}>
                      <Link to={"/profile/"+user.email} >
                        <div className = "row">
                          <div className = "col-4">
                            <img src = {"/api/users/"+user.email+"/avatar"}
                              width = "140"
                              height = "140"
                              alt = {user.email}
                              />
                          </div>
                          <div className = "col-1"></div>
                          <div className = "col-6" style ={{marginTop:20}}>
                            <div style = {{fontWeight : "bold", fontSize : 20}}>{user.first_name + " " +user.last_name}</div>
                            <div style = {{fontSize : 14}}>{user.email}</div>
                            <div style = {{fontSize : 16}}>{this.state.projectCounts[user.email] !== undefined ? this.state.projectCounts[user.email].length :0} Projects</div>
                            <div style = {{width : 200}}><SkillOutputList value = {this.state.tags[user.email]} /></div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
              </div>
          </div>
        </div>
      </div>
    )
  }
}
