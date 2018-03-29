import { h, render, Component } from 'preact';
import vis from 'vis';
import Data from '../../data/WIES_nodes_manual.json';

Object.prototype.clone = function() {
  if (typeof(this)=="object"){
      var clone = {};
      for (var prop in this)
          if (this.hasOwnProperty(prop))
              clone[prop] = this[prop];

      return clone;
  }
}

export default class Graph extends Component {
  constructor(){
    super();
    this.init = this.init.bind(this);
    this.getNodeData = this.getNodeData.bind(this);
    this.redrawAll2 = this.redrawAll2.bind(this);
    this.getDefaultOptions = this.getDefaultOptions.bind(this);
    const nodeSize = 400;
    const fontSize = 200;
    const container = document.getElementById('mynetwork');
    const nodeDetail = document.getElementById('nodeContent');
    let nodes = new vis.DataSet();
    let edges = new vis.DataSet();
    let data = {
      nodes: nodes,
      edges: edges
    };
    const options = {
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
        barnesHut: {
          gravitationalConstant: -5000,
          centralGravity: 1,
          avoidOverlap: 0.25,
          springLength: 95,
          springConstant: 0.01,
          damping: 0.1
        }
      },
      layout: {
        improvedLayout: true
      }
    };
    const groups = {
      ["Applied Research"]: {
          icon: {
              code: '\uf1fb',
              color: 'rgb(175, 101, 197)'
          }
      },
      ["Basic Research"]: {
          icon: {
              code: '\uf0c3',
              color: 'rgb(175, 101, 197)'
          }
      },
      ["Faculty"]: {
          icon: {
              code: '\uf2c1',
              color: 'rgb(197, 77, 81)'
          }
      },
      ["Grad Student"]: {
          icon: {
              code: '\uf19d',
              color: 'rgb(197, 77, 81)'
          }
      },
      ["Outreach - Citizen Science"]: {
          icon: {
              code: '\uf2b5',
              color: 'rgb(17, 181, 153)'
          }
      },
      ["Outreach - K-12"]: {
          icon: {
              code: '\uf0f3',
              color: 'rgb(17, 181, 153)'
          }
      },
      ["Outreach - Symposia"]: {
          icon: {
              code: '\uf130',
              color: 'rgb(17, 181, 153)'
          }
      },
      ["Major Program"]: {
          icon: {
              code: '\uf0e8',
              color: 'rgb(63,128,205)'
          }
      },
      ["Summer university classes"]: {
          icon: {
              code: '\uf185',
              color: 'rgb(119,147,60)'
          }
      },
      ["UG Student"]: {
          icon: {
              code: '\uf2c2',
              color: 'rgb(197, 77, 81)'
          }
      },
      ["USC Classes"]: {
          icon: {
              code: '\uf02d',
              color: 'rgb(119,147,60)'
          }
      },
      ["USC Fellowships"]: {
          icon: {
              code: '\uf091',
              color: 'rgb(173, 171, 27)'
          }
      },
      ["Whitepapers"]: {
          icon: {
              code: '\uf15c',
              color: 'rgb(154, 154, 154)'
          }
      }
    };

    this.state = {
      fontSize: fontSize,
      nodeSize: nodeSize,
      groups: groups,
      options: options,
      nodes: nodes,
      edges: edges,
      nodeContent: nodeDetail,
      container: container,
      nodes: nodes,
      edges: edges,
      data: data,
      network: new vis.Network(container, data, options)
    }
  }
  componentWillMount(){
    window[ addEventListener ? 'addEventListener' : 'attachEvent' ]
      ( addEventListener ? 'load' : 'onload', this.init );
  }
  init(){
    this.redrawAll2(Data);
    this.state.network.on('click', function (params) {
      if (params.nodes.length > 0) {
        var nodeData = this.state.nodes.get(params.nodes[0]);
      }
    })
    this.state.network.on('hoverNode', function(h){
      var edgesToUpdate = this.state.edges.get();
      var nodesToUpdate = this.state.nodes.get();
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
        var defaultOptions = this.getDefaultOptions(nodesToUpdate[i]);
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
      this.state.network.storePositions()
      this.state.nodes.update(nodesToUpdate);
      this.state.edges.update(edgesToUpdate);
    })
    this.state.network.on('blurNode', function(h){
      var edgesToUpdate = this.state.edges.get();
      var nodesToUpdate = this.state.nodes.get();
      for (var i = 0; i < edgesToUpdate.length; ++i) {
        edgesToUpdate[i].width = 1;
        edgesToUpdate[i].color = { color: 'black' };
      }
      for (var i = 0; i < nodesToUpdate.length; ++i) {
        var defaultOptions = this.getDefaultOptions(nodesToUpdate[i]);
        nodesToUpdate[i].icon = defaultOptions.icon;
        nodesToUpdate[i].font = defaultOptions.font;
        delete nodesToUpdate[i].x
        delete nodesToUpdate[i].y
      }
      this.state.network.storePositions()
      this.state.nodes.update(nodesToUpdate);
      this.state.edges.update(edgesToUpdate);
    })
  }
  getNodeData(nodeData) {
    var data = {
      id: nodeData.id,
      label: nodeData.label,
      group: nodeData.group,
      x: nodeData.x,
      y: nodeData.y
    }
    return JSON.stringify(data, undefined, 3);
  }

  redrawAll2(savedJSON){
    for (var i = 0; i < savedJSON.nodes.length; ++i) {
      var options = this.getDefaultOptions(savedJSON.nodes[i]);
      savedJSON.nodes[i].font = options.font;
      savedJSON.nodes[i].icon = options.icon;
      savedJSON.nodes[i].color = options.color;
      savedJSON.nodes[i].size = this.state.nodeSize;
      savedJSON.nodes[i].title = '<strong>'+savedJSON.nodes[i].group+': </strong>'+savedJSON.nodes[i].label;
    }
    this.state.nodes.add(savedJSON.nodes);
    this.state.edges.add(savedJSON.edges);
    var nodeData = this.state.nodes.get(2); // get the data from node 2 as example
    this.state.network.fit(); // zoom to fit
  }

  getDefaultOptions(node) {
    const { groups } = this.state;
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
    if (!color) { color = this.state.options.nodes.color.clone() }
    if (!icon) { icon = this.state.options.nodes.icon.clone() }
    if (!font) { font = this.state.options.nodes.font.clone() }
    return { color: color, icon: icon, font: font };
  }
  render() {
    return (
      <div id="mynetwork"></div>
    )
  }
}
