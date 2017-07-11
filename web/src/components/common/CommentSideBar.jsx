import React from 'react';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {fetchJson} from './Backend'
import TextField from 'material-ui/TextField';



export default class CommentSideBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {showCommentBar: false,
    comment:"",
    comments: []};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  transformArray(dataArray) {
    var filteredDataArray = [];
    for(let dataObject of dataArray) {
      filteredDataArray.push(dataObject);
    }
    return filteredDataArray;
  };


  handleChange(event){
    const value = event.target.value;
    this.setState({
      comment: value});
  }


  handleSubmit(event){
    var fetchURL ="/api/projects/"+this.props.uuid+"/comment";
    fetch(fetchURL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: this.state.comment
      }).then(function(response){
        if(response.status === 200){
          return true;
        }else{
          return false;
        }
      });
    this.setState({
      comment: ""});

    this.loadComments();
  }



  handleToggle = () => this.setState({showCommentBar: !this.state.showCommentBar});

  componentWillReceiveProps(props){
    this.setState({showCommentBar: props.value});
  }

  componentWillMount(){
    this.loadComments();
  }


  loadComments(){
    var fetchURL ="/api/projects/"+this.props.uuid+"/comment";
    fetchJson(fetchURL).then(function(data) {
      var filteredData = this.transformArray(data);
      console.log(data);
      this.setState({
        comments: filteredData
      });
    }.bind(this));
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
                        secondaryText={item.author.email + " " + item.datetime}
              />
            </div>)
          }
        </List>
      </Drawer>
    );
  }
}
