import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import ChipInput from 'material-ui-chip-input';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete'
import styles from '../common/Styles.jsx'
import ChipInputList from '../common/ChipInputList.jsx'



export default class SharePane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      authors:[]
    };

    this.handleAuthorChange = this.handleAuthorChange.bind(this);
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  componentWillMount(){
    this.loadAuthors();
  }

  componentWillReceiveProps(props){
    this.setState({open: props.value});
  }


  loadAuthors() {
    var suggestedAuthors = [{id:"marko@knex.", name :"Marko"},
    {id:"victor@knex", name :"Victor"},{id:"cedric@knex", name :"Cedric"}];

    //loadSuggestedAuthors

    var suggestedAuthorsArray = []
    for (var i in suggestedAuthors) {
      suggestedAuthorsArray = suggestedAuthorsArray.concat([suggestedAuthors[i].name + " ("+suggestedAuthors[i].id+ ")"]);
    }
    this.setState({suggestedAuthors: suggestedAuthorsArray});
  }


  handleAuthorChange(value) {
    this.setState({authors : value});
    this.props.onChange("tags" , value);
  }

  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
        />,
      <RaisedButton
        label="Share"
        primary={true}
        onTouchTap={this.handleClose}
        style={{marginLeft:20}}
        />,
    ];

    return (
      <Dialog
        title="Share project with"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
        >
        <ChipInputList suggestions = {this.state.suggestedAuthors}
          onChange={this.handleAuthorChange}
          filtered ={true}
          value={this.state.authors}
          hintText={'Add authors...'}
          />

      </Dialog>
    );
  }
}
