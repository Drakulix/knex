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
import Status from './Status'


export default class SavedQuery extends Component {

    constructor(props) {
      super(props)
      var query = this.props.savedSearch.metadata

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
                  label = {<span className = "hidden-lg-down">Run query</span>}
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
                 label =  {<span className = "hidden-lg-down">Delete query</span>}
                 icon = {<Delete style = {{color: Styles.palette.alternateTextColor}}/>}
                 >
              </RaisedButton>
            </div>
          </div>
          <Card  expanded = {this.state.expanded} onExpandChange = {() => this.setState({expanded: !this.state.expanded})}>
            <CardHeader
              title = "Detailed information"
              actAsExpander = {true}
              showExpandableButton = {true}
            />
          <CardText expandable = {true}>
            <div style = {{ textAlign: "left", verticalAlign: "bottom", display: "block"}} >
              <div className = "row">
                <div className = "col-1 filter-label hidden-md-down" style = {{textAlign: "left"}}>Querystring</div>
                {(this.state.query.searchString === undefined) ?
                  <div className = "col-5 query-value hidden-md-down" style = {{color: Styles.palette.disabledColor }}>No value provided</div>
                : <div className = "col-5 query-value">{this.state.query.searchString}</div>
                }
                <div className = "col-6 hidden-md-down"/>
                <div className = "col-1 filter-label hidden-md-down" style = {{textAlign: "left"}}>Title</div>
                {(this.state.query.title === undefined) ?
                  <div className = "col-5 query-value hidden-md-down" style = {{color: Styles.palette.disabledColor }}>No value provided</div>
                : <div className = "col-5 query-value">{this.state.query.title}</div>
                }
                <div className = "col-1 filter-label hidden-md-down" style = {{textAlign: "left", marginLeft: -40}}>Description</div>
                {(this.state.query.description === undefined) ?
                  <div className = "col-5 query-value hidden-md-down" style = {{color: Styles.palette.disabledColor }}>No value provided</div>
                : <div className = "col-5 query-value">{this.state.query.description}</div>
                }
                <div className = "col-1 filter-label hidden-md-down">Tags</div>
                  {(this.state.query.tags === undefined) ?
                    <div className = "col-5 query-value hidden-md-down" style = {{color: Styles.palette.disabledColor }}>No value provided</div>
                : <div className = "col-5" style= {{marginTop: 5}}><TagOutputList value = {this.state.query.tags}/></div>
                }
                <div className = "col-1 filter-label hidden-md-down" style = {{textAlign: "left", marginLeft: -40}}>Authors</div>
                {(this.state.query.authors === undefined) ?
                  <div className = "col-5 query-value hidden-md-down" style = {{color: Styles.palette.disabledColor }}>No value provided</div>
                : <div className = "col-5" style= {{marginTop: 5, marginLeft: -14}}><AuthorOutputList value = {this.state.query.authors} userNames = {this.props.userNames}/></div>
                }

                 <div className = "col-1 filter-label hidden-md-down" style = {{textAlign: "left"}}>From</div>
                {(this.state.query.date_from === undefined) ?
                  <div className = "col-2 query-value hidden-md-down" style = {{color: Styles.palette.disabledColor }}>No value provided</div>
                : <div className = "col-2 query-value" style= {{marginTop: 5}}>{this.state.query.date_from}</div>
                }

                <div className = "col-1 filter-label hidden-md-down" style = {{textAlign: "left"}}>To</div>
               {(this.state.query.date_to === undefined) ?
                 <div className = "col-2 query-value hidden-md-down" style = {{marginLeft: -40, color: Styles.palette.disabledColor }}>No value provided</div>
               : <div className = "col-2 query-value" style= {{marginLeft: -40, marginTop: 5}}>{this.state.query.date_to}</div>
               }

                <div className = "col-1 filter-label hidden-md-down" style = {{textAlign: "left"}} >Status</div>
                  {(this.state.query.status === undefined) ?
                    <div className = "col-5 query-value hidden-md-down" style = {{color: Styles.palette.disabledColor }}>No value provided</div>
                : <div className = "col-5 " style= {{marginTop: 5}}><Status value = {this.state.query.status}/></div>
                }

              </div>
            </div>
          </CardText>
        </Card>
        </div>
      )
    }
  }
