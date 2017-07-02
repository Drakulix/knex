import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import {fetchProjectDetails, fetchJson,updateProjectDetails} from '../common/Backend'
import Form from "../libraries/react-jsonschema-form";
import { Redirect } from 'react-router-dom';
import 'isomorphic-fetch';
import { connect } from 'react'

const schema = {
  type: "object",
  required: ["title", "authors", "date_creation", "description", "status"],
  properties: {
    title: {
      type: "string",
      title: "Title",

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
      //format: "date-time",

    },
    description: {
      type: "string",
      title: "Description",

    },
    status: {
      type: "string",
        title: "Status"
    },
    url: {
      type: "array",
      title: "URL",
      items: {
        type: "string"
      }
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

const log = (type) => console.log.bind(console, type);
export default class UpdateProjectView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      myid: window.location.href.substring(29,65)
    };
  }

  componentWillReceiveProps(nextProps){
    this.loadProjectInf(nextProps)
  }

  componentDidMount(){
    this.loadProjectInf(this.props);
  }

  setBackRoute(props) {
    return "/projects/" + this.state.myid;
  }


  loadProjectInf(props) {

    fetchProjectDetails(this.state.myid).then(data => {

      this.state.formData=data;
      this.forceUpdate();

    });
  }

  handleSubmit(){
    console.log(this.state.formData);
    updateProjectDetails("PUT",this.state.formData,this.state.myid);
    alert("Project updated!");
  }
  onSubmit = ({formData}) => {

    console.log(formData);
    updateProjectDetails("PUT",formData,this.state.myid);
    alert("Project updated!");
  }
  render(){

    return(
      <div className="container">
        <div className="innerContainer">
          <div className="headerCreation">Update Project</div>
            <Form schema={schema}
              uiSchema={uiSchema}
              formData={this.state.formData}
              onChange={this.state.forceUpdate}
              onSubmit={this.onSubmit}
              onError={log("errors")}/>
            <Link to={this.setBackRoute()}>
              <button className="btn-cancel">Cancel</button>
            </Link>
        </div>
      </div>
    )
  }
}
