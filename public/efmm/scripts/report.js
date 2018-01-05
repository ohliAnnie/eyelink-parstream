$(document).ready(function() {               
  $('#date').val(moment().format(dateFormat));      
  getData();
  drawToggle();
  $('#btn_search').click(function() {          
    getData();
    drawToggle();
  });
});

var dateFormat = 'YYYY-MM-DD';  
var color = { oee : '#1492FF', availability : '#04BBC2', performance : '#78B800', quality : '#FF5F00' };
var flag = '', cid = '';

function getData() {  
  var date = $('#date').val();
  console.log(date)
  var machine = $('#machine').val().split('_');  
  flag = machine[0], cid = machine[1];
  var data = { date : date, flag : flag, cid : cid };
  var in_data = { url : "/reports/restapi/getRangeGapData", type : "GET", data : data };  
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {                           
      drawChart(result.rtnData, result.min-2);
    } 
  });
}

function drawChart(data, min) {
  var sdate = data[0].dtSensed;
  var edate = data[data.length-1].dtSensed;

  var composite = dc.compositeChart("#composed");

  var minDate = d3.time.hour(new Date(sdate));
  var maxDate = d3.time.hour(new Date(edate));  

  var gap = (maxDate-minDate)/(24 * 60 * 60 * 1000);  
  var nyx = crossfilter(data);
  var all = nyx.groupAll();

  var timeDim = nyx.dimension(function(d){       
    return new Date(d.dtSensed);
  }); 

  var oGroup = timeDim.group().reduceSum(function(d){ return d.overall_oee; });
  var aGroup = timeDim.group().reduceSum(function(d){ return d.availability; });
  var pGroup = timeDim.group().reduceSum(function(d){ return d.performance; });
  var qGroup = timeDim.group().reduceSum(function(d){ return d.quality; });
  
  
  composite.margins().bottom = 50;
  composite.margins().right = 65;
  //composite.xAxis().tickFormat(function(v) {return week[v];});
  composite.yAxis().ticks(7);
  composite
    .width(window.innerWidth*0.88)
    .height(300)
    .x(d3.time.scale().domain([minDate,maxDate]))
    //.round(d3.time.day.round)
    //.x(d3.scale.linear().domain([0,6]))             
    .y(d3.scale.linear().domain([min, 102]))    
    .yAxisLabel("%")
    .legend(dc.legend().x(window.innerWidth*0.08).y(288).itemHeight(12).itemWidth(window.innerWidth*0.1).gap(4).horizontal(true))
    .renderHorizontalGridLines(true)
    .title(function(d){ return d.key+'\n'+this.layer+' : '+d.value+' %'; })
    .compose([
      dc.lineChart(composite)
          .dimension(timeDim)            
          .colors(color.oee)
          .renderDataPoints(true)
          .group(oGroup, "OEE"),
      dc.lineChart(composite)
          .dimension(timeDim)
          .colors(color.availability)
          .renderDataPoints(true)
          .group(aGroup, "Availability"),
      dc.lineChart(composite)
          .dimension(timeDim)
          .colors(color.performance)
          .renderDataPoints(true)
          .group(pGroup, "Performance"),
      dc.lineChart(composite)
          .dimension(timeDim)
          .colors(color.quality)
          .renderDataPoints(true)
          .group(qGroup, "Quality")                      
    ])
    .brushOn(false)
    .render();
}

function drawToggle(){
  var date = new Date($('#date').val()).getTime();
  getToggleData(date)
  $('#toggle').empty();    
  var sb = new StringBuffer(); 
  sb.append('<div data-toggle="buttons" class="btn-group btn-group-devided">');  
  for(i=date-6*24*60*60*1000; i<=date; i+=24*60*60*1000){
    var day =new Date(i);        
    if(i==date){
      sb.append('<label class="btn btn-transparent green-sharp btn-circle btn-sm active" onclick="getToggleData('+i+')">');
    } else {
      sb.append('<label class="btn btn-transparent green-sharp btn-circle btn-sm" onclick="getToggleData('+i+')">');
    }
    sb.append('<input type="radio" value ="'+i+'"checked="N" class="toggle"/>');
    sb.append(day.getMonth()+1+'/'+day.getDate()+'</label>');
  }
  sb.append('</div>');
  $('#toggle').append(sb.toString());
}

function getToggleData(date){  
  if(flag == ''){
    var machine = $('#machine').val().split('_');  
    flag = machine[0], cid = machine[1];
  }
  var data = { date : date, flag :flag, cid : cid };
  var in_data = { url : "/reports/restapi/getToggleData", type : "GET", data : data };  
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {                           
      drawToggleChart(result.rtnData, result.min-2, result.max+2);
    } 
  });
}

function drawToggleChart(data, min, max) {
  console.log(data);
  var comoee = dc.compositeChart("#oee");
  var comfactor = dc.compositeChart("#factor");

  var minDate = new Date(data[0].dtSensed);  
  var maxDate = new Date(data[data.length-1].dtSensed);  

  var nyx = crossfilter(data);
  var all = nyx.groupAll();

  var timeDim = nyx.dimension(function(d){    
    return new Date(d.dtSensed);
  }); 

  var oGroup = timeDim.group().reduceSum(function(d){ return d.overall_oee; });
  var aGroup = timeDim.group().reduceSum(function(d){ return d.availability; });
  var pGroup = timeDim.group().reduceSum(function(d){ return d.performance; });
  var qGroup = timeDim.group().reduceSum(function(d){ return d.quality; });
 
  comoee.margins().bottom = 50;
  comoee.margins().right = 35;
  //comoee.xAxis().tickFormat(function(v) {return week[v];});
  comoee.yAxis().ticks(7);
  comoee
    .width(window.innerWidth*0.36)
    .height(300)
    .x(d3.time.scale().domain([minDate,maxDate]))
    //.round(d3.time.day.round)
    //.x(d3.scale.linear().domain([0,6]))             
    .y(d3.scale.linear().domain([min, 102]))    
    .yAxisLabel("%")
    .legend(dc.legend().x(window.innerWidth*0.03).y(280).itemHeight(12).itemWidth(window.innerWidth*0.08).gap(4).horizontal(true))
    .renderHorizontalGridLines(true)
    .title(function(d){ return d.key+'\n'+this.layer+' : '+d.value+' %'; })
    .compose([
      dc.lineChart(comoee)
          .dimension(timeDim)            
          .colors(color.oee)
          .renderDataPoints(true)
          .group(oGroup, "OEE"),
      dc.lineChart(comoee)
          .dimension(timeDim)
          .colors(color.availability)
          .renderDataPoints(true)
          .group(aGroup, "Availability"),
      dc.lineChart(comoee)
          .dimension(timeDim)
          .colors(color.performance)
          .renderDataPoints(true)
          .group(pGroup, "Performance"),
      dc.lineChart(comoee)
          .dimension(timeDim)
          .colors(color.quality)
          .renderDataPoints(true)
          .group(qGroup, "Quality")                      
    ])
    .brushOn(false)
    .render();

  var group = [], chart = [], cnt = 0, ccnt = 0;
  var colorArray = ["#b15928","Aqua","DeepPink","Lime","#fb9a99","#e31a1c","#ffff99","#fdbf6f","#1f78b4","#b2df8a","#ff7f00","#33a02c","#cab2d6","#a6cee3","#6a3d9a","MediumBlue","LightCoral"];

  for(k in data[0]){        
    if(k=='dtSensed'||k=='status'||k=='cid'||k=='overall_oee'||k=='performance'||k=='quality'||k=='availability'){
    } else {      
      group[cnt] = makeGroup(timeDim, k);
      chart[cnt] = dc.lineChart(comfactor)
          .dimension(timeDim)            
          .colors(colorArray[ccnt++])
          .renderDataPoints(true)
          .group(group[cnt++], k);
    }
  }   

  //comfactor.margins().bottom = 1;
  comfactor.margins().right = 160;
  comfactor.margins().left = 48;
  //comfactor.xAxis().tickFormat(function(v) {return week[v];});
  comfactor.yAxis().ticks(7);
  comfactor
    .width(window.innerWidth*0.5)
    .height(305)
    .x(d3.time.scale().domain([minDate,maxDate]))
    //.round(d3.time.day.round)
    //.x(d3.scale.linear().domain([0,6]))             
    .y(d3.scale.linear().domain([0, max]))        
    .legend(dc.legend().x(window.innerWidth*0.38).y(20).itemHeight(12).itemWidth(180).gap(3))
    .renderHorizontalGridLines(true)
    .title(function(d){ return d.key+'\n'+this.layer+' : '+d.value; })
    .compose(chart)
    .brushOn(false)
    .render();


}

function makeGroup(dim, key) {
  return dim.group().reduceSum(function(d){ return d[key];})
}