import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactTable from 'react-table'
import Backend from './Backend'
import Filters from './Filters'
import IconButton from 'material-ui/IconButton'
import styles from '../common/Styles.jsx'
import Snackbar from 'material-ui/Snackbar'
import AuthorOutputList from '../common/chips/AuthorOutputList'
import TagOutputList from '../common/chips/TagOutputList'
import ConfirmationPane from '../common/ConfirmationPane'
import Badge from '../common/Badge'
import Spinner from '../common/Spinner'


export default class BookmarksTable extends Component {

  constructor(props) {
    super(props)
    var filters = {}
    if(props.predefinedFilter !== undefined){
      filters = props.predefinedFilter
    }
    this.state = {
      filters : filters,
      filteredData : [],
      dialogOpen : false,
      dialogText : "Delete Project",
      action : null,
      loading : true,
      buttonText : "Delete",
      snackbar : false,
      snackbarText : ""
    }

    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  handleDelete(projectInf){
    this.setState({
      snackbar : false,
      dialogText : "Do you want to delete project " + projectInf.title + "?",
      buttonText : "Delete",
      dialogOpen : true,
      action : () => {
        this.setState({dialogOpen:false})
        Backend.deleteProject(projectInf._id)
        .then(this.props.handler())
        .then(this.setState({snackbar :true,
          snackbarText : "Project "+ projectInf.title +" deleted"}))
      }
    })
  }

  handleArchive(projectInf){
    this.setState({
      snackbar : false,
      dialogText : "Do you want to archive project " + projectInf.title + "?",
      buttonText : "archive",
      dialogOpen : true,
      action : () => {
        this.setState({dialogOpen:false})
        Backend.getProjectArchived(projectInf._id, true)
            .then(this.props.handler())
            .then(this.setState({snackbar :true,
            snackbarText : "Project "+ projectInf.title +" archived"}))
      }
    })
  }

  handleUnArchive(projectInf){
    Backend.getProjectArchived(projectInf._id, false)
        .then(this.props.handler())
        .then(this.setState({snackbar :true,
          snackbarText : "Project " + projectInf.title + " unarchived"}))
  }

  handleBookmark(projectInf){
    if(projectInf.is_bookmark === "true") {
      Backend.deleteBookmark(projectInf._id)
      .then(this.props.handler())
      .then(this.setState({snackbar :true,
        snackbarText : "Project bookmarked"}))
    }
    else {
      Backend.addBookmark(projectInf._id)
      .then(this.props.handler())
      .then(this.setState({snackbar :true,
        snackbarText : "Project bookmark removed"}))
    }
  }

  componentWillReceiveProps(props){
    this.setState({
      filteredData : (this.props.isBookmarkTable
                      ? this.filter(props.data, this.state.filters) : props.data)
      })
  }

  fetchData(){
    this.setState({loading : true})
    this.props.fetchHandler
    .then((projects) => {
      this.setState({
        data : projects,
        filteredTable : projects,
        loading : false
      })
      this.filter(projects, this.state.filters)
    })
  }

  handleFilterChange(key, value){
    var state = this.state.filters
    if(value === undefined || value === ""  || value.length === 0){
      delete state[key]
    }
    else  {
      state[key] = value
    }
    this.setState({filters : state})
    this.filter(this.state.data, state)
    if(this.props.handleFilter !== undefined)
      this.props.handleFilter(key,value)
  }

  filter(data, filters){
    this.setState({loading : true})
    var array = []
    for(let dataObject of data){
      var discard = false
      alert(dataObject)
      if(!this.props.remoteFilters){
        for(let key of Object.keys(filters)){
        var value = filters[key]
        if(key === "tags" || key === "authors"){
          var temp = dataObject[key].join().toLowerCase()
          for(let item in value){
            if (temp.indexOf(value[item]) === -1){
              discard = true
              break
            }
          }
        }
        else{
          switch (key){
            case "date_to":
              discard = dataObject.date_creation  > value
              break
            case "date_from":
              discard = dataObject.date_creation  < value
              break
            default:
              discard = dataObject[key].toLowerCase().indexOf(value.toLowerCase()) === -1
              break
          }
        }
        if(discard){
          break
        }
      }
      }
      if(!discard){
        array.push(dataObject)
      }
    }
    return array
  }

  render() {
    const columns = []
    if(this.props.columns.indexOf("title") !== -1){
      columns.push({
        Header: 'Project title',
        id: 'title',
        width: 180,
        accessor: d => d,
        Cell: props =>
            <div style={{whiteSpace : "normal", marginTop:8}}>
              <Link to={`/project/${props.value._id}`}
                className="table-link-text">
                {props.value.title}
              </Link>
            </div>
      })
    }
    if(this.props.columns.indexOf("date_creation") !== -1){
      columns.push({
        Header: 'Date',
        accessor: 'date_creation',
        pivot: true,
        width:95,
        style: {textAlign:"center", marginTop:9},
      })
    }
    if(this.props.columns.indexOf("status") !== -1){
      columns.push({
        Header: 'Status',
        accessor: 'status',
        id:'status',
        style: {align:"center", width : 100},
              width: 100,
        Cell: props => <Badge value={props.value} />
      })
    }
    if(this.props.columns.indexOf("tags") !== -1){
      columns.push({
        Header: 'Tags',
        accessor: "tags",
        width: 220,
        style: {textAlign:"center", width : 220},
        Cell: props => <TagOutputList value = {props.value} />
      })
    }
    if(this.props.columns.indexOf("authors") !== -1){
      columns.push({
        Header: 'Authors',
        accessor: "authors",
        width: 180,
        Cell: props => <AuthorOutputList value = {props.value} />
      })
    }
    if(this.props.columns.indexOf("description") !== -1){
      columns.push({
        Header: 'Description',
        id: 'description',
        style: {width: "100%"},
        accessor: 'description',
        Cell: props =>{
          var text = (props.value !== undefined) ? props.value.substring(0,250).trim(): "";
          text = text + ((text.length >= 250) ? "..." : "")
          return(
            <div style ={{whiteSpace : "normal", marginTop:8}}>
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
        Cell: props =>
          <IconButton onClick={()=>this.handleBookmark(props.value)}
                      touch={true}
                      style = {styles.largeIcon}
                      iconStyle={{fontSize: '24px'}}>
            <i className="material-icons">{props.value.is_bookmark === "true" ? "star" : "star_border"}</i>
          </IconButton>
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
          onClick = {()=>this.handleUnArchive(props.value)}
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
          onClick = {()=>this.handleArchive(props.value)}
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
          onClick = {()=>this.handleDelete(props.value)}
          touch = {true}
          style = {styles.largeIcon}
          iconStyle = {{fontSize: '24px'}}
          value = {props.value._id}>
            <i className="material-icons">delete</i>
          </IconButton>
      })
    }
    return (
      <div className = "container" >
        <ConfirmationPane   open = {this.state.dialogOpen}
                            handleClose = {() => {this.setState({dialogOpen : false, snackbar : false})}}
                            title = {this.state.dialogText}
                            confirmationLabel = {this.state.buttonText}
                            confirmAction = {this.state.action}
        />
        <Snackbar open={this.state.snackbar}
                  message={this.state.snackbarText}
                  autoHideDuration={10000}
        />
      <Spinner loading = {this.props.loading} text ={"Loading projects"}/>
        <div style = {{display : (!this.props.loading ? "block" : "none")}}>
          <Filters value={this.state.filters}
                   onChange={this.handleFilterChange}/>
          <ReactTable
              data={this.state.filteredData}
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
