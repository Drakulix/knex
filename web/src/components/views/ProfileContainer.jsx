import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {login, isLoggedIn, logout, getCookie, setCookie, isAdmin, getMyEmail, getUserInfo, changePassword, changeProfile} from '../common/Authentication.jsx';

export default class ProfileContainer extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      profile_exists : true,
      site: 'info',
      error: '',
      profileInf: {},
      email: props.email,
      first_name: '',
      last_name: '',
      bio: '',
      pw_old: '',
      pw_new: '',
      pw_new_confirm: ''
    };
    this.handlePwOldChange = this.handlePwOldChange.bind(this);
    this.handlePwNewChange = this.handlePwNewChange.bind(this);
    this.handlePwNewConfChange = this.handlePwNewConfChange.bind(this);
    this.handlePwChangeSubmit = this.handlePwChangeSubmit.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
    this.handleProfileChangeSubmit = this.handleProfileChangeSubmit.bind(this)
  }
 
  handleSiteChange(value) {
    this.setState({site: value})
  }
  
  handleFirstNameChange(event) {
    this.setState({first_name: event.target.value});
  }

  handleLastNameChange(event) {
    this.setState({last_name: event.target.value});
  }

  handleBioChange(event) {
    this.setState({bio: event.target.value});
  }

  handlePwOldChange(event) {
    this.setState({pw_old: event.target.value});
  }

  handlePwNewChange(event) {
    this.setState({pw_new: event.target.value});
  }

  handlePwNewConfChange(event) {
    this.setState({pw_new_confirm: event.target.value});
  }

  handleBioChange(event) {
    this.setState({profileInf: {bio: event.target.value} });
  }

  componentWillReceiveProps(nextProps){
    this.setState({email: nextProps.email});
    this.loadProfileInf(this.state.email);

  }

  componentWillMount(){

  }

  componentDidMount(){
    this.loadProfileInf(this.state.email);
  }

  loadProfileInf(e) {
    getUserInfo(e).then(data => {
      this.setState({profileInf: data});
      if(!data){
        this.setState({profile_exists: false});
      }
    }).catch(ex => {
      this.setState({profile_exists: false});
    });

  }

  getMenuEditStyle(){
    if(this.state.email != getMyEmail() && !isAdmin()){
      return ({visibility: 'hidden'});
    }else{
      return ({});
    }
  }

  getEditSiteOldPasswordStyle(){
    if(isAdmin()){
      return ({visibility: 'hidden'});
    }else{
      return ({});
    }
  }

  handlePwChangeSubmit(event){
    event.preventDefault();
    if(this.state.pw_new != this.state.pw_new_confirm){
      alert('New passwords do not match!');
      return ;
    }
    changePassword(this.state.email, this.state.pw_old, this.state.pw_new).then((success) => {
      if(success){
        alert("Password change success");
      }else{
        this.setState({ error: 'Login failed' });
        alert("Password change failed");
      }
    });
  }

  handleProfileChangeSubmit(event){
    event.preventDefault();
    changeProfile(this.state.email, this.state.first_name, this.state.last_name, this.state.bio ).then((success) => {
      if(success){
        alert("Profile changed!");
      }else{
        this.setState({ error: 'Login failed' });
        alert("Profile change failed");
      }
    });
  }

  render() {
    if( !this.state.profile_exists){
      return ( 
        <div className="container">
          <div className="header">Profile Not Found</div>
        </div>
      );
    }
    if(this.state.site == 'info'){
    return (
      <div className="container">
        <div className="header">Profile Details</div>
        <ul className="nav nav-tabs">
          <li className="nav-item" onClick={() => this.handleSiteChange('info')}>
            <p className="nav-link active" href="#">Profile</p>
          </li>
          <li className="nav-item" onClick={() => this.handleSiteChange('comment')}>
            <p className="nav-link" href="#" >Comments</p>
          </li>
          <li className="nav-item" onClick={() => this.handleSiteChange('edit')} style={this.getMenuEditStyle()}>
            <p className="nav-link" href="#">Edit</p>
          </li>
        </ul>
        <div className="row">
          <div className="col-9">
            <p className="profile-header">Information:</p>
            <p className="profile-info">{this.state.profileInf.first_name} {this.state.profileInf.last_name}</p>
            <p className="profile-header">Biography:</p>
            <p className="profile-info">{this.state.profileInf.bio}</p>
          </div>
          <div className="col-3">
            <img src="http://www.freeiconspng.com/uploads/profile-icon-9.png" width="200px" height="200px" alt="..." className="rounded-circle profile-icon" />
            <p className="profile-icon-text">Change Avatar</p>
          </div>
        </div>

        <p>{this.state.profileInf.first_name}'s Projects</p>
        <div className="table-container">
          <table className="table">
            <thead className="thead-default">
              <tr>
                <th>Project Name</th>
                <th>Status</th>
                <th>Description</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Contextual music information retrieval and recommendation</th>
                <td>pending</td>
                <td>descriptions are useful</td>
                <td>22/06/17</td>
                <td>
                  <i className="fa fa-bookmark" aria-hidden="true"></i>
                </td>
              </tr>
              <tr>
                <th scope="row">Semantic Analysis of Song Lyrics</th>
                <td>pending</td>
                <td>descriptions are great</td>
                <td>22/06/17</td>
                <td>
                  <i className="fa fa-bookmark-o" aria-hidden="true"></i>
                </td>
              </tr>
              <tr>
                <th scope="row">Combining Audio Content and Social Context for Semantic Music Discovery</th>
                <td>done</td>
                <td>descriptions are love</td>
                <td>22/06/17</td>
                <td>
                  <i className="fa fa-bookmark-o" aria-hidden="true"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="pagination-container">
          <div className="text-xs-center">
            <div>
              <ul className="pagination">
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
                <li className="page-item"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                  <span className="sr-only">Next</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if(this.state.site == 'edit'){
    return (
      <div className="container">
        <div className="header">Profile Details</div>
        <ul className="nav nav-tabs">
          <li className="nav-item" onClick={() => this.handleSiteChange('info')}>
            <p className="nav-link " href="#">Profile</p>
          </li>
          <li className="nav-item" onClick={() => this.handleSiteChange('comment')}>
            <p className="nav-link" href="#" >Comments</p>
          </li>
          <li className="nav-item" onClick={() => this.handleSiteChange('edit')} style={this.getMenuEditStyle()}>
            <p className="nav-link active" href="#">Edit</p>
          </li>
        </ul>
        <div className="row">
          <div className="col-9">
            <form onSubmit={this.handleProfileChangeSubmit}>
              <p className="profile-header">Information:</p>
              <p className="profile-info">
                First Name: <input type="text" className="form-control" onChange={this.handleFirstNameChange} value={this.state.profileInf.first_name}  />
                Last Name: <input type="text" className="form-control" onChange={this.handleLastNameChange} value={this.state.profileInf.last_name}  />
              </p>
              <p className="profile-header">Biography:</p>
              <p className="profile-info"><textarea onChange={this.handleBioChange} >{this.state.profileInf.bio}</textarea></p>
              <button type="submit" className="btn btn-primary">Change Profile</button>
            </form>
          </div>
          <div className="col-3">
            <img src="http://www.freeiconspng.com/uploads/profile-icon-9.png" width="200px" height="200px" alt="..." className="rounded-circle profile-icon" />
            <p className="profile-icon-text">Change Avatar</p>
          </div>
        </div>
        <div className="change-password">
          <form onSubmit={this.handlePwChangeSubmit}>
            <div className="form-group row">
              <label className="col-2 col-form-label">Email</label>
              <div className="col-10">
                <p className="form-control-static">{ this.state.email }</p>
              </div>
            </div>
            <div className="form-group row" style ={this.getEditSiteOldPasswordStyle()} >
              <label for="inputPassword" className="col-2 col-form-label">Old Password</label>
              <div className="col-4">
                <input type="password" className="form-control" id="inputPassword" placeholder="Password" onChange={this.handlePwOldChange} />
              </div>
            </div>
            <div className="form-group row">
              <label for="inputPassword" className="col-2 col-form-label">New Password</label>
              <div className="col-4">
                <input type="password" className="form-control" id="inputPassword" placeholder="Password" onChange={this.handlePwNewChange} />
              </div>
            </div>
            <div className="form-group row">
              <label for="inputPassword" className="col-2 col-form-label">Confirm Password</label>
              <div className="col-4">
                <input type="password" className="form-control" id="inputPassword" placeholder="Password" onChange={this.handlePwNewConfChange} />
              </div>
              <button type="submit" className="btn btn-primary">Change Password</button>
            </div>
          </form>
        </div>
        
        
      </div>
  );
  }else if(this.state.site == 'comment'){
    return (
      <div className="container">
        <div className="header">Profile Details</div>
        <ul className="nav nav-tabs">
          <li className="nav-item" onClick={() => this.handleSiteChange('info')}>
            <p className="nav-link" href="#">Profile</p>
          </li>
          <li className="nav-item" onClick={() => this.handleSiteChange('comment')}>
            <p className="nav-link active" href="#" >Comments</p>
          </li>
          <li className="nav-item" onClick={() => this.handleSiteChange('edit')} style={this.getMenuEditStyle()}>
            <p className="nav-link" href="#">Edit</p>
          </li>
        </ul>
        <p>{this.state.profileInf.first_name}'s Comments</p>
        <div className="table-container">
          <table className="table">
            <thead className="thead-default">
              <tr>
                <th>Project Name</th>
                <th>Status</th>
                <th>Description</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Contextual music information retrieval and recommendation</th>
                <td>pending</td>
                <td>descriptions are useful</td>
                <td>22/06/17</td>
                <td>
                  <i className="fa fa-bookmark" aria-hidden="true"></i>
                </td>
              </tr>
              <tr>
                <th scope="row">Semantic Analysis of Song Lyrics</th>
                <td>pending</td>
                <td>descriptions are great</td>
                <td>22/06/17</td>
                <td>
                  <i className="fa fa-bookmark-o" aria-hidden="true"></i>
                </td>
              </tr>
              <tr>
                <th scope="row">Combining Audio Content and Social Context for Semantic Music Discovery</th>
                <td>done</td>
                <td>descriptions are love</td>
                <td>22/06/17</td>
                <td>
                  <i className="fa fa-bookmark-o" aria-hidden="true"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="pagination-container">
          <div className="text-xs-center">
            <div>
              <ul className="pagination">
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
                <li className="page-item"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                  <span className="sr-only">Next</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
);
  }
  }
}
