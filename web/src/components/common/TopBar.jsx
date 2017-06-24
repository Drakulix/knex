import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Popover, PopoverTitle, PopoverContent } from 'reactstrap';

class TopBar extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
      logo: 'Company Logo'
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    return (
      <div className="container-fluid topbar">
        <div className="row">
          <div className="col-10">
          </div>
          <div className="col-1">
            <div className="top-bar-text">
            <i id="Popover1" onClick={this.toggle} className="bell fa fa-bell" aria-hidden="true"></i>
              <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
                <PopoverTitle>Notifications</PopoverTitle>
                <PopoverContent>
                  <div>
                    <a>A Project got updated</a>
                  </div>
                  <div>
                    <a>A Project got updated</a>
                  </div>
                  <div>
                    <a>Janette bookmarked a project</a>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
        </div>

          <div className="col-1">
            <p className="top-bar-text">
              <Link to="/">
                <i className="fa fa-power-off" aria-hidden="true"></i>
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default TopBar;
