import React from 'react'
import Backend from '../common/Backend'
import HeadLine from '../common/HeadLine'
import PasswordChange from '../common/settings/PasswordChange'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import NotificationSettings from '../common/settings/NotificationSettings'

export default class Settings extends React.Component {



  render() {
    return (
      <div className = "container">
        <HeadLine title = {"Your settings"}/>
          <Card>
            <CardHeader
              title = {"Change your notification settings"}
              actAsExpander = {true}
              showExpandableButton = {true}
            />
            <CardText expandable = {true}>
              <NotificationSettings />
            </CardText>
          </Card>
          <Card style = {{marginTop: 40}}>
            <CardHeader
              title = {"Change your password"}
              actAsExpander = {true}
              showExpandableButton = {true}
            />
            <CardText expandable = {true}>
              <PasswordChange email = {Backend.getMail()} />
            </CardText>
          </Card>
      </div>
    )
  }
}
