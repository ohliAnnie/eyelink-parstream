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
  var data = { date : getParameterByName('date'), type : getParameterByName('type'), cid : getParameterByName('cid') };
  console.log(data);
  var in_data = { url : "/dashboard/restapi/getDashboardInfo", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {
      var data = result.rtnData;          
      console.log(data);
      drawTable(data)
    } 
  });  
}
var gage = '';
function drawTable(data) {
  $('#tbody').empty();  
  var sb = new StringBuffer();
  var style3 = 'style="text-align:center;"';
  sb.append('<table class="table table-striped table-bordered">');
  sb.append('<tr style="background-color:#353535; color:white; "><th colspan=5 '+style3+'>'+data.dtTransmitted+'</th></tr>');     
  sb.append('<tr><td>')  
  sb.append(innerTable(data.data, getParameterByName('type')));    
  sb.append('</td></tr></table>');    
  $('#tbody').append(sb.toString());
  var max = 100;
  gage = getGaguChart("gage", max, 'green', data.data[0].overall_oee, 0.109);    
}

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

function innerTable(data, type){
  //var style = 'style="color:'+color+'; text-align:'+align+'; font-weight:bold;"';  
  var alarm = (data.status=='active')?'green':(data.status=='idle')?'blue':'red';
  var color = (data.overall_oee>=0.7)?'#6ABC64':(data.overall_oee>=0.5)?'#79ABFF':'#FF7E7E';  
  var sb = '<table class="table table-striped table-bordered" onclick="location.href=';
  sb += "'info?date="+getParameterByName('date')+'&type='+type+'&cid='+data.cid+"'"+'">';  
  sb += '<tr style="background-color:'+alarm+'"><td colspan="3" style="color:white; text-align:center;" ><strong style="font-size:20px;">'+data.cid+'</strong><br>'+data.status+'</td></tr>';    
  sb += '<tr><td colspan="3"><div class="gage" style="text-align:center;"></div></td></tr>';  
  sb += '</table>'  
  return sb;
}