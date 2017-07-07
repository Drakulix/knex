import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import TextField from 'material-ui/TextField';



export default class CommentSideBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {showCommentBar: false,
    comment:""};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      comment: value});
  }


  handleSubmit(event){
    const name = event.target.name;
    const value = event.target.value;

    var fetchURL ="/api/projects/"+this.props.uuid+"/comment/";

    // PUT comment irgendwie
    this.setState({
      comment: ""});
  }



  handleToggle = () => this.setState({showCommentBar: !this.state.showCommentBar});

  componentWillReceiveProps(props){
    this.setState({showCommentBar: props.value});
  }

  componentWillMount(){
    this.loadComments();
  }


  loadComments(){
    var comments = [
      {message : "Thats a comment" , author_name :"Marko", id:"21", datetime: "12.12.2012"},


      {message : "Thats a comment" , author_name :"Marko", id:"21", datetime: "12.12.2012"}
    ];


  var fetchURL ="/api/projects/"+this.props.uuid+"/comment/"; //GET


this.setState({comments: comments});
  }

  render() {
    return (
        <Drawer
          docked={false}
          width={600}
          open={this.state.showCommentBar}
          onRequestChange={(showCommentBar) => this.setState({showCommentBar})}>
          <List>
            <div style={{padding:20}}>
            <TextField  value={this.state.comment}
                        onChange={this.handleChange}
                        hintText="Add a comment"
                        style={{width:'100%'}}
                        multiLine={2}
            />
            <div style={{textAlign:"center", marginBottom:25}}>
              <RaisedButton label="Comment"
                            disabled={this.state.comment === ""}
                            onClick={this.handleSubmit}
                            primary={true}/>
            </div>
          </div>
          {this.state.comments.map(item =>
            <div>
              <Divider/>
              <ListItem primaryText={item.message}
                        secondaryText={item.author_name + " " + item.datetime}
              />
            </div>)
          }
        </List>
      </Drawer>
    );
  }
}
