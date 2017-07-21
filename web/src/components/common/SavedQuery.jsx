import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Chip from 'material-ui/Chip'
import IconButton from 'material-ui/IconButton'
import styles from '../common/Styles.jsx'

export default class SavedQuery extends Component {

    constructor(props) {
      super(props)
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
             {this.props.value.label}
          </div>
          <div className="col-8"></div>
           <div className="col-1" style={{textAlign:"center",marginTop: 0, marginBottom: 20}}>
            <Link to={"/discovery/"+this.props.value._id}>
              <IconButton
               onClick={this.runQuery}
               touch={true}
               style = {styles.largeIcon}
               tooltipPosition="top-center"
               tooltip="Execute Query"
               iconStyle={{fontSize: '24px'}}
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
               iconStyle={{fontSize: '24px'}}
               >
               <i className="material-icons">delete</i>
             </IconButton>
           </div>
         </div>
         <div className="row">
           <div className="col-1 filter-label" style={{textAlign: "left"}}>Title</div>
           <div className="col-5 query-value" style={{marginLeft:-40}}>
             {this.props.value.title}
           </div>
           <div className="col-1 filter-label" style={{textAlign: "left"}}>Description</div>
           <div className="col-5 query-value">
             {this.props.value.description}
           </div>
           </div>
           <div className="row">
             <div className="col-1 filter-label">Tags</div>
             <div  className="col-5  query-value" style={{marginLeft:-40}}>
               <div style = {styles["wrapper"]}>
                 { this.props.value.tags.map(item =>
                   <Chip style= {styles["chipText"]}>
                     {item}</Chip>) }
                     </div>
             </div>
             <div className="col-1 filter-label"> Authors</div>
             <div  className="col-5  query-value">
               <div style = {styles["wrapper"]}>
                 { this.props.value.authors.map(item =>
                   <Chip style= {styles["chipText"]}>
                     {item.name}</Chip>) }
                     </div>
             </div>
           </div>
           <div className="row">
             <div className="col-1 filter-label" style={{textAlign: "left" , marginLeft:2}}>From</div>
             <div className="col-2  query-value" style={{marginLeft:-40}} >
               {this.props.value.date_from}
             </div>
             <div className="col-1 filter-label" style={{textAlign: "left"}}>Till</div>
             <div className="col-2  query-value" style={{marginLeft:-40}}>
               {this.props.value.date_to}
             </div>
             <div className="col-1 filter-label" style={{textAlign: "left", marginLeft:37}} >Status</div>
             <div className="col-2  query-value">
               {this.props.value.status}
             </div>
           </div>
         </div>
      )
    }
  }
