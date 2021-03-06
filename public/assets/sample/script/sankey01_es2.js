$(function(){
  var indexs = $('#indexs').val();       
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var day = new Date().toString().split(' ');    
  var index = indexs+day[3]+'.'+mon[day[1]]+'.'+day[2];    
  console.log(index);
 $.ajax({
    url: "/sample/restapi/selectJiraAccReq" ,
    dataType: "json",
    type: "get",
    data: { index : index },
    success: function(result) {
      console.log(result);
      if (result.rtnCode.code == "0000") {        
        makeData(result.rtnData);
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });     
});

function makeData(result) {
var node={}, nodes = [], line = {}, lines = [], req={},  last = {}, lineNode = {}, id= {};
      var colors=['#61DBF0', '#f5662b', '#FAED7D', '#367d85', '#AB6CFF', '#97ba4c', '#3f3e47', '#9f9fa3', '#1F50B5', '#FFBB00'];
     var reqCnt = 0, nodeCnt = 0, lineCnt = 0, lineNodeCnt = 0, idCnt = 0;        
     var nodeNo = 0;
     var nodeList = [];
     result.forEach(function(d) {              
        var a = d._source.request.split('?');                     
        console.log(a[0]);
    var c = a[0].split('.');    
    if(c[c.length-1]!='js'&&c[c.length-1]!='css'&&c[c.length-1]!='png'&&c[c.length-1]!='woff'&&c[c.length-1]!='json'&&c[c.length-1]!='jsp'&&c[c.length-1]!='jspa'&&c[c.length-1]!='ico'&&c[c.length-1]!='svg'){
        if(req[a[0]] == null) {          
          req[a[0]] = { no : reqCnt++, cnt : 1};
        } else {
          req[a[0]].cnt++;        
        }

        if(id[d._source.auth] == null) {
          id[d._source.auth] = colors[idCnt++%10];                   
        }
        var nodeId = d._source.auth+'_'+req[a[0]].no;       
        
        if(node[nodeId] ==null){
          nodeList[nodeNo] = nodeId;
          node[nodeId] ={ name : a[0], id : nodeId, no : nodeNo++ };          
        }
        if(last[d._source.auth] != null){
          var from = last[d._source.auth];
          var to = nodeId;  
          if(node[from].no > node[to].no){
            from = nodeId;
            to = last[d._source.auth];
          }        
          if(from != to){
            if(line[node[to].no+'-'+node[from].no] == null){
              if(lineNode[from] == null) {                
                lineNode[from] = {};        
                node[from].no = lineNodeCnt;        
                nodes[lineNodeCnt++] = node[from];                        
              }
              if(lineNode[to] == null) {
                lineNode[to] = {};    
                node[to].no = lineNodeCnt;
                nodes[lineNodeCnt++] = node[to];                                
              }
              var source = node[from].no;
              var target = node[to].no;              
              if(line[source+'-'+target] == null) {                
                line[source+'-'+target] = { no : lineCnt };               
                lines[lineCnt++] = {  source:  source , target: target, value : 0.0001 };                
              } else {                            
                lines[line[source+'-'+target].no].value += 0.0001;
              }
            } else {                   
              lines[line[node[to].no+'-'+node[from].no].no].value += 0.0001;
            }
          } else {            
           if(lineNode[to] == null) {
              lineNode[to] = {};                  
              node[to].no = lineNodeCnt;              
              nodes[lineNodeCnt++] = node[to];                                
            }  
          }
        }        
        last[d._source.auth] =  node[nodeId].id;       
      }
       });
     var json = {"nodes" :nodes, "links" : lines };
     drawChart({rtnData : json, color : id});
}

function drawChart(data) {
   var colors = data.color;
      console.log(color);
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
 
}