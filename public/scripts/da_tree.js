function drawTree() { 

    d3.selectAll("svg").remove(); 
  var sdate = $('#sdate').val();
  var edate = $('#edate').val();
  if ($('#factor0').is(':checked') === true) {
    var factor = $('#factor0').val();
  } else if ($('#factor1').is(':checked') === true) {
    var factor = $('#factor1').val();
  } else if ($('#factor2').is(':checked') === true) {
    var factor = $('#factor2').val();
  } else if ($('#factor3').is(':checked') === true) {
    var factor = $('#factor3').val();
  } 

  console.log('%s, %s', sdate, edate);
  console.log(factor);
  $.ajax({
    url: "/analysis/restapi/getDaClusterMaster" ,
    dataType: "json",
    type: "get",
    data: {startDate:sdate, endDate:edate},
    success: function(result) {     
      if (result.rtnCode.code == "0000") {
        var data = result.rtnData;               
        var set = [];
        console.log(data);
        drawDirectory(data, sdate, edate);
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function drawDirectory(data, sdate, edate) {  

  var margin = {top: 30, right: 20, bottom: 30, left: 20},
      width = 960 - margin.left - margin.right,
      barHeight = 20,
      barWidth = width * .8;

  var i = 0,
      duration = 400,
      root;

  var tree = d3.layout.tree()
      .nodeSize([0, 20]);

  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

  var svg = d3.select("dirTree").append("svg")
      .attr("width", width + margin.left + margin.right)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     // data Setting
     var voltage = [], ampere = [], active_power = [], power_factor = [], factor = [], dir = [];
      data.forEach(function(d) {    
    // voltage
    var c0 = [], c1 = [], c2 = [], c3 = [];
    var a = d.c0_voltage_node.split(';');
    for(var i=0; i < a.length; i++) {      c0.push({ name : a[i]});    }
    var a = d.c1_voltage_node.split(';');
    for(var i=0; i < a.length; i++) {      c1.push({ name : a[i]});    }
    var a = d.c2_voltage_node.split(';');
    for(var i=0; i < a.length; i++) {      c2.push({ name : a[i]});    }
    var a = d.c3_voltage_node.split(';');
    for(var i=0; i < a.length; i++) {      c3.push({ name : a[i]});    }
    voltage.push({ name : 'c0', children : c0 });  
    voltage.push({ name : 'c1', chileren : c1 });  
    voltage.push({ name : 'c2', children : c2 });  
    voltage.push({ name : 'c3', children : c3 });        
    // ampere
    var c0 = [], c1 = [], c2 = [], c3 = [];
    var a = d.c0_ampere_node.split(';');
    for(var i=0; i < a.length; i++) {      c0.push({ name : a[i]});    }
    var a = d.c1_ampere_node.split(';');
    for(var i=0; i < a.length; i++) {      c1.push({ name : a[i]});    }
    var a = d.c2_ampere_node.split(';');
    for(var i=0; i < a.length; i++) {      c2.push({ name : a[i]});    }
    var a = d.c3_ampere_node.split(';');
    for(var i=0; i < a.length; i++) {     c3.push({ name : a[i]});    }
    ampere.push({ name : 'c0', children : c0 });  
    ampere.push({ name : 'c1', chileren : c1 });  
    ampere.push({ name : 'c2', children : c2 });  
    ampere.push({ name : 'c3', children : c3 });  
    // active_power
    var c0 = [], c1 = [], c2 = [], c3 = [];
    var a = d.c0_active_power_node.split(';');
    for(var i=0; i < a.length; i++) {      c0.push({ name : a[i]});    }
    var a = d.c1_active_power_node.split(';');
    for(var i=0; i < a.length; i++) {      c1.push({ name : a[i]});    }
    var a = d.c2_active_power_node.split(';');
    for(var i=0; i < a.length; i++) {      c2.push({ name : a[i]});    }
    var a = d.c3_active_power_node.split(';');
    for(var i=0; i < a.length; i++) {      c3.push({ name : a[i]});    }
    active_power.push({ name : 'c0', children : c0 });  
    active_power.push({ name : 'c1', chileren : c1 });  
    active_power.push({ name : 'c2', children : c2 });  
    active_power.push({ name : 'c3', children : c3 });  
    // power_factor
    var c0 = [], c1 = [], c2 = [], c3 = [];
    var a = d.c0_power_factor_node.split(';');
    for(var i=0; i < a.length; i++) {      c0.push({ name : a[i]});    }
    var a = d.c1_power_factor_node.split(';');
    for(var i=0; i < a.length; i++) {      c1.push({ name : a[i]});    }
    var a = d.c2_power_factor_node.split(';');
    for(var i=0; i < a.length; i++) {      c2.push({ name : a[i]});    }
    var a = d.c3_power_factor_node.split(';');
    for(var i=0; i < a.length; i++) {      c3.push({ name : a[i]});    }
    power_factor.push({ name : 'c0', children : c0 });  
    power_factor.push({ name : 'c1', chileren : c1 });  
    power_factor.push({ name : 'c2', children : c2 });  
    power_factor.push({ name : 'c3', children : c3 });  
    factor.push({ name : 'voltage', children : voltage });
    factor.push({ name : 'ampere', children : ampere});
    factor.push({ name : 'active_power', children : active_power });
    factor.push({ name : 'power_factor', children : power_factor });
    dir.push({ name : 'factor', children : factor });
  });
  console.log(dir);

  flare.x0 = 0;
  flare.y0 = 0;
  update(root = dir);
}




function update(source) {

  // Compute the flattened node list. TODO use d3.layout.hierarchy.
  var nodes = tree.nodes(root);

  var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

  d3.select("svg").transition()
      .duration(duration)
      .attr("height", height);

  d3.select(self.frameElement).transition()
      .duration(duration)
      .style("height", height + "px");

  // Compute the "layout".
  nodes.forEach(function(n, i) {
    n.x = i * barHeight;
  });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .style("opacity", 1e-6);

  // Enter any new nodes at the parent's previous position.
  nodeEnter.append("rect")
      .attr("y", -barHeight / 2)
      .attr("height", barHeight)
      .attr("width", barWidth)
      .style("fill", color)
      .on("click", click);

  nodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
      .text(function(d) { return d.name; });

  // Transition nodes to their new position.
  nodeEnter.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1);

  node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1)
    .select("rect")
      .style("fill", color);

  // Transition exiting nodes to the parent's new position.
  node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .style("opacity", 1e-6)
      .remove();

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

function color(d) {
  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}
