import React, { Component } from 'react'
import ReactTable from 'react-table'
import { Link } from 'react-router-dom'
import IconButton from 'material-ui/IconButton'
import styles from '../../common/Styles'
import Backend from '../../common/Backend'
import Spinner from '../../common/Spinner'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import ConfirmationPane from '../../common/ConfirmationPane'
import Snackbar from 'material-ui/Snackbar'


export default class ManageUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open : false,
      loading : false,
      snackbar : false,
      snackbarText : false,
      expanded : true,
      data : [],
      filteredList : [],
      email : "",
      name : "",
      projectCounts : []
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSetAdmin = this.handleSetAdmin.bind(this)
    this.intentionToDeleteUser = this.intentionToDeleteUser.bind(this)
  }

  componentWillReceiveProps(){
    this.loadUsers()
  }

  loadUsers(){
    this.setState({loading : true,
      open : false,
      snackbar : false
    })
    Backend.getUsers()
    .then((data) => {
      this.setState({
        userList : data,
        filteredList : data,
      })
    })
    .then(() => {return  Backend.getProjectsForAllUsers()})
    .then((count) => {this.setState({projectCounts : count})})
    .then (() => this.filter ("default", ""))
    .then(() => this.setState({loading : false}))
  }


  handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    this.setState({ [name] : value})
    this.filter(name, value)
  }

  handleSetAdmin(userInf){
    var text = "User " + userInf.first_name + " " + userInf.last_name + " ";
    if(userInf.roles.includes("admin")){
      userInf.roles.splice(userInf.roles.indexOf("admin"))
      text = text + " is not admin anymore"
    }
    else {
      userInf.roles.push("admin")
      text = text + " is now admin"
    }
    Backend.setUserRoles(userInf.email,
                         userInf.first_name,
                         userInf.last_name,
                         userInf.bio,
                         userInf.roles)
    .then(() => {this.loadUsers()})
    .then(() =>{this.setState({snackbar : true, snackbarText:text})})
    }

  handleSetActive(userInf){
    var text = "User " + userInf.first_name + " " + userInf.last_name + " is "+ (userInf.active ? "de-" : "") + "activated"
    Backend.setActivation( userInf.email,
                           userInf.first_name,
                           userInf.last_name,
                           userInf.bio,
                           userInf.active === "false" ? "true" : "false"
                           )
   .then(() => {this.loadUsers()})
   .then(() =>{this.setState({snackbar : true, snackbarText:text})})
  }

  intentionToDeleteUser(userID){
    this.setState({
      open : true,
      userID : userID})
  }

  handleDelete(){
    Backend.deleteUser(this.state.userID)
    .then(() =>{this.setState({ open:false,
                                snackbar: true,
                                snackbarText : "User " + this.state.userID + " deleted"})})
    .then(() => {this.loadUsers()})
  }


  filter(name, value){
    var filteredList = []
    for(let dataObject of this.state.userList) {
      var discard = false
      var userName = (dataObject.first_name + " " + dataObject.last_name).toLowerCase()
      var email = dataObject.email.toLowerCase()
      discard = discard || email.indexOf(name === "email" ? value.toLowerCase() :  this.state.email.toLowerCase()) === -1
      discard = discard || userName.indexOf(name === "name" ? value.toLowerCase() :  this.state.name.toLowerCase()) === -1
      if(!discard)
        filteredList.push(dataObject)
    }
    this.setState({
      filteredList : filteredList
    })
  }



  render(){
    var columns = []
    columns.push({
      Header : 'Name',
      id : 'userID',
      accessor : d => d,
      Cell : props =>{
        return(
          <div style = {{whiteSpace : "normal", marginTop:5}}>
            <Link to = {`profile/${props.value.email}`}
              className = "table-link-text">
              {props.value.first_name + " " + props.value.last_name }
            </Link>
          </div>
        )
      }
    })

    columns.push({
      Header : 'Email',
      id : 'email',
      width : 300,
      style : {textAlign : "center", marginTop:5},
      accessor : d => d,
      Cell : props =>{
        return(
          <div style = {{whiteSpace : "normal"}}>
            <Link to = {`profile/${props.value.email}`}
              className = "table-link-text">
              {props.value.email}
            </Link>
          </div>
        )
      }
    })

    columns.push({
      Header : 'Projects',
      id : 'projectCount',
      width :80,
      style : {textAlign : "center", marginTop:5},
      accessor : "email",
      Cell : props => this.state.projectCounts[props.value] !== undefined ? this.state.projectCounts[props.value].length :0
    })

    columns.push({
      Header : 'Active',
      id : 'active',
      accessor : d => d,
      filterable : false,
      width : 60,
      style : {textAlign : "center"},
      Cell : props =>{
        return(
          <div onClick = {() => this.handleSetActive(props.value)}><i className="material-icons" style={{fontSize : '24px',padding:3}}>
            {props.value.active === "false" ?  "clear" : "done"}
          </i></div>)

      }
    })

    columns.push({
      Header : 'Admin',
      id : 'admin',
      width : 60,
      filterable : false,
      style : {textAlign : "center"},
      accessor : d => d,
      Cell : props =>{
        return(
          <div onClick = {() => this.handleSetAdmin(props.value)}><i className="material-icons" style={{fontSize : '24px',padding:3}}>
            {(props.value.roles.indexOf("admin") !== -1) ?  "done" : "clear"}
          </i></div>)
      }
    })

    columns.push({
      Header : 'Edit',
      accessor : d => d,
      id : 'delete',
      sortable : false,
      width : 60,
      style : {textAlign : "center"},
      Cell : props => <Link
                      to = {"/profile/"+props.value.email}>
                      <IconButton
                          touch = {true}
                          style = {styles.largeIcon}
                          iconStyle = {{fontSize : '24px'}}
                          value = {props.value._id}
                          >
                            <i className = "material-icons">mode_edit</i>
                          </IconButton>
                    </Link>
    })

    columns.push({
      Header : 'Delete',
      accessor : d => d,
      id : 'delete',
      sortable : false,
      width : 60,
      style : {textAlign : "center"},
      Cell : props => <IconButton
            onClick = {()=>this.intentionToDeleteUser(props.value.email)}
            touch = {true}
            style = {styles.largeIcon}
            iconStyle = {{fontSize : '24px'}}
            value = {props.value._id}
            >
              <i className = "material-icons">delete</i>
            </IconButton>
      })

    return (
      <div className = "container" >
        <ConfirmationPane open = {this.state.open}
                          handleClose = {() => {this.setState({open : false})}}
                          title = {"Do you want to delete user " + this.state.userID}
                          confirmationLabel = {"Delete User"}
                          confirmAction = {this.handleDelete}
        />
        <Snackbar
          open={this.state.snackbar}
          message={this.state.snackbarText}
          autoHideDuration={10000}
        />
      <Spinner loading = {this.state.loading} text ={"Loading users"} />
        <div style = {{display : (!this.state.loading ? "block" : "none")}}>
          <div style = {{marginBottom : 20, width:"100%"}}>
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
                  <div className = "col-5">
                    <TextField style = {{width : '100%'}}
                        value = {this.state.name}
                        name = "name"
                        onChange = {this.handleChange}
                        type = "text" placeholder = "Enter username..."
                    />
                  </div>
                  <div className = "col-1 filter-label">Email</div>
                  <div className = "col-5">
                    <TextField style = {{width : '100%'}}
                        value = {this.state.email}
                        name = "email"
                        onChange = {this.handleChange}
                        type = "text" placeholder = "Enter email adress..."
                    />
                  </div>
                </div>
              </CardText>
            </Card>
          </div>
          <ReactTable style = {{width : "100%"}}
                   data = {this.state.filteredList}
                   columns = {columns}
                   defaultExpanded = {{1 : true}}
                   filterable = {false}
                   minRows = {3}
                   noDataText = 'No users found'
                   showPageSizeOptions = {false}
                   defaultPageSize = {10}
                   defaultSorted = {[{
                      id : 'userID',
                      desc : true
                    }]}
          />
        </div>
      </div>
    )
  }
}
