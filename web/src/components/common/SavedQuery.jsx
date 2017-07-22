import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Chip from 'material-ui/Chip'
import IconButton from 'material-ui/IconButton'
import styles from '../common/Styles.jsx'

<<<<<<< HEAD
<<<<<<< HEAD
=======

<<<<<<< HEAD
>>>>>>> af1da7a... WIP
=======
>>>>>>> af1da7a... WIP
=======
>>>>>>> 44597e1... Merge and BF
export default class SavedQuery extends Component {

    constructor(props) {
      super(props)
      var query = this.props.query
      var temp = []
      for (var i in query.authors) {
        temp = temp.concat([query.authors[i].name + " ("+query.authors[i].email+ ")"])
      }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      query.authors = (temp.length !== 0 ? temp : undefined)
      delete query.userID
=======
=======
>>>>>>> 44597e1... Merge and BF
      query.authors = temp
      temp = []
      for (var i in query.tags) {
        temp = temp.concat([query.tags[i]])
      }
      query.tags = temp
<<<<<<< HEAD
>>>>>>> af1da7a... WIP
=======
      query.authors = (temp.length !== 0 ? temp : undefined)
      delete query.userID
>>>>>>> 2605f56... Filters prepared
=======
>>>>>>> 44597e1... Merge and BF
      this.state = {
        query : query
      }
      this.deleteQuery = this.deleteQuery.bind(this)
      this.runQuery = this.runQuery.bind(this)
    }

    deleteQuery(){
    }

    runQuery(){
    }

    render() {
      return(
        <div style={{marginBottom:20}}>
         <div className="row" >
          <div className="col-2 filter-label">
             {this.state.query.label}
          </div>
          <div className="col-8"></div>
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
           <div className="col-1 filter-label" style={{textAlign: "left"}}>Title</div>
           <div className="col-5 query-value" style={{marginLeft:-40}}>
             {this.state.query.title}
           </div>
           <div className="col-1 filter-label" style={{textAlign: "left"}}>Description</div>
           <div className="col-5 query-value">
             {this.state.query.description}
           </div>
           </div>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2605f56... Filters prepared
          <div className="row">
            <div className="col-1 filter-label">Tags</div>
            <div  className="col-5  query-value" style={{marginLeft:-40}}>
              <div style = {styles["wrapper"]}>
                 { this.state.query.tags !== undefined ?
                    this.state.query.tags.map(item =>
                      <Chip style= {styles["chipText"]}>
                        {item}</Chip>) : ""}
              </div>
            </div>
            <div className="col-1 filter-label"> Authors</div>
            <div  className="col-5  query-value">
              <div style = {styles["wrapper"]}>
                 { this.state.query.authors !== undefined ?
                    this.state.query.authors.map(item =>
                      <Chip style= {styles["chipText"]}>
                        {item}</Chip>) : ""}
              </div>
            </div>
<<<<<<< HEAD
=======
=======
>>>>>>> 44597e1... Merge and BF
           <div className="row">
             <div className="col-1 filter-label">Tags</div>
             <div  className="col-5  query-value" style={{marginLeft:-40}}>
               <div style = {styles["wrapper"]}>
                 { this.state.query.tags.map(item =>
                   <Chip style= {styles["chipText"]}>
                     {item}</Chip>) }
                     </div>
             </div>
             <div className="col-1 filter-label"> Authors</div>
             <div  className="col-5  query-value">
               <div style = {styles["wrapper"]}>
                 { this.state.query.authors.map(item =>
                   <Chip style= {styles["chipText"]}>
                     {item}</Chip>) }
                     </div>
             </div>
<<<<<<< HEAD
>>>>>>> af1da7a... WIP
=======
>>>>>>> 2605f56... Filters prepared
=======
>>>>>>> 44597e1... Merge and BF
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
