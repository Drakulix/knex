import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Chip from 'material-ui/Chip'
import styles from '../common/Styles.jsx';

import IconButton from 'material-ui/IconButton';
import SharePane from '../common/SharePane';
import CircularProgress from 'material-ui/CircularProgress';
import CommentSideBar from '../common/CommentSideBar.jsx'


export default class ProjectContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectID : this.props.match.params.uuid,
      projectInf:{},
      myBookmarks: {},
      bookmarked:false,
      owner : false,
      sharePane: false,
      commentBar: false,
      project_exists: false
    };

    this.handleEdit = this.handleEdit.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.handleBookmark = this.handleBookmark.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillMount(){
    this.loadSiteInf(this.state.projectID);
  }

  componentWillReceiveProps(nextProps){
    this.setState({projectID: nextProps.uuid});
    this.loadSiteInf(this.state.projectID)
  }


  fetchMyBookmarks(){
    return fetch('/api/users/bookmarks', {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
      headers: {
        "Accept": "application/json",
      }
    }).then(response => response.json()).catch(ex => {
      console.error('parsing failes', ex);
    });
  }

  fetchProjectInfo(uuid){
    return fetch('/api/projects/' + uuid, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
      headers: {
        "Accept": "application/json",
      }
    }).then(response => response.json()).catch(ex => {
      console.error('parsing failes', ex);
    });
  }

  loadSiteInf(uuid) {
    this.fetchProjectInfo(uuid).then(data => {
      this.setState({projectInf: data});
      if(!data){
        this.setState({project_exists: false});
      }else{
        this.setState({project_exists: true})
      }
      this.setState({site_loaded: true})
    }).catch(ex => {
      this.setState({project_exists: false});
        this.setState({site_loaded: true})
    });

    this.fetchMyBookmarks().then(data => {
      this.setState({myBookmarks: data});
      if(!data){
        this.setState({});
      }else{
        var bookmarks_id = [];
        var arrayLength = data.length;
        for (var i = 0; i < arrayLength; i++){
          bookmarks_id.push(data[i]._id)
        }
        if (bookmarks_id.indexOf(this.state.projectID) !== -1){
          this.setState({bookmarked: true})
        } else {
          this.setState({bookmarked: false})
        }
        this.setState({project_exists: true})
      }
      this.setState({site_loaded: true})
    }).catch(ex => {
      this.setState({project_exists: false});
        this.setState({site_loaded: true})
    });

  this.setState({owner : true});
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

  addBookmark(){
  return fetch('/api/users/bookmarks/' + this.state.projectID , {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(function(response){
      if(response.status=200){
        return true;
      }else{
        return false;
      }
    });
  }

  removeBookmark(){
    var url = "/api/users/bookmarks/"
    return fetch(url+this.state.projectID, {
      credentials: 'include',
      method: "DELETE",
      body: "",
      headers: {

      }
    }).then(function(response){
      if(response.status===200){
        return true;
      }else{
        return false;
      }
    });
  }

  handleBookmark(event){
    event.preventDefault();
    this.setState({commentBar:false});
    this.setState({sharePane:false});


    if(new String (this.state.bookmarked) == "true"){
      //deleteBookmark
      this.removeBookmark().then(res => {
        if(res){
          this.setState({bookmarked : false});
        }
      });
    }else {
      this.addBookmark().then(res => {
        if(res){
          this.setState({bookmarked : true});
        }
      });

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
    if(!this.state.site_loaded){
      return (
        <div className="container">
          <div className="header"><CircularProgress size={80} thickness={5} /></div>
        </div>
      );
    }
    if(!this.state.project_exists){
      return (
        <div className="container">
          <div className="header">Project Not Found</div>
        </div>
      );
    }else{
    let status_badge = null;
    if (this.state.projectInf.status === 'DONE'){
      status_badge = <span className="badge badge-success">DONE</span>
    } else if (this.state.projectInf.status === 'IN_PROGRESS') {
      status_badge = <span className="badge badge-warning">IN_PROGRESS</span>
    } else if (this.state.projectInf.status === 'IN_REVIEW') {
      status_badge = <span className="badge badge-info">IN_REVIEW</span>
    } else {
      status_badge = this.state.projectInf.status
    }
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
                  <div>{status_badge}</div>
                </div>
                <div className="col-4">
                  <div className="profile-info">Creation date</div>
                  <div>{this.state.projectInf.date_creation}</div>
                </div>
                <div className="col-4">
                  <div className="profile-info">Last update </div>
                  <div> {this.state.projectInf.date_last_updated}</div>
                </div>
              </div>
              <div style={{marginTop:30}}>
                <div className="profile-info">Authors</div>
                <div style = {styles["wrapper"]}>
                  {
                    this.state.projectInf.authors.map(item =>
                      <Chip style= {styles["chip"]}>
                        <Link to={"/profile/"+item.email} style= {styles["chipText"]}>{item.name}</Link>
                      </Chip>
                    )
                  }
                  </div>
                </div>
                <div style={{marginTop:30}}>
                  <div className="profile-info">Links</div>
                  <div style = {styles["wrapper"]}>
                    { this.state.projectInf.url.map(item => <Chip style= {styles["chip"]}>
                    <a href={item} style= {styles["chipText"]}>{item}</a></Chip>) }
                    </div>
                  </div>
                </div>
                <div className="col-1"></div>
                <div className="col-6">
                  <div style={{marginTop:10}}>
                    <div className="profile-info">Tags </div>
                    <div style = {styles["wrapper"]}>
                      { this.state.projectInf.tags.map(item =>
                        <Chip style= {styles["chip"]}>
                          <Link to={item} style= {styles["chipText"]} >{item}</Link></Chip>) }
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
                        tooltipPosition="top-center"
                        tooltip="Comment project"
                        iconStyle={{fontSize: '24px'}}
                        >
                        <i className="material-icons">comment</i>
                      </IconButton>
                      <IconButton
                        onClick={this.handleBookmark}
                        touch={true}
                        style = {styles.largeIcon}
                        tooltipPosition="top-center"
                        tooltip="Bookmark project"
                        iconStyle={{fontSize: '24px'}}
                        >
                        <i className="material-icons">
                          {(new String(this.state.bookmarked) == "true") ? "star_rate" : "star_border"}
                        </i>
                      </IconButton>
                      <IconButton
                        onClick={this.handleShare}
                        touch={true}
                        style = {styles.largeIcon}
                        tooltipPosition="top-center"
                        tooltip="Share project"
                        iconStyle={{fontSize: '24px'}}
                        >
                        <i className="material-icons">share</i>
                      </IconButton>
                      <Link to={"/update/" + this.state.projectID}  >
                      <IconButton

                        touch={true}
                        style = {styles.largeIcon}
                        disabled={!this.state.owner}
                        tooltipPosition="top-center"
                        tooltip="Edit project"
                        iconStyle={{fontSize: '24px'}}
                        >
                        <i className="material-icons">mode_edit</i>
                      </IconButton>
                      </Link>
                      <IconButton
                        onClick={this.handleDelete}
                        touch={true}
                        style = {styles.largeIcon}
                        disabled={!this.state.owner}
                        tooltipPosition="top-center"
                        tooltip="Delete project"
                        iconStyle={{fontSize: '24px'}}
                        >
                        <i className="material-icons">delete</i>
                      </IconButton>
                    </div>
                  </div>
                </div>
    );
  }
  }
}
