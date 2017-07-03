  import React, { Component } from 'react';
import {fetchProjectDetails, fetchJson} from '../common/Backend'
import { Link } from 'react-router-dom';

import ChipInput from 'material-ui-chip-input'
import Chip from 'material-ui/Chip'
import IconButton from 'material-ui/IconButton';




const styles = {
  chip: {
    margin: '8px 8px 0 0',
    float: 'left',
    background: '#ff5000'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  largeIcon: {
    width: 50,
    height: 50,
    marginLeft: 10,
    padding: 4
   }
};


const update_url='/update/'
export default class ProjectContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectInf:{},
      bookmarked:false,
      owner : false
    };
  }

  componentWillMount(){
    this.loadProjectInf(this.props.match.params.uuid);
  }

  componentWillReceiveProps(nextProps){
    this.loadProjectInf(nextProps)
  }

  componentDidMount(){
    this.loadProjectInf(this.props);
  }


  loadProjectInf(uuid) {

    this.setState({projectInf : {_id :"dsa", title:"test", status:"done",
      date_creation : "12", date_update:"11", description : "lirum larum",
      tags:["av","dasda", "adsadas"], url:["fds","dasda", "adsadas"], authors :[{id:"33", name :"dda"}, {id:"32", name :"ddaa"}]
    }});

    this.setState({bookmarked : false});
    this.setState({owner : false});

    /*    fetchProjectDetails(uuid).then(data => {
    this.setState({projectInf: data})
    });*/

  }





  render(){


    return(

<div className="container">
  <div className="innerContainer">


  <div className = "row headerCreation" style={{width:"100%"}}>
      <div className="col-9">
           <div style={{marginLeft:-3}}> Project</div>
           <div style={{fontSize: '20px'}}> {this.state.projectInf.title}</div>
      </div>
      <div className="col-3">
        <div >
          <IconButton
              onClick={this.logout}
              touch={true}
              style = {styles.largeIcon}
              tooltipPosition="bottom-center"
              tooltip="Comment project"
             iconStyle={{fontSize: '36px'}}
              >
              <i className="material-icons" style={{color: 'black', width:'100px'}}>comment</i>
        </IconButton>
        <IconButton
            onClick={this.logout}
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
            onClick={this.logout}
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
            onClick={this.logout}
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
        <div>
          <div className="profile-info">Status</div>
          <div>{this.state.projectInf.status}</div>
        </div>
        <div className="row">
          <div className="creation-date-elem col-6">
            <div className="profile-info">Creation date</div>
            <div>{this.state.projectInf.date_creation}</div>
          </div>
          <div className="col-6">
            <div className="profile-info">Last update </div>
            <div> {this.state.projectInf.date_update}</div>
          </div>
        </div>
          <div style={{marginTop:30}}>
            <div className="profile-info">Authors</div>
              <div style = {styles["wrapper"]}>
                {this.state.projectInf.authors.map(item => <Chip style= {styles["chip"]}>
                              <Link to={item.id} style= {styles["chipText"]}>{item.name}</Link></Chip>)}
              </div>
          </div>
          <div style={{marginTop:30}}>
            <div className="profile-info">Links</div>
            <div style = {styles["wrapper"]}>
                      {this.state.projectInf.url.map(item => <Chip style= {styles["chip"]}>
                                <Link to={item} style= {styles["chipText"]}>{item}</Link></Chip>)}
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
