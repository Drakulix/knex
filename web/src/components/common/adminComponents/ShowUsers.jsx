import React, { Component } from 'react'
import ReactTable from 'react-table'
import { Link } from 'react-router-dom'
import IconButton from 'material-ui/IconButton'
import styles from '../../common/Styles'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import Backend from '../../common/Backend'
import CircularProgress from 'material-ui/CircularProgress'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import TextField from 'material-ui/TextField'


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
      name : ""
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSetAdmin = this.handleSetAdmin.bind(this)
  }

  handleClose(){
    this.setState({
      open : false
    })
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
    Backend.setUserRoles(userInf)
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


  handleDelete(userID){
    this.setState({
        open : true,
        userID : userID})
  }

  render(){
    var columns = []
    columns.push({
      Header : 'Users',
      id : 'userID',
      accessor : d => d,
      Cell : props =>{
        return(
          <div style = {{whiteSpace : "normal"}}>
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
      Header : 'Admin',
      id : 'admin',
      width : 100,
      filterable : false,
      style : {textAlign : "center"},
      accessor : d => d,
      Cell : props =>{
        //Horrible hack as long the Role issue is not fixed... can deliver horrible results
        return(
          <div onClick = {() => this.handleSetAdmin(props.value)}><i className="material-icons" style={{fontSize : '24px',padding:3}}>
            {(props.value.roles.includes("admin")) ?  "done" : "clear"}
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
            onClick = {()=>this.handleDelete(props.value.email)}
            touch = {true}
            style = {styles.largeIcon}
            iconStyle = {{fontSize : '24px'}}
            value = {props.value._id}
            >
              <i className = "material-icons">delete</i>
            </IconButton>
      })

    return (
      <div className = "padding">
        <ConfirmationPane open = {this.state.open}
                          userID = {this.state.userID}
                          handleUserUpdate = {this.props.handleUserUpdate}
                          handleClose = {this.handleClose}/>
        <div className = "header-tab" style = {{textAlign : "center"}}>List users</div>
          <div className = "container" style = {{display : (this.state.loading ? "block" : "none")}}>
            <div className = "header"><CircularProgress size = {80} thickness = {5} /></div>
          </div>
          <div style = {{display : (!this.state.loading ? "block" : "none")}}>
            <div className = "row" style = {{marginBottom : 20}}>
              <div className = "col-1"></div>
              <div className = "col-10">
                <Card   onExpandChange = {() => this.setState({expanded : !this.state.expanded})}>
                  <CardHeader
                    title = "Filter users by"
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
              <div className = "col-1"></div>
            </div>
            <div className = "row">
              <div className = "col-1"></div>
              <div className = "col-10">
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
              <div className = "col-1"></div>
            </div>
          </div>
        </div>
    )
  }
}

class ConfirmationPane extends Component {
  handleDelete = () =>{
    var text = "You can not delete the admin user"
    text = "User " + this.props.userID + " deleted"
    Backend.deleteUser(this.props.userID).then(
      this.props.handleUserUpdate(text)
    )
  }


  componentWillReceiveProps(props){
    this.setState({open : props.open})
  }

  render() {
    const actions = [
      <RaisedButton
        label = "Cancel"
        primary = {true}
        onTouchTap = {this.props.handleClose}
        />,
      <RaisedButton
        label = "DELETE USER"
        primary = {true}
        onTouchTap = {this.handleDelete}
        style = {{marginLeft : 20}}
        />,
    ]

    return (
      <Dialog
        title = {"Do you want to delete user "+ this.props.userID}
        actions = {actions}
        modal = {false}
        open = {this.props.open}
        onRequestClose = {this.props.handleClose}
        >
      </Dialog>
    )
  }
}
