import React, { Component } from 'react'
import Chip from 'material-ui/Chip'
import {Link} from 'react-router-dom'

export default class AuthorOutputList extends Component{

  render(){
    return (
      <div style = {{display: 'flex', flexWrap: 'wrap',}}>
        { this.props.value !== undefined ?
          this.props.value.map(item =>
            <Chip style= {{margin: '8px 8px 0 0', background : '#ffffff', float: 'left' }} key={item}>
              <Link   to = {"/profile/"+item}
                      style= {{color:'#000000', fontWeight:'bold'}}>
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
