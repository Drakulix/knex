import React, { Component } from 'react'
import Chip from 'material-ui/Chip'
import Styles from '../Styles.jsx'

export default class SkillOutputList extends Component{

  render(){
    return (
      <div style = {{textAlign: "center"}}>
        { this.props.value !== undefined ?
          this.props.value.map(item =>
            <Chip style= {{margin: '4px 4px 4px 4px', background: Styles.palette.primary1Color, float: 'left' }} key = {item}>
              <div style= {{color: Styles.palette.alternateTextColor, fontWeight: 'bold', whiteSpace: 'normal', lineHeight: 1.5}}>
                {item}
              </div>
            </Chip>
          ): ""
        }
      </div>
    )
  }
}
