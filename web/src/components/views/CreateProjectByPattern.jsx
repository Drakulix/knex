import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import CreateProjectLink from '../pages/CreateProjectLink.jsx';
import Form from "react-jsonschema-form";

const schema = {
  type: "object",
  required: ["title"],
  properties: {
    title: {
      type: "string",
      title: "Title",
      default: "A new task"
    },
    list: {
      type: "array",
      title: "A multiple choices list",
      items: {
        type: "string",
        enum: ["foo", "bar", "fuzz", "qux"],
      },
      uniqueItems: true
    },
    ttztestst: {
      type: "string", format: "uri"
    },
    tes: {
      type: "string",
      title: "Title",
      default: "A new task"
    },
    bla: {
      type: "array", title: "A multiple choices list",
      items: {
      type: "string",
      enum: ["foo", "bar", "fuzz", "qux"]
      },
      uniqueItems: true
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

  onSubmit() {
  	alert('submitted!');
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
        </div>
      </div>
  )
  }
}
