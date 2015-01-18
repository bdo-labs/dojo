
var app = angular.module('flowChart');
app.controller('FlowCtrl', ['$state', FlowCtrl]);
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
  var font = '10pt Helvetica neue,Helvetica,Sans serif';
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
          if (obj.editable) {
            // ngDialog.open({
            //   template: 'assets/components/flow-chart/details.html',
            //   controller: ['']
            // })
          }
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

  var stepNode = make(go.Node, 'Spot', sharedNodeAttributes(),
    make(go.Panel, 'Auto',
      make(go.Shape, 'Rectangle', {
        name: 'shape',
        fill: 'rgb(210,210,210)',
        stroke: red,
        strokeWidth: 0,
        margin: air
      },
      new go.Binding('fill', 'tags', function(tags){
        if (tags.indexOf('critical') != -1) return 'rgb(255,255,255)';
        else return 'rgb(210,210,210)';
      }),
      new go.Binding('strokeWidth', 'tags', function(tags){
        if (tags.indexOf('critical') != -1) return 3;
        return 0;
      }),
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
      make(go.Shape, 'Ellipse', {
        name: 'shape',
        minSize: new go.Size(80, 80),
        fill: 'rgb(255,255,255)',
        stroke: 'rgb(210,210,210)',
        strokeWidth: 3,
        margin: air
      }),
      make(go.TextBlock, {
        name: 'text',
        textAlign: 'center',
        margin: 10,
        font: font.replace('10', '12'),
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

  var systemNode = make(go.Node, 'Spot', sharedNodeAttributes(),
    make(go.Panel, 'Auto',
      make(go.Shape, 'Parallelogram2', {
        name: 'shape',
        minSize: new go.Size(80, 80),
        fill: 'rgb(210,210,210)',
        stroke: null,
        margin: air
      }),
      make(go.TextBlock, {
        name: 'text',
        textAlign: 'center',
        margin: 10,
        stroke: lightText,
        font: font,
        editable: true
      },
      new go.Binding('text', 'text').makeTwoWay())
    ),
    makePort('L', go.Spot.Left, true, false),
    makePort('R', go.Spot.Right, true, false),
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

  _.extend(ctrl, {
    stepNode: stepNode,
    processNode: processNode,
    decisionNode: decisionNode,
    systemNode: systemNode,
    linkTemplate: linkTemplate,
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
      chart: '=',
      highlight: '@',
      editable: '@'
    },
    link: function(scope, el, attrs, flow){
      var make = go.GraphObject.make;
      var diagram = make(go.Diagram, el.children()[0], {
        initialContentAlignment: go.Spot.Center,
        allowDrop: true,
        LinkDrawn: showLinkLabel,
        LinkRelinked: showLinkLabel,
      });

      diagram.nodeTemplateMap.add('Process', flow.processNode);
      diagram.nodeTemplateMap.add('Step', flow.stepNode);
      diagram.nodeTemplateMap.add('Decision', flow.decisionNode);
      diagram.nodeTemplateMap.add('System', flow.systemNode);

      diagram.linkTemplate = flow.linkTemplate;
      diagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;
      diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
      diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
      diagram.model = go.Model.fromJson(flow.chart);
      diagram.undoManager.isEnabled = true;

      /**
       * Add categories to panel.
       */

      var categories = [
        { category: "Process", text: "Process" },
        { category: "Step", text: "Step" },
        { category: "Decision", text: "Decision" },
        { category: "System", text: "System" }
      ];
      var palette = make(go.Palette, el.children()[1], {
        initialDocumentSpot: go.Spot.TopCenter,
        initialViewportSpot: go.Spot.TopCenter,
        nodeTemplateMap: diagram.nodeTemplateMap,
        model: new go.GraphLinksModel(categories)
      });

      attrs.$observe('editable', function(editable){
        diagram.nodes.each(function(node){
          var shape = node.findObject('shape');
          var text = node.findObject('text');
          var location = node.findObject('location');
          editable = scope.$eval(attrs.editable);
          var cursor = editable ? 'pointer' : 'default';
          node.editable = editable;
          text.editable = editable;
          location.movable = editable;
          shape.cursor = text.cursor = cursor;
        });
        flow.editable = editable;
      });

      attrs.$observe('highlight', function(ts){
        diagram.nodes.each(function(node){

          // Shape cache

          var els = [
            node.findObject('shape'),
            node.findObject('text')
          ];
          node.findLinksOutOf().each(function(link){ els.push(link); });

          // Transform tag-string to array of tags

          var tags = scope.$eval(ts);
          if (Array.isArray(tags)) {
            tags = _.pluck(tags, 'text');
          }

          if (!tags.length) return highlight(els);
          if (_.intersection(node.data.tags, tags).length == tags.length) {
            return highlight(els);
          }
          shade(els);

        });
      });

      diagram.addDiagramListener('modified', function(){
        // console.log(diagram.model.toJson());
      });

    }
  };
}

function highlight(){
  var els = _.flatten(Array.prototype.slice.call(arguments));
  angular.forEach(els, function(el){ el.opacity = 1; });
}

function shade(){
  var els = _.flatten(Array.prototype.slice.call(arguments));
  angular.forEach(els, function(el){ el.opacity = .2; });
}

