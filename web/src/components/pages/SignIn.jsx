import React from 'react';

export default class SignIn extends React.Component {
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
          <div className="input-group">
            <span className="input-group-addon">
              <span
                    className="glyphicon glyphicon-envelope"
                    aria-hidden="true"
              />
            </span>
            <input type="text" className="form-control" placeholder="Email" />
          </div>


          <div className="input-group">
            <span className="input-group-addon">
              <span
                className="glyphicon glyphicon-asterisk"
                aria-hidden="true"
              />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
            />
          </div>

          {/*Input checkbox remember*/}
          <div className="checkbox">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
          </div>

          <button type="button" className="btn btn-default btn-lg sign-button">
            Login
          </button>
          <div>
            <a href="#" className="register-info">
              Don't have an account yet?<br/>Register here.
            </a>
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
