import React, { Component } from 'react'
import ChipInput from 'material-ui-chip-input'
import Chip from 'material-ui/Chip'
import AutoComplete from 'material-ui/AutoComplete'
import styles from '../common/Styles.jsx'

export default class AuthorInputList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list : this.props.value,
      suggestions : this.props.suggestions
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
    var list = this.state.list.filter((c) => c !== deletedChip)
    this.setState({
      list : list
    })
    var event = {target : { name : this.props.name,
      value : list}}
    this.props.onChange(event)
  }

  componentWillReceiveProps(props){
    this.setState({
      list : props.value,
      suggestions : props.suggestions
    });
  }

  render(){
    return(
      <ChipInput
        dataSource={this.state.suggestions}
        value={this.state.list}
        filter={AutoComplete.fuzzyFilter}
        onRequestAdd={(chip) => this.handleRequestAdd(chip)}
        onRequestDelete={(deletedChip) => this.handleRequestDelete(deletedChip)}
        errorText={this.props.errorText}
        hintText={this.props.hintText}
        fullWidth
        chipRenderer={({ value, text, isFocused, isDisabled, handleClick, handleRequestDelete }, key) => (
          <Chip
            key={key}
            style= {{margin: '8px 8px 0 0',float: 'left'}}
            backgroundColor={'#ffffff'}
            onTouchTap={handleClick}
            onRequestDelete={handleRequestDelete}>
            <span style={{color : '#000000', fontWeight: 'bold'}}> {value} </span>
          </Chip>
        )}/>
      )
    }
  }
