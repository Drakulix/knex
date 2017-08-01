import React, { Component } from 'react'
import Chip from 'material-ui/Chip'
import {Link} from 'react-router-dom'
import Styles from '../Styles.jsx'


export default class TagOutputList extends Component{

  render(){
    return (
      <div style = {{display: 'flex', flexWrap: 'wrap',}}>
        { this.props.value !== undefined ?
          this.props.value.map(item =>
            <Chip style = {{margin: '4px 4px 4px 4px', background : Styles.palette.primary1Color, float: 'left' }} key = {item}>
              <Link to = {`/discovery/${JSON.stringify({tags : [item]})}`}
                    style = {{color : Styles.palette.alternateTextColor, fontWeight:'bold'}}>
                {item}
              </Link>
              <br/>
            </Chip>
          ) : ""
        }
      </div>
    )
  }
}
