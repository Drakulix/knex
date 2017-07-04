  import React, { Component } from 'react';
import {fetchProjectDetails, fetchJson} from '../common/Backend'
import { Link } from 'react-router-dom';

import ChipInput from 'material-ui-chip-input'
import Chip from 'material-ui/Chip'
import IconButton from 'material-ui/IconButton';
import SharePane from '../common/SharePane';
import styles from '../common/Styles.jsx';
import CommentSideBar from '../common/CommentSideBar.jsx'


const update_url='/update/'
export default class ProjectContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectID : "",
      projectInf:{},
      bookmarked:false,
      owner : false,
      sharePane: false,
      commentBar: false
    };


    this.handleEdit = this.handleEdit.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.handleBookmark = this.handleBookmark.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleDelete = this.handleDelete.bind(this);


  }

  componentWillMount(){
    this.setState({projectInf : this.props.match.params.getURL});
    this.loadProjectInf(this.props.match.params.getURL);
    this.setState({projectID :this.props.match.params.getURL});
  }

  componentWillReceiveProps(nextProps){
    this.loadProjectInf(nextProps)
  }

  componentDidMount(){
    this.loadProjectInf(this.props);
  }


  loadProjectInf(uuid) {

    this.setState({projectInf : {_id :"dsa", title:"test", status:"done",
date_creation : "12", date_update:"11", description : "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
tags:["av","dasda", "adsadas"], url:["http://google.com","http://github.org", "http://soundloud.com"], authors :[{id:"33", name :"dda"}, {id:"32", name :"ddaa"}]
}});

this.setState({bookmarked : true});
this.setState({owner : true});

    /*    fetchProjectDetails(uuid).then(data => {
    this.setState({projectInf: data})
    });*/

  }


handleComment(event){
  event.preventDefault();
//  window.location = '/comment/'+  this.state.projectID;
  this.setState({sharePane:false});
  this.setState({commentBar:true});
}

handleShare(event){
  event.preventDefault();
  //window.location = '/share/'+  this.state.projectID;
  this.setState({commentBar:false});
  this.setState({sharePane:true});
}

handleBookmark(event){
  event.preventDefault();
  this.setState({commentBar:false});
  this.setState({sharePane:false});
if(this.state.bookmarked){
  //deleteBookmark
  this.setState({bookmarked : false});

}
else {
  //addBookmark
  this.setState({bookmarked : true});
}

}

handleEdit(event){
  event.preventDefault();
  window.location = '/update/'+  this.state.projectID;
}


handleDelete(event){
  event.preventDefault();
  window.location = '/delete/'+  this.state.projectID;
}




  render(){
    return(

<div className="container">
  <div className="innerContainer">
  <SharePane value={this.state.sharePane} uuid={this.state.projectID}></SharePane>
  <CommentSideBar value={this.state.commentBar} uuid={this.state.projectID}></CommentSideBar>
  <div className = "row headerCreation" style={{width:"100%"}}>
    <div className="col-12">
      <div>Project</div>
      <div style={{fontSize: '20px'}}> {this.state.projectInf.title}</div>
    </div>
  </div>
    <div className="row">
      <div className="col-5">
        <div className="row">
          <div className="col-4">
            <div className="profile-info">Status</div>
            <div>{this.state.projectInf.status}</div>
          </div>
          <div className="col-4">
            <div className="profile-info">Creation date</div>
            <div>{this.state.projectInf.date_creation}</div>
          </div>
          <div className="col-4">
            <div className="profile-info">Last update </div>
            <div> {this.state.projectInf.date_update}</div>
          </div>
        </div>
          <div style={{marginTop:30}}>
            <div className="profile-info">Authors</div>
              <div style = {styles["wrapper"]}>
                {this.state.projectInf.authors.map(item => <Chip style= {styles["chip"]}>
                              <Link to={"/profile/"+item.id} style= {styles["chipText"]}>{item.name}</Link></Chip>)}
              </div>
          </div>
          <div style={{marginTop:30}}>
            <div className="profile-info">Links</div>
            <div style = {styles["wrapper"]}>
                      {this.state.projectInf.url.map(item => <Chip style= {styles["chip"]}>
                                <a href={item} style= {styles["chipText"]}>{item}</a></Chip>)}
            </div>
          </div>
        </div>
        <div className="col-1"></div>
        <div className="col-6">
          <div style={{marginTop:10}}>
            <div className="profile-info">Tags </div>
            <div style = {styles["wrapper"]}>
                  {this.state.projectInf.tags.map(item =>
                      <Chip style= {styles["chip"]}>
                        <Link to={item} style= {styles["chipText"]} >{item}</Link></Chip>)}
            </div>
          </div>
        <div style={{marginTop:30}}>
          <div className="profile-info">Description</div>
          <div><a>{this.state.projectInf.description}</a></div>
        </div>
      </div>
    </div>
  <div style={{textAlign:"center", marginTop:75}} >
        <IconButton
            onClick={this.handleComment}
            touch={true}
            style = {styles.largeIcon}
            tooltipPosition="bottom-center"
            tooltip="Comment project"
           iconStyle={{fontSize: '30px'}}
            >
            <i className="material-icons">comment</i>
      </IconButton>
      <IconButton
          onClick={this.handleBookmark}
          touch={true}
          style = {styles.largeIcon}
          tooltipPosition="bottom-center"
          tooltip="Bookmark project"
           iconStyle={{fontSize: '30px'}}
          >
          <i className="material-icons">
                {(this.state.bookmarked) ? "star_rate" : "star_border"}
          </i>
      </IconButton>
      <IconButton
          onClick={this.handleShare}
          touch={true}
          style = {styles.largeIcon}
          tooltipPosition="bottom-center"
          tooltip="Share project"
           iconStyle={{fontSize: '30px'}}
          >
          <i className="material-icons">share</i>
      </IconButton>
      <IconButton
          onClick={this.handleEdit}
          touch={true}
          style = {styles.largeIcon}
          disabled={!this.state.owner}
          tooltipPosition="bottom-center"
          tooltip="Edit project"
          iconStyle={{fontSize: '30px'}}
          >
          <i className="material-icons">mode_edit</i>
      </IconButton>
      <IconButton
          onClick={this.handleDelete}
          touch={true}
          style = {styles.largeIcon}
          disabled={!this.state.owner}
          tooltipPosition="bottom-center"
          tooltip="Delete project"
          iconStyle={{fontSize: '30px'}}
          >
          <i className="material-icons">delete</i>
      </IconButton>
    </div>
  </div>
</div>
    );
  }
}
