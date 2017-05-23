$(function(){
  var colors = {
           'sunghan.bae': '#61DBF0',
            'hyeyoung.lee':              '#f5662b',
            'undefined':         '#FAED7D',
            'edit':              '#367d85',
            'diagram':             '#AB6CFF',
            'gallery':             '#97ba4c',
            'timeline': '#3f3e47',
            'fallback':            '#9f9fa3',
            'status' : '#1F50B5',
            'manager' : '#FFBB00'
          };
      /*  d3.json("/assets/sample/data/test.json", function(error, json) {          */
     d3.json("/sample/restapi/selectJiraAccReq", function(error, data) {        
         var temp = {}, node={}, nodes = {}, line = {},req={}, user = {}, last = {};
        var cnt = 0;
        var reqCnt = 0, userCnt = 0, nodeCnt = 0;
        var reqLen = 0, lineLen = 0;
        var nodeNo = 0;
        var userList = [];
       data.rtnData.forEach(function(d) {
        var a = d._source.request.split('?');   
        var name = a[0];
        var count = {};        
        if(req[a[0]] == null) {          
          req[a[0]] = { no : reqCnt++, cnt : 1};
        } else {
          req[a[0]].cnt++;
        }
        if(line[d._source.auth] == null) {
          userList[userCnt++] = d._source.auth;
          line[d._source.auth] = { link:[] };          
        } else if(last[d._source.auth] != req[a[0]].no){
          line[d._source.auth].link.push({ id: last[d._source.auth]+'-'+req[a[0]].no, from: last[d._source.auth] , to:req[a[0]].no, cnt: 1 });
        }
        last[d._source.auth] = req[a[0]].no;
        if(node[d._source.auth+'_'+req[a[0]].no] ==null){
          node[d._source.auth+'_'+req[a[0]].no] ={};
          nodes[nodeCnt++] = { name : a[0], id : d._source.auth+'_'+req[a[0]].no, no : nodeNo++};          
        }
       });       
       console.log(userList);
       console.log(req);
       console.log(line);
       console.log(nodes);
     
/*       var nodes = temp
        console.log(nodes);
        console.log(links);
        var json =  { 'nodes' : nodes, 'links' : links};  
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
          .draw(json);
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