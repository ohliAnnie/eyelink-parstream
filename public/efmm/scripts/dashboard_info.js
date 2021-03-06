$(document).ready(function(e) {          
  getData(urlParams.date);
  $("#refresh").change(function(){
    if($("#refresh").is(":checked")){
      check = true;      
      (function loop() {      
        console.log('test')
        getData(new Date().getTime());
        if(check){
          setTimeout(loop, 30*1000);
        }
      })();      
    } else{    
      check = false;  
    }
  });

    $('#sample tbody').on( 'click', 'button', function () {
        var data = table.row( $(this).parents('tr') ).data();
        alert( data[0] +"'s salary is: "+ data[ 5 ] );
    } );
});
var check = false;

var urlParams = location.search.split(/[?&]/).slice(1).map(function(paramPair) {
    return paramPair.split(/=(.+)?/).slice(0, 2);
  }).reduce(function(obj, pairArray) {
    obj[pairArray[0]] = pairArray[1];
    return obj;
  }, {});

function getData(date){  
  var data = { date : date, type : urlParams.type, cid : urlParams.cid, state : urlParams.state };
  var in_data = { url : "/dashboard/restapi/getDashboardInfo", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {      
      var data = result.rtnData;             
      console.log(data)
      drawTable(data, result.alarmCount);
      dataTable(data);      
    } 
  });
  var data = { date : urlParams.date, cid : urlParams.cid };
  var in_data = { url : "/dashboard/restapi/getDashboardInfoStatus", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {
      var data = result.rtnData;        
      drawLineChart(data);
    } 
  });  
}

var gage = '';
function getGaguChart(id, max, color, value, size) {  
  return new RadialProgressChart('.'+id, {
    diameter: 200,
    max: max,
    round: false,
    series: [
    {
      value: value*100,
      color: ['red', color]
    }
    ],
    center: function (d) {
      return d.toFixed(1) + '%'
    },
    size : {
      width : window.innerWidth*size,
      height : window.innerWidth*size
    }
  });
}

function drawTable(data, alarmCount) {
  console.log(alarmCount)
  var color = { oee : '#1492FF', availability : '#04BBC2', performance : '#78B800', quality : '#FF5F00' };
  $('#gage').empty();
  var sbT = new StringBuffer();    
  sbT.append('<div class="detail-title"><h3>'+data.flag+' '+data.cid+'</h3>');
  sbT.append('<a class="btn btn-transparent grey-salsa btn-circle btn-sm active" href="detail?date=');
  sbT.append(urlParams.date+'">Back</a></div>');  
  sbT.append('<div class="row"><div class="chart" style="height:auto">');    
  sbT.append('<div class="gage" style="text-align:center;"></div></div>');
  sbT.append('<div class="row"><div class="col-sm-12">');  
  sbT.append('<div class="col-xs-12 label mes-status color-'+data.state+'">'+data.state);
  if(alarmCount != 0) {
    sbT.append(' <button type="button" class="btn btn-warning btn-xs" onclick="drawAlarmModal('+"'"+data.flag+"','"+data.cid+"'"+')">'+alarmCount+'</button>');
  }
  sbT.append('</div>');
  sbT.append('<table class="table table-striped table-bordered">');
  sbT.append('<tr><th>Ava</th><th>Perf</th><th>Qual</th></tr>');
  sbT.append('<tr><td>'+data.availability.toFixed(1)+'%</td><td>' + data.performance.toFixed(1));
  sbT.append('%</td><td>'+data.quality.toFixed(1)+'%</td></tr>');
  sbT.append('</table></div></div></div>'); 
  $('#gage').append(sbT.toString());
  gage = getGaguChart("gage", 100, color.oee, data.overall_oee, 0.13);    
}

function drawAlarmModal(flag, cid){  
  $('#mbody').empty();    
  var sbM = new StringBuffer(); 
  sbM.append('<div id="datatable_container" style="height:360px; overflow:auto;">')
  sbM.append('<table id="sample" class="table table-striped table-bordered table-hover">');
  sbM.append('<thead><tr><th style="text-align:center;">Date</th><th style="text-align:center;">List</th>');
  sbM.append('</tr></thead>');
  sbM.append('</table></div>');  
  $('#mbody').append(sbM.toString());        
  $('#sample').DataTable( {
    "order": [[ 0, "desc" ]],
    "searching": false,
    "processing": true,
    "serverSide": true,
    "paging" : true,
    "ajax": {
      url : "/dashboard/restapi/getAlarmListPagingInfo",
      type : 'GET',      
      data: function ( d ) {                
        d.cid = cid;
        d.flag = flag;         
        d.search_key = d.search.value;
      }      
    },
    "columns" : [{ data: "date" },
      { "targets" : -1,
        "data": null,
        "bSortable": false,
        render: function(data, type, full, meta){         
          var d = '';
          for(i=0; i<full.list.length; i++){
            if(i!=0){ d += '<br>'; }
            d += full.list[i];
          }
          return d;
        }
      }]    
  });  
  showAlarmView();
}
function showAlarmView() {      
  $('#modal-alarm').modal("show");  
}


function dataTable(data){
  console.log(data)
  $('#data').empty();
  var sbD = new StringBuffer();
  sbD.append('<table class="table table-striped table-hover">');  
  sbD.append('<tr><th><i class="icon-clock"></i> &nbsp;');
  sbD.append(data.dtSensed+'</th><th>Property</th></tr>');
  //sbD.append('<tr><td>Machine ID</td><td>'+data.cid+'</td></tr>');
  //sbD.append('<tr><td>Status</td><td>'+data.state+'</td></tr>');  
/*  sbD.append('<tr><td>OEE</td><td>'+(data.overall_oee*100).toFixed(1)+'%</td></tr>');
  sbD.append('<tr><td>Avaiability</td><td>'+data.availability.toFixed(1)+'%</td></tr>');
  sbD.append('<tr><td>Performance</td><td>'+data.performance.toFixed(1)+'%</td></tr>');
  sbD.append('<tr><td>Quality</td><td>'+data.quality.toFixed(1)+'%</td></tr>');*/
  sbD.append('<tr><td>Shift Length</td><td>'+(data.total_shift_length/60).toFixed(0)+'Min</td></tr>');
  sbD.append('<tr><td>Planned Break Time</td><td>'+Math.floor((data.total_meal_break+data.total_short_break)/60)+'Min</td></tr>');
  sbD.append('<tr><td>Down Time</td><td>'+Math.floor(data.total_down_time/60)+'Min</td></tr>');
  sbD.append('<tr><td>Planned Production Time</td><td>'+Math.floor(data.planned_production_time/60)+'Min</td></tr>');
  sbD.append('<tr><td>Ideal Run Rate</td><td>'+data.ideal_run_rate+'</td></tr>');
  sbD.append('<tr><td>Total Pieces</td><td>'+data.total_pieces+'</td></tr>');
  sbD.append('<tr><td>Good Pieces</td><td>'+data.total_accept_pieces+'</td></tr>');
  sbD.append('<tr><td>Reject Pieces</td><td>'+data.total_reject_pieces+'</td></tr>');
  //sbD.append('<tr><td colspan="2">');
  //sbD.append('</td></tr>');
  sbD.append('</table>');  
  $('#data').append(sbD.toString());
}

function drawLineChart(data) {
  var composite = dc.compositeChart("#composed");
  if(data.length != 0) {
    var minDate = new Date(data[0].measure_time);
    var maxDate = new Date(data[data.length-1].measure_time);
  } else {    
    var maxDate = new Date();
    var minDate = new Date(maxDate.getTime()-60*1000);
  }

  var ndx = crossfilter(data);

  var dim  = ndx.dimension(function(d){
    return new Date(d.measure_time);
  });

  var colorArray = ["Aqua","Aquamarine","Blue","BlueViolet","Brown","BurlyWood","CadetBlue",
                    "Chartreuse","Chocolate","Coral","Crimson","Cyan","Red","RosyBrown","RoyalBlue",
                    "DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki",
                    "DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon",
                    "DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise",
                    "DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue",
                    "ForestGreen","Gold","GoldenRod","Yellow","LightPink","LightSalmon","LightSeaGreen",
                    "Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo",
                    "Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue",
                    "LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen",
                    "LightSkyBlue","LightSlateGray","LightSlateGrey",
                    "LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine",
                    "MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen",
                    "MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin",
                    "Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen",
                    "PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue",
                    "Purple","SaddleBrown","Salmon","SandyBrown","SeaGreen",
                    "SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow",
                    "SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","YellowGreen"];

  var group = [], chart = [], cnt = 0, ccnt = 0;
  for(k in data[0]){        
    if(k=='measure_time'||k=='flag'||k=='cid'||k=='sensorType'||k=='type'){
    } else {      
      group[cnt] = makeGroup(dim, k);
      chart[cnt] = dc.lineChart(composite)
          .dimension(dim)            
          .colors(colorArray[ccnt++])
          .renderDataPoints(true)
          .group(group[cnt++], k);
    }
  }   

  composite.margins().bottom = 245;
  composite.margins().right = 55;  
  composite
    .width(window.innerWidth*0.65)
    .height(690)
    .x(d3.time.scale().domain([minDate,maxDate]))
    //.round(d3.time.day.round)
    //.x(d3.scale.linear().domain([0,data.length-1]))             
    .y(d3.scale.linear().domain([0, 90]))    
    .legend(dc.legend().x(40).y(480).itemHeight(12).itemWidth(175).gap(6).horizontal(true))
    .renderHorizontalGridLines(true)
    .title(function(d){ return this.layer+' : '+d.value; })
    .compose(chart)
    .brushOn(false)
    .render();

  
}

function makeGroup(dim, key) {
  return dim.group().reduceSum(function(d){ return d[key];})
}