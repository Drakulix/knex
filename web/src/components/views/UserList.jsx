import React, { Component } from 'react'
import Backend from '../common/Backend'
import { Link } from 'react-router-dom'
import Spinner from '../common/Spinner'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import TagInputList from '../common/chips/TagInputList'
import SkillOutputList from '../common/chips/SkillOutputList'
import Styles from '../common/Styles.jsx'
import Pagination from '../common/Pagination'
import HeadLine from '../common/HeadLine'


const userPerPage = 6

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
      tags : [],
      userTags : {},
      page : 0,
      pages :[[]]
    }
    this.handleChange = this.handleChange.bind(this)
  }


  componentDidMount(){
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
    this.setState({
        userList : data,
        loading : false,
        filteredList : data,
      })
    })
    .then(Backend.getAllUsersTags()
      .then((userTags) => {
        this.setState({userTags : userTags})
      })
    )
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
    var filteredList = []
    var tagsToCompare = (name === "tags") ? value : this.state.tags
    var emailValue = this.state.email.toLowerCase()
    var nameValue = this.state.name.toLowerCase()
    for(let dataObject of this.state.userList) {
      var discard = false
      var userName = (`${dataObject.first_name} ${dataObject.last_name}`).toLowerCase()
      var userEmail = dataObject.email.toLowerCase()
      discard = discard || userEmail.indexOf(name === "email" ? value.toLowerCase() :  emailValue) === -1
      discard = discard || userName.indexOf(name === "name" ? value.toLowerCase() :  nameValue) === -1
      var temp = this.state.userTags[userEmail] !== undefined ? `#${this.state.userTags[userEmail].join('#')}#` : ''
      for(let item in tagsToCompare){
        if (temp.indexOf(`#${tagsToCompare[item]}#`) === -1){
          discard = true
          break
        }
      }
      if(!discard)
          filteredList.push(dataObject)
    }
    var page = []
    var pages = []
    for(let user in filteredList){
      if(user % userPerPage === 0){
        page = []
        pages.push(page)
      }
      page.push(filteredList[user])
    }
    this.setState({
      filteredList: filteredList,
      pages: pages,
      page: page * userPerPage >=  filteredList.length ? 0 : this.state.page
    })
  }

  render(){
    return (
      <div className = "container">
        {this.state.loading ?  <Spinner loading = {true} text = {"oading users"}/> :
          <div style = {{width : "100%"}}>
          <div>
            <HeadLine title = {"Looking for a user?"}/>
            <Card  onExpandChange = {() => this.setState({expanded : !this.state.expanded})}>
              <CardHeader
                  title = "Apply filters to your search"
                  actAsExpander = {true}
                  showExpandableButton = {true}
              />
              <CardText expandable = {true}>
                <div className = "row">
                  <div className = "col-1 filter-label hidden-md-down">Name</div>
                  <div className = "col-3">
                    <TextField
                        fullWidth = {true}
                        value = {this.state.name}
                        name = "name"
                        onChange = {this.handleChange}
                        type = "text" placeholder = "Enter username..."
                    />
                  </div>
                  <div className = "col-1 filter-label hidden-md-down">Email</div>
                  <div className = "col-3">
                    <TextField
                        fullWidth = {true}
                        value = {this.state.email}
                        name = "email"
                        onChange = {this.handleChange}
                        type = "text" placeholder = "Enter email adress..."
                    />
                  </div>
                  <div className = "col-1 filter-label hidden-md-down">Expertise</div>
                  <div className = "col-3">
                    <TagInputList  onChange = {this.handleChange}
                                      filtered = {true}
                                      name = "tags"
                                      value = {this.state.tags}/>
                  </div>
                </div>
              </CardText>
            </Card>
            <div style = {{marginTop : 20, paddingLeft:15, paddingRight: 15}}>
              {this.state.pages.length === 0 ?
                <div style = {{marginTop: 60, textAlign: 'center', fontSize: 24, color: Styles.palette.disabledColor }}>No users found</div>
                  :
                <div>
                  <div>
                    {this.state.pages[this.state.page].map((user, index) => (
                      index % 3 === 0 ?
                      <div className = "row" key = {index}>
                        {this.state.pages[this.state.page].map((user, index2) => (
                          index2 >= index && index2 < index + 3 ?
                          <div className = "col-4"
                            key = {`user#${index2}`}>
                            <UserCard user = {user}
                            projectCounts = {this.state.projectCounts}
                            userTags = {this.state.userTags}/>
                          </div>
                          : ""
                        ))}
                      </div> : ""
                    ))}
                  </div>
                  <div style = {{marginBottom: "2em", position: 'fixed', marginLeft: "13em"}} className = "fixed-bottom">
                    <div className = "row">
                    <div className = "col"></div>
                    <div className = "col-6">
                      <Pagination page = {this.state.page}
                              jumpTo = {(page) => this.setState({page : page})}
                              pages = {this.state.pages.length}
                      />
                    </div>
                    <div className = "col"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        }
      </div>
    )
  }
}

class UserCard extends Component {

  render () {
    return (
      <div key = {this.props.user.email} style = {{marginRight : 20, marginBottom : 20}}>
        <Link to = {`/profile/${this.props.user.email}`}
              style = {{color : Styles.palette.textColor}}>
          <div style = {{fontWeight : "bold", fontSize : 20}}>{`${this.props.user.first_name} ${this.props.user.last_name}`}</div>
          <div className = "row" style = {{paddingLeft: 15, paddingRight: 15}}>
            <div className = "col-4 hidden-md-down">
              <img src = {`/api/users/${this.props.user.email}/avatar`}
                  style ={{width: 80, height: 80, marginTop:0}}
                  className = "rounded-circle profile-icon"
                  alt = {this.props.user.email}
              />
            <div style = {{fontSize : 16, textAlign: "center", width: "100%"}}>{this.props.projectCounts[this.props.user.email] !== undefined ? this.props.projectCounts[this.props.user.email].length : 0} Projects</div>
            </div>
            <div className = "col-8" style = {{marginTop : 0}}>
              <div className ="hidden-lg-up" style = {{fontSize : 16, textAlign: "left", width: "100%"}}>{this.props.projectCounts[this.props.user.email] !== undefined ? this.props.projectCounts[this.props.user.email].length : 0} Projects</div>
              <SkillOutputList value = {this.props.userTags[this.props.user.email]}/>
          </div>
          </div>
          <div style = {{width : "100%"}}>
          </div>
        </Link>
      </div>
    )
  }
}
