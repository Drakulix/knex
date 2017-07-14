import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactTable from 'react-table'
import {get} from './Backend'
import Filters from './Filters'
import IconButton from 'material-ui/IconButton'
import Chip from 'material-ui/Chip'
import styles from '../common/Styles.jsx'

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
      url : "/api/projects",
    }

    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddBookmark = this.handleAddBookmark.bind(this)
    this.handleRemoveBookmark = this.handleRemoveBookmark.bind(this)
  }

  handleDelete(projectID){
    fetch("/api/projects/"+projectID, {
      credentials: 'include',
      method: "DELETE",
      body: "",
      headers: {
      }
    }).then(response => response.status)
      .catch(ex => {
      console.error('parsing failed', ex)
    })
    this.fetchData(this.state.url)
  }

  handleAddBookmark(projectID){
    for(let project of this.state.data) {
      if(project._id === projectID){
        project["is_bookmark"] = true
        break
      }
    }
    for(let project of this.state.filteredTable) {
      if(project._id === projectID){
        project["is_bookmark"] = true
        break
      }
    }
    fetch("/api/users/bookmarks/"+projectID, {
      credentials: 'include',
      method: "POST",
      body: "",
      headers: {
      }
    }).then(response => response.status)
      .catch(ex => {
      console.error('parsing failed', ex)
    }
  )
  this.fetchData(this.state.url)
  }

  handleRemoveBookmark(projectID){
    for(let project of this.state.data) {
      if(project._id === projectID){
        project["is_bookmark"] = false
        break
      }
    }
    for(let project of this.state.filteredTable) {
      if(project._id === projectID){
        project["is_bookmark"] = false
        break
      }
    }

    var url = "/api/users/bookmarks/"
    fetch(url+projectID, {
      credentials: 'include',
      method: "DELETE",
      body: "",
      headers: {
      }
    }).then(response => response.status)
      .catch(ex => {
        console.error('parsing failed', ex)
      }
    )
    this.fetchData(this.state.url)
  }

  componentDidMount() {
    this.setState({url :this.props.fetchURL})
    this.fetchData(this.props.fetchURL)
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (this.state.url != nextProps.fetchURL){
      this.setState({url :nextProps.fetchURL})
      this.fetchData(nextProps.fetchURL)
    }
  }

  fetchData(url){
    get(url).then(function(data) {
      var datas =[]
      if(data !== undefined)
        datas = data
      var filteredDataArray = []
      var dataArray = []
      for(let dataObject of datas) {
        var transformedObject = dataObject
        var t = new String(dataObject.tags)
        t = t.substring(0,t.length)
        var array = t.split(",")
        array.sort()
        transformedObject["tagString"] =array.join()
        var temp = []
        for (var i in  dataObject.authors) {
          temp = temp.concat([dataObject.authors[i].name + " ##"+dataObject.authors[i].email] )
        }
        temp.sort()
        transformedObject["authorString"] = temp.join()
        filteredDataArray.push(transformedObject)
        dataArray.push(transformedObject)
      }
      this.setState({
        data: dataArray,
        filteredTable : filteredDataArray
      })
        this.filter(this.state.filters)
      }.bind(this))
    }

    handleFilterChange(key, value){
      var state = this.state.filters
      if(value === ""){
        delete state[key]
      }
      else  {
        state[key] = value
      }
      this.setState({filters : state})
      this.filter(state)
      if(this.props.handleFilter !== undefined)
        this.props.handleFilter(key,value)
    }

    filter(filters){
      var array = []
      for(let dataObject of this.state.data) {
        var discard = false
        for(let key of Object.keys(filters)){
          var value = filters[key]
          switch (key){
            case "title":
              discard = dataObject.title.toLowerCase().indexOf(value.toLowerCase()) === -1
              break
            case "description":
              discard = dataObject.description.toLowerCase().indexOf(value.toLowerCase()) === -1
              break
            case "status":
              discard = dataObject.status.toLowerCase().indexOf(value.toLowerCase()) === -1
              break
            case "filter_date_to":
              discard = dataObject.date_creation  > value
              break
            case "filter_date_from":
              discard = dataObject.date_creation  < value
              break
            case "tags":
              var temp = dataObject.tags.join().toLowerCase()
              for(let i in value){
                var tag = value[i]
                discard = temp.indexOf(tag.toLowerCase()) === -1
                if(discard)
                  break
              }
              break
            case "authors":
              temp = []
              for (var i in  dataObject.authors) {
                temp = temp.concat([dataObject.authors[i].name + " ("+dataObject.authors[i].email+ ")"])
              }
              temp = temp.join().toLowerCase()
              for(let i in value){
                var author = value[i]
                discard = temp.indexOf(author.toLowerCase()) === -1
                if(discard)
                  break
              }
              break
            default:
              break
          }
          if(discard){
            break
          }
        }
        if(!discard){
          array.push(dataObject)
        }
        this.setState({filteredTable : array})
      }
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
              <Link to={`project/${props.value._id}`}
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
        accessor: "tagString",
        id : 'tagString',
        width: 220,
        style: {textAlign:"center"},
        Cell: props =>{
          var array = props.value === undefined ? [] : new String(props.value).split(",")
          return(
              array.map(item =>
                <Chip key={item} style= {styles["chip"]}>
                  <Link to={"/discovery?tag=" +item} style= {styles["chipText"]} >{item}</Link></Chip>)
          )
        },
      })
    }
    if(this.props.columns.indexOf("authors") !== -1){
      columns.push({
        Header: 'Authors',
        accessor: "authorString",
        width: 150,
        id : 'authorString',
        Cell: props =>{
          var array = props.value === undefined ? [] : new String(props.value).split(",")
          return(
            <div>
            {array.map(item =>
              <Chip key={item.substring(item.indexOf(" ##")+3)} style= {styles["chip"]}>
                <Link to={"/profile/"+item.substring(
                    item.indexOf(" ##")+3
                  )} style= {styles["chipText"]} >{item.substring(0,item.indexOf(" ##"))}</Link><br></br></Chip>) }
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

          var text = (props.value.description !== undefined) ? new String(props.value.description).substring(0,250).trim()+"..." : "";
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
    if(this.props.columns.indexOf("delete") !== -1){
      columns.push({
        Header: 'Delete',
        accessor: d => d,
        id: 'delete',
        sortable:false,
        width: 60,
        style: {textAlign:"center"},
        Cell: props => <IconButton
          onClick = {()=>this.handleDelete(props.value._id)}
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
    )
  }
}
