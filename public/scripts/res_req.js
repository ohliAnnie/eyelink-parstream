function makeIndex(){      
  var indexs = $('#indexs').val();  
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var monS = ['01','02','03','04','05','06','07','08','09','10','11','12']  ;
  var sdate = $('#sdate').val();  
  var s = sdate.split('-')
  var minDate = new Date(s[0], parseInt(s[1])-1, s[2], 0, 0, 0);
  var edate = $('#edate').val();
  var e = edate.split('-');
  var maxDate = new Date(e[0], parseInt(e[1])-1, e[2], 0, 0, 0);
  console.log(sdate, edate);
  var indexD = [], rangeD = [], xD = [], cnt = 0;    
  for(i=minDate.getTime(); i < maxDate.getTime()+24*60*60*1000; i+=24*60*60*1000){    
    var day = new Date(i).toString().split(' ');    
    indexD[cnt] = indexs+day[3]+'.'+mon[day[1]]+'.'+day[2];    
    xD[cnt] = mon[day[1]]+'/'+day[2];
    var day2 = new Date(i+24*60*60*1000).toString().split(' ');         
    rangeD[cnt++] ='{"key" : "'+mon[day[1]]+'/'+day[2] +'", "from" : "'+day[3]+'-'+mon[day[1]]+'-'+day[2]+'T00:00:00.000Z", "to" : "'+day2[3]+'-'+mon[day2[1]]+'-'+day2[2]+'T00:00:00.000Z" }';  
  }    
  getData(indexD, xD, rangeD.toString(), "#day");  
 
  var indexW = [], rangeW = [], xW = [], cnt = 0;   
  var weeks = parseInt($('#weeks').val());
  var wNum = weeks * 7 - 1;
  for(i=wNum; i>=0; i--) {
    var day = new Date(maxDate.getTime()-i*24*60*60*1000).toString().split(' ');    
    if(i%7 == 6){      
      var day2 = new Date(maxDate.getTime()-(i-6)*24*60*60*1000).toString().split(' ');         
      xW[cnt] = mon[day[1]]+'/'+day[2]+'~'+mon[day2[1]]+'/'+day2[2];
      rangeW[cnt] ='{"key" : "'+xW[cnt++] +'", "from" : "'+day[3]+'-'+mon[day[1]]+'-'+day[2]+'T00:00:00.000Z", "to" : "'+day2[3]+'-'+mon[day2[1]]+'-'+day2[2]+'T00:00:00.000Z" }';  
    }
  }
  var wYear = maxDate.getFullYear(), wMon = maxDate.getMonth();
  for(i=weeks/4; i>=0; i--) {
    indexW[i] = indexs+wYear+'.'+monS[wMon--]+'.*';          
    if(wMon==0){
      wYear--;
      wMon = 12;      
    } 
  } 
  getData(indexW, xW, rangeW.toString(), "#week");  
  
  var indexM = [],  rangeM = [], xM = [], eYear = maxDate.getFullYear(), eMon = maxDate.getMonth();  
  var months = parseInt($('#months').val());
  var mNum = months - 1;  
  for(i=mNum; i>=0; i--){
    indexM[i] = indexs+eYear+'.'+monS[eMon]+'.*'
    if(eMon == 11){
      var year = eYear+1, mon = 0;
    } else {
      var year = eYear, mon = eMon+1;
    }
    xM[i] = eYear+'-'+monS[eMon--];    
    rangeM[i] ='{"key" : "'+xM[i] +'", "from" : "'+xM[i]+'-01T00:00:00.000Z", "to" : "'+year+'-'+monS[mon]+'-01T00:00:00.000Z" }';  
    if(eMon == 0){
      eMon = 11;
      eYear--;
    }    
  }
  getData(indexM, xM, rangeM.toString(), "#month");    

  console.log(weeks, months);
}

function getData(index, x, range, name) {    
   $.ajax({
    url: "/reports/restapi/getMultiIndexCount" ,
    dataType: "json",
    type: "get",
    data: { index : index, range : range  },
    success: function(result) {
      // console.log(result);        
      if (result.rtnCode.code == "0000") {                            
        console.log(result.rtnData);
        drawChart(result.rtnData.group_by_x.buckets, x, name);          
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

function drawChart(rtnData, xD, name) {      
  var data = [];
  var max = 0;
  for(i=0; i<xD.length; i++) {        
    var d = rtnData[xD[i]];
    var e = d.aggs.buckets[0] ;    
   data.push({ "date" : xD[i], "1s" : d.by_type.buckets.s1.doc_count, "3s" : d.by_type.buckets.s3.doc_count, "5s" : d.by_type.buckets.s5.doc_count, "slow" : d.by_type.buckets.slow.doc_count, "error" : e.doc_count});
   if(max < e.doc_count){
    max = e.doc_count;
   }
  }
  console.log(data);

  var margin = {top: 20, right: 40, bottom: 30, left:50},
    width = window.innerWidth*0.44 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([5, width-90], .1);

  var y = d3.scale.linear()
      .rangeRound([height, 0]);

  y1 = d3.scale.linear().range([height, 0]).domain([0,max*2]);//marks can have min 0 and max 100

  var yAxisRight = d3.svg.axis().scale(y1)
      .orient("right").ticks(5); 

  var color = d3.scale.ordinal()
      .range(["#EDC951",  "#31a354", "#00A0B0", "#FFB2F5"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");
      //.tickFormat(d3.format(".2s"));

// Define the div for the tooltip
  var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

  var svg = d3.select(name).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date" && key !=="error"; }));
    data.forEach(function(d) {
      var y0 = 0;
      d.group = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
      d.total = d.group[d.group.length - 1].y1;
    });    
    
    x.domain(data.map(function(d) { return d.date; }));
    //stores toltal headcount
    y.domain([0, d3.max(data, function(d) { return d.total; })]);
    
    //line function for averageLine
    var averageline = d3.svg.line()
        .x(function(d) { return x(d.date) + x.rangeBand()/2; })
        .y(function(d) { return y1(d.error); });

    //this will make the y axis to teh right
    svg.append("g")       
          .attr("class", "y axis")  
          .attr("transform", "translate(" + (width-88) + " ,0)") 
          .style("fill", "red")   
          .call(yAxisRight);
          
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Count");

    var state = svg.selectAll(".state")
        .data(data)
      .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x(d.date) + ",0)"; });
    //adding the rect for group chart
    state.selectAll("rect")
        .data(function(d) {         
          return d.group; })
      .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("x", function(d) {return x(d.name);})
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .style("fill", function(d) { return color(d.name); })
        .on("mouseover", function(d) {    
            div.transition()    
                .duration(200)    
                .style("opacity", .9);    
            div .html(d.name + " : "  + d.y1)  
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });


    svg.append("path")        // Add the valueline path.
          .attr("d", averageline(data));

    // Add the scatterplot
    svg.selectAll("dot")  
        .data(data)     
    .enter().append("circle")               
        .attr("r", 6)   
        .attr("cx", function(d) { return x(d.date) + x.rangeBand()/2; })     
        .style("opacity", .1)
        .attr("cy", function(d) { return y1(d.error); })   
        .on("mouseover", function(d) {    
            div.transition()    
                .duration(200)    
                .style("opacity", .9);    
            div.html("error : "  + d.error)  
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });
    

    //add teh legend
    var legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
        


}

