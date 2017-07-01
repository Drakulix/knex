import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class AdminOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      project: {
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
      }
    };
  }
  render() {
    return (
      <div className="container">
        <div className="header">Admin Area</div>
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
        <button className="delete-button">
          <i className="fa fa-trash-o" aria-hidden="true"></i>
        </button>
        <div className="table-container">
          <table className="table">
            <thead className="thead-default">
              <tr>
                <th>Project Name</th>
                <th>Author</th>
                <th>Status</th>
                <th>Description</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Contextual music information retrieval and recommendation</th>
                <td>Mark</td>
                <td>in progress</td>
                <td>{this.state.project.description}</td>
                <td>22/06/17</td>
                <td>
                  <input type="checkbox" className="form-check-input" />
                </td>
              </tr>
              <tr>
                <th scope="row">Semantic Analysis of Song Lyrics</th>
                <td>Jacob</td>
                <td>done</td>
                <td>{this.state.project.description}</td>
                <td>22/06/17</td>
                <td>
                  <input type="checkbox" className="form-check-input" />
                </td>
              </tr>
              <tr>
                <th scope="row">Combining Audio Content and Social Context for Semantic Music Discovery</th>
                <td>Larry</td>
                <td>pending</td>
                <td>{this.state.project.description}</td>
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
            <ul className="pagination justify-content-center">
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
