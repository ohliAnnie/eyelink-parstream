$(function(){ // on dom ready
var elesJson = {
  nodes: [
    { data: { id: 'user', foo: 10, bar: 5, baz: 5 } },
    { data: { id: 'app', foo: 10, bar: 5, baz: 3 } }
  ], 

  edges: [
     { data: { id: 'eb', weight: 10, source: 'user', target: 'app' } },
    
  ]
};

var cy = cytoscape({
  container: document.getElementById('cy'),

   style: cytoscape.stylesheet()
    .selector('node')
      .css({        
        'background-color': '#6272A3',
        'shape': 'rectangle',
        'width': 'mapData(foo, 0, 10, 40, 50)',
        'height': 'mapData(bar, 0, 10, 10, 70)',
        'content': 'data(id)',
        'background-fit': 'cover',
         'border-color': '#000',
        'border-width': 3,
        'border-opacity': 0.5
      })
    .selector('edge')
      .css({
        'curve-style': 'bezier',
        'width': 4,
        'line-color': '#B1C1F2',
        'target-arrow-color': '#B1C1F2',
        'target-arrow-shape': 'triangle',
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