import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import IconButton from 'material-ui/IconButton'
import styles from '../common/Styles.jsx'
import Backend from '../common/Backend'
import AuthorOutputList from '../common/chips/AuthorOutputList'
import TagOutputList from '../common/chips/TagOutputList'


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
        <div style={{marginBottom:20}}>
          <div className="row">
            <div className="col-2 filter-label">
              Label {this.state.query.label}
            </div>
            <div className="col-4"></div>
            <div className="col-1 filter-label" style={{marginLeft:-40}}>Hits</div>
            <div className="col-1" style= {{marginTop : 13}}>{this.props.savedSearch.count}</div>
            <div className="col-2"></div>
            <div className="col-1" style={{textAlign:"center",marginTop: 0, marginBottom: 20}}>
              <Link to={"/discovery/"+ JSON.stringify(this.state.query)}>
                <IconButton
                  onClick={this.runQuery}
                 touch={true}
                 style = {styles.largeIcon}
                 tooltipPosition="top-center"
                 tooltip="Execute Query"
                 iconStyle={{fontSize: '36px'}}
                 >
                  <i className="material-icons">search</i>
                </IconButton>
              </Link>
            </div>
            <div className="col-1" style={{textAlign:"center",marginTop: 0, marginBottom: 20}}>
              <IconButton
                 onClick={this.deleteQuery}
                 touch={true}
                 style = {styles.largeIcon}
                 tooltipPosition="top-center"
                 tooltip="Delete Query"
                 iconStyle={{fontSize: '36px'}}
                 >
                 <i className="material-icons">delete</i>
              </IconButton>
            </div>
          </div>
          <div className="row">
            <div className="col-1 filter-label" style={{textAlign: "left"}}>Query</div>
            <div className="col-5 query-value" style={{marginLeft:-40}}>
             {this.state.query.searchString}
            </div>
            <div className="col-1 filter-label" style={{textAlign: "left"}}>Title</div>
            <div className="col-5 query-value" style={{marginLeft:-40}}>
             {this.state.query.title}
            </div>
            <div className="col-1 filter-label" style={{textAlign: "left"}}>Description</div>
            <div className="col-5 query-value">
             {this.state.query.description}
            </div>
          </div>
          <div className="row">
            <div className="col-1 filter-label">Tags</div>
            <div  className="col-5  query-value"  style={{marginTop:4}}>
              <TagOutputList value ={this.state.query.tags} />
            </div>
            <div className="col-1 filter-label"  style={{marginLeft:-40}}> Authors</div>
            <div  className="col-5  query-value" style={{marginTop:4}}>
              <AuthorOutputList value ={this.state.query.authors} userNames={this.props.userNames} />
            </div>
          </div>
          <div className="row">
            <div className="col-1 filter-label" style={{textAlign: "left" , marginLeft:2}}>From</div>
            <div className="col-2  query-value" style={{marginLeft:-40}} >
               {this.state.query.date_from}
            </div>
            <div className="col-1 filter-label" style={{textAlign: "left"}}>Till</div>
            <div className="col-2  query-value" style={{marginLeft:-40}}>
               {this.state.query.date_to}
            </div>
            <div className="col-1 filter-label" style={{textAlign: "left", marginLeft:37}} >Status</div>
            <div className="col-2  query-value">
              {this.state.query.status}
            </div>
          </div>
        </div>
      )
    }
  }
