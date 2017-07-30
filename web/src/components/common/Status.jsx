import React, { Component } from 'react'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import Chip from 'material-ui/Chip'

const statusString = [
  {text : <Chip style = {{background : '#ff5000', marginTop:4}}><span style= {{color:'#ffffff', fontWeight:'bold', fontSize:12}}>Done</span></Chip>, value : "DONE"},
  {text : <Chip style = {{background : '#ffb400',marginTop:4}}><span style= {{color:'#ffffff', fontWeight:'bold', fontSize:12}}>In review</span></Chip>, value : "IN_REVIEW"},
  {text : <Chip style = {{background : '#ffcc50',marginTop:4}}><span style= {{color:'#ffffff', fontWeight:'bold', fontSize:12}}>In progress</span></Chip>, value : "IN_PROGRESS"}
]

export default class Status extends Component {

  render () {
    for(let item in statusString){
      if (statusString[item].value === this.props.value)
        return statusString[item].text
    }
    return (<div>{this.props.value}</div>)
  }

}


export class StatusInput extends Component {

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
