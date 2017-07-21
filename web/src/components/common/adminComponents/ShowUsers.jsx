import React, { Component } from 'react'
import ReactTable from 'react-table'
import { Link } from 'react-router-dom'
import IconButton from 'material-ui/IconButton'
import styles from '../../common/Styles'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import Backend from '../../common/Backend'
import CircularProgress from 'material-ui/CircularProgress'


export default class ShowUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open : false,
      loading : false
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose(){
    this.setState({
      open : false
    })
  }

  componentWillReceiveProps(props){
    this.setState({
      loading : props.loading,
      open:false
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
      Header: 'Users',
      id: 'userID',
      accessor: d => d,
      filterMethod: (filter, row) => {
                  return (row[filter.id].first_name + " "
                        + row[filter.id].first_name).indexOf(filter.value) !== -1
                },
      Cell: props =>{
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
      Header: 'Email',
      id: 'email',
      accessor: d => d,
      filterMethod: (filter, row) => {
                  return row[filter.id].email.indexOf(filter.value) !== -1
                },
      Cell: props =>{
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
      Header: 'Admin',
      id: 'admin',
      width:100,
      filterable:false,
      style:{textAlign:"center"},
      accessor: d => d,
      Cell: props =>{
        return(<div></div>)
      }
    })

    columns.push({
      Header: 'Edit',
      accessor: d => d,
      id: 'delete',
      sortable:false,
      filterable:false,
      width: 60,
      style: {textAlign:"center"},
      Cell: props => <Link
                      to={"/profile/"+props.value.email}>
                      <IconButton
                          touch={true}
                          style = {styles.largeIcon}
                          iconStyle={{fontSize: '24px'}}
                          value={props.value._id}
                          >
                            <i className="material-icons">mode_edit</i>
                          </IconButton>
                    </Link>
    })

    columns.push({
      Header: 'Delete',
      accessor: d => d,
      id: 'delete',
      sortable:false,
      filterable:false,
      width: 60,
      style: {textAlign:"center"},
      Cell: props => <IconButton
            onClick={()=>this.handleDelete(props.value.email)}
            touch={true}
            style = {styles.largeIcon}
            iconStyle={{fontSize: '24px'}}
            value={props.value._id}
            >
              <i className="material-icons">delete</i>
            </IconButton>
      })

    return (
      <div className="padding">
        <ConfirmationPane open={this.state.open}
                          userID={this.state.userID}
                          handleUserUpdate={this.props.handleUserUpdate}
                          handleClose={this.handleClose}/>
        <div className="header-tab" style={{textAlign:"center"}}>List users</div>
          <div className = "container" style = {{display : (this.state.loading ? "block" : "none")}}>
            <div className = "header"><CircularProgress size = {80} thickness = {5} /></div>
          </div>
          <div style = {{display : (!this.state.loading ? "block" : "none")}}>
            <div className="row">
              <div className="col-1"></div>
              <div className="col-10">
                <ReactTable style = {{width : "100%"}}
                     data={this.props.userList}
                     columns={columns}
                     defaultExpanded={{1: true}}
                     filterable={true}
                     showPageSizeOptions={false}
                     defaultPageSize={10}
                     defaultSorted={[{
                        id: 'userID',
                        desc: true
                      }]}
                     />
              </div>
              <div className="col-1"></div>
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
    this.setState({open: props.open})
  }

  render() {
    const actions = [
      <RaisedButton
        label = "Cancel"
        primary = {true}
        onTouchTap = {this.props.handleClose}
        />,
      <RaisedButton
        label="DELETE USER"
        primary = {true}
        onTouchTap = {this.handleDelete}
        style = {{marginLeft:20}}
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
