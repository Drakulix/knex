import React, { Component } from 'react'
import ReactTable from 'react-table'
import { Link } from 'react-router-dom'
import IconButton from 'material-ui/IconButton'
import styles from '../../common/Styles'
import Backend from '../../common/Backend'
import CircularProgress from 'material-ui/CircularProgress'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import ConfirmationPane from '../../common/ConfirmationPane'


export default class ShowUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open : false,
      loading : false,
      expanded : true,
      data : this.props.userList,
      filteredList : this.props.userList,
      email : "",
      name : "",
      projectCounts : []
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSetAdmin = this.handleSetAdmin.bind(this)
    this.intentionToDeleteUser = this.intentionToDeleteUser.bind(this)
  }


  componentWillMount(){
    Backend.getProjectsForAllUsers()
    .then(function (count) {this.setState({projectCounts : count})}.bind(this))
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
      text = text + " is not Admin anymore"
    }
    else {
      userInf.roles.push("admin")
      text = text + " is now Admin"
    }
    Backend.setUserRoles(userInf.email,
                         userInf.first_name,
                         userInf.last_name,
                         userInf.bio,
                         userInf.roles)
    .then(this.props.handleUserUpdate(text))
  }

  handleSetActive(userInf){
    var text = "User " + userInf.first_name + " " + userInf.last_name + " is "+ (userInf.active ? "de-" : "") + "activated"
    Backend.setActivation( userInf.email,
                           userInf.first_name,
                           userInf.last_name,
                           userInf.bio,
                           userInf.active ? "false" : "true")
    .then(this.props.handleUserUpdate(text))
  }

  componentWillReceiveProps(props){
    this.setState({
      loading : props.loading,
      open : false,
      data : props.userList,
      filteredList : props.userList
    })
    this.filter("default", "")
  }

  filter(name, value){
    var temp = []
    for(let dataObject of this.state.data) {
      var discard = true
      var userName = dataObject.first_name + " " + dataObject.last_name
      switch (name) {
        case "email":
          discard = value !== "" && dataObject.email.indexOf(value) === -1
          discard = discard || (this.state.name !== "" && userName.indexOf(this.state.name) === -1)
          break;
        case "name":
          discard = value !== "" && userName.indexOf(value) === -1
          discard = discard || (this.state.email !== "" && dataObject.email.indexOf(this.state.email) === -1)
          break;
        default:
          discard = this.state.name !== "" && userName.indexOf(this.state.name) === -1
          discard = discard || (this.state.email !== "" && dataObject.email.indexOf(this.state.email) === -1)
          break
        }
        if(!discard)
          temp.push(dataObject)
      }
    this.setState({
      filteredList : temp
    })
  }

  intentionToDeleteUser(userID){
    this.setState({
      open : true,
      userID : userID})
  }

  handleDelete(){
    Backend.deleteUser(this.state.userID).then(function confirm(){
      this.setState({open:false})
      this.props.handleUserUpdate("User " + this.state.userID + " deleted")
    }.bind(this))
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
      Cell : props => this.state.projectCounts[props.value].length
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
            {props.value.active ?  "done" : "clear"}
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
      <div>
        <ConfirmationPane open = {this.state.open}
                          handleClose = {() => {this.setState({open : false})}}
                          title = {"Do you want to delete user " + this.state.userID}
                          confirmationLabel = {"Delete User"}
                          confirmAction = {this.handleDelete}
        />
        <div className = "container" style = {{display : (this.state.loading ? "block" : "none")}}>
          <div className = "header"><CircularProgress size = {80} thickness = {5} /></div>
        </div>
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
