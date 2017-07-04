  import React, { Component } from 'react';
import {fetchProjectDetails, fetchJson} from '../common/Backend'
import { Link } from 'react-router-dom';

import ChipInput from 'material-ui-chip-input'
import Chip from 'material-ui/Chip'
import IconButton from 'material-ui/IconButton';
import SharePane from '../common/SharePane';
import styles from '../common/Styles.jsx';



const update_url='/update/'
export default class ProjectContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectID : "",
      projectInf:{},
      bookmarked:false,
      owner : false,
      sharePane: false
    };


    this.handleEdit = this.handleEdit.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.handleBookmark = this.handleBookmark.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleDelete = this.handleDelete.bind(this);


  }

  componentWillMount(){
    this.setState({projectInf : this.props.match.params.uuid});
    this.loadProjectInf(this.props.match.params.uuid);
    this.setState({projectID :this.props.match.params.uuid});
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
  alert("comment");
  window.location = '/comment/'+  this.state.projectID;
}

handleShare(event){
  event.preventDefault();
  //window.location = '/share/'+  this.state.projectID;

this.setState({sharePane:true});

}

handleBookmark(event){
  event.preventDefault();

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

    const { _id, authors, date_creation, date_update, description } = this.state.projectInf;
    const { status, tags, title, url} = this.state.projectInf;
    var status_badge = null;
    if (status == 'DONE'){
      status_badge = <span className="badge badge-success">DONE</span>
    } else if (status == 'IN_PROGRESS') {
      status_badge = <span className="badge badge-warning">IN_PROGRESS</span>
    } else if (status == 'IN_REVIEW') {
      status_badge = <span className="badge badge-info">IN_REVIEW</span>
    } else {
      status_badge = status
    }

    var authors_string = null;
    if (authors != null){
      var author_container = []
      for (var i = 0; i < authors.length; i++){
        author_container.push(authors[i].name);
      }
      authors_string = author_container.join(", ")
    } else {
      authors_string = ''
    }
    if (tags != null){
      var tag_container = []
      for (var i = 0; i < tags.length; i++){
        tag_container.push(<span className="badge badge-default">{tags[i]}</span>)
      }
    } else {
      tag_container = ''
    }
    return(

<div className="container">
  <div className="innerContainer">
  <SharePane value={this.state.sharePane}></SharePane>

  <div className = "row headerCreation" style={{width:"100%"}}>
      <div className="col-9">
           <div style={{marginLeft:-3}}> Project</div>
           <div style={{fontSize: '20px'}}> {this.state.projectInf.title}</div>
      </div>
      <div className="col-3" style={{align:"right"}}>
        <div >
          <IconButton
              onClick={this.handleComment}
              touch={true}
              style = {styles.largeIcon}
              tooltipPosition="bottom-center"
              tooltip="Comment project"
             iconStyle={{fontSize: '36px'}}
              >
              <i className="material-icons" style={{color: 'black', width:'100px'}}>comment</i>
        </IconButton>
        <IconButton
            onClick={this.handleBookmark}
            touch={true}
            style = {styles.largeIcon}
            tooltipPosition="bottom-center"
            tooltip="Bookmark project"
             iconStyle={{fontSize: '36px'}}
            >
            <i className="material-icons" style={{color: 'black', fontSize: '48px' }}>
                  {(this.state.bookmarked) ? "star_rate" : "star_border"}
            </i>
        </IconButton>
        <IconButton
            onClick={this.handleShare}
            touch={true}
            style = {styles.largeIcon}
            tooltipPosition="bottom-center"
            tooltip="Share project"
             iconStyle={{fontSize: '36px'}}
            >
            <i className="material-icons" style={{color: 'black'}}>share</i>
        </IconButton>
        <IconButton
            onClick={this.handleEdit}
            touch={true}
            style = {styles.largeIcon}
            disabled={!this.state.owner}
            tooltipPosition="bottom-center"
            tooltip="Edit project"
            iconStyle={{fontSize: '36px'}}
            >
            <i className="material-icons" style={{color: 'black'}}>mode_edit</i>
        </IconButton>
        <IconButton
            onClick={this.handleDelete}
            touch={true}
            style = {styles.largeIcon}
            disabled={!this.state.owner}
            tooltipPosition="bottom-center"
            tooltip="Delete project"
             iconStyle={{fontSize: '36px'}}
            >
            <i className="material-icons" style={{color: 'black'}}>delete</i>
        </IconButton>

        </div>
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
            <div>{this.state.projectInf.title}</div>
          </div>
        <div style={{marginTop:30}}>
          <div className="profile-info">Description</div>
          <div><a>{this.state.projectInf.description}</a></div>
        </div>
      </div>
    </div>
  </div>
</div>
    );
  }
}
