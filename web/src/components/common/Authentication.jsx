import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import 'isomorphic-fetch';
import 'babel-polyfill';
import { Redirect } from 'react-router-dom';


var loggedin = false;
var myemail = '';

export function isLoggedIn(){
  return loggedin;
}

export function getMyEmail(){
  return myemail;
}

export function isAdmin(){
  return false;
}



export function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function getUserInfo(e){
  var res;
  fetch('/api/users/' + e, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
      headers: {
        "Accept": "application/json",
      }
   }).then(function(response){
      if(response.status==200){
        console.log("getUserInfo status: " + response.status);
        return response.json();
      }else{
        console.log("getUserInfostatus: " + response.status);
        return false;
      }
    }).then(function(data) {
      console.log(data);
      return data;
    });
}

export function login(login_email, login_password){
  const m = encodeURIComponent(login_email);
  const p = encodeURIComponent(login_password);
  const requestBody = `email=${m}&password=${p}`;
  return fetch('/api/users/login', {
      mode: 'no-cors',
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
      },
      body: requestBody
    }).then( response => {
      setCookie('email', login_email);
      if(response.status==200){
        console.log("MYLOG status: " + response.status);
        getUserInfo(login_email);
        myemail = login_email;
        loggedin = true;
        return true;
      }else{
        console.log("MYLOG status: " + response.status);
        return false;
      }
    });
}

export function logout(){
  return fetch('/api/users/logout', {
      mode: 'no-cors',
      credentials: 'include',
      method: 'GET'
    }).then(function(response){
      if(response.status==200){
        myemail = '';
        loggedin = false;
        return true;
      }else{
        return false;
      }
    });

}

export function register(reg_firstname, reg_lastname, reg_email, reg_password, reg_password_confirm, reg_role){

  var payload = {
    "first name" : reg_firstname ,
    "last name" : reg_lastname,
    "email" : reg_email,
    "password" : reg_password,
    "bio" : "",
    "role" : "user"
  };

  if(reg_password != reg_password_confirm || reg_password == ''){
    alert('password does not match' );
    return false;
  }


  return fetch('/api/users', {
  //    mode: 'no-cors',
  //    credentials: 'include',
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( payload )
    }).then(function(response){
      if(response.status==200){
        return true;
      }else{
        return false;
      }
    });
}


