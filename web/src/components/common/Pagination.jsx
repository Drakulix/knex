import React, { Component } from 'react'

import FlatButton from 'material-ui/FlatButton'

import FirstPage from 'material-ui/svg-icons/navigation/first-page';
import LastPage from 'material-ui/svg-icons/navigation/last-page';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import More from 'material-ui/svg-icons/navigation/more-horiz';
import Styles from './Styles.jsx'

const style = {
  width: 40,
  height: 40,
  minWidth : 40,
  fontSize : 20,
  verticalAlign: "middle",
  color: Styles.palette.textColor,
}

const activeLabel = {
  fontSize : 20,
  color: Styles.palette.textColor,
  marginLeft: -4,
  verticalAlign: 'bottom-center'
}

const activeStyle = {
  width: 38,
  height: 38,
  minWidth : 38,
  verticalAlign: "middle",
  fontSize : 20,
  color: Styles.palette.textColor,
  borderColor : Styles.palette.primary1Color,
  borderRadius : '50%',
  borderStyle : 'solid',
  borderWidth: 2,
}

export default class Pagination extends Component {

  render () {
    return (
      <div  className = "row center-block" style = {{textAlign: "center"}}>
        <div className = "col"></div>
        <div className = "col-1">
          <FlatButton style = {style} onClick = {() => this.props.jumpTo(0)} icon = {<FirstPage style={style} />}/>
        </div>
        <div className = "col-1">
          <FlatButton style = {style} icon = {<ChevronLeft style = {style}/>} onClick = {() => this.props.jumpTo(Math.max(0, this.props.page - 1))}/>
        </div>
        {this.props.page > 0 ?
          <div className = "col-1">
             <FlatButton labelStyle = {style} style = {style} label = "1" onClick = {() => this.props.jumpTo(0)}/>
          </div>
          : ""
        }
        {this.props.page > 2 ?
          <div className = {this.props.page === this.props.pages - 1
              ? "col-4": this.props.page === this.props.pages - 2
              ? "col-3": this.props.page === this.props.pages - 3
              ? "col-2" : "col-1"}>
            <FlatButton disabled = {true} style ={style} icon = {<More style = {style}/>}/>
          </div>
          : ""
        }
        {this.props.page > 1 ?
          <div className = "col-1">
            <FlatButton labelStyle = {style} style = {style} label = {this.props.page}
              onClick = {() => this.props.jumpTo(this.props.page - 1)}/>
          </div>
          : ""
        }
        <div className = "col-1">
          <FlatButton disabled = {true}  style = {activeStyle}
                      labelStyle = {activeLabel} label = {this.props.page + 1} />
        </div>
        {this.props.page <  this.props.pages -2 ?
          <div className = "col-1">
            <FlatButton labelStyle = {style} style = {style} label = {this.props.page  + 2}
                        onClick = {() => this.props.jumpTo(this.props.page + 1)}/></div>
           : ""
        }
        {this.props.page < this.props.pages - 3 ?
          <div className = {this.props.page === 0
              ? "col-4": this.props.page === 1
              ? "col-3": this.props.page === 2
              ? "col-2" : "col-1"}>
           <FlatButton style ={style} disabled = {true} icon = {<More style = {style}/>}/></div>
         : ""
        }
        {this.props.page < this.props.pages - 1 ? <div className = "col-1"><FlatButton labelStyle = {style} style = {style} label = {this.props.pages} onClick = {() => this.props.jumpTo(this.props.pages - 1)}/></div> : ""}
        <div className = "col-1">
          <FlatButton style = {style} icon = {<ChevronRight style = {style}/>}
            onClick = {() => this.props.jumpTo(Math.min(this.props.pages-1, this.props.page+1))}/>
        </div>
        <div className = "col-1">
          <FlatButton style = {style} icon = {<LastPage style = {style}/>}
            onClick = {() => this.props.jumpTo(this.props.pages-1)}/>
        </div>
        <div className = "col"></div>
      </div>
    )
  }
}
