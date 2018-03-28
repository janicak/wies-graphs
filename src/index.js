import vis from 'vis';
import './style.css';
import Data from '../data/WIES_nodes_manual.json';

function init(){
  Object.prototype.clone = function() {
    if (typeof(this)=="object"){
        var clone = {};
        for (var prop in this)
            if (this.hasOwnProperty(prop))
                clone[prop] = this[prop];

        return clone;
    }
  }
  function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          success(JSON.parse(xhr.responseText));
        }
        else {
          error(xhr);
        }
      }
    };
    xhr.open('GET', path, true);
    xhr.send();
  }
  var network;
  var nodes = new vis.DataSet();
  var edges = new vis.DataSet();
  var gephiImported;
  var nodeContent = document.getElementById('nodeContent');
  //loadJSON('./data/WIES_nodes.json', redrawAll, function(err) {console.log('error')});
  //loadJSON('../data/WIES_nodes_manual.json', redrawAll2, function(err) {console.log('error')});
  var container = document.getElementById('mynetwork');
  var data = {
    nodes: nodes,
    edges: edges
  };
  var fontSize = 200;
  var nodeSize = 400;
  var groups = {
    ["Applied Research"]: {
        icon: {
            code: '\uf1fb',
            size: nodeSize,
            color: 'rgb(175, 101, 197)'
        }
    },
    ["Basic Research"]: {
        icon: {
            code: '\uf0c3',
            size: nodeSize,
            color: 'rgb(175, 101, 197)'
        }
    },
    ["Faculty"]: {
        icon: {
            code: '\uf2c1',
            size: nodeSize,
            color: 'rgb(197, 77, 81)'
        }
    },
    ["Grad Student"]: {
        icon: {
            code: '\uf19d',
            size: nodeSize,
            color: 'rgb(197, 77, 81)'
        }
    },
    ["Outreach - Citizen Science"]: {
        icon: {
            code: '\uf2b5',
            size: nodeSize,
            color: 'rgb(17, 181, 153)'
        }
    },
    ["Outreach - K-12"]: {
        icon: {
            code: '\uf0f3',
            size: nodeSize,
            color: 'rgb(17, 181, 153)'
        }
    },
    ["Outreach - Symposia"]: {
        icon: {
            code: '\uf130',
            size: nodeSize,
            color: 'rgb(17, 181, 153)'
        }
    },
    ["Major Program"]: {
        icon: {
            code: '\uf0e8',
            size: nodeSize,
            color: 'rgb(63,128,205)'
        }
    },
    ["Summer university classes"]: {
        icon: {
            code: '\uf185',
            size: nodeSize,
            color: 'rgb(119,147,60)'
        }
    },
    ["UG Student"]: {
        icon: {
            code: '\uf2c2',
            size: nodeSize,
            color: 'rgb(197, 77, 81)'
        }
    },
    ["USC Classes"]: {
        icon: {
            code: '\uf02d',
            size: nodeSize,
            color: 'rgb(119,147,60)'
        }
    },
    ["USC Fellowships"]: {
        icon: {
            code: '\uf091',
            size: nodeSize,
            color: 'rgb(173, 171, 27)'
        }
    },
    ["Whitepapers"]: {
        icon: {
            code: '\uf15c',
            size: nodeSize,
            color: 'rgb(154, 154, 154)'
        }
    },
  }
  var options = {
    width: '100%',
    height: '100%',
    nodes: {
        shape: 'icon',
        icon: {
          face: 'FontAwesome',
          code: '\uf0c0',
          size: nodeSize,
        },
        size: nodeSize,
        font: {
            size: fontSize,
            face: "tahoma",
            color: 'black',
            vadjust: 150,
            strokeWidth: 80,
            strokeColor: 'white'
        },
        borderWidth: 2,
        heightConstraint: 50,
        color: {
          background: 'black'
        }
    },
    edges: {
        width: 1,
        smooth: {
          type: 'vertical',
          roundness: .75
        },
        color: { color: 'black' }
    },
    interaction: {
      hover: true,
      hoverConnectedEdges:false,
      navigationButtons: true
    },
    physics: {
      maxVelocity: 60,
      minVelocity: 2,
      solver: 'barnesHut',
      /*stabilization: {
        enabled: true,
        fit: true
      },*/
      barnesHut: {
        gravitationalConstant: -5000,
        centralGravity: 1,
        avoidOverlap: 0.25,
        springLength: 95,
        //springConstant: 0.01,
        springConstant: 0.01,
        damping: 0.1
      }
    },
    layout: {
      improvedLayout: true
    }
  };
  network = new vis.Network(container, data, options);
  redrawAll2(Data);
  network.on('click', function (params) {
    if (params.nodes.length > 0) {
      var nodeData = nodes.get(params.nodes[0]);
      nodeContent.innerHTML = getNodeData(nodeData) // get the data from selected node
       // show the data in the div
    }
  })
  network.on('hoverNode', function(h){
    var edgesToUpdate = edges.get();
    var nodesToUpdate = nodes.get();
    var nodeIds = [h.node];

    for (var i = 0; i < edgesToUpdate.length; ++i) {
      if (edgesToUpdate[i].to == h.node || edgesToUpdate[i].from == h.node) {
        edgesToUpdate[i].width = 2;
        if (nodeIds.indexOf(edgesToUpdate[i].to) == -1){ nodeIds.push(edgesToUpdate[i].to) }
        if (nodeIds.indexOf(edgesToUpdate[i].from) == -1){ nodeIds.push(edgesToUpdate[i].from) }
      } else {
        edgesToUpdate[i].color = { color: 'rgba(0,0,0,0.15)' };
      }
    }

    for (var i = 0; i < nodesToUpdate.length; ++i) {
      var defaultOptions = getDefaultOptions(nodesToUpdate[i]);
      if (nodeIds.indexOf(nodesToUpdate[i].id) == -1) {
        var iconFaded = defaultOptions.icon;
        iconFaded.color = 'rgba(0,0,0,0.15)';
        nodesToUpdate[i].icon = iconFaded;

        var fontFaded = defaultOptions.font;
        fontFaded.color = 'rgba(0,0,0,0.15)';
        nodesToUpdate[i].font = fontFaded;

      } else {
        nodesToUpdate[i].icon = defaultOptions.icon;
      }
      delete nodesToUpdate[i].x
      delete nodesToUpdate[i].y
    }
    network.storePositions()
    nodes.update(nodesToUpdate);
    edges.update(edgesToUpdate);
  })
  network.on('blurNode', function(h){
    var edgesToUpdate = edges.get();
    var nodesToUpdate = nodes.get();
    for (var i = 0; i < edgesToUpdate.length; ++i) {
      edgesToUpdate[i].width = 1;
      edgesToUpdate[i].color = { color: 'black' };
    }
    for (var i = 0; i < nodesToUpdate.length; ++i) {
      var defaultOptions = getDefaultOptions(nodesToUpdate[i]);
      nodesToUpdate[i].icon = defaultOptions.icon;
      nodesToUpdate[i].font = defaultOptions.font;
      delete nodesToUpdate[i].x
      delete nodesToUpdate[i].y
    }
    network.storePositions()
    nodes.update(nodesToUpdate);
    edges.update(edgesToUpdate);
  })
  var firstTime = true;
  network.on("afterDrawing", function (ctx) {
    if (firstTime) {
          //network.fit();
          setTimeout(function () {
              //network.fit();
          }, 200);
      }
      firstTime = false;
  });
  network.on("configChange", function() {
    // this will immediately fix the height of the configuration
    // wrapper to prevent unecessary scrolls in chrome.
    // see https://github.com/almende/vis/issues/1568
    var div = container.getElementsByClassName('vis-configuration-wrapper')[0];
    div.style["height"] = div.getBoundingClientRect().height + "px";
  });

  /**
   * This function fills the DataSets. These DataSets will update the network.
   */
  function redrawAll(gephiJSON) {
    if (gephiJSON.nodes === undefined) {
      gephiJSON = gephiImported;
    }
    else {
      gephiImported = gephiJSON;
    }
    nodes.clear();
    edges.clear();
    var parsed = vis.network.gephiParser.parseGephi(gephiJSON, {
      nodes: {
        fixed: false,
        parseColor: false,
      },
      edges: {
        inheritColor: false
      }
    });
    var edited = { nodes: [], edges: []}
    parsed.nodes.forEach(function(node){
      node.group = node.attributes.Category;
      var defaultOptions = getDefaultOptions(node);
      edited.nodes.push({
        id: node.id,
        label: node.label,
        group: node.group,
        //title: 'Category: ' + node.attributes.Category,
        icon: defaultOptions.icon.clone(),
        color: defaultOptions.color.clone(),
        x: node.x,
        y: node.y,
        physics: false,
        //size: 200
      });
    })
    parsed.edges.forEach(function(edge){
      edge.color = options.edges.color;
      edited.edges.push(edge);
    })
    // add the parsed data to the DataSets.
    nodes.add(edited.nodes);
    edges.add(edited.edges);
    var nodeData = nodes.get(2); // get the data from node 2 as example
    nodeContent.innerHTML = getNodeData(nodeData); // show the data in the div
    network.fit(); // zoom to fit
  }

  function getNodeData(nodeData) {
    var data = {
      id: nodeData.id,
      label: nodeData.label,
      group: nodeData.group,
      x: nodeData.x,
      y: nodeData.y
    }
    return JSON.stringify(data, undefined, 3);
  }

  function redrawAll2(savedJSON){
    for (var i = 0; i < savedJSON.nodes.length; ++i) {
      var options = getDefaultOptions(savedJSON.nodes[i]);
      savedJSON.nodes[i].font = options.font;
      savedJSON.nodes[i].icon = options.icon;
      savedJSON.nodes[i].color = options.color;
      savedJSON.nodes[i].size = nodeSize;
      savedJSON.nodes[i].title = '<strong>'+savedJSON.nodes[i].group+': </strong>'+savedJSON.nodes[i].label;
    }
    nodes.add(savedJSON.nodes);
    edges.add(savedJSON.edges);
    var nodeData = nodes.get(2); // get the data from node 2 as example
    nodeContent.innerHTML = getNodeData(nodeData); // show the data in the div
    network.fit(); // zoom to fit
    //network.moveTo({ position: { x:position.x + 3000, y: position.y } });
    /*network.redraw();
    console.log('redrawn')
    setTimeout(function(){ network.redraw(); console.log('redrawn again')}, 3000)*/
  }

  function getDefaultOptions(node) {
    var color;
    var icon;
    var font;
    var group = (node.group);
    if (groups.hasOwnProperty(group)) {
      if (groups[group].hasOwnProperty('color')) {
        color = groups[group].color.clone()
      }
      if (groups[group].hasOwnProperty('icon')) {
        icon = groups[group].icon.clone()
      }
      if (groups[group].hasOwnProperty('font')) {
        icon = groups[group].font.clone()
      }
    }
    if (!color) { color = options.nodes.color.clone() }
    if (!icon) { icon = options.nodes.icon.clone() }
    if (!font) { font = options.nodes.font.clone() }
    return { color: color, icon: icon, font: font };
  }

  function savePositions(){
    var edgesToUpdate = edges.get();
    var nodesToUpdate = nodes.get();
    var data = { edges: edgesToUpdate, nodes: nodesToUpdate }
    console.log(JSON.stringify(data))
  }
}

window[ addEventListener ? 'addEventListener' : 'attachEvent' ]( addEventListener ? 'load' : 'onload', init )
