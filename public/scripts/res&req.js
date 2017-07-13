var cntD1 = [], cntD3 = [], cntD5 = [], cntDS = [], cntDE = [], Di = 0; 
function getData(){  
  var mon = {'Jan' : '01', 'Feb' : '02', 'Mar' : '03', 'Apr' : '04', 'May' : '05', 'Jun' : '06', 'Jul' : '07', 'Aug' : '08', 'Sep' : '09', 'Oct' : '10', 'Nov' : '11', 'Dec' : '12' };    
  var sdate = $('#sdate').val();  
  var s = sdate.split('-')
  var minDate = new Date(s[0], parseInt(s[1])-1, s[2], 0, 0, 0);
  var edate = $('#edate').val();
  var e = edate.split('-');
  var maxDate = new Date(e[0], parseInt(e[1])-1, e[2], 0, 0, 0);
  var indexD = [], cnt = 0;  
  console.log(sdate, edate);
  for(i=minDate.getTime(); i < maxDate.getTime()+24*60*60*1000; i+=24*60*60*1000){    
    var day = new Date(i).toString().split(' ');    
    indexD[cnt++] = "filebeat_jira_access-"+day[3]+'.'+mon[day[1]]+'.'+day[2];    
  }    
  getDay(indexD);  
 
  var indexW = [];
  var wStart = maxDate.getTime()-27*24*60*60*1000;
  for(i=0; i<4; i++) {
    var week = [];
    for(j=0; j<7; j++){
      var day = new Date(wStart).toString().split(' ');    
      week[j] = "filebeat_jira_access-"+day[3]+'.'+mon[day[1]]+'.'+day[2];    
      wStart += 24*60*60*1000;
    }
    indexW[i] = week;
  }
  console.log(indexW);
  var indexM = [], eYear = parseInt(e[0]), eMon = parseInt(e[1]);  
  for(i=5; i>=0; i--){
    indexM[i] = "filebeat_jira_access-"+eYear+'.'+(eMon--)+'.*'
    if(eMon == 0){
      eMon = 12;
      eYear--;
    }
  }
  console.log(indexM);  
}

function getDay(indexD) {    
  var cntD1 = [], cntD3 = [], cntD5 = [], cntDS = [], cntDE = [], Di = 0; 
  var gap = indexD.length ;
  for(i=0; i<gap; i++){
     $.ajax({
      url: "/reports/restapi/getDay1sCount" ,
      dataType: "json",
      type: "get",
      data: { index : indexD[i] },
      success: function(result) {
        // console.log(result);        
        if (result.rtnCode.code == "0000") {                            
          setDayData(Di, 0, result.rtnData, gap);          
        } else {
          //- $("#errormsg").html(result.message);
        }
      },
      error: function(req, status, err) {
        //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
      }
    });      
     $.ajax({
      url: "/reports/restapi/getDay3sCount" ,
      dataType: "json",
      type: "get",
      data: { index : indexD[i] },
      success: function(result) {
        // console.log(result);        
        if (result.rtnCode.code == "0000") {                  
          setDayData(Di, 1, result.rtnData, gap);
        } else {
          //- $("#errormsg").html(result.message);
        }
      },
      error: function(req, status, err) {
        //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
      }
    }); 
    $.ajax({
      url: "/reports/restapi/getDay5sCount" ,
      dataType: "json",
      type: "get",
      data: { index : indexD[i] },
      success: function(result) {
        // console.log(result);        
        if (result.rtnCode.code == "0000") {                  
          setDayData(Di, 2, result.rtnData, gap);
        } else {
          //- $("#errormsg").html(result.message);
        }
      },
      error: function(req, status, err) {
        //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
      }
    }); 
    $.ajax({
      url: "/reports/restapi/getDaySlowCount" ,
      dataType: "json",
      type: "get",
      data: { index : indexD[i] },
      success: function(result) {
        // console.log(result);        
        if (result.rtnCode.code == "0000") {                  
          setDayData(Di, 3, result.rtnData, gap);
        } else {
          //- $("#errormsg").html(result.message);
        }
      },
      error: function(req, status, err) {
        //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
      }
    });  
    $.ajax({
      url: "/reports/restapi/getDayErrorCount" ,
      dataType: "json",
      type: "get",
      data: { index : indexD[i] },
      success: function(result) {
        // console.log(result);        
        if (result.rtnCode.code == "0000") {                  
          setDayData(Di++, 4, result.rtnData, gap);
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
 
}


function setDayData(x, y, cnt, gap){
  switch(y) {
    case 0 :
     cntD1[x] = cnt;
     break;
    case 1 :
     cntD3[x] = cnt;
     break;
    case 2 :
     cntD5[x] = cnt;
     break;
    case 3 :
     cntDS[x] = cnt;
     break;
    case 4 : 
     cntDE[x] = cnt;
     break;
  }  
  if(y == 4 && x== (gap-1) && cntD1.length == gap && cntD3.length == gap && cntD5.length == gap && cntDS.length == gap && cntDE.length == gap) {
    dayChart(gap);
  }  
}

function dayChart(gap) {  
  var sdate = $('#edate').val();
  var s = sdate.split('-');
  var minDate = new Date(s[0], parseInt(s[1])-1, s[2], 0, 0, 0).getTime();    
  var data = [];
  for(i=0; i<gap; i++) {    
    var date = new Date(minDate - i*24*60*60*1000).toString().split(' ');
    data.push({ "date" : date[3]+'/'+date[1]+'/'+date[2], "1s" : cntD1[i], "3s" : cntD3[i], "5s" : cntD5[i], "slow" : cntDS[i], "error" : cntDE[i]});
  }
  console.log(data);

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = window.innerWidth*0.9 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width-150], .1);

  var y = d3.scale.linear()
      .rangeRound([height, 0]);

  y1 = d3.scale.linear().range([height, 0]).domain([0,100]);//marks can have min 0 and max 100

  var yAxisRight = d3.svg.axis().scale(y1)
      .orient("right").ticks(5); 

  var color = d3.scale.ordinal()
      .range(["#EDC951",  "#31a354", "#00A0B0", "#FFB2F5" , "#CC333F"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

  var svg = d3.select("#day").append("svg")
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
          .attr("transform", "translate(" + (width-100) + " ,0)") 
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
        .text("Population");

    var state = svg.selectAll(".state")
        .data(data)
      .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x(d.date) + ",0)"; });
    //adding the rect for group chart
    state.selectAll("rect")
        .data(function(d) { return d.group; })
      .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .style("fill", function(d) { return color(d.name); });

    svg.append("path")        // Add the valueline path.
          .attr("d", averageline(data));
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

