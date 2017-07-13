import React from 'react'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import ChipInputList from '../common/ChipInputList.jsx'
import { fetchJson} from '../common/Backend.jsx'

export default class SharePane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      authors:[]
    }
    this.handleAuthorChange = this.handleAuthorChange.bind(this)
  }

  handleClose = () => {
    this.setState({open: false})
  }

  shareProject =() =>{
    for (var i in this.state.authors) {
      var string = this.state.authors[i]
      var id = string.substring(string.lastIndexOf("(")+1, string.length-1)
      var shareURL =  "/api/projects/"+this.props.uuid+"/share/"+id
      fetch(shareURL, {
        method: 'POST',
        mode: 'no-cors',
        credentials: 'include',
        headers: {
          "Accept": "application/json",
        }
      }).then(response => response.json()).catch(ex => {
        console.error('parsing failes', ex)
      })
    }
    this.setState({open: false})
  }


  componentDidMount() {
    //tipp: if you fetch server side data, this is the place where it should happen :)

    //gets all the exsiting tags from the backend
    fetchJson('/api/projects/tags').then(function(tags) {
      this.setState({
        suggestedTags: tags
      })
    }.bind(this))

    //gets all the authors from the backend
    fetchJson('/api/users').then(function(authors) {
      var suggestedAuthors = authors
      var suggestedAuthorsArray = []
      for (var i in suggestedAuthors) {
        suggestedAuthorsArray = suggestedAuthorsArray.concat([
                                   suggestedAuthors[i].first_name + " "
                                   +suggestedAuthors[i].last_name +
                             + " ("+suggestedAuthors[i].email+ ")"])
      }
      console.log(suggestedAuthorsArray)
      this.setState({
        suggestedAuthors: suggestedAuthorsArray
      })
    }.bind(this))
  }

  componentWillReceiveProps(props){
    this.setState({open: props.value})
  }

  handleAuthorChange(value) {
    this.setState({authors : value})
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
        onTouchTap={this.shareProject}
        style={{marginLeft:20}}
        />,
    ]
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
    )
  }
}
