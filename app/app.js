'use strict';

/* Bootstrapping app's modules */

var letsgetaway = angular.module('letsgetaway', [
  'ngRoute',
  'mainModule',
  'selectDatesDirective',
  'backendService'
  ]);