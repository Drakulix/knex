import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import ChipInput from 'material-ui-chip-input';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete'
import styles from '../common/Styles.jsx'




export default class SharePane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      authors:[]
    };
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

  handleRequestAdd (chip, name) {
    if(this.state["suggestedAuthors"].indexOf(chip) == -1)
        return;
     this.setState({
       [name]: [...this.state[name], chip]
     })
   }

  handleRequestDelete (deletedChip, name) {
     this.setState({
         [name]: this.state[name].filter((c) => c !== deletedChip)
       })
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
          <ChipInput
                 dataSource={this.state.suggestedAuthors}
                 value={this.state.authors}
                 filter={AutoComplete.fuzzyFilter}
                 hintText='add users...'
                 onRequestAdd={(chip) => this.handleRequestAdd(chip, "authors")}
                 onRequestDelete={(deletedChip) => this.handleRequestDelete(deletedChip, "authors")}
                 fullWidth
                 chipRenderer={({ value, isFocused, isDisabled, handleClick, handleRequestDelete }, key) => (
                   <Chip
                           key={key}
                           style= {styles["chip"]}
                           backgroundColor={styles.chip.background}
                           onTouchTap={handleClick}
                           onRequestDelete={handleRequestDelete}>
                          <span style={styles["chipText"]}> {value} </span>
                   </Chip>
                )}/>
        </Dialog>
    );
  }
}
