$(document).ready(function(e) {        
  getData();  
});

var urlParams = location.search.split(/[?&]/).slice(1).map(function(paramPair) {
  return paramPair.split(/=(.+)?/).slice(0, 2);
}).reduce(function(obj, pairArray) {
  obj[pairArray[0]] = pairArray[1];
  return obj;
}, {});

function getData(){    
  var data = { flag : urlParams.flag, com1 : urlParams.com1, com2 : urlParams.com2,
               state1 : urlParams.state1, state2 : urlParams.state2  };
  var in_data = { url : "/dashboard/restapi/getDashboardCompare", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {
      var data = result.rtnData;            
      drawTable(data);
      drawGage(data);
    } 
  });  
}

var gage = [], size = 0.1, cnt = 0;
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

var color = { oee : '#1492FF', availability : '#04BBC2', performance : '#78B800', quality : '#FF5F00' };
function drawGage(data) {  
  $('#gage').empty();  
  var sb = new StringBuffer();  
  $('#gage').append(sb.toString());  
  var gCnt = 0;  
  for(i=0; i<data.length; i++){
    var max = 100;     
    gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, data[i].overall_oee, size);
  }
}

function drawTable(data) {
  console.log(data);
  $('#tbody').empty();  
  var sb = new StringBuffer();  
  sb.append('<table class="table table-hover table-mes">');  
  sb.append('<tr><th></th><td>');
  sb.append('<div class="detail-title">');
  sb.append('<a class="btn btn-transparent grey-salsa btn-circle btn-sm active" href="info?date=');
  sb.append(new Date(data[0].dtSensed).getTime()+'&type='+data[0].flag+'&state='+data[0].state+'&cid='+data[0].cid+'"> Info</a></div>');    
  sb.append('<div class="gage'+cnt++ +'" style="text-align:center;"></div></div>');
  sb.append('<div class="row"><div class="col-sm-12">');  
  sb.append('</td><td>');
  sb.append('<div class="detail-title">');
  sb.append('<a class="btn btn-transparent grey-salsa btn-circle btn-sm active" href="info?date=');
  sb.append(new Date(data[1].dtSensed).getTime()+'&type='+data[1].flag+'&state='+data[1].state+'&cid='+data[1].cid+'"> Info</a></div>');    
  sb.append('<div class="gage'+cnt++ +'" style="text-align:center;"></div></div>');
  sb.append('<div class="row"><div class="col-sm-12">');  
  sb.append('</td></tr>');    
  sb.append(drawTr(['<h4 align="center">'+data[0].flag+' '+data[0].cid+'</h4>', '<h4 align="center">'+data[1].flag+' '+data[1].cid+'</h4>'], 'MachineID', 'black'));    
  sb.append('<tr><th>Status</th><td>');
  sb.append('<div class="col-xs-12 label mes-status color-'+data[0].state+'">'+data[0].state+'</div>');
  sb.append('</td><td>');
  sb.append('<div class="col-xs-12 label mes-status color-'+data[1].state+'">'+data[1].state+'</div>');
  sb.append('</td></tr>');      
  sb.append(drawTr([(data[0].overall_oee*100).toFixed(3)+' %', (data[1].overall_oee*100).toFixed(3)+' %'], 'OEE', color.oee))
  sb.append(drawTr([data[0].availability.toFixed(3)+' %', data[1].availability.toFixed(3)+' %'], 'Availability', color.availability))
  sb.append(drawTr([data[0].performance.toFixed(3)+' %', data[1].performance.toFixed(3)+' %'], 'Performance', color.performance))
  sb.append(drawTr([data[0].quality.toFixed(3)+' %', data[1].quality.toFixed(3)+' %'], 'Quality', color.quality))
  sb.append(drawTr([data[0].total_shift_length, data[1].total_shift_length], 'Shift Length', 'black'));    
  sb.append(drawTr([data[0].total_down_time, data[1].total_down_time], 'Down Time', 'black'));  
  sb.append(drawTr([data[0].planned_production_time, data[1].planned_production_time], 'Planned Production Time', 'black'));  
  sb.append(drawTr([data[0].ideal_run_rate, data[1].ideal_run_rate], 'Ideal Run Rate', 'black'));  
  sb.append(drawTr([data[0].total_pieces, data[1].total_pieces], 'Total Pieces', 'black'));  
  sb.append(drawTr([data[0].total_accept_pieces, data[1].total_accept_pieces], 'Good Pieces', 'black'));  
  sb.append(drawTr([data[0].total_reject_pieces, data[1].total_reject_pieces], 'Reject Pieces', 'black'));  
  sb.append('</table>');    
  $('#tbody').append(sb.toString());    
}

function drawTr(data, id, color){
  var style = 'style="color:'+color+';"';
  var sb = '<tr><th>'+id+'</th>';
  for(i=0; i<data.length; i++){
    sb += '<td '+style+'>'+data[i]+'</td>';  
  }  
  sb += '</tr>';
  return sb;
}