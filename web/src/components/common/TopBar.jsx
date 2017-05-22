import React, { Component } from 'react';

class TopBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logo: 'Company Logo'
    };
  }

  render() {
    return (
      <div className="top-bar-container">
        <div className="company-logo ">
          {this.state.logo}
        </div>
      </div>
    );
  }

  onInputChange(term) {
    this.setState({term});
    this.props.onSearchTermChange(term);
  }
}

export default TopBar;
