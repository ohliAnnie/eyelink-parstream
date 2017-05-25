$(function(){
  var colors = {    
           'aa': '#61DBF0',
            'bb':              '#f5662b',
            'cc':         '#FAED7D',
            'dd':              '#367d85',
            'ee':             '#AB6CFF',
            '5_':             '#97ba4c',
            '6_': '#3f3e47',
            '7_':            '#9f9fa3',
            '8_' : '#1F50B5',
            '9_' : '#FFBB00'
          };
      /*  d3.json("/assets/sample/data/test.json", function(error, json) {          */
     d3.json("/sample/restapi/selectJiraAccJson", function(error, data) {                 
      console.log(data.rtnData);
      /*var json = JSON.parse(data.rtnData); 
      console.log(json);*/
        var chart = d3.select("#chart").append("svg").chart("Sankey.Path");
       chart
          .name(label)
          .colorNodes(function(name, node) {
            return color(node, 1) || colors.fallback;
          })
          .colorLinks(function(link) {
            return color(link.source, 4) || color(link.target, 1) || colors.fallback;
          })
          .nodeWidth(15)
          .nodePadding(10)
          .spread(true)
          .iterations(0)
          .draw(data.rtnData);
        function label(node) {
          return node.name.replace(/\s*\(.*?\)$/, '');
        }
        function color(node, depth) {
          var id = node.id.replace(/(_score)?(_\d+)?$/, '');
          if (colors[id]) {
            return colors[id];
          } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
            return color(node.targetLinks[0].source, depth-1);
          } else {
            return null;
          }
        }
      });
    });