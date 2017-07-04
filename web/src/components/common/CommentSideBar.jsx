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
      {comment : "Thats a comment" , name :"Marko", id:"21", date: "12.12.2012"},


      {comment : "Thats a comment" , name :"Marko", id:"21", date: "12.12.2012"}
    ];

this.setState({comments: comments});
  }

  render() {
    return (
        <Drawer
          docked={false}
          width={400}
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
              <ListItem primaryText={item.comment}
                        secondaryText={item.name + " " + item.date}
              />
            </div>)
          }
        </List>
      </Drawer>
    );
  }
}
