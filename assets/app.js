
/**
 * Initialize Angular application and
 * inject 3rd-party dependencies.
 */

var app = angular.module('flowChart', [
  'ui.router',
  'ngAnimate'
]);

/**
 * Configurations.
 */

app.config(['$urlRouterProvider', function($urlRouterProvider){
  $urlRouterProvider
    .otherwise('/chart');
}]);

