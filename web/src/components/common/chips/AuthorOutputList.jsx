import React, { Component } from 'react'
import Chip from 'material-ui/Chip'
import {Link} from 'react-router-dom'
import Styles from '../Styles.jsx'


export default class AuthorOutputList extends Component{

  render(){
    return (
      <div style = {{display: 'flex', flexWrap: 'wrap',}}>
        { this.props.value !== undefined ?
          this.props.value.map(email =>
            <Chip style= {{margin: '4px 4px 4px 4px', background: '#ffffff', float: 'left' }} key = {email}>
              <Link   to = {`/profile/${email}`}
                      style= {{color: Styles.palette.textColor, fontWeight: 'bold'}}>
                      {this.props.userNames !== undefined && this.props.userNames[email] !== undefined
                        ?  this.props.userNames[email]: email}
              </Link>
              <br/>
            </Chip>
          ): ""
        }
      </div>
    )
  }
}
