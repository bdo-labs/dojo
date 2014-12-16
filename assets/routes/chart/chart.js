
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
            controller: 'DetailsCtrl',
            controllerAs: 'details',
            templateUrl: 'assets/routes/chart/details.html',
            resolve: {
              node: function(ChartService){
                var chart = ChartService.get();
                console.dir(chart);
                return chart.data.nodeDataArray[0];
              }
            }
          }
        }
      });
  }])
  .controller('MainCtrl', MainCtrl)
  .controller('DetailsCtrl', DetailsCtrl);

function MainCtrl(chart){
  var ctrl = this;

  var tags = [];
  angular.forEach(chart.data.nodeDataArray, function(node){
    tags = _.union(tags, node.tags);
  });
  chart.tags = tags;

  _.extend(ctrl, chart);
}

MainCtrl.prototype.loadTags = function(tag){
  var ctrl = this;
  return ctrl.tags;
};

function DetailsCtrl(node){
  var ctrl = this;

  _.extend(ctrl, {node: node});
}

