import React, { Component } from 'react'
import ReactTable from 'react-table'
import { Link } from 'react-router-dom'
import Styles from '../../common/Styles'
import Backend from '../../common/Backend'
import CircularProgress from 'material-ui/CircularProgress'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import ConfirmationPane from '../../common/ConfirmationPane'
import Snackbar from 'material-ui/Snackbar'
import Delete from 'material-ui/svg-icons/action/delete'
import Yes from 'material-ui/svg-icons/action/done'
import No from 'material-ui/svg-icons/content/clear'
import Edit from 'material-ui/svg-icons/editor/mode-edit'
import history from '../../common/history'


const style = {
  button: {
    width: 24,
    height: 24,
    verticalAlign: "middle",
    color: Styles.palette.textColor,
    cursor: 'pointer'
  }
}

export default class ManageUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      loading: false,
      snackbar: false,
      snackbarText: false,
      expanded: true,
      data: [],
      filteredList: [],
      email: "",
      name: "",
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
    this.setState({loading: true,
      userList: [],
      filteredList: [],
      open: false,
      snackbar: false
    })
    Backend.getUsers()
    .then((data) => {
      this.setState({
        userList: data,
        filteredList: data,
      })
    })
    .then (() => this.filter ("default", ""))
    .then(() => this.setState({loading: false}))
  }


  handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    this.setState({ [name]: value})
    this.filter(name, value)
  }

  handleSetAdmin(userInf){
    var text = `User ${userInf.first_name} ${userInf.last_name} `
    if(userInf.roles.includes("admin")){
      userInf.roles.splice(userInf.roles.indexOf("admin"))
      text = `${text} is not admin anymore`
    }
    else {
      userInf.roles.push("admin")
      text = `${text} is now admin`
    }
    Backend.setUserRoles(userInf.email,
                         userInf.first_name,
                         userInf.last_name,
                         userInf.bio,
                         userInf.roles)
    .then(() => {this.loadUsers()})
    .then(() =>{this.setState({snackbar: true, snackbarTex: text})})
    }

  handleSetActive(userInf){
    var text = `User ${userInf.first_name} ${userInf.last_name}  is ${userInf.active ? "de-": ""}activated`
    Backend.setActivation( userInf.email,
                           userInf.first_name,
                           userInf.last_name,
                           userInf.bio,
                           userInf.active === "false" ? "true": "false"
                           )
   .then(() => {this.loadUsers()})
   .then(() =>{this.setState({snackbar: true, snackbarTex: text})})
  }

  intentionToDeleteUser(userID){
    this.setState({
      open: true,
      userID: userID})
  }

  handleDelete(){
    Backend.deleteUser(this.state.userID)
    .then(() =>{this.setState({ ope: false,
                                snackba: true,
                                snackbarText: `User ${this.state.userID} deleted`})})
    .then(() => {this.loadUsers()})
  }


  filter(name, value){
    var filteredList = []
    for(let dataObject of this.state.userList) {
      var discard = false
      var userName = `${dataObject.first_name} ${dataObject.last_name}`.toLowerCase()
      var email = dataObject.email.toLowerCase()
      discard = discard || email.indexOf(name === "email" ? value.toLowerCase(): this.state.email.toLowerCase()) === -1
      discard = discard || userName.indexOf(name === "name" ? value.toLowerCase(): this.state.name.toLowerCase()) === -1
      if(!discard)
        filteredList.push(dataObject)
    }
    this.setState({
      filteredList: filteredList
    })
  }

  render(){
    var columns = []
    columns.push({
      Header: 'Name',
      id: 'userID',
      accessor: d => d,
      Cell: props =>{
        return(
          <div style = {{whiteSpace: "normal", marginTo: 5}}>
            <Link to = {`profile/${props.value.email}`}
              style = {{fontWeight: "bold", color: Styles.palette.textColor}}>
              {`${props.value.first_name} ${props.value.last_name}`}
            </Link>
          </div>
        )
      }
    })

    columns.push({
      Header: 'Email',
      id: 'email',
      width: 300,
      style: {textAlign: "center", marginTo: 5},
      accessor: d => d,
      Cell: props =>{
        return(
          <div style = {{whiteSpace: "normal"}}>
            <Link to = {`profile/${props.value.email}`}
              style = {{fontWeight: "bold", color: Styles.palette.textColor}}>
              {props.value.email}
            </Link>
          </div>
        )
      }
    })

    columns.push({
      Header: 'Projects',
      id: 'project_count',
      width :80,
      style: {textAlign: "center", marginTo: 5},
      accessor: d => d,
      Cell: props => <div style= {{color: Styles.palette.textColor}}>{props.value.project_count}</div>
    })

    columns.push({
      Header: 'Active',
      id: 'active',
      accessor: d => d,
      filterable: false,
      width: 60,
      style: {textAlign: "center"},
      Cell: props =>
          <div onClick = {() => this.handleSetActive(props.value)}>
            {props.value.active === "true" ? <Yes style= {style.button}/> : <No style = {style.button}/>}
          </div>
    })

    columns.push({
      Header: 'Admin',
      id: 'admin',
      width: 60,
      filterable: false,
      style: {textAlign: "center"},
      accessor: d => d,
      Cell: props =>
          <div onClick = {() => this.handleSetAdmin(props.value)}>
            {(props.value.roles.indexOf("admin") !== -1) ? <Yes style = {style.button}/> : <No style = {style.button}/>}
          </div>
    })

    columns.push({
      Header: 'Edit',
      accessor: d => d,
      id: 'delete',
      sortable: false,
      width: 60,
      style: {textAlign: "center"},
      Cell: props =>
          <div onClick = {()=>history.push(`/profile/${props.value.email}`)}>
            <Edit style= {style.button}/>
          </div>
    })
    columns.push({
      Header: 'Delete',
      accessor: d => d,
      id: 'delete',
      sortable: false,
      width: 60,
      style: {textAlign: "center"},
      Cell: props =>
        <div onClick = {()=>this.intentionToDeleteUser(props.value.email)}>
          <Delete style= {style.button}/>
        </div>
      })

    return (
      <div className = "container" >
        <ConfirmationPane open = {this.state.open}
                          handleClose = {() => {this.setState({open: false})}}
                          title = {`Do you want to delete user ${this.state.userID}`}
                          confirmationLabel = {"Delete User"}
                          confirmAction = {this.handleDelete}
        />
        <Snackbar
          open = {this.state.snackbar}
          message = {this.state.snackbarText}
          autoHideDuration = {10000}
        />
        <div style = {{marginBottom: 20, widt: "100%"}}>
          <Card  onExpandChange = {() => this.setState({expanded: !this.state.expanded})}>
            <CardHeader
                title = "Filter"
                subtitle = "Define filters for your list"
                actAsExpander = {true}
                showExpandableButton = {true}
            />
            <CardText expandable = {true}>
              <div className = "row">
                <div className ="hidden-lg-up col"/>
                <div className = "col-1 filter-label hidden-md-down">Name</div>
                <div className = "col-5">
                  <TextField
                      value = {this.state.name}
                      name = "name"
                      fullWidth = {true}
                      onChange = {this.handleChange}
                      type = "text" placeholder = "Enter username..."
                  />
                </div>
                <div className = "col-1 filter-label hidden-md-down">Email</div>
                <div className = "col-5">
                  <TextField style = {{width: '100%'}}
                      value = {this.state.email}
                      name = "email"
                      onChange = {this.handleChange}
                      type = "text" placeholder = "Enter email adress..."
                  />
                </div>
                <div className ="hidden-lg-up col"/>
              </div>
            </CardText>
          </Card>
        </div>
        <ReactTable style = {{width: "100%"}}
                 data = {this.state.filteredList}
                 columns = {columns}
                 defaultExpanded = {{1: true}}
                 filterable = {false}
                 minRows = {3}
                 showPageSizeOptions = {false}
                 noDataText = {() =>
                   (this.state.loading) ?
                     <CircularProgress  size = {45} thickness = {5} />: "No users found"
                 }
                 defaultPageSize = {10}
                 defaultSorted = {[{
                    id: 'userID',
                    desc: true
                  }]}
        />
      </div>
    )
  }
}
