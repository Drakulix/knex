import React, { Component } from 'react'
import Styles from '../Styles.jsx'

const change = {
  borderWidth: 2,
  borderColor : Styles.palette.primary1Color,
  borderStyle : 'solid',
}

const noChange = {
  borderWidth: 2,
  borderColor : 'transparent',
  borderStyle : 'solid',
}


export default class InformationPane extends Component{



  render(){
    return (
      <div className = {this.props.className}
           style = {this.props.change !== undefined && this.props.change ? change: noChange}>
        {this.props.change ?
          <div style = {{fontSize: 10, paddingLeft:5, color : Styles.palette.alternateTextColor, backgroundColor: Styles.palette.primary1Color, textTransform: 'uppercase'}}>
            Changed
          </div>
        : <div style = {{}} /> }
        <div style = {{padding: 12, paddingTop:5}}>{this.props.component}</div>
      </div>
    )
  }

}
