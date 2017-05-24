import React from 'react';

class SignUp extends React.Component {
  render() {
    return (
      <section className="sign-container">
        <h1 className="service-name">Knex</h1>
        <h2 className="team-name">Team Data Science</h2>
        <div className="rectangle-sign">
          <h3 className="sign-type-desc">Sign In
          </h3>

          <div className="input-group" id="email-signup">
            <span className="input-group-addon">
              <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
            </span>
            <input type="text" className="form-control" placeholder="Email"/>
          </div>

          <div className="input-group">
            <span className="input-group-addon">
              <span className="glyphicon glyphicon-asterisk" aria-hidden="true"></span>
            </span>
            <input type="text" className="form-control" placeholder="Password"/>
          </div>

          <div className="input-group">
            <span className="input-group-addon">
              <span className="glyphicon glyphicon-asterisk" aria-hidden="true"></span>
            </span>
            <input type="text" className="form-control" placeholder="Confirm Password"/>
          </div>

          <button type="button" className="btn btn-default btn-lg sign-button">
            Sign Up
          </button>
        </div>

      </section>
    )
  }
}

export default SignUp;
