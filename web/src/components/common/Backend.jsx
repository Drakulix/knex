import React, {Component} from 'react';
import 'isomorphic-fetch';
const PROJECT_URL = '/api/projects/'

  export function fetchJson(path) {
    // use this function to make a GET request.
    const url = `${path}`

    return fetch(url,{credentials: 'include',}).then(response => response.json()).catch(ex => {
      console.error('parsing failes', ex);
    });

  }


  export function fetchDelete(url){
    return fetch(url, {
      method: "DELETE",
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




    export function fetchNotification(){
      return fetch('/api/notifications/', {
        method: 'GET',
        mode: 'no-cors',
        credentials: 'include',
        headers: {
          "Accept": "application/json",
        }
      }).then(response => response.json()).catch(ex => {
        console.error('parsing failes', ex);
      });
    }




  export function fetchProjectInfo(uuid){
    return fetch('/api/projects/' + uuid, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
      headers: {
        "Accept": "application/json",
      }
    }).then(response => response.json()).catch(ex => {
      console.error('parsing failes', ex);
    });
  }


  export function fetchProjectDetails(uuid){
    // Return project details from project with specified uuid
    const url = `${PROJECT_URL}${uuid}`

    return fetch(url).then(response => response.json()).catch(ex => {
      console.error('parsing failes', ex);
    });
  }
  export function updateProjectDetails(method, payload, uuid){
    const url = `${PROJECT_URL}${uuid}`
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



  export function sendJson(method, path, payload) {
    //use this function to make a POST requst
    const url = `${path}`

    return fetch(url, {
      method: method,
      body: JSON.stringify(payload),
      headers: {
        'Accept': 'application/json',
        'credentials': 'include',
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
      fetchJson('/api/projects');
      sendJson('POST', '/api/projects/search', {
        "query": {
          "match_all": {}
        }
      });
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
