
var app = angular.module('flowChart');

app
  .service('ChartService', ChartService);

function ChartService(){

  // FIXME Store and retrieve nodes and links in localStorage
  //     | We can then synchronize the data to a remote storage.

  var nodesArray = [
    {"text":"Identifying thematic funding opportunities", "category": "Step", "key":1, "loc":"-304.0000000000001 47.00000000000006", "tags": ["grant manager"]},
    {"text":"Identify regional / strategic funding opportunities", "category": "Step", "key":2, "loc":"12.999999999999915 47.000000000000085", "tags": ["grant manager"] },
    {"text":"Track and identify funding opportunities", "category": "Step", "key":3, "loc":"347.00000000000017 46.999999999999886", "tags": ["grant manager", "PFO"]},
    {"text":"Identify team and call meeting", "category": "Step", "key":4, "loc":"98.00000000000034 345", "tags": ["grant manager", "PFO", "critical"]},
    {"text":"Funding\navailable?", "category":"Decision", "key":-3, "loc":"347 249.00000000000003", "tags": ["PFO"]},
    {"text":"Disregard funding", "category": "Step", "key":-10, "loc":"590.0000000000002 335", "tags": []},
    {"text":"Start", "category":"Process", "key":-1, "loc":"-500 47", "tags": ["grant manager"]},
    {"text":"End", "category":"Process", "key":-4, "loc":"347 444.00000000000006", "tags": ["PFO"]}
  ];

  var linksArray = [
    {"from":1, "to":2, "fromPort":"R", "toPort":"L", "points":[-212.00000000000028,47.00000000000006,-202.00000000000028,47.00000000000006,-153.25000000000017,47.00000000000006,-153.25000000000017,47.000000000000085,-104.50000000000007,47.000000000000085,-94.50000000000007,47.000000000000085]},
    {"from":2, "to":3, "fromPort":"R", "toPort":"L", "points":[120.49999999999991,47.000000000000085,130.49999999999991,47.000000000000085,180.75000000000006,47.000000000000085,180.75000000000006,46.999999999999886,231.00000000000017,46.999999999999886,241.00000000000017,46.999999999999886]},
    {"from":-3, "to":4, "fromPort":"L", "toPort":"T", "points":[277.49999999999994,249,267.49999999999994,249,98.00000000000034,249,98.00000000000034,269.6,98.00000000000034,290.2,98.00000000000034,300.2], "visible":true, "text":"Yes", "brush":"rgb(243,73,74)"},
    {"from":3, "to":-3, "fromPort":"B", "toPort":"T", "points":[347.00000000000017,91.79999999999988,347.00000000000017,101.79999999999988,347.00000000000017,135.64999999999995,346.99999999999994,135.64999999999995,346.99999999999994,169.5,346.99999999999994,179.5]},
    {"from":-3, "to":-10, "fromPort":"R", "toPort":"T", "brush":"rgb(243,73,74)", "visible":true, "points":[416.49999999999994,249,426.49999999999994,249,590.0000000000002,249,590.0000000000002,268.175,590.0000000000002,287.35,590.0000000000002,297.35], "text":"No"},
    {"from":-1, "to":1, "fromPort":"R", "toPort":"L", "points":[-450,47,-440,47,-423.0000000000001,47,-423.0000000000001,47.00000000000006,-406.0000000000003,47.00000000000006,-396.0000000000003,47.00000000000006]},
    {"from":4, "to":-4, "fromPort":"B", "toPort":"L", "points":[98.00000000000034,389.79999999999984,98.00000000000034,399.79999999999984,98.00000000000034,444,192.50000000000014,444,286.99999999999994,444,296.99999999999994,444]},
    {"from":-10, "to":-4, "fromPort":"B", "toPort":"R", "points":[590.0000000000001,372.65000000000003,590.0000000000001,382.65000000000003,590.0000000000001,444,498.5,444,406.99999999999994,444,396.99999999999994,444]}
  ];

  this.get = function(select){
    console.count('service');
    var chart = {
      title: 'HK, kostnader i grants',
      data: {
        nodeDataArray: nodesArray,
        linkDataArray: linksArray
      }
    };
    if (select && select.text) {
      var key = _.findKey(chart.data.nodeDataArray, select);
      console.log(key);
      console.log(chart.data.nodeDataArray[key]);
      return chart.data.nodeDataArray[key];
    }
    return chart;
  }
}

