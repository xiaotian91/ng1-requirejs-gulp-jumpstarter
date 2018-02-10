'use strict';
define([],function(){

  // Declare app level module which depends on filters, and services
  return angular.module('myApp.config', [])

    // where to redirect users if they need to authenticate (see security.js)
      .constant('loginRedirectPath', '/login')

      // where to connect to the api resources
      .constant('$apiPath', 'http://localhost:6090')

});