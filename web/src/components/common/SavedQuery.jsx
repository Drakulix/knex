import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import Backend from '../common/Backend'
import AuthorOutputList from '../common/chips/AuthorOutputList'
import TagOutputList from '../common/chips/TagOutputList'
import Styles from './Styles.jsx'


export default class SavedQuery extends Component {

    constructor(props) {
      super(props)
      var query = this.props.savedSearch.query

      this.state = {
        query : query,
      }
      this.deleteQuery = this.deleteQuery.bind(this)
    }

    deleteQuery(){
      Backend.deleteSavedSearch(this.props.savedSearch.id)
      .then(this.props.snackbarHandler("Query deleted"))
    }

    render() {
      return(
        <div style = {{marginBottom:40}}>
          <div className = "row" style = {{marginBottom : 20}}>
            <div className = "col-2 filter-label" style= {{fontSize : 22}}>
               {this.state.query.label}
            </div>
            <div className = "col-4"></div>
            <div className = "col-1 filter-label" style= {{fontSize : 22}}>Hits</div>
            <div className = "col-1" style= {{fontSize : 22, marginTop:13}}>{this.props.savedSearch.count}</div>
            <div className = "col-2" style = {{textAlign:"right",marginTop: 10}}>
              <Link to = {`/discovery/${JSON.stringify(this.state.query)}`}>
                <RaisedButton
                  onClick = {this.runQuery}
                  label = {"Run query"}
                  primary = {true}
                  fullWidth = {true}
                  icon = {<i className = "material-icons" style = {{color: Styles.palette.alternateTextColor, marginTop: 0}}>search</i>}
                 >
                </RaisedButton>
              </Link>
            </div>
            <div className = "col-2" style = {{textAlign:"right",marginTop: 10}}>
              <RaisedButton
                 onClick = {this.deleteQuery}
                 primary = {true}
                 fullWidth = {true}
                 label = "Delete Query"
                 icon = {<i className = "material-icons" style = {{color: Styles.palette.alternateTextColor, marginTop: 0}}>delete</i>}
                 >
              </RaisedButton>
            </div>
          </div>
          <Card  expanded = {this.state.expanded} onExpandChange = {() => this.setState({expanded : !this.state.expanded})}>
            <CardHeader
              title = "Detailed view"
              actAsExpander = {true}
              showExpandableButton = {true}
            />
          <CardText expandable = {true}>
            <div style = {{ textAlign : "left", verticalAlign : "center", display : "block"}} >
              <div className = "row">
                <div className = "col-1 filter-label" style = {{textAlign: "left"}}>Querystring</div>
                <div className = "col-5 query-value" style = {{marginLeft:-40}}>
                 {this.state.query.searchString}
                </div>
                <div className = "col-1 filter-label" style = {{textAlign: "left"}}>Title</div>
                <div className = "col-5 query-value" style = {{marginLeft:-40}}>
                 {this.state.query.title}
                </div>
                <div className = "col-1 filter-label" style = {{textAlign: "left"}}>Description</div>
                <div className = "col-5 query-value">
                 {this.state.query.description}
                </div>
              </div>
              <div className = "row">
                <div className = "col-1 filter-label">Tags</div>
                <div  className = "col-5  query-value"  style = {{marginTop:4}}>
                  <TagOutputList value = {this.state.query.tags} />
                </div>
                <div className = "col-1 filter-label"  style = {{marginLeft:-40}}> Authors</div>
                <div  className = "col-5  query-value" style = {{marginTop:4}}>
                  <AuthorOutputList value = {this.state.query.authors} userNames = {this.props.userNames} />
                </div>
              </div>
              <div className = "row">
                <div className = "col-1 filter-label" style = {{textAlign: "left" , marginLeft:2}}>From</div>
                <div className = "col-2  query-value" style = {{marginLeft:-40}} >
                   {this.state.query.date_from}
                </div>
                <div className = "col-1 filter-label" style = {{textAlign: "left"}}>To</div>
                <div className = "col-2  query-value" style = {{marginLeft:-40}}>
                   {this.state.query.date_to}
                </div>
                <div className = "col-1 filter-label" style = {{textAlign: "left", marginLeft:37}} >Status</div>
                <div className = "col-2  query-value">
                  {this.state.query.status}
                </div>
              </div>
            </div>
          </CardText>
        </Card>
        </div>
      )
    }
  }
