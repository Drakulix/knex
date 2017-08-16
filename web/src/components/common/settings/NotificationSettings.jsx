import React, { Component } from 'react'
import Backend from '../../common/Backend'
import Toggle from 'material-ui/Toggle'


const notificationTypes = {
   'create':     "A new interesting project was uploaded",
   'archive':    "One of your projects was archived",
   'unarchive':  "One of your projects was recovered",
   'share':      "A project was shared to you",
   'comment':    "One of your projects was commented",
   'update':     "One of your projects was edited",
   'bookmark':   "One of your projects was bookmarked",
}

export default class NotificationSettings extends Component {

  constructor(props){
    super(props)
    var temp = {}
    var types = Object.keys(notificationTypes)
    for(let key in types){
      temp[types[key]] = false
    }
    this.state = {
      settings : temp
    }
    this.onToggle = this.onToggle.bind(this)
  }

  loadSettings(){
    Backend.loadNotifiactionSettings()
    .then ((settings) => {
      var temp = {}
      var types = Object.keys(notificationTypes)
      for(let key in types){
        var setting = types[key]
        temp[setting] = (settings[setting] === "true" || settings[setting] === undefined) ? true : false
      }
      this.setState({settings: temp})
    })
  }

  componentWillMount(){
    this.loadSettings()
  }

  onToggle(event){
    var settings = this.state.settings;
    settings[event.target.name] = !settings[event.target.name]
    this.setState(settings)
    Backend.setNotificationSettings(settings)
  }

  render () {
    return (
      <div className = "row">
        {Object.keys(notificationTypes).map(
          key =>
            <div className = "col-4" key = {key}>
              <Toggle
                label = {notificationTypes[key]}
                name = {key}
                onToggle = {this.onToggle}
                toggled = {this.state.settings[key]}
                labelPosition = {'right'}
              />
            </div>

        )}
      </div>
    )
  }
}
