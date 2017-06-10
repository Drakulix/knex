import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import CreateProjectLink from '../pages/CreateProjectLink.jsx';
import Form from "../libraries/react-jsonschema-form";

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
      title: "Author",
      items: {
        type: "object",
        properties: {
          name: {
            "title": "Name",
            "type": "string"
          },
          email: {
            "title": "E-Mail",
            "type": "string",
            "format": "email"
          }
        }
      }
    },
    date_creation: {
      type: "string",
      title: "Creation Date",
      default: "2011-12-12"
    },
    description: {
      type: "string",
      title: "Description",
      default: "A Description"
    },
    status: {
      type: "array",
        title: "A multiple choices list",
        items: {
          type: "string",
          enum: ["pending", "in progress", "done", "no status"],
        },
        uniqueItems: true
    },
    url: {
      type: "string",
      title: "Github URL",
      format: "uri"
    },
    url_two: {
      type: "string",
      title: "Other URL",
      format: "uri"
    },
    tags: {
      title: "Tags",
      type: "array",
      items: {
        type: "string"
      }
    }
  }
};

const uiSchema = {
  url: {
    "ui:placeholder": "http://"
  },
  description: {
    "ui:widget": "textarea"
  },
  tags: {
    "ui:help": "Add tags!"
  },
  authors: {
    "ui:help": "Add author!"
  },
  foo: {
    "ui:options":  {
      addable: true
    }
  }
};

const formData = {

}

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
              uiSchema={uiSchema}
              formData={formData}
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
