
var app = angular.module('flowChart');

/**
 * Chart route.
 */

app
  .config(['$stateProvider', function($stateProvider){
    $stateProvider
      .state('chart', {
        abstract: true,
        url: '/chart',
        template: '<popover ui-view="details"></popover><main ui-view="main"></main>'
      })
      .state('chart.index', {
        url: '',
        views: {
          main: {
            controller: 'MainCtrl',
            controllerAs: 'chart',
            resolve: {
              chart: function(ChartService){
                return ChartService.get();
              }
            },
            templateUrl: 'assets/routes/chart/chart.html'
          }
        }
      })
  }])
  .controller('MainCtrl', MainCtrl)


function MainCtrl($q, chart){
  var ctrl = this;
  ctrl.deferred = $q.defer();

  // Creates an array of unique tags
  var tags = [];
  angular.forEach(chart.data.nodeDataArray, function(node){
    tags = _.union(tags, node.tags);
  });
  chart.tags = tags;

  _.extend(ctrl, chart);
}


MainCtrl.prototype.loadTags = function(tag){
  var ctrl = this;
  var deferred = ctrl.deferred;
  deferred.resolve(ctrl.tags);
  return deferred.promise;
};

