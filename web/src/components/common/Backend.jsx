import React, {Component} from 'react';
import 'babel-polyfill';
import 'isomorphic-fetch';
const BACKEND_URL = 'http://localhost:5000'
const PROJECT_URL = '/api/projects/'

  export function fetchJson(path) {
    // use this function to make a GET request.
    const url = `${BACKEND_URL}${path}`

    return fetch(url).then(response => response.json()).catch(ex => {
      console.error('parsing failes', ex);
    });

  }

  export function fetchProjectDetails(uuid){
    // Return project details from project with specified uuid
    const url = `${BACKEND_URL}${PROJECT_URL}${uuid}`

    return fetch(url).then(response => response.json()).catch(ex => {
      console.error('parsing failes', ex);
    });
  }

  export function sendJson(method, path, payload) {
    //use this function to make a POST requst
    const url = `${BACKEND_URL}${path}`

    return fetch(url, {
      method: method,
      body: JSON.stringify(payload),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    // .then(json => console.dir(json))
      .catch(ex => {
      console.error('parsing failed', ex)
    });
  }

  // TODO(gitmirgut): remove later
  export default class BackendTest extends Component {
    //This Component is just for testing
    constructor(props) {
      super(props);

      this.state = {
        state: null
      };
    }

    render() {
      fetchJson('/api/projects'),
      sendJson('POST', '/api/projects/search', {
        "query": {
          "match_all": {}
        }
      }),
      sendJson('POST', '/api/projects/search', {
        "query": {
          "query_string": {
            "default_field": "tags",
            "query": "project"
          }
        }
      })
      return (
        <div></div>
      );
    }
}
