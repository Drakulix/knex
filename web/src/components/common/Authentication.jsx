import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import 'isomorphic-fetch';
import 'babel-polyfill';
import { Redirect } from 'react-router-dom';


var loggedin = false;
var myemail = '';
var myProfile;

export function isLoggedIn(){
  return loggedin;
}

export function getMyEmail(){
  return ( myemail || getCookie('email') );
}

export function isAdmin(){ 

        return getUserInfo(getMyEmail()).then(function(response) {
          return response.json;
        }).then(function (response){
            myProfile = response;
            return (myProfile && (myProfile.roles == 'admin'));
        }).then(res => {return res});
        
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

export function changePassword(email, oldpw, newpw){

  const requestBody = `email=${email}&old password=${oldpw}&new password=${newpw}`;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('old password', oldpw);
    formData.append('new password', newpw);

  var sbody = {'email': email, 'old password': oldpw, 'new password': newpw};
  return fetch('/api/users/password' , {
      method: 'PUT',
      credentials: 'include',
      headers: {
//        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sbody)
   }).then(function(response){
      if(response.status==200){
        return true;
      }else{
        return false;
      }
});
}

export function changeProfile(email, first_name, last_name, bio){

  var sbody = {'email': email, 'first name': first_name, 'last name': last_name, 'bio': bio};

  return fetch('/api/users' , {
      method: 'PUT',
      credentials: 'include',
      headers: {
//        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sbody)

   }).then(response => response.status).catch(ex => {
      console.error('parsing failes', ex);
    });
}

export function getUserInfo(e){
  var res;
  return fetch('/api/users/' + e, {
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

export function login(login_email, login_password){
  const m = encodeURIComponent(login_email);
  const p = encodeURIComponent(login_password);
  const requestBody = `email=${m}&password=${p}`;
  var res = fetch('/api/users/login', {
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
        myemail = login_email;
        loggedin = true;
        return true;
      }else{
        console.log("MYLOG status: " + response.status);
        return false;
      }
    });
    getUserInfo(myemail).then((success) => {
        myProfile = success;
    });;
    return res;
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
    "roles" : reg_role
  };

  if(reg_password != reg_password_confirm || reg_password == ''){
    alert('password does not match' );
    return false;
  }


  return fetch('/api/users', {
  //    mode: 'no-cors',
  //    credentials: 'include',
      method: 'POST',
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
