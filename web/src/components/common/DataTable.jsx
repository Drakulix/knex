import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactTable from 'react-table'
import Backend from './Backend'
import Filters from './Filters'
import IconButton from 'material-ui/IconButton'
import Styles from '../common/Styles.jsx'
import Snackbar from 'material-ui/Snackbar'
import AuthorOutputList from '../common/chips/AuthorOutputList'
import TagOutputList from '../common/chips/TagOutputList'
import ConfirmationPane from '../common/ConfirmationPane'
import Status from '../common/Status'
import CircularProgress from 'material-ui/CircularProgress'
import Archive from 'material-ui/svg-icons/content/archive'
import Unarchive from 'material-ui/svg-icons/content/unarchive'
import StarBorder from 'material-ui/svg-icons/toggle/star-border'
import Star from 'material-ui/svg-icons/toggle/star'
import Delete from 'material-ui/svg-icons/action/delete'


export default class BookmarksTable extends Component {

  constructor(props) {
    super(props)
    var filters = {}
    if(props.predefinedFilter !== undefined){
      filters = props.predefinedFilter
    }
    this.state = {
      filters: filters,
      filteredData: [],
      dialogOpen: false,
      dialogText: "Delete Project",
      action: null,
      loading: true,
      buttonText: "Delete",
      snackbar: false,
      snackbarText: "",
    }

    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  handleError(){
    this.setState({
      dialogOpen: false,
      snackbar: true,
      snackbarText: "Error while loading projects",
      loading: false
    })
  }

  handleDelete(projectInf){
    this.setState({
      snackbar: false,
      dialogText: `Do you want to delete project ${projectInf.title}?`,
      buttonText: "Delete",
      dialogOpen: true,
      action: () => {
        this.setState({loading: true, dialogOpen: false, filteredData: []})
        Backend.deleteProject(projectInf._id)
        .then(() => {this.props.handler(this.state.filters)})
        .then(this.setState({snackbar: true,
          snackbarText: `Project ${projectInf.title} deleted`}))
        .catch(() => {this.handleError()})
      }
    })
  }

  handleArchive(projectInf){
    this.setState({
      snackbar: false,
      dialogText: `Do you want to archive project ${projectInf.title}?`,
      buttonText: "Archive",
      dialogOpen: true,
      action: () => {
        this.setState({loading: true,dialogOpen: false, filteredData: []})
        var project = projectInf
        delete project.is_bookmark
        project['archived'] = true
        Backend.archiveProject(projectInf._id, "true")
        .then(() => {this.props.handler(this.state.filters)})
        .then(this.setState({snackbar: true,
          snackbarText: `Project ${projectInf.title} archived`}))
        .catch((e) => {this.handleError()})
      }
    })
  }

  handleUnArchive(projectInf){
    this.setState({loading: true, filteredData: []})
    var project = projectInf
    delete project.is_bookmark
    project['archived'] = false
    Backend.archiveProject(projectInf._id, "false")
        .then(() => {this.props.handler(this.state.filters)})
        .then(() => {this.setState({snackbar: true,
          snackbarText: `Project ${projectInf.title} unarchived`})})
        .catch(() => {this.handleError()})
  }

  handleBookmark(projectInf){
    this.setState({loading: true, filteredData: []})
    Backend.handleBookmark(projectInf._id, projectInf.is_bookmark)
    .then(() => {this.props.handler(this.state.filters)})
    .then(() => {this.setState({snackbar: true,
      snackbarText: `Project bookmark${projectInf.is_bookmark ? " removed": "ed"}`})})
    .catch(() => {this.handleError()})
  }

  componentWillReceiveProps(props){
    if(!this.props.loading && ! props.loading){
      this.setState({snackbar: false})
    }
    if(this.props.loading && ! props.loading){
      Backend.getAuthors()
      .then((authors) => {
        Backend.getUserNames(authors)
        .then ((userNames) => {
          this.setState({
            userNames: userNames,
            filteredData: (this.props.isBookmarkTable
                            ? this.filter(props.data, this.state.filters): props.data),
          })
        })
      })
    }else{
      this.setState({
        filteredData: (this.props.isBookmarkTable
                        ? this.filter(props.data, this.state.filters): props.data),
        })
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.loading !== this.props.loading){
      this.setState({ loading: this.props.loading})
    }
  }

  resize = () => this.forceUpdate()

  componentDidMount() {
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  handleFilterChange(key, value){
    var state = this.state.filters
    if(value === undefined || value === ""  || value.length === 0){
      delete state[key]
    }
    else  {
      state[key] = value
    }
    this.setState({filters: state})
    if(this.props.handleFilter !== undefined)
      this.props.handleFilter(key,value)
    this.props.handler(state)
  }

  filter(data, filters){
    var array = []
    for(let dataObject of data){
      var discard = false
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
            case "date_to" :
              discard = dataObject.date_creation  > value
              break
            case "date_from" :
              discard = dataObject.date_creation  < value
              break
            default :
              discard = dataObject[key].toLowerCase().indexOf(value.toLowerCase()) === -1
              break
          }
        }
        if(discard){
          break
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
        width: 160,
        sortMethod: (a,b) => {
          return  a.title.toLowerCase() === b.title.toLowerCase() ? 0
               : a.title.toLowerCase() > b.title.toLowerCase() ? 1: -1
        },
        accessor: d => d,
        Cell: props =>
            <div style = {{whiteSpace: "normal", textAlign: 'left', marginTop: 8}}>
              <Link to = {`/project/${props.value._id}`}
                style = {{fontWeight: "bold", color: Styles.palette.textColor}}
                >
                {props.value.title}
              </Link>
            </div>
      })
    }
    if(this.props.columns.indexOf("date_creation") !== -1){
      columns.push({
        Header: 'Date',
        accessor: 'date_creation',
        show: window.innerWidth > 768,
        pivot: true,
        width: 95,
        style: {textAlign: "center", marginTop: 9, fontFamily : '-Roboto,sans-serif'},
      })
    }
    if(this.props.columns.indexOf("status") !== -1){
      columns.push({
        Header: 'Status',
        accessor: 'status',
        id: 'status',
        style: {marginTop: 6},
        width: 105,
        Cell: props => <Status value = {props.value} />
      })
    }
    if(this.props.columns.indexOf("tags") !== -1){
      columns.push({
        Header: 'Tags',
        accessor: "tags",
        width: 163,
        style: {textAlign: "center", width: 220},
        Cell: props => <TagOutputList value = {props.value} />
      })
    }
    if(this.props.columns.indexOf("authors") !== -1){
      columns.push({
        Header: 'Authors',
        accessor: "authors",
        width: 200,
        Cell: props => <AuthorOutputList value = {props.value} userNames = {this.state.userNames} />
      })
    }
    if(this.props.columns.indexOf("description") !== -1){
      columns.push({
        Header: 'Description',
        id: 'description',
        style: {width: "100%", fontFamily :'-Roboto,sans-serif'},
        show: window.innerWidth > 768,
        accessor: 'description',
        Cell: props =>{
          var text = (props.value !== undefined) ? props.value.substring(0,150).trim(): "";
          text = text + ((props.value.length > 150) ? "...": "")
          return(
            <div style = {{whiteSpace: "normal", marginTop: 8, color: Styles.palette.textColor}}>
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
        style: {textAlign: "center"},
        Cell: props =>
          <IconButton onClick = {()=>this.handleBookmark(props.value)}
                      touch = {true}
                      style = {Styles.largeIcon}
                      iconStyle = {{fontSize: '24px',color: Styles.palette.textColor}}>
            {props.value.is_bookmark ? <Star/>: <StarBorder/>}
          </IconButton>
      })
    }
    if(this.props.columns.indexOf("unarchive") !== -1){
      columns.push({
        Header: 'Unarchive',
        accessor: d => d,
        id: 'unarchive',
        sortable: true,
        sortMethod: (a,b) => {
          return  a.archived === b.archived ?
          (a.title < b.title ? 1: -1)
         :
          (a.archived  ? 1: -1)},
        width: 100,
        style: {textAlign: "center"},
        Cell: props => { return props.value.archived === "true"?
          <IconButton
          onClick = {()=>this.handleUnArchive(props.value)}
          touch = {true}
          style = {Styles.largeIcon}
          iconStyle = {{fontSize: '24px',color: Styles.palette.textColor}}
          value = {props.value._id}>
            <Unarchive/>
          </IconButton>
     : ""}
      })
    }
    if(this.props.columns.indexOf("archive") !== -1){
      columns.push({
        Header: 'Archive',
        accessor: d => d,
        id: 'archive',
        sortable: true,
        sortMethod: (a,b) => {
          return  a.archived === b.archived ?
          (a.title < b.title ? -1: 1)
         :
          (a.archived  ? 1: -1)},
        width: 80,
        style: {textAlign: "center"},
        Cell: props => { return props.value.archived === "false" ?
          <IconButton
          onClick = {()=>this.handleArchive(props.value)}
          touch = {true}
          style = {Styles.largeIcon}
          iconStyle = {{fontSize: '24px',color: Styles.palette.textColor}}
          value = {props.value._id}>
            <Archive/>
          </IconButton>
     : "" }
      })
    }
    if(this.props.columns.indexOf("delete") !== -1){
      columns.push({
        Header: 'Delete',
        accessor: d => d,
        id: 'delete',
        sortable: false,
        width: 60,
        style: {textAlign: "center"},
        Cell: props => <IconButton
          onClick = {()=>this.handleDelete(props.value)}
          touch = {true}
          style = {Styles.largeIcon}
          iconStyle = {{fontSize: '24px', color: Styles.palette.textColor}}
          value = {props.value._id}>
            <Delete/>
          </IconButton>
      })
    }
    return (
      <div>
        <ConfirmationPane   open = {this.state.dialogOpen}
                            handleClose = {() => {this.setState({dialogOpen: false, snackbar: false})}}
                            title = {this.state.dialogText}
                            confirmationLabel = {this.state.buttonText}
                            confirmAction = {this.state.action}
        />
        <Snackbar open = {this.state.snackbar}
                  message = {this.state.snackbarText}
                  autoHideDuration = {10000}
        />
        <div>
          <Filters value = {this.state.filters}
                   title = {"Apply filters to your search"}
                   onChange = {this.handleFilterChange}/>
          <ReactTable
              data = {this.state.filteredData}
              columns = {columns}
              defaultSorted = {[{
                    id: 'title',
                    desc: false
                    }]}
              filterable = {false}
              showPageSizeOptions = {false}
              minRows = {3}
              noDataText = {() =>
                (this.state.loading) ?
                  <CircularProgress  size = {40} thickness = {5} />: "No projects found"
              }
              defaultPageSize = {10}/>
        </div>
      </div>
    )
  }
}
