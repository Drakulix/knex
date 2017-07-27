import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'


export default class ConfirmationPane extends Component {

  render() {
    const actions = [
      <RaisedButton
        label = "Cancel"
        primary = {true}
        onTouchTap = {this.props.handleClose}
        />,
      <RaisedButton
        label = {this.props.confirmationLabel}
        primary = {true}
        onTouchTap = {this.props.confirmAction}
        style = {{marginLeft : 20}}
        />,
    ]

    return (
      <Dialog
        title = {this.props.title}
        actions = {actions}
        modal = {false}
        open = {this.props.open}
        onRequestClose = {this.props.handleClose}
        >
      </Dialog>
    )
  }
}
