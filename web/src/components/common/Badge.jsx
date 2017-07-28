import React, { Component } from 'react'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

const statusString = [
  {text : <span className = "badge badge-success">DONE</span>, value : "DONE"},
  {text : <span className = "badge badge-info">IN_REVIEW</span>, value : "IN_REVIEW"},
  {text : <span className = "badge badge-warning">IN_PROGRESS</span>, value : "IN_PROGRESS"},
]

export default class Badge extends Component {

  render () {
    for(let item in statusString){
      if (statusString[item].value === this.props.value)
        return statusString[item].text
    }
    return (<div>{this.props.value}</div>)
  }

}


export class BadgeInput extends Component {

  render (){
    return (
      <DropDownMenu
        value = {this.props.value}
        onChange = {this.props.onChange}
        labelStyle = {{width : '100%', paddingLeft : 0}}
        underlineStyle = {{width : '100%', marginLeft : 0}}
        autoWidth = {false}
        style = {{width : '100%'}}
        >
        {statusString.map(item =><MenuItem
            key = {item.value}
            value = {item.value}
            primaryText = {item.text} />)}
      </DropDownMenu>
    )
  }
}
