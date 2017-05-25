import React from 'react';


export default class SignUp extends React.Component {
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
          <h3 className="sign-type-desc">Sign Up
          </h3>

          {/*Input Email*/}
          <div className="input-group" id="email-signup">
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
          <div className="input-group">
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
          <div className="input-group">
            <span className="input-group-addon">
              <span
                className="fa fa-asterisk"
                aria-hidden="true" />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              type="password"
              required
            />
          </div>

          <button  type="submit" className="btn btn-lg btn-primary sign-button">
            Sign Up
          </button>
        </div>

      </section>
    );
  }
}

SignUp.propTypes = {
  serviceName: React.PropTypes.string,
  teamName: React.PropTypes.string,
}

SignUp.defaultProps = {
  serviceName: 'Knex',
  teamName: 'Team Data Science'
};
