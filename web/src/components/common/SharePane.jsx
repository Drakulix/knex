import React from 'react'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import ChipInputList from '../common/ChipInputList.jsx'
import {get, post} from '../common/Backend.jsx'
import {getMyEmail} from '../common/Authentication.jsx'


export default class SharePane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      authors : []
    }
    this.handleAuthorChange = this.handleAuthorChange.bind(this)
  }

  shareProject =() =>{
    for (var i in this.state.authors) {
      var string = this.state.authors[i]
      var id = string.substring(string.lastIndexOf("(")+1, string.length-1)
      post("/api/projects/"+this.props.uuid+"/share/"+id, {})
    }
    this.setState({open : false})
    this.props.handleSharedProject()
  }

  componentDidMount() {
    //tipp : if you fetch server side data, this is the place where it should happen :)
    //gets all the authors from the backend
    get('/api/users').then(function(authors) {
      var suggestedAuthors = authors
      var suggestedAuthorsArray = []
      for (var i in suggestedAuthors) {
        if(suggestedAuthors[i].email == getMyEmail())
          continue
        suggestedAuthorsArray = suggestedAuthorsArray.concat([
                                   suggestedAuthors[i].first_name + " "
                                  +suggestedAuthors[i].last_name
                             + " ("+suggestedAuthors[i].email+ ")"])
      }
      console.log(suggestedAuthorsArray)
      this.setState({
        suggestedAuthors : suggestedAuthorsArray
      })
    }.bind(this))
  }

  handleAuthorChange(event) {
    const value = event.target.value
    this.setState({authors : value})
  }

  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleClosedSharePane}
        />,
      <RaisedButton
        label="Share"
        primary={true}
        onTouchTap={this.shareProject}
        style={{marginLeft : 20}}
        disabled ={this.state.authors.length === 0}
        />,
    ]
    return (
      <Dialog
        title="Share project with"
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.handleClosedSharePane}
        >
        <ChipInputList suggestions = {this.state.suggestedAuthors}
          onChange={this.handleAuthorChange}
          filtered ={true}
          value={this.state.authors}
          name = "authors"
          hintText={'Add authors...'}
          />
      </Dialog>
    )
  }
}
