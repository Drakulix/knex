import React from 'react';

class SignIn extends React.Component {
  render() {
    return (
      <section className="sign-container">
        <h1 className="service-name">Knex</h1>
        <h2 className="team-name">Team Data Science</h2>
        <div className="rectangle-sign">
          <h3 className="sign-type-desc">Sign In
          </h3>

          <div className="input-group">
            <span className="input-group-addon" id="sizing-addon1">
              <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
            </span>
            <input type="text" className="form-control" placeholder="Email"/>
          </div>

          <div className="input-group">
            <span className="input-group-addon" id="basic-addon2">
              <span className="glyphicon glyphicon-asterisk" aria-hidden="true"></span>
            </span>
            <input type="password" className="form-control" placeholder="Password"/>
          </div>

          <div className="checkbox">
            <label>
              <input type="checkbox"/>
              Remember me
            </label>
          </div>

          <button type="button" className="btn btn-default btn-lg sign-button">
            Login
          </button>
          <div>
            <a href="#" className="register-info">Don't have an account yet?<br></br>Register here.</a>
          </div>
        </div>

      </section>
    )
  }
}

export default SignIn;
