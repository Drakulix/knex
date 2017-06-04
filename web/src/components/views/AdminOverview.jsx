import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class UploadByLink extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="adminarea-header">Admin Area</div>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <p className="nav-link active" href="#">Overview</p>
          </li>
          <li className="nav-item">
            <p className="nav-link" href="#">Manage User</p>
          </li>
          <li className="nav-item">
            <p className="nav-link" href="#">Invite User</p>
          </li>
        </ul>
        <div className="table-container">
          <table className="table">
            <thead className="thead-default">
              <tr>
                <th>Project Name</th>
                <th>Author</th>
                <th>Status</th>
                <th>Descrption</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Contextual music information retrieval and recommendation</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>22/06/17</td>
                <td>
                  <input type="checkbox" className="form-check-input" />
                </td>
              </tr>
              <tr>
                <th scope="row">Semantic Analysis of Song Lyrics</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>22/06/17</td>
                <td>
                  <input type="checkbox" className="form-check-input" />
                </td>
              </tr>
              <tr>
                <th scope="row">Combining Audio Content and Social Context for Semantic Music Discovery</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
                <td>22/06/17</td>
                <td>
                  <input type="checkbox" className="form-check-input" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="pagination-container">
          <div className="text-xs-center">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                  <span className="sr-only">Previous</span>
                </a>
              </li>
              <li className="page-item"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
                </a>
              </li>
            </ul>
        </div>
      </div>
    </div>
    );
  }
}
