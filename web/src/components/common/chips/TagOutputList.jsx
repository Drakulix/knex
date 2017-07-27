import React, { Component } from 'react'
import Chip from 'material-ui/Chip'
import {Link} from 'react-router-dom'

export default class TagOutputList extends Component{

  render(){
    return (
      <div style = {{display: 'flex', flexWrap: 'wrap',}}>
        { this.props.value !== undefined ?
          this.props.value.map(item =>
            <Chip style= {{margin: '8px 8px 0 0', background : '#ff5000', float: 'left' }} key={item}>
              <Link to={"/discovery/"+ JSON.stringify({tags : [item]})}
                    style= {{color:'#ffffff', fontWeight:'bold'}}>
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
