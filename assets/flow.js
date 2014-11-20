
function init() {
  var $ = go.GraphObject.make;
  flow = $(go.Diagram, "flow", {
    initialContentAlignment: go.Spot.Center,
    allowDrop: true,
    "LinkDrawn": showLinkLabel,
    "LinkRelinked": showLinkLabel,
    "undoManager.isEnabled": true
  });

  /**
   * Shared node styles.
   */

  function nodeStyle() {
    return [
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      {
        locationSpot: go.Spot.Center,
        selectionAdorned: false,
        mouseEnter: function (e, obj) { showPorts(obj.part, true); },
        mouseLeave: function (e, obj) { showPorts(obj.part, false); }
      }
    ];
  }

  /**
   * Makes a transparent port
   */

  function makePort(name, spot, output, input) {
    return $(go.Shape, "Circle", {
      fill: "transparent",
      stroke: null,
      desiredSize: new go.Size(8, 8),
      alignment: spot,
      alignmentFocus: spot,
      portId: name,
      fromSpot: spot,
      toSpot: spot,
      fromLinkable: output,
      toLinkable: input,
      cursor: "pointer"
    });
  }

  /**
   * Preferences.
   */

  var lightText = "white";
  var red = "rgb(243,73,74)";
  var font = "10pt Helvetica neue";
  var air = 10;

  /**
   * Default node.
   */

  var defaultNode = $(go.Node, "Spot", nodeStyle(),
    $(go.Panel, "Auto",
      $(go.Shape, "Rectangle", {
        fill: "rgb(203,203,203)",
        stroke: null,
        margin: air
      },
      new go.Binding("figure", "figure")),
      $(go.TextBlock, {
        font: font,
        stroke: lightText,
        margin: 30,
        maxSize: new go.Size(160, NaN),
        wrap: go.TextBlock.WrapFit,
        editable: true
      },
      new go.Binding("text", "text").makeTwoWay())
    ),
    makePort("T", go.Spot.Top, false, true),
    makePort("L", go.Spot.Left, true, true),
    makePort("R", go.Spot.Right, true, true),
    makePort("B", go.Spot.Bottom, true, false)
  );
  flow.nodeTemplateMap.add("", defaultNode);

  var processNode = $(go.Node, "Spot", nodeStyle(),
    $(go.Panel, "Auto",
      $(go.Shape, "Circle", {
        minSize: new go.Size(80, 80),
        fill: "rgb(127,127,127)",
        stroke: null,
        margin: air
      }),
      $(go.TextBlock, {
        margin: 10,
        font: font,
        stroke: lightText,
        editable: true
      },
      new go.Binding("text", "text").makeTwoWay())
    ),
    makePort("L", go.Spot.Left, true, false),
    makePort("R", go.Spot.Right, true, false),
    makePort("B", go.Spot.Bottom, true, false)
  );
  flow.nodeTemplateMap.add("Process", processNode);

  var decisionNode = $(go.Node, "Spot", nodeStyle(),
      $(go.Panel, "Auto", $(go.Shape, "Decision", {
        fill: red,
        stroke: null,
        margin: air,
        geometryStretch: go.GraphObject.Uniform
      }),
      $(go.TextBlock, {
        margin: 10,
        font: font,
        stroke: lightText,
        editable: true
      },
      new go.Binding("text", "text").makeTwoWay())
    ),
    makePort("T", go.Spot.Top, false, true),
    makePort("L", go.Spot.Left, true, true),
    makePort("R", go.Spot.Right, true, true),
    makePort("B", go.Spot.Bottom, true, false)
  );
  flow.nodeTemplateMap.add("Router", decisionNode);

  flow.linkTemplate = $(go.Link, {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpGap,
      corner: 5, toShortLength: 4,
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true
    },
    new go.Binding("points").makeTwoWay(),
    $(go.Shape, {
        isPanelMain: true,
        stroke: "gray",
        strokeWidth: 2
      },
      new go.Binding("stroke", "brush").makeTwoWay()
    ),
    $(go.Shape, {
        toArrow: "standard",
        stroke: null,
        fill: "gray"
      },
      new go.Binding("fill", "brush").makeTwoWay()
    ),
    $(go.Panel, "Auto", {
        visible: false,
        name: "LABEL",
        segmentIndex: 2,
        segmentFraction: 0.5
      },
      new go.Binding("visible", "visible").makeTwoWay(),
      $(go.Shape, "Circle", {
        minSize: new go.Size(40, 40),
        fill: "white",
        stroke: "gray",
        strokeDashArray: [2, 1]
      }),
      $(go.TextBlock, "Yes", {
        textAlign: "center",
        font: font,
        stroke: "#333333",
        editable: true
      },
      new go.Binding("text", "text").makeTwoWay())
    )
  );

  // Make link labels visible if coming out of a "conditional" node.
  // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
  function showLinkLabel(e) {
    var label = e.subject.findObject("LABEL");
    if (label !== null && (e.subject.fromNode.data.category === "Router")) {
      label.brush = red;
      label.visible = true;
    }
  }

  // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
  flow.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
  flow.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
  flow.model = go.Model.fromJson(data);

  // initialize the Palette that is on the left side of the page
  palette = $(go.Palette, "palette", {
    nodeTemplateMap: flow.nodeTemplateMap,
    model: new go.GraphLinksModel([
      { category: "Process", text: "Process" },
      { text: "Step" },
      { category: "Router", text: "?" }
    ])
  });

}

// Make all ports on a node visible when the mouse is over the node

function showPorts(node, show) {
  var diagram = node.diagram;
  if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
  node.ports.each(function(port) {
    port.stroke = (show ? node.sm : null);
    port.strokeWidth = 2;
  });
}

