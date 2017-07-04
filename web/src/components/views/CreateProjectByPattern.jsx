import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Form from "../libraries/react-jsonschema-form";
import { Redirect } from 'react-router-dom';
//import exampleJSON from "../../data/test_project.json";

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
      //format: "date-time",
      default: "2011-12-12"
    },
    description: {
      type: "string",
      title: "Description",
      default: "A Description"
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
  url: {
    "ui:placeholder": "http://"
  },
  description: {
    "ui:widget": "textarea"
  },
  tags: {
    "ui:help": "Add tags!"
  },
  url: {
    "ui:help": "Add URLs!"
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
  authors: [""],
  url: [""],
  tags: [""]
}

const log = (type) => console.log.bind(console, type);

export default class UploadByPattern extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title : "",
      titleSet : false,
      anySet : false,
    };
  }

  onSubmit = ({formData}) => {
    fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    }),
    console.log(formData);
    alert("New Project added!");
  }

  loadJSON(){
    var request = new Request(this.state.sourceURL);
    var that = this;
    fetch(request)
    .then(response => response.json()).catch(ex => {
      console.error('parsing fails', ex);
    })
    .then(function(data) {
      that.setState({
        gotoCreateByPattern : true,
      });
    });
    return null
  }

  componentWillMount(){
    var URL = encodeURI(decodeURIComponent(this.props.match.params.getURL));
    var request = new Request(URL,{
      method:'GET',
      mode: 'cors',
      header:{
      'Access-Control-Allow-Origin':'*'
      },
    });
    var that = this;
    fetch(request)
    .then(response => response.json()).catch(ex => {
      alert("Errors reading file:\n"+ex);
    })
    .then(function(data) {
      if(data!=null){
        if(data.title!=null){
          that.setState({
            title : data.title,
            titleSet : true,
            anySet: true,
          })
        };
        if(data.authors!=null){
          that.setState({
            authors : data.authors,
            authorsSet : true,
            anySet: true,
          })
        };
        if(data.date_creation!=null){
          that.setState({
            creationDate : data.date_creation,
            creationDateSet : true,
            anySet: true,
          })
        };
        if(data.description!=null){
          that.setState({
            description : data.description,
            descriptionSet : true,
            anySet: true,
          })
        };
        if(data.status!=null){
          that.setState({
            status : data.status,
            statusSet : true,
            anySet: true,
            anySet: true,
          })
        };
        if(data.tags!=null){
          that.setState({
            tags : data.tags,
            tagsSet : true,
            anySet: true,
          })
        };
        if(data.url!=null){
          that.setState({
            url : data.url,
            urlSet : true,
            anySet: true,
          })
        };
      }
    });
  }

  dlschema(){
    var authorArray = [];
    var urlArray = [];
    if(this.state.authors!=null){
      for (var i = 0; i<this.state.authors.length;i++){
        authorArray.push({
          name : this.state.authors[i].name,
          email : this.state.authors[i].email,
        });
      }
    };
    if(this.state.url!=null){
      for (var i = 0; i<this.state.url.length;i++){
        urlArray.push(this.state.url[i]);
      }
    }


    return {
      type: "object",
      required: ["title", "authors", "date_creation", "description", "status"],
      properties: {
        title: {
          type: "string",
          title: "Title",
          default: this.state.title
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
          },
          default: authorArray,
        },
        date_creation: {
          type: "string",
          title: "Creation Date",
          //format: "date-time",
          default: this.state.creationDate
        },
        description: {
          type: "string",
          title: "Description",
          default: this.state.description
        },
        status: {
          type: "string",
          title: "Status",
          default: this.state.status
        },
        url: {
          type: "array",
          title: "URL",
          items: {
            type: "string"
          },
          default : urlArray,
        },
        tags: {
          title: "Tags",
          type: "array",
          items: {
            type: "string"
          },
          default: this.state.tags
        }
      }
    };
  }

  render() {
    if(this.state.anySet){
      return(
        <div className="container">
          <div className="innerContainer">
            <div className="headerCreation">Create New Project</div>
              <Form schema={this.dlschema()}
                uiSchema={uiSchema}
                onChange={log("changed")}
                onSubmit={this.onSubmit}
                onError={log("errors")} />
              <Link to="/createbylink">
                <button className="btn-cancel">Cancel</button>
              </Link>
          </div>
        </div>
      )
    } else {
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
}
