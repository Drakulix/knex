import React, { Component } from 'react'
import Chip from 'material-ui/Chip'

export default class SkillOutputList extends Component{

  render(){
    return (
      <div style = {{display: 'flex', flexWrap: 'wrap',}}>
        { this.props.value !== undefined ?
          this.props.value.map(item =>
            <Chip style= {{margin: '4px 4px 4px 4px', background : '#ff5000', float: 'left' }} key={item}>
              <div style= {{color:'#ffffff', fontWeight:'bold'}}>
                {item}
              </div>
            </Chip>
          ) : ""
        }
      </div>
    )
  }
}
