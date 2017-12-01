$(document).ready(function(e) {        
  getData();  
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getData(){  
  var data = { date : getParameterByName('date'), type : getParameterByName('type'), cid : getParameterByName('cid'), state : getParameterByName('state') };
  console.log(data);
  var in_data = { url : "/dashboard/restapi/getDashboardInfo", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {
      var data = result.rtnData;          
      console.log(data);
      drawTable(data);
      dataTable(data);
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

function drawTable(data) {
  $('#gage').empty();
  var sbT = new StringBuffer();
  //var style = 'style="color:'+color+'; text-align:'+align+'; font-weight:bold;"';  
  var alarm = (data.state=='active')?'green':(data.state=='idle')?'blue':'red';
  var color = (data.overall_oee>=0.7)?'#6ABC64':(data.overall_oee>=0.5)?'#79ABFF':'#FF7E7E';  
  sbT.append('<table class="table table-striped table-bordered">');  
  sbT.append('<tr style="background-color:'+alarm+'"><td colspan="3" style="color:white; text-align:center;">');
  sbT.append('<strong style="font-size:20px;">'+data.flag+' '+data.cid+'</strong><br>'+data.state+'</td></tr>');    
  sbT.append('<tr><td colspan="3"><div class="gage" style="text-align:center;"></div></td></tr>');
  sbT.append('<tr style="background-color:'+color+'"><td style="text-align:center;">Ava<br>'+data.availability.toFixed(1));
  sbT.append('%</td><td style="text-align:center;">Perf<br>'+data.performance.toFixed(1)+'%</td>');
  sbT.append('<td style="text-align:center;">Qual<br>'+data.quality.toFixed(1)+'%</td></tr>');
  sbT.append('</table>');
  $('#gage').append(sbT.toString());
  gage = getGaguChart("gage", 100, 'green', data.overall_oee, 0.13);    
}
function dataTable(data){
  $('#data').empty();
  var sbD = new StringBuffer();
  sbD.append('<table class="table table-striped table-bordered">');  
  sbD.append('<tr style="background-color:#353535; color:white;"><td colspan="2" style="text-align:center;">');
  sbD.append(data.dtSensed+'</td></tr>');
  sbD.append('<tr><th>Machine ID</th><td>'+data.flag+' '+data.cid+'</td></tr>');
  sbD.append('<tr><th>Status</th><td>'+data.state+'</td></tr>');  
  sbD.append('<tr><th>OEE</th><td>'+(data.overall_oee*100).toFixed(1)+'%</td></tr>');
  sbD.append('<tr><th>Avaiability</th><td>'+data.availability.toFixed(1)+'%</td></tr>');
  sbD.append('<tr><th>Performance</th><td>'+data.performance.toFixed(1)+'%</td></tr>');
  sbD.append('<tr><th>Quality</th><td>'+data.quality.toFixed(1)+'%</td></tr>');
  sbD.append('<tr><th>Shift Length</th><td>'+(data.total_shift_length/60).toFixed(0)+'Min</td></tr>');
  sbD.append('<tr><th>Planned Break Time</th><td>'+Math.floor((data.total_meal_break+data.total_short_break)/60)+'Min</td></tr>');
  sbD.append('<tr><th>Down Time</th><td>'+Math.floor(data.total_down_time/60)+'Min</td></tr>');
  sbD.append('<tr><th>Planned Production Time</th><td>'+Math.floor(data.planned_production_time/60)+'Min</td></tr>');
  sbD.append('<tr><th>Ideal Run Rate</th><td>'+data.ideal_run_rate+'</td></tr>');
  sbD.append('<tr><th>Total Pieces</th><td>'+data.total_pieces+'</td></tr>');
  sbD.append('<tr><th>Good Pieces</th><td>'+data.total_accept_pieces+'</td></tr>');
  sbD.append('<tr><th>Reject Pieces</th><td>'+data.total_reject_pieces+'</td></tr>');
  sbD.append('</table>');
  $('#data').append(sbD.toString());
}