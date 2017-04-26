$(function(){ // on dom ready
var elesJson = {
  nodes: [
    { data: { id: 'n1', name : 'USER', img: '../assets/images/user1.png' } },
    { data: { id: 'n2', name : 'USER', img: '../assets/images/user2.png' } },
    { data: { id: 'n3', name : 'FRONT-WEB', img: '../assets/sample/tomcat0.png' } },
    { data: { id: 'n4', name : 'BACKEND-WEB', img: '../assets/sample/tomcat3.png' } },
    { data: { id: 'n5', name : 'BACKEND-API', img: '../assets/sample/tomcat1.png' } },
    { data: { id: 'n6', name : 'MEMCACHED', img: '../assets/sample/memcached.png' } },
    { data: { id: 'n7', name : 'XXX:YYY:ZZZ', img: '../assets/sample/cloud.png' } },
    { data: { id: 'n8', name : 'URL\t2740\nURL:XXX\t1974\nURL:AAA\t1370\n765', img: '../assets/sample/cloud.png' } },
    { data: { id: 'n9', name : 'pinpoint', img: '../assets/sample/pinpoint.png' } },
    { data: { id: 'n10', name : 'MySQL', img: '../assets/sample/mysql.png' } },
    { data: { id: 'n11', name : 'ARCUS', img: '../assets/sample/arcus.png' } },      ],
  edges: [
     { data: { id: 'n1n3', count : 8459, source: 'n1', target: 'n3' } },
     { data: { id: 'n3n6', count : 5922, source: 'n3', target: 'n6' } },
     { data: { id: 'n3n7', count : 709, source: 'n3', target: 'n7' } },
     { data: { id: 'n3n8', count : 6849, source: 'n3', target: 'n8' } },
     { data: { id: 'n3n5', count : 661, source: 'n3', target: 'n5' } },
     { data: { id: 'n5n9', count : 861, source: 'n5', target: 'n9' } },
     { data: { id: 'n5n10', count : 854, source: 'n5', target: 'n10' } },
     { data: { id: 'n3n4', count : 760, source: 'n3', target: 'n4' } },
     { data: { id: 'n2n4', count : 1525, source: 'n2', target: 'n4' } },
     { data: { id: 'n4n7', count : 205, source: 'n4', target: 'n7' } },
     { data: { id: 'n4n5', count : 194, source: 'n4', target: 'n5' } },
     { data: { id: 'n4n10', count : 2285, source: 'n4', target: 'n10' } },
     { data: { id: 'n4n11', count : 2280, source: 'n4', target: 'n11' } },     
  ]  
};

var cy = cytoscape({
  container: document.getElementById('cy'),
        
   style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'width': '100px',
        'height': '80px',
        'content': 'data(name)',
        'background-fit': 'cover',
         'border-color': '#000',
        'border-width': 1,
        'border-opacity': 0.5,
        'text-outline-width': 2,
        'text-outline-color': 'white',          
        'shape': 'rectangle',   
        'text-valign': 'bottom', 
        'text-wrap' : 'wrap' ,
        'background-image': 'data(img)', })
    .selector('edge')
      .css({
        'curve-style': 'bezier',
        'width': 3,
        'line-color': '#B1C1F2',
        'target-arrow-color': '#B1C1F2',
        'target-arrow-shape': 'triangle',
        'text-outline-width': 5,
        'text-outline-color': 'white',
        'content': 'data(count)',
        'opacity': 0.8,
        
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
      .selector('#a1')
      .css({
        'background-image': '../assets/images/user1.png'

      })
      .selector('#a2')
      .css({
        'background-image': '../assets/images/user2.png'

      })
      .selector('#b1')
      .css({
        'background-image': '../assets/sample/tomcat.png'
      })
      .selector('.multiline-manual')
      .css({
        'text-wrap' : 'wrap'
      }),
      

  elements: elesJson,
  
  layout: {
    name: 'dagre',
    rankDir: 'LR',
    nodeSep: 100,
    edgeSep: 100,
    rankSep: 100,
  },

  ready: function(){
    window.cy = this;
    // giddy up
  }
}); 
var defaults = {
    container: document.getElementById('cynav')
  , viewLiveFramerate: 0 // set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
  , thumbnailEventFramerate: 30 // max thumbnail's updates per second triggered by graph updates
  , thumbnailLiveFramerate: false // max thumbnail's updates per second. Set false to disable
  , dblClickDelay: 200 // milliseconds
  , removeCustomContainer: true // destroy the container specified by user on plugin destroy
  , rerenderDelay: 100 // ms to throttle rerender updates to the panzoom for performance
};
 var nav = cy.navigator ( defaults );
}); // on dom ready
