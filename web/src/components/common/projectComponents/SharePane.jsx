import React from 'react'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import AuthorInputList from '../chips/AuthorInputList'
import Backend from '../Backend'

export default class SharePane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      authors : [],
    }
    this.handleAuthorChange = this.handleAuthorChange.bind(this)
  }

  shareProject =() =>{
    for (var i in this.state.authors) {
      Backend.shareProjectToUser(this.props.uuid, this.state.authors[i])
    }
    this.setState({open : false})
    this.props.handleSharedProject()
  }

  handleAuthorChange(event) {
    const value = event.target.value
    this.setState({authors : value})
  }

  render() {
    const actions = [
      <RaisedButton
        label = "Cancel"
        primary = {true}
        onTouchTap = {this.props.handleClosedSharePane}
        />,
      <RaisedButton
        label = "Share"
        primary = {true}
        onTouchTap = {this.shareProject}
        style = {{marginLeft : 20}}
        disabled = {this.state.authors.length === 0}
        />,
    ]
    return (
      <Dialog
        title = "Share project with"
        actions = {actions}
        modal = {false}
        open = {this.props.open}
        onRequestClose = {this.handleClosedSharePane}
        >
        <AuthorInputList
          onChange = {this.handleAuthorChange}
          name = "authors"
          filtered = {true}
          value = {this.state.authors}
          style = {{marginBottom : (this.state.authors.length === 0) ? 0 : 17} }
          errorText = {(this.state.authors.length === 0) ?
                      "Please provide at least one author" : ""}
          />
      </Dialog>
    )
  }
}
