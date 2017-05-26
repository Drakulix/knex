import 'babel-polyfill';
import 'isomorphic-fetch';
const BACKEND_URL = 'http://localhost:5000'
  import React, {Component} from 'react';

  export function fetchJson(path) {
    // use this function to make a GET request.
    const url = `${BACKEND_URL}${path}`

    return fetch(url)
    .then(response => response.json())
    .catch(ex => {
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

  export default class BackendTest extends Component {
    constructor(props) {
      super(props);

      this.state = {
        state: null
      };
    }

    render() {
      // fetchJson('/api/projects/dummyadd'),
      sendJson('POST', '/api/projects/search', {
        "query": {
          "match_all": {}
        }
      }),
      sendJson('POST', '/api/projects/search', {
        "query": {
          "match_all": {}
        }
      }).then(json => console.log(json))

      return (
        <div></div>
      );
    }
  }
