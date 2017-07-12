import React, { Component } from 'react'
import ChipInput from 'material-ui-chip-input'
import Chip from 'material-ui/Chip'
import AutoComplete from 'material-ui/AutoComplete'
import styles from '../common/Styles.jsx'


export default class ChipInputList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list:this.props.value
    }
  }

  handleRequestAdd (chip) {
    if(this.props.filtered && this.props.suggestions.indexOf(chip) === -1)
      return
    var list = [...this.state.list, chip]
    this.setState({
      list: list
    })
    this.props.onChange(list)
  }

  handleRequestDelete (deletedChip) {
    var list = this.state.list.filter((c) => c !== deletedChip)
    this.setState({
      list: list
    })
    this.props.onChange(list)
  }

  componentWillReceiveProps(props){
    this.props = props
  }

  render(){
    return(
      <ChipInput
        dataSource={this.props.suggestions}
        value={this.state.list}
        filter={AutoComplete.fuzzyFilter}
        onRequestAdd={(chip) => this.handleRequestAdd(chip)}
        onRequestDelete={(deletedChip) => this.handleRequestDelete(deletedChip)}
        errorText={this.props.errorText}
        hintText={this.props.hintText}
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
      )
    }
  }
