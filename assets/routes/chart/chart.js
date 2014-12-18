
var app = angular.module('flowChart');

/**
 * Chart route.
 */

app
  .config(['$stateProvider', function($stateProvider){
    $stateProvider
      .state('chart', {
        url: '/chart',
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
          },
          details: {
            controller: 'MainCtrl',
            controllerAs: 'chart',
            templateUrl: 'assets/routes/chart/details.html',
            resolve: {
              chart: function(ChartService){
                return ChartService.get();
              }
            }
          }
        }
      });
  }])
  .controller('MainCtrl', MainCtrl)


function MainCtrl($q, chart){
  var ctrl = this;

  var tags = [];
  angular.forEach(chart.data.nodeDataArray, function(node){
    tags = _.union(tags, node.tags);
  });
  chart.tags = tags;

  ctrl.deferred = $q.defer();

  _.extend(ctrl, chart);
}


MainCtrl.prototype.loadTags = function(tag){
  var ctrl = this;
  var deferred = ctrl.deferred;
  deferred.resolve(ctrl.tags);
  return deferred.promise;
};

