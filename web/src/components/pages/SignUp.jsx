import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../style/img/knex_logo.png';
import PropTypes from 'prop-types'

export default class SignUp extends Component {

  render() {
    const { teamName } = this.props;

    return (
      <section className="sign-container">

        {/*Information*/}
        <img className="service-name" src={logo} alt="knex logo" width="200px" height="133px" />
        <h2 className="team-name">{teamName}</h2>
        <div className="rectangle-sign">
          <h3 className="sign-type-desc">Sign Up
          </h3>

          {/*Input Email*/}
          <div className="input-group input-login" id="email-signup">
            <span className="input-group-addon">
              <span
                className="fa fa-envelope-o"
                aria-hidden="true"
              />
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              required autofocus
            />
          </div>

          {/*Input password*/}
          <div className="input-group input-login">
            <span className="input-group-addon">
              <span
                className="fa fa-asterisk"
                aria-hidden="true" />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              required
            />
          </div>

          {/*Input confirm password*/}
          <div className="input-group input-login">
            <span className="input-group-addon">
              <span
                className="fa fa-asterisk"
                aria-hidden="true" />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              required
            />
          </div>

          <Link to="/discovery">
            <button  type="submit" className="btn btn-lg btn-primary sign-button">
              Sign Up
            </button>
          </Link>
        </div>

        <div>
          <Link to="/">
            <a href="signin" className="register-info">
              You already have an account?<br/>Login here.
            </a>
          </Link>
        </div>

      </section>
    );
  }
}

SignUp.propTypes = {
  serviceName: PropTypes.string,
  teamName: PropTypes.string,
}

SignUp.defaultProps = {
  serviceName: 'Knex',
  teamName: 'Team Data Science'
};
