import React, {Component} from 'react'
import 'isomorphic-fetch'
const PROJECT_URL = '/api/projects/'

  export function get(path) {
    // use this function to make a GET request.
    const url = `${path}`
    return fetch(url,{
      method: "GET",
      mode: 'no-cors',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include'})
      .then(response => response.json())
      .catch(ex => {
        console.error('parsing failes', ex)
    })
  }

  export function del(path) {
      // use this function to make a POST request.
      const url = `${path}`
      return fetch(url,{
        method: "DELETE",
        credentials: 'include',
      })
        .then(function(response){
          return response.status === 200
        })
        .catch(ex => {
            console.error('parsing failes', ex)
      })
    }

  export function post(path, body) {
    // use this function to make a POST request.
    const url = `${path}`
    return fetch(url,{
      method: "POST",
      body: JSON.stringify(body),
      mode: 'no-cors',
      credentials: 'include',})
      .then(function(response){
        return response.status === 200
      })
      .catch(ex => {
          console.error('parsing failes', ex)
    })
  }

  export function put(path, body) {
    // use this function to make a PUT request.
    const url = `${path}`
    return fetch(url,{
      method: "PUT",
      body: JSON.stringify(body),
      mode: 'no-cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .catch(ex => {
      console.error('parsing failes', ex)
    })
  }
