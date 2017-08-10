import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import Backend from '../common/Backend'
import AuthorOutputList from '../common/chips/AuthorOutputList'
import TagOutputList from '../common/chips/TagOutputList'
import Styles from './Styles.jsx'
import Delete from 'material-ui/svg-icons/action/delete'
import Search from 'material-ui/svg-icons/action/search'

export default class SavedQuery extends Component {

    constructor(props) {
      super(props)
      var query = this.props.savedSearch.query

      this.state = {
        query: query,
      }
      this.deleteQuery = this.deleteQuery.bind(this)
    }

    deleteQuery(){
      Backend.deleteSavedSearch(this.props.savedSearch.id)
      .then(this.props.snackbarHandler("Query deleted"))
    }

    render() {
      return(
        <div style = {{marginBottom: 40}}>
          <div className = "row" style = {{marginBottom: 20}}>
            <div className = "col-2 filter-label" style= {{fontSize: 22}}>
               {this.state.query.label}
            </div>
            <div className = "col-4"></div>
            <div className = "col-1 filter-label" style= {{fontSize: 22}}>Hits</div>
            <div className = "col-1" style= {{fontSize: 22, marginTop: 13}}>{this.props.savedSearch.count}</div>
            <div className = "col-2" style = {{textAlign: "right",marginTop: 10}}>
              <Link to = {`/discovery/${JSON.stringify(this.state.query)}`}>
                <RaisedButton
                  onClick = {this.runQuery}
                  label = {"Run query"}
                  primary = {true}
                  fullWidth = {true}
                  icon = {<Search style = {{color: Styles.palette.alternateTextColor}}/>}
                 >
                </RaisedButton>
              </Link>
            </div>
            <div className = "col-2" style = {{textAlign: "right",marginTop: 10}}>
              <RaisedButton
                 onClick = {this.deleteQuery}
                 primary = {true}
                 fullWidth = {true}
                 label = "Delete Query"
                 icon = {<Delete style = {{color: Styles.palette.alternateTextColor}}/>}
                 >
              </RaisedButton>
            </div>
          </div>
          <Card  expanded = {this.state.expanded} onExpandChange = {() => this.setState({expanded: !this.state.expanded})}>
            <CardHeader
              title = "Detailed view"
              actAsExpander = {true}
              showExpandableButton = {true}
            />
          <CardText expandable = {true}>
            <div style = {{ textAlign: "left", verticalAlign: "center", display: "block"}} >
              <div className = "row">
                <div className = "col-1 filter-label" style = {{textAlign: "left"}}>Querystring</div>
                <div className = "col-5 query-value">
                 {(this.state.query.searchString === undefined) ? <div style = {{color: Styles.palette.disabledColor }}>No value provided</div>: this.state.query.searchString}
                </div>
              </div>
              <div className = "row">
                <div className = "col-1 filter-label" style = {{textAlign: "left"}}>Title</div>
                <div className = "col-5 query-value">
                  {(this.state.query.title === undefined) ? <div style = {{color: Styles.palette.disabledColor }}>No value provided</div>: this.state.query.title}
                </div>
                <div className = "col-1 filter-label" style = {{textAlign: "left", marginLeft: -40}}>Description</div>
                <div className = "col-5 query-value" style = {{marginLeft: 14}}>
                  {(this.state.query.description === undefined) ? <div style = {{color: Styles.palette.disabledColor }}>No value provided</div>: this.state.query.description}
                </div>
              </div>
              <div className = "row">
                <div className = "col-1 filter-label">Tags</div>
                <div  className = "col-5  query-value"  style = {{marginTop: 5}}>
                  {(this.state.query.tags === undefined) ? <div style = {{marginTop: 9, color: Styles.palette.disabledColor }}>No value provided</div>: <TagOutputList value = {this.state.query.tags} />}
                </div>
                <div className = "col-1 filter-label"  style = {{marginLeft: -40}}> Authors</div>
                <div  className = "col-5  query-value" style = {{marginTop: 5}}>
                  {(this.state.query.authors === undefined) ? <div style = {{marginTop: 9, color: Styles.palette.disabledColor }}>No value provided</div>: <AuthorOutputList value = {this.state.query.authors} userNames = {this.props.userNames} />}
                </div>
              </div>
              <div className = "row">
                <div className = "col-1 filter-label" style = {{textAlign: "left"}}>From</div>
                <div className = "col-2  query-value" >
                   {(this.state.query.date_from === undefined) ? <div style = {{color: Styles.palette.disabledColor }}>No value provided</div>: this.state.query.date_from}

                </div>
                <div className = "col-1 filter-label" style = {{textAlign: "left"}}>To</div>
                <div className = "col-2  query-value" style = {{marginLeft: -40}}>
                    {(this.state.query.date_to === undefined) ? <div style = {{color: Styles.palette.disabledColor }}>No value provided</div>: this.state.query.date_to}
                </div>
                <div className = "col-1 filter-label" style = {{textAlign: "left"}} >Status</div>
                <div className = "col-2  query-value">
                  {(this.state.query.status === undefined) ? <div style = {{marginLeft: 14, color: Styles.palette.disabledColor }}>No value provided</div>: this.state.query.status}
                </div>
              </div>
            </div>
          </CardText>
        </Card>
        </div>
      )
    }
  }
