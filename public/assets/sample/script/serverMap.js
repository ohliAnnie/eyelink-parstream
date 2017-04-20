$(function(){ // on dom ready
var elesJson = {
  nodes: [
    { data: { id: 'user', foo: 0, bar: 0, baz: 10 }, position: {x: 000, y:100}  },
    { data: { id: 'app', foo: 1, bar: 10, baz: 0 }, position: {x: 100, y:100}  }
  ], 

  edges: [
     { data: { id: 'ua', name : 15, weight: 10, source: 'user', target: 'app' }},
     { data: { id: 'aa', name : 1, weight: 10, source: 'app', target: 'app' } },
  ]  
};

var cy = cytoscape({
  container: document.getElementById('cy'),

   style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'width': '60px',
        'height': '60px',
        'content': 'data(id)',
        'pie-size': '80%',
        'pie-1-background-color': '#E8747C',
        'pie-1-background-size': 'mapData(foo, 0, 10, 0, 100)',
        'pie-2-background-color': '#74E883',
        'pie-2-background-size': 'mapData(bar, 0, 10, 0, 100)',
        'pie-3-background-color': 'white',
        'pie-3-background-size': 'mapData(baz, 0, 10, 0, 100)'
      })
    .selector('edge')
      .css({
        'curve-style': 'bezier',
        'width': 4,
        'line-color': '#B1C1F2',
        'target-arrow-color': '#B1C1F2',
        'target-arrow-shape': 'triangle',
         'content': 'data(name)',
        'opacity': 0.8
      })
    .selector(':selected')
      .css({
        'background-color': 'black',
        'line-color': 'blue',
        'target-arrow-color': 'blue',
        'source-arrow-color': 'black',
        'opacity': 1
      }),

  elements: elesJson,
  
  layout: {
    name: 'breadthfirst',
    directed: true,
    padding: 10
  },

  ready: function(){
    window.cy = this;
    
    // giddy up
  }
}); 
 
}); // on dom ready
