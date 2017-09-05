import React, { Component } from 'react'
import ChipInput from 'material-ui-chip-input'
import Chip from 'material-ui/Chip'
import AutoComplete from 'material-ui/AutoComplete'
import Backend from '../../common/Backend'
import Styles from '../Styles.jsx'

export default class AuthorInputList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }

  componentWillReceiveProps(props){
    var list = props.value.map((email) => {
      var name = email
      for(let item in this.state.suggestions){
        if(this.state.suggestions[item].email === email){
          name = this.state.suggestions[item].name
          break
        }
      }
      return {email: email, name: name}
    })
    this.setState({
      list: list,
    });
  }

  componentWillMount(){
    Backend.getAuthors().then((suggestions) => {
      var list = this.props.value.map(email => {
        var name = email
        for(let item in suggestions){
          if(suggestions[item].email === email){
            name = suggestions[item].name
            break
          }
        }
        return {email: email, name: name}
      })
      this.setState({
        suggestions: suggestions,
        list: list,
      })
    })
  }

  handleRequestAdd (chip) {
    if(this.props.filtered && !this.state.suggestions.some((c) => c.email === chip.email))
      return
    var list = [...this.state.list, chip]
    this.setState({
      list: list
    })
    var value = list.map((item) => {return item.email})
    var event = {target: { name: this.props.name,
      value: value}}
    this.props.onChange(event)
  }

  handleRequestDelete (deletedChip) {
    var list = this.state.list.filter((c) => c.email !== deletedChip)
    this.setState({
      list: list
    })
    var value = list.map((item) => {return item.email})
    var event = {target: { name: this.props.name,
      value: value}}
    this.props.onChange(event)
  }

  render(){
    return(
      <ChipInput
        dataSource = {this.state.suggestions}
        value = {this.state.list}
        filter = {AutoComplete.fuzzyFilter}
        onRequestAdd = {(chip) => this.handleRequestAdd(chip)}
        onRequestDelete = {(deletedChip) => this.handleRequestDelete(deletedChip)}
        errorText = {this.props.errorText}
        dataSourceConfig = {{ text: 'name', value: 'email' }}
        hintText = {'Add authors...'}
        fullWidth
        chipRenderer = {({ value, text, isFocused, isDisabled, handleClick, handleRequestDelete }, key) => (
          <Chip
            key = {key}
            style = {{margin: '8px 8px 0 0',float: 'left'}}
            backgroundColor = {'#ffffff'}
            onTouchTap = {handleClick}
            onRequestDelete = {handleRequestDelete}>
            <span style = {{color: Styles.palette.textColor, fontWeight: 'bold', whiteSpace: 'normal', lineHeight: 1.5}}> {text} </span>
          </Chip>
        )}/>
      )
    }
  }
