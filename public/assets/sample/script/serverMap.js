$(function(){ // on dom ready
var elesJson = {
  nodes: [
    { data: { id: 'a1', name: 'USER', foo: 0, bar: 0, baz: 10 } },
    { data: { id: 'a2', name: 'USER', foo: 0, bar: 0, baz: 10 } },
    { data: { id: 'b1', name: 'FRONT-WEB', foo: 1, bar: 10, baz: 0 } },
    { data: { id: 'b2', name: 'BACKEND-WEB', foo: 1, bar: 10, baz: 0 } },
    { data: { id: 'b3', name: 'BACKEND-API', foo: 1, bar: 10, baz: 0 } },
    { data: { id: 'c1', name: 'MEMCACHED', foo: 0, bar: 0, baz: 10 } },
    { data: { id: 'c2', name: 'pinpoint', foo: 0, bar: 0, baz: 10 } },
    { data: { id: 'c3', name: 'MySQL', foo: 0, bar: 0, baz: 10 } },
    { data: { id: 'd1', name: 'ff31ddb85e9b4318c02e5e50a4315c27', foo: 0, bar: 0, baz: 10 } },
    { data: { id: 'e1', name1: 'search.naver.com',num1: 156, name2: 'section.blog.naver.com', num2: 136, foo: 0, bar: 0, baz: 10 } },
  ], 

  edges: [
     { data: { id: 'a1b1', name : 1048, weight: 10, source: 'a1', target: 'b1' }},
     { data: { id: 'b1c1', name : 468, weight: 10, source: 'b1', target: 'c1' } },
     { data: { id: 'b1e1', name : 1063, weight: 10, source: 'b1', target: 'e1' } },
     { data: { id: 'b1b3', name : 71, weight: 10, source: 'b1', target: 'b3' } },
     { data: { id: 'b1b2', name : 76, weight: 10, source: 'b1', target: 'b2' } },
     { data: { id: 'a2b2' , name : 23, weight: 10, source: 'a2', target: 'b2' } },
     { data: { id: 'b3c2', name : 87, weight: 10, source: 'b3', target: 'c2' } },
     { data: { id: 'b3c3', name : 79, weight: 10, source: 'b3', target: 'c3' } },
     { data: { id: 'b2b3', name : 9, weight: 10, source: 'b2', target: 'b3' } },
     { data: { id: 'b2c3', name : 99, weight: 10, source: 'b2', target: 'c3' } },
     { data: { id: 'b2d1', name : 228, weight: 10, source: 'b2', target: 'd1' } },
  ]  
};

var cy = cytoscape({
  container: document.getElementById('cy'),
        
   style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'width': '60px',
        'height': '50px',
        'content': 'data(name)',
        'background-fit': 'cover',
         'border-color': '#000',
        'border-width': 1,
        'border-opacity': 0.5,
        'text-outline-width': 2,
        'text-outline-color': 'white',        
        'shape': 'rectangle',      })
    .selector('edge')
      .css({
        'curve-style': 'bezier',
        'width': 3,
        'line-color': '#B1C1F2',
        'target-arrow-color': '#B1C1F2',
        'target-arrow-shape': 'triangle',
        'text-outline-width': 3,
        'text-outline-color': 'white',
        'content': 'data(name)',
        'opacity': 0.8
      })
    .selector(':selected')
      .css({
        'background-color': 'black',
        'line-color': 'blue',
         'border-width': 3,
        'border-color': 'blue',
        'target-arrow-color': 'blue',
        'source-arrow-color': 'black',
        'opacity': 1
      })
      .selector('#a')
      .css({
        'background-image': '../assets/images/user1.png'

      })
      .selector('#b')
      .css({
        'background-image': '../assets/sample/tomcat.png'
      }),
      

  elements: elesJson,
  
  layout: {
    name: 'cose',
    padding: 10,
   randomize: true,
    sort: function( a, b ){
              if( a.id() < b.id() ){
                return -1;
              } else if( a.id() > b.id() ){
                return 1;
              } else {
                return 0;
            }
      }
  },

  ready: function(){
    window.cy = this;
    
    // giddy up
  }
}); 
 
}); // on dom ready
