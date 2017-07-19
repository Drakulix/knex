import React from 'react'
import Drawer from 'material-ui/Drawer'
import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import {get, del} from './Backend'
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TextField from 'material-ui/TextField'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';


class CommentItem extends React.Component {
  constructor(){
    super();
  }

  handleDelete(event){
    var fetchURL ="/api/projects/"+this.props.p_id+"/comment/"+this.props.comment.id
    del(fetchURL)
    this.props.handleDeleted()
    }

  render(){
    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
      >
        <MoreVertIcon color={grey400} />
      </IconButton>
    );

    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onClick = {()=>console.log('Edit')}>Edit</MenuItem>
        <MenuItem onClick = {()=>this.handleDelete()} >Delete</MenuItem>
      </IconMenu>
    );
    return (
    <ListItem primaryText={this.props.comment.message}
              secondaryText={<div>
                <span style={{float : "left"}}>{this.props.comment.author.email}</span>
                <span style={{float : "right"}}> {this.props.comment.datetime}</span>
              </div>}
              rightIconButton={rightIconMenu}
    />
  )
  }
}

export default class CommentSideBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {showCommentBar : false,
    comment : "",
    comments : []}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDeleted = this.handleDeleted.bind(this)
  }

  transformArray(dataArray) {
    var filteredDataArray = []
    for(let dataObject of dataArray) {
      filteredDataArray.push(dataObject)
    }
    return filteredDataArray
  }

  handleChange(event){
    const value = event.target.value
    this.setState({
      comment : value
    })
  }

  handleDeleted(event){
    this.loadComments()
    this.props.callback()
  }

  handleSubmit(event){
    var fetchURL ="/api/projects/"+this.props.uuid+"/comment"
    fetch(fetchURL, {
        method : 'POST',
        credentials : 'include',
        headers : {
          'Content-Type' : 'text/plain'
        },
        body : this.state.comment
      }).then(function(response){
        if(response.status === 200){
          return true
        }else{
          return false
        }
      })
    this.setState({
      comment : ""
    })
    this.loadComments()
    this.props.callback()
  }

  handleToggle = () => this.setState({showCommentBar : !this.state.showCommentBar})

  componentWillReceiveProps(props){
    this.setState({showCommentBar : props.value})
  }

  componentWillMount(){
    this.loadComments()
  }

  loadComments(){
    var fetchURL = "/api/projects/" + this.props.uuid + "/comment"
    get(fetchURL).then(function(data) {
      var filteredData = this.transformArray(data)
      this.setState({
        comments : filteredData
      })
    }.bind(this))
  }

  render() {
    return (
      <Drawer
        docked={false}
        width={600}
        open={this.state.showCommentBar}
        onRequestChange={(showCommentBar) => this.setState({showCommentBar})}>
        <List>
          <div style={{padding : 20}}>
          <TextField  value={this.state.comment}
                      onChange={this.handleChange}
                      hintText="Add a comment"
                      style={{width : '100%'}}
                      multiLine = {true}
          />
          <div style={{textAlign : "center", marginBottom : 25}}>
            <RaisedButton label="Comment"
                          disabled={this.state.comment === ""}
                          onClick={this.handleSubmit}
                          primary={true}/>
          </div>
        </div>
        {this.state.comments.map(item =>
          <div>
            <Divider/>
            <CommentItem comment={item} p_id={this.props.uuid} handleDeleted={this.handleDeleted}/>
          </div>)
        }
      </List>
    </Drawer>
    )
  }
}
