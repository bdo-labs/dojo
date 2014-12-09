
var app = angular.module('flowChart');
app.controller('FlowCtrl', FlowCtrl);
app.directive('flowChart', flowDirective);

function showLinkLabel(e) {
  var label = e.subject.findObject('LABEL');
  if (label !== null && (e.subject.fromNode.data.category === 'Decision')) {
    label.brush = red;
    label.visible = true;
  }
}

/**
 * Flow controller
 *
 * The controller sets up the appearance and functionality of the chart.
 */

function FlowCtrl(){
  var ctrl = this;

  var make = go.GraphObject.make;

  var lightText = 'rgb(100,100,100)';
  var red = 'rgb(243,73,74)';
  var font = '10pt Helvetica neue';
  var air = 10;

  function showPorts(node, show) {
    if (!node.editable) return;
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function(port) {
      port.stroke = (show ? node.sm : null);
      port.strokeWidth = 2;
    });
  }

  function sharedNodeAttributes() {
    return [
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify), {
        name: 'location',
        locationSpot: go.Spot.Center,
        selectionAdorned: false,
        click: function (e, obj) {
          if (obj.editable) return;
          alert('We could replace this dialog with some fancy metadata and documents.');
        },
        mouseEnter: function (e, obj) { showPorts(obj.part, true); },
        mouseLeave: function (e, obj) { showPorts(obj.part, false); }
      }
    ];
  }

  function makePort(name, spot, output, input) {
    return make(go.Shape, 'Circle', {
      fill: 'transparent',
      stroke: null,
      desiredSize: new go.Size(8, 8),
      alignment: spot,
      alignmentFocus: spot,
      portId: name,
      fromSpot: spot,
      toSpot: spot,
      fromLinkable: output,
      toLinkable: input,
      cursor: 'pointer'
    });
  }

  var defaultNode = make(go.Node, 'Spot', sharedNodeAttributes(),
    make(go.Panel, 'Auto',
      make(go.Shape, 'Rectangle', {
        name: 'shape',
        fill: 'rgb(210,210,210)',
        stroke: null,
        margin: air
      },
      new go.Binding("figure", "figure")),
      make(go.TextBlock, {
        name: 'text',
        textAlign: 'center',
        font: font,
        stroke: lightText,
        margin: 30,
        maxSize: new go.Size(160, NaN),
        wrap: go.TextBlock.WrapFit,
        editable: true
      }, new go.Binding('text', 'text').makeTwoWay())
    ),
    makePort('T', go.Spot.Top, false, true),
    makePort('L', go.Spot.Left, true, true),
    makePort('R', go.Spot.Right, true, true),
    makePort('B', go.Spot.Bottom, true, false)
  );

  var processNode = make(go.Node, 'Spot', sharedNodeAttributes(),
    make(go.Panel, 'Auto',
      make(go.Shape, 'Circle', {
        name: 'shape',
        minSize: new go.Size(80, 80),
        fill: 'transparent',
        stroke: 'rgb(210,210,210)',
        strokeWidth: 3,
        margin: air
      }),
      make(go.TextBlock, {
        name: 'text',
        textAlign: 'center',
        margin: 10,
        font: '12pt Helvetica neue',
        stroke: red,
        editable: true
      },
      new go.Binding('text', 'text').makeTwoWay())
    ),
    makePort('L', go.Spot.Left, true, false),
    makePort('R', go.Spot.Right, true, false),
    makePort('B', go.Spot.Bottom, true, false)
  );

  var decisionNode = make(go.Node, 'Spot', sharedNodeAttributes(),
      make(go.Panel, 'Auto', make(go.Shape, 'Decision', {
        name: 'shape',
        fill: red,
        margin: air,
        stroke: null,
        geometryStretch: go.GraphObject.Uniform
      }),
      make(go.TextBlock, {
        name: 'text',
        margin: 5,
        font: font,
        textAlign: 'center',
        stroke: 'rgb(255,255,255)',
        editable: true
      },
      new go.Binding('text', 'text').makeTwoWay())
    ),
    makePort('T', go.Spot.Top, false, true),
    makePort('L', go.Spot.Left, true, true),
    makePort('R', go.Spot.Right, true, true),
    makePort('B', go.Spot.Bottom, true, false)
  );

  var linkTemplate = make(go.Link, {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpGap,
      corner: 5, toShortLength: 4,
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true
    },
    new go.Binding('points').makeTwoWay(),
    make(go.Shape, {
        name: 'connector',
        isPanelMain: true,
        stroke: 'rgb(210,210,210)',
        strokeWidth: 2
      },
      new go.Binding('stroke', 'brush').makeTwoWay()
    ),
    make(go.Shape, {
        name: 'arrow',
        toArrow: 'standard',
        stroke: null,
        fill: 'rgb(210,210,210)'
      },
      new go.Binding('fill', 'brush').makeTwoWay()
    )
  );

  var chart = {
    class: 'go.GraphLinksModel',
    linkFromPortIdProperty: 'fromPort',
    linkToPortIdProperty: 'toPort'
  };
  _.extend(chart, ctrl.chart());

  _.extend(ctrl, {
    defaultNode: defaultNode,
    processNode: processNode,
    decisionNode: decisionNode,
    linkTemplate: linkTemplate,
    chart: chart
  });

}


function flowDirective(){
  return {
    restrict: 'E',
    controller: 'FlowCtrl',
    controllerAs: 'flow',
    bindToController: true,
    templateUrl: 'assets/components/flow-chart/flow-chart.html',
    scope: {
      chart: '&',
      categories: '=palette',
      highlight: '@',
      editable: '@'
    },
    link: function(scope, el, attrs, flow){
      var make = go.GraphObject.make;
      var chart = el.children()[0];
      var palette = el.children()[1];
      var diagram = make(go.Diagram, chart, {
        initialContentAlignment: go.Spot.Center,
        allowDrop: true,
        LinkDrawn: showLinkLabel,
        LinkRelinked: showLinkLabel,
      });

      diagram.nodeTemplateMap.add('Process', flow.processNode);
      diagram.nodeTemplateMap.add('', flow.defaultNode);
      diagram.nodeTemplateMap.add('Decision', flow.decisionNode);
      diagram.linkTemplate = flow.linkTemplate;
      diagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;
      diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
      diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
      diagram.model = go.Model.fromJson(flow.chart);
      diagram.undoManager.isEnabled = true;

      /**
       * Add categories to panel.
       */

      make(go.Palette, palette, {
        nodeTemplateMap: diagram.nodeTemplateMap,
        model: new go.GraphLinksModel(flow.categories)
      });

      // TODO Move functionality to the Controller
      //    | To do so we need to share the initiated diagram.

      attrs.$observe('editable', function(editable){
        diagram.nodes.each(function(node){
          editable = scope.$eval(attrs.editable);
          node.editable = editable;
          var shape = node.findObject('shape');
          var text = node.findObject('text');
          var location = node.findObject('location');
          text.editable = editable;
          location.movable = editable;
          if (editable) {
            shape.cursor = 'pointer';
            text.cursor = 'pointer';
          }
        });
        flow.editable = editable;
      });

      // TODO Move functionality to the Controller
      //    | To do so we need to share the initiated diagram.

      attrs.$observe('highlight', function(tags){
        diagram.nodes.each(function(node){
          var shape = node.findObject('shape');
          var text = node.findObject('text');

          if (tags && typeof tags == 'string'){
            tags = tags.split(',');
            tags = tags.map(function(tag){
              tag = tag.replace(/^[\s]*/, '').replace(/[\s]*$/, '');
              return tag;
            });
          }

          node.highlight = 0;
          if (!tags || tags == '') {
            node.highlight = 1;
          } else {
            angular.forEach(tags, function(tag){
              if (_.contains(node.data.tags, tag)){
                node.highlight = 1;
              }
            });
          }

          if (!node.highlight) {
            shape.opacity = text.opacity = .2;
            node.findLinksOutOf().each(function(link){
              link.opacity = .2;
            });
          } else {
            shape.opacity = text.opacity = 1;
            node.findLinksOutOf().each(function(link){
              link.opacity = 1;
            });
          }

        });
      });

      diagram.addDiagramListener('modified', function(){
        // console.log(diagram.model.toJson());
      });

    }
  };
}
