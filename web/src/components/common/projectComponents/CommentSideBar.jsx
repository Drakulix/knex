import React from 'react'
import Drawer from 'material-ui/Drawer'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Backend from '../Backend'
import {grey400} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TextField from 'material-ui/TextField'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';


class CommentItem extends React.Component {
  constructor(){
    super();
    this.state = {open : false}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this)
  }

  handleDelete(event){
    Backend.deleteProjectComment(this.props.p_id, this.props.comment.id)
    .then(() => this.props.handleUpdateList())
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleEdit(event){
    this.setState({
      message : this.props.comment.message
    })
    this.handleOpen()
  }

  handleSubmitEdit(event){
    Backend.updateProjectComment(this.props.p_id, this.props.comment.id, this.state.message)
    .then(() => {
      this.props.handleUpdateList()
      this.handleClose()
    })
  }

  handleChange(event) {
    var value = event.target.value;
    this.setState({message: value})

  }

  render(){
    const actions = [
      <FlatButton
        label = "Cancel"
        primary = {true}
        onTouchTap = {this.handleClose}
      />,
      <FlatButton
        label = "Submit"
        primary = {true}
        keyboardFocused = {true}
        onTouchTap = {this.handleSubmitEdit}
      />,
    ];

    const iconButtonElement = (
      <IconButton
        touch = {true}
        tooltip = "more"
        tooltipPosition = "bottom-left"
      >
        <MoreVertIcon color = {grey400} />
      </IconButton>
    );

    const rightIconMenu = (
      <IconMenu iconButtonElement = {iconButtonElement}>
        <MenuItem onClick = {()=>this.handleEdit()}>Edit</MenuItem>
        <MenuItem onClick = {()=>this.handleDelete()} >Delete</MenuItem>
      </IconMenu>
    );
    return (
    <div>
    <Dialog
          title = "Edit Comment"
          actions = {actions}
          modal = {false}
          open = {this.state.open}
          onRequestClose = {this.handleClose}
        >
        <TextField  value = {this.state.message}
          name = "Change Comment."
          onChange = {this.handleChange}
          hintText = "Change Comment."
          style = {{width : '100%', marginTop : 6}}
          multiLine = {true}
          />

        </Dialog>
    <ListItem primaryText = {this.props.comment.message}
              secondaryText = {<div>
                <span style = {{float : "left"}}>
                  {this.props.userNames!== undefined ? this.props.userNames[this.props.comment.author]
                                                    : this.props.comment.author}
                </span>
                <span style = {{float : "right"}}>{this.props.comment.datetime}</span>
              </div>}
              rightIconButton = {rightIconMenu}
    />
    </div>
  )
  }
}

export default class CommentSideBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showCommentBar : false,
      comment : "",
      comments : []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUpdateList = this.handleUpdateList.bind(this)
    this.loadComments = this.loadComments.bind(this)
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

  handleUpdateList(event){
    this.loadComments()
    this.props.handleUpdateComments()
  }

  handleSubmit(event){
    Backend.addProjectComment(this.props.uuid, this.state.comment).then(function(response){
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
  }

  handleToggle = () => this.setState({showCommentBar : !this.state.showCommentBar})

  componentWillReceiveProps(props){
    this.setState({showCommentBar : props.open})
  }

  componentWillMount(){
    this.loadComments()
  }

  loadComments(){
    return Backend.getProjectComments(this.props.uuid).then((data) => {
      var filteredData = this.transformArray(data)
      this.props.loadComments(data.length)
      this.setState({
        comments : filteredData
      })
    })
  }

  render() {
    return (
      <Drawer
        docked = {false}
        width = {600}
        open = {this.state.showCommentBar}
        onRequestChange = {(showCommentBar) => this.setState({showCommentBar})}>
        <div style = {{padding : 20}}>
          <TextField  value = {this.state.comment}
                    onChange = {this.handleChange}
                    hintText = "Add a comment"
                    style = {{width : '100%'}}
                    multiLine = {true}
          />
          <div style = {{textAlign : "center", marginBottom : 25}}>
            <RaisedButton label = "Comment"
                        disabled = {this.state.comment === ""}
                        onClick = {this.handleSubmit}
                        primary = {true}/>
          </div>
        </div>
        <List>
        {this.state.comments.map(item =>
          <div key = {item.id}>
            <Divider/>
            <CommentItem comment = {item} userNames = {this.props.userNames} p_id = {this.props.uuid} handleUpdateList = {this.handleUpdateList}/>
          </div>)
        }
      </List>
    </Drawer>
    )
  }
}
