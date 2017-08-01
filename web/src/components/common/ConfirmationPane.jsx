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
        style = {{ width : 160}}
        />,
      <RaisedButton
        label = {this.props.confirmationLabel}
        primary = {true}
        onTouchTap = {this.props.confirmAction}
        style = {{marginLeft : 20, width : 160}}
        />,
    ]

    return (
      <Dialog
        title = {this.props.title}
        actions = {actions}
        modal = {false}
        open = {this.props.open}
        >
      </Dialog>
    )
  }
}
