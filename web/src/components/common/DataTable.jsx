import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactTable from 'react-table'
import Backend from './Backend'
import Filters from './Filters'
import IconButton from 'material-ui/IconButton'
import Chip from 'material-ui/Chip'
import styles from '../common/Styles.jsx'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'

export default class BookmarksTable extends Component {

  constructor(props) {
    super(props)
    var filters = {}
    if(props.predefinedFilter !== undefined){
      filters = props.predefinedFilter
    }

    this.state = {
      data: [{
      }],
      filters : filters,
      filteredTable : [{
      }],
      handler : this.props.fetchHandler,
      //url : props.fetchURL,
      dialogOpen : false,
      dialogText : "",
      projectTitle : "",
      projectID : "",
      action : null,
      loading : true,
      buttonText : "DELETE",
      snackbar : false,
      snackbarText : ""
    }

    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddBookmark = this.handleAddBookmark.bind(this)
    this.handleRemoveBookmark = this.handleRemoveBookmark.bind(this)
    this.handleArchive = this.handleArchive.bind(this)
    this.handleUnArchive = this.handleUnArchive.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.fetchData()
  }

  handleDelete(projectID, projectName){
    this.setState({dialogOpen : true,
      snackbar : false,
      dialogText : "Do you want to delete project " + projectName +"?",
      projectID : projectID,
      buttonText : "Delete",
      action : function (){
        this.setState({dialogOpen:false})
           Backend.deleteProject(projectID)
          .then(this.fetchData())
          .then(this.setState({snackbar :true,
            snackbarText : "Project "+ projectName + " deleted"})
          )
      }.bind(this)
      })
  }

  handleUnArchive(projectID, projectTitle){
    Backend.getProjectArchived(projectID, false)
    .then(this.fetchData())
    .then(this.setState({snackbar :true,
      snackbarText : "Project " + projectTitle + " unarchived"})
    )
  }

  handleClose(){
    this.setState({dialogOpen : false})
  }

  handleArchive(projectID, projectName){
    this.setState({dialogOpen : true,
      snackbar : false,
      dialogText : "Do you want to archive project " + projectName +"?",
      projectID : projectID,
      buttonText : "archive",
      action : function (){
        this.setState({dialogOpen:false})
        Backend.getProjectArchived(projectID, true)
          .then(this.fetchData())
          .then(this.setState({snackbar :true,
            snackbarText : "Project "+projectName +" archived"})
          )
      }.bind(this)
      })
  }

  handleAddBookmark(projectID){
    Backend.addBookmark(projectID)
      .then(this.fetchData())
  }

  handleRemoveBookmark(projectID){
    Backend.deleteBookmark(projectID)
      .then(this.fetchData())
  }

  // componentDidMount() {
  //   this.fetchData()
  // }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
/*    if (this.state.url != nextProps.fetchURL){
      this.setState({url :nextProps.fetchURL})
      this.fetchData(nextProps.fetchURL)
    }*/
  }

  fetchData(){
    this.setState({loading : true})
    return this.props.fetchHandler.then(function(data) {
      this.setState({
        data: data,
        filteredTable : []
      })
      this.filter(this.state.filters)
      this.setState({loading : false})
    }.bind(this))
  }

  handleFilterChange(key, value){
    var state = this.state.filters
    if(value === undefined || value ===""  || value.length === 0){
      delete state[key]
    }
    else  {
      if(key == "authors"){
          var value = value.map(item => {return item.email})
      }
      state[key] = value
    }
    this.setState({filters : state})
    this.filter(state)
    if(this.props.handleFilter !== undefined)
      this.props.handleFilter(key,value)
  }

  filter(filters){
    this.setState({loading : true})
    var array = []
    for(let dataObject of this.state.data) {
      var discard = false
      for(let key of Object.keys(filters)){
        var value = filters[key]
        switch (key){
            case "date_to":
              discard = dataObject.date_creation  > value
              break
            case "date_from":
              discard = dataObject.date_creation  < value
              break
            case "tags":
              var temp = dataObject[key].join().toLowerCase()
              discard = value.some(function notContains(element){
                            return temp.indexOf(element) === -1})
              break
            case "authors":
              temp = dataObject[key].join().toLowerCase()
              discard = value.some( function notContains(element){
                return temp.indexOf(element) === -1
              })
              break
            default:
              discard = dataObject[key].toLowerCase().indexOf(value.toLowerCase()) === -1
              break
          }
        if(discard){
          break
        }
      }
      if(!discard){
        array.push(dataObject)
      }
    }
    this.setState({filteredTable : array,
    loading : false})
  }

  render() {
    const columns = []
    if(this.props.columns.indexOf("title") !== -1){
      columns.push({
        Header: 'Project title',
        id: 'title',
        width: 200,
        accessor: d => d,
        Cell: props =>{
          return(
            <div style={{whiteSpace : "normal"}}>
              <Link to={`/project/${props.value._id}`}
                className="table-link-text">
                {props.value.title}
              </Link>
            </div>
          )
        }
      })
    }
    if(this.props.columns.indexOf("status") !== -1){
      columns.push({
        Header: 'Status',
        accessor: 'status',
        id:'status',
        style: {textAlign:"center"},
        width: 100,
        Cell: props =>{
          var status_badge = props.value
          switch(props.value){
            case "DONE":  status_badge = <span className="badge badge-success">DONE</span>
              break
            case 'IN_PROGRESS':
              status_badge = <span className="badge badge-warning">IN_PROGRESS</span>
              break
            case 'IN_REVIEW':
              status_badge = <span className="badge badge-info">IN_REVIEW</span>
              break
            default:
              break
          }
          return(
            <div>{status_badge}</div>
          )
        }
      })
    }
    if(this.props.columns.indexOf("date_creation") !== -1){
      columns.push({
        Header: 'Date',
        accessor: 'date_creation',
        pivot: true,
        width:95,
        style: {textAlign:"center"},
      })
    }
    if(this.props.columns.indexOf("tags") !== -1){
      columns.push({
        Header: 'Tags',
        accessor: "tags",
        id : 'tags',
        width: 220,
        style: {textAlign:"center"},
        Cell: props =>{
          var array = props.value === undefined ? [] : props.value
          return(
              <div style={{marginTop: -10}}>
                {array.map(item =>
                  <Chip key={item} style= {styles["chip"]}>
                    <Link to={"/discovery?tag=" +item} style= {styles["chipText"]} >{item}</Link>
                  </Chip>)
                }
              </div>
          )
        },
      })
    }
    if(this.props.columns.indexOf("authors") !== -1){
      columns.push({
        Header: 'Authors',
        accessor: "authors",
        width: 150,
        id : 'authors',
        Cell: props =>{
          var array = props.value === undefined ? [] : props.value
          return(
            <div style={{marginTop: -10}}>
            {array.map(item =>
              <Chip key={item} style = {{margin: '8px 8px 0 0', background : '#ffffff', float: 'left' }}>
                <Link to={"/profile/"+item}
                       style= {{color:'#000000', fontWeight:'bold'}}>
                      {item}
                </Link><br></br></Chip>) }
            </div>
          )
        },
      })
    }
    if(this.props.columns.indexOf("description") !== -1){
      columns.push({
        Header: 'Description',
        id: 'description',
        style: {width: "100%"},
        accessor: d => d,
        Cell: props =>{
          var text = (props.value.description !== undefined) ? props.value.description.substring(0,250).trim(): "";
          text = text + ((text.length >= 250) ? "..." : "")
          return(
            <div style ={{whiteSpace : "normal"}}>
            {text}
            </div>
          )
        }
      })
      }
    if(this.props.columns.indexOf("bookmarked") !== -1){
      columns.push({
        Header: 'Bookmark',
        id: 'is_bookmark',
        accessor: d=>d,
        pivot: true,
        width: 85,
        style: {textAlign:"center"},
        Cell: props =>{
          return(
            (new String(props.value.is_bookmark) == "true") ?
              <IconButton onClick={()=>this.handleRemoveBookmark(props.value._id)}
                touch={true}
                style = {styles.largeIcon}
                iconStyle={{fontSize: '24px'}}>
                <i className="material-icons">star</i>
              </IconButton>
            :
              <IconButton onClick={()=>this.handleAddBookmark(props.value._id)}
                touch={true}
                style = {styles.largeIcon}
                iconStyle={{fontSize: '24px'}}>
                  <i className="material-icons">star_border</i>
              </IconButton>
          )
        }
      })
    }
    if(this.props.columns.indexOf("unarchive") !== -1){
      columns.push({
        Header: 'Unarchive',
        accessor: d => d,
        id: 'archived',
        sortable:true,
        sortMethod: (a,b) => {
          return  a.archived === b.archived ?
          (a.title < b.title ? 1 : -1)
           :
          (a.archived  ? 1 : -1)},
        width: 100,
        style: {textAlign:"center"},
        Cell: props => { return props.value.archived  ?
          <IconButton
          onClick = {()=>this.handleUnArchive(props.value._id, props.value.title)}
          touch = {true}
          style = {styles.largeIcon}
          iconStyle = {{fontSize: '24px'}}
          value = {props.value._id}>
            <i className="material-icons">unarchive</i>
          </IconButton>
          : ""}
      })
    }
    if(this.props.columns.indexOf("archive") !== -1){
      columns.push({
        Header: 'Archive',
        accessor: d => d,
        id: 'archive',
        sortable:true,
        sortMethod: (a,b) => {
          return  a.archived === b.archived ?
          (a.title < b.title ? -1 : 1)
           :
          (a.archived  ? 1 : -1)},
        width: 80,
        style: {textAlign:"center"},
        Cell: props => { return !props.value.archived  ?
          <IconButton
          onClick = {()=>this.handleArchive(props.value._id, props.value.title)}
          touch = {true}
          style = {styles.largeIcon}
          iconStyle = {{fontSize: '24px'}}
          value = {props.value._id}>
            <i className="material-icons">archive</i>
          </IconButton>
          : "" }
      })
    }

    if(this.props.columns.indexOf("delete") !== -1){
      columns.push({
        Header: 'Delete',
        accessor: d => d,
        id: 'delete',
        sortable:false,
        width: 60,
        style: {textAlign:"center"},
        Cell: props => <IconButton
          onClick = {()=>this.handleDelete(props.value._id,props.value.title)}
          touch = {true}
          style = {styles.largeIcon}
          iconStyle = {{fontSize: '24px'}}
          value = {props.value._id}>
            <i className="material-icons">delete</i>
          </IconButton>
      })
    }
    return (
      <div>
        <ConfirmationPane open = {this.state.dialogOpen}
                          projectID = {this.state.projectID}
                          dialogText = {this.state.dialogText}
                          handleDelete = {this.handleDelete}
                          handleClose = {this.handleClose}
                          buttonText = {this.state.buttonText}
                          handleAction= {this.state.action}
        />
      <Snackbar open={this.state.snackbar}
                message={this.state.snackbarText}
                autoHideDuration={10000}
      />
      <div className = "container" style = {{display : (this.state.loading ? "block" : "none")}}>
        <div className = "header"><CircularProgress size = {80} thickness = {5} /></div>
      </div>
      <div style = {{display : (!this.state.loading ? "block" : "none")}}>
        <Filters value={this.state.filters}
                 onChange={this.handleFilterChange}/>
        <ReactTable
            data={this.state.filteredTable}
            columns={columns}
            defaultExpanded={{1: true}}
            filterable={false}
            showPageSizeOptions={false}
            defaultPageSize={10}/>
        </div>
      </div>
    )
  }
}


  class ConfirmationPane extends Component {
    constructor(props) {
      super(props)
      this.state = {
        open: false
        }
      this.handleDelete = this.handleDelete.bind(this)
    }

    handleDelete(event){
      event.preventDefault()
      this.props.handleAction()
    }


    componentWillReceiveProps(props){
      this.setState({open: props.dialogOpen})
    }

    render() {
      const actions = [
        <RaisedButton
          label = "Cancel"
          primary = {true}
          onTouchTap = {this.props.handleClose}
          />,
        <RaisedButton
          label = {this.props.buttonText}
          primary = {true}
          onTouchTap = {this.handleDelete}
          style = {{marginLeft:20}}
          />,
      ]

      return (
        <Dialog
          title = {this.props.dialogText}
          actions = {actions}
          modal = {false}
          open = {this.props.open}
          onRequestClose = {this.props.handleClose}
          >
        </Dialog>
      )
    }
}
