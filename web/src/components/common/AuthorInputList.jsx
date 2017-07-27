import React, { Component } from 'react'
import ChipInput from 'material-ui-chip-input'
import Chip from 'material-ui/Chip'
import AutoComplete from 'material-ui/AutoComplete'
import styles from '../common/Styles.jsx'

export default class AuthorInputList extends Component {
  constructor(props) {
    super(props)
    this.state = {
<<<<<<< HEAD
      list : this.props.value,
      suggestions : this.props.suggestions
=======
      list : this.props.value
>>>>>>> fdd606059a07b4bcb59200b742484876795cab25
    }
  }

  handleRequestAdd (chip) {
    if(this.props.filtered && this.props.suggestions.indexOf(chip) === -1)
      return
    var list = [...this.state.list, chip]
    this.setState({
      list : list
    })
    var event = {target : { name : this.props.name,
      value : list}}
    this.props.onChange(event)
  }

  handleRequestDelete (deletedChip) {
<<<<<<< HEAD
    var list = this.state.list.filter((c) => c !== deletedChip)
    this.setState({
      list : list
    })
=======
    var list = this.state.list.filter((c) => c.email !== deletedChip)
    this.setState({
      list : list
    })
    
>>>>>>> fdd606059a07b4bcb59200b742484876795cab25
    var event = {target : { name : this.props.name,
      value : list}}
    this.props.onChange(event)
  }

  componentWillReceiveProps(props){
<<<<<<< HEAD

    this.setState({list : props.value,
suggestions : props.suggestions
    });
=======
    this.setState({list : props.value});
>>>>>>> fdd606059a07b4bcb59200b742484876795cab25
  }

  render(){
    return(
      <ChipInput
<<<<<<< HEAD
        dataSource={this.state.suggestions}
=======
        dataSource={this.props.suggestions}
        dataSourceConfig={{ text: 'name', value: 'email' }}
>>>>>>> fdd606059a07b4bcb59200b742484876795cab25
        value={this.state.list}
        filter={AutoComplete.fuzzyFilter}
        onRequestAdd={(chip) => this.handleRequestAdd(chip)}
        onRequestDelete={(deletedChip) => this.handleRequestDelete(deletedChip)}
        errorText={this.props.errorText}
        hintText={this.props.hintText}
        fullWidth
<<<<<<< HEAD
        chipRenderer={({ value, isFocused, isDisabled, handleClick, handleRequestDelete }, key) => (
=======
        chipRenderer={({ value, text, isFocused, isDisabled, handleClick, handleRequestDelete }, key) => (
>>>>>>> fdd606059a07b4bcb59200b742484876795cab25
          <Chip
            key={key}
            style= {{margin: '8px 8px 0 0',float: 'left'}}
            backgroundColor={'#ffffff'}
            onTouchTap={handleClick}
            onRequestDelete={handleRequestDelete}>
<<<<<<< HEAD
            <span style={{color : '#000000', fontWeight: 'bold'}}> {value} </span>
=======
            <span style={{color : '#000000', fontWeight: 'bold'}}> {text} </span>
>>>>>>> fdd606059a07b4bcb59200b742484876795cab25
          </Chip>
        )}/>
      )
    }
  }
