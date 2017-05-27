import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class SignIn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { serviceName, teamName } = this.props;

    return (
      <section className="sign-container">

        {/*Information*/}
        <h1 className="service-name">{serviceName}</h1>
        <h2 className="team-name">{teamName}</h2>
        <div className="rectangle-sign">
          <h3 className="sign-type-desc">Sign In</h3>

          {/*Input Email*/}
          <div className="input-group input-login">
            <span className="input-group-addon">
              <span
                className="fa fa-envelope-o"
                aria-hidden="true"
              />
            </span>
            <input type="text" className="form-control" placeholder="Email" required autofocus/>
          </div>

          {/*Input password*/}
          <div className="input-group input-login">
            <span className="input-group-addon">
              <span
                className="fa fa-asterisk"
                aria-hidden="true"
              />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              required
            />
          </div>

          {/*Input checkbox remember*/}
          <div className="checkbox">
            <label>
              <input type="checkbox" />
               {" Remember me"}
            </label>
          </div>

          <Link to="/discovery">
            <button type="submit" className="btn btn-lg btn-primary sign-button">
              Login
            </button>
          </Link>
          <div>
            <Link to="/register">
              <a href="#" className="register-info">
                Don't have an account yet?<br/>Register here.
              </a>
            </Link>
          </div>
        </div>

      </section>
    );
  }
}

SignIn.propTypes = {
  serviceName: React.PropTypes.string,
  teamName: React.PropTypes.string,
}

SignIn.defaultProps = {
  serviceName: 'Knex',
  teamName: 'Team Data Science'
};
