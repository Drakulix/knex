import React from 'react';

export default class ProfileContainer extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="header">Profile Details</div>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <p className="nav-link active" href="#">Profile</p>
          </li>
          <li className="nav-item">
            <p className="nav-link" href="#">Comments</p>
          </li>
        </ul>
        <div className="row">
          <div className="col-9">
            <p className="profile-header">Information:</p>
            <p className="profile-info">Max Meier</p>
            <p className="profile-header">Team:</p>
            <p className="profile-info">SoundCloud Data Science</p>
            <p className="profile-header">Focus:</p>
            <p className="profile-info">Search, Listeners, A/B Testing</p>
          </div>
          <div className="col-3">
            <img src="http://www.freeiconspng.com/uploads/profile-icon-9.png" width="200px" height="200px" alt="..." className="rounded-circle profile-icon" />
            <p className="profile-icon-text">Change Avatar</p>
          </div>
        </div>
        <div className="change-password">
          <form>
            <div className="form-group row">
              <label className="col-2 col-form-label">Email</label>
              <div className="col-10">
                <p className="form-control-static">email@example.com</p>
              </div>
            </div>
            <div className="form-group row">
              <label for="inputPassword" className="col-2 col-form-label">Password</label>
              <div className="col-4">
                <input type="password" className="form-control" id="inputPassword" placeholder="Password" />
              </div>
            </div>
            <div className="form-group row">
              <label for="inputPassword" className="col-2 col-form-label">Confirm Password</label>
              <div className="col-4">
                <input type="password" className="form-control" id="inputPassword" placeholder="Password" />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
        <p>Your Projects</p>
        <div className="table-container">
          <table className="table">
            <thead className="thead-default">
              <tr>
                <th>Project Name</th>
                <th>Status</th>
                <th>Description</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Contextual music information retrieval and recommendation</th>
                <td>pending</td>
                <td>descriptions are useful</td>
                <td>22/06/17</td>
                <td>
                  <i className="fa fa-bookmark" aria-hidden="true"></i>
                </td>
              </tr>
              <tr>
                <th scope="row">Semantic Analysis of Song Lyrics</th>
                <td>pending</td>
                <td>descriptions are great</td>
                <td>22/06/17</td>
                <td>
                  <i className="fa fa-bookmark-o" aria-hidden="true"></i>
                </td>
              </tr>
              <tr>
                <th scope="row">Combining Audio Content and Social Context for Semantic Music Discovery</th>
                <td>done</td>
                <td>descriptions are love</td>
                <td>22/06/17</td>
                <td>
                  <i className="fa fa-bookmark-o" aria-hidden="true"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="pagination-container">
          <div className="text-xs-center">
            <div>
              <ul className="pagination">
                <li className="page-item">
                  <a className="page-link" role="button" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
                <li className="page-item"><a className="page-link" role="button">1</a></li>
                <li className="page-item"><a className="page-link" role="button">2</a></li>
                <li className="page-item"><a className="page-link" role="button">3</a></li>
                <li className="page-item">
                <a className="page-link" role="button" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                  <span className="sr-only">Next</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
