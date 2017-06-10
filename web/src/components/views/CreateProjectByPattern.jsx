import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import CreateProjectLink from '../pages/CreateProjectLink.jsx';
import Form from "react-jsonschema-form";

import exampleJSON from "../../data/test_project.json";

const schema = {
  type: "object",
  required: ["title", "authors", "date_creation", "description", "status"],
  properties: {
    title: {
      type: "string",
      title: "Title",
      default: "A new task"
    },
    authors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            "type": "string"
          },
          email: {
            "type": "string"
          }
        }
      }
    },
    date_creation: {
      type: "string",
      title: "Creation Date",
      default: "2011-12-12"
      //format: "uri"
    },
    description: {
      type: "string",
      title: "Description",
      default: "A Description"
    },
    status: {
      type: "string",
      title: "A multiple choices list",
      default: "in progress"
    }
  }
};

const uiSchema = {
  "ui:widget": "checkboxes",
  "ui:widget": "password",
  "ui:help": "Hint: Make it strong!",
  "ui:placeholder": "http://"
};

const log = (type) => console.log.bind(console, type);

export default class UploadByPattern extends React.Component {

  onSubmit = ({formData}) => {
    fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
      //body: JSON.stringify(exampleJSON)
    }),
    console.log(formData);
  }

  render(){
    return(
      <div className="container">
        <div className="innerContainer">
          <div className="headerCreation">Create New Project</div>
            <Form schema={schema}
              onChange={log("changed")}
              onSubmit={this.onSubmit}
              onError={log("errors")} />
            <Link to="/createbylink">
              <button className="btn-cancel">Cancel</button>
            </Link>
        </div>
      </div>
  )
  }
}
