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
  var data = { date : getParameterByName('date') };
  var in_data = { url : "/dashboard/restapi/getDashboardDetail", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {
      var data = result.rtnData;          
      drawTable(data)
    } 
  });  
}

function drawTable(data) {
  $('#tbody').empty();  
  var sb = new StringBuffer();
  var style3 = 'style="text-align:center;"';
  sb.append('<table class="table table-striped table-bordered">');
  sb.append('<tr style="background-color:#353535; color:white; "><th colspan=5 '+style3+'>'+data.notching[0].dtSensed+'</th></tr>');  
  sb.append('<tr style="background-color:#353535; color:yellow;"><th '+style3+'>Notching</th><th '+style3+'>Stacking</th>');
  sb.append('<th '+style3+'>Tab Welding</th><th '+style3+'>Packaging</th><th '+style3+'>Degassing</th></tr><td>');
  var style = 'style="background-color:#9E9E9E;"';
  var style2 = 'text-align:center; background-color:#9E9E9E;';  
  for(i=0; i<data.notching.length; i++) {
    sb.append(innerTable(data.notching[i], 'notching'));
  }
  sb.append('</td><td>');
  for(i=0; i<data.stacking.length; i++) {
    sb.append(innerTable(data.stacking[i], 'stacking'));
  }
  sb.append('</td><td>');
  var testData = { availability : 0.913, performance : 0.821, quality : 0.997, overall_oee : 0.6 };
  testData.cid = 300;
  sb.append(innerTable(testData, 'welding'));
  sb.append('</td><td>');
  testData.overall_oee = 0.3;
  testData.cid = 400;
  sb.append(innerTable(testData, 'packaging'));
  sb.append('</td><td>');
  testData.overall_oee = 0.1;
  testData.cid = 500;
  sb.append(innerTable(testData, 'degassing'));
  sb.append('</td></tr></table>');    
  $('#tbody').append(sb.toString());
  for(i=0; i<data.notching.length; i++){
    var max = 100; 
    gage[i] = getGaguChart("gage"+i, max, 'green', data.notching[i].overall_oee, 0.109);  
  }
  for(i=0; i<data.stacking.length; i++){
    var max = 100; 
    gage[i+data.notching.length] = getGaguChart("gage"+(i+data.notching.length), max, 'green', data.stacking[i].overall_oee, 0.109);
  }
  var i = data.notching.length+data.stacking.length; 
  gage[i] = getGaguChart("gage"+i, max, 'green', 0.6, 0.109);
  gage[++i] = getGaguChart("gage"+i, max, 'green', 0.3, 0.109);
  gage[++i] = getGaguChart("gage"+i, max, 'green', 0.1, 0.109);  
}

function innerTable(data, type){
  //var style = 'style="color:'+color+'; text-align:'+align+'; font-weight:bold;"';
  var status = ['active', 'idle', 'alarm'];
  data.status = status[Math.floor(Math.random() * 10)%3]  
  var alarm = (data.status=='active')?'green':(data.status=='idle')?'blue':'red';
  var color = (data.overall_oee>=0.7)?'#6ABC64':(data.overall_oee>=0.5)?'#79ABFF':'#FF7E7E';  
  var sb = '<table class="table table-striped table-bordered" onclick="location.href=';
  sb += "'info?date="+getParameterByName('date')+'&type='+type+'&status='+data.status+'&cid='+data.cid+"'"+'">';
  console.log(sb);
  sb += '<tr style="background-color:'+alarm+'"><td colspan="3" style="color:white; text-align:center;" ><strong style="font-size:20px;">'+data.cid+'</strong><br>'+data.status+'</td></tr>';    
  sb += '<tr><td colspan="3"><div class="gage'+cnt++ +'" style="text-align:center;"></div></td></tr>';
  sb += '<tr style="background-color:'+color+'"><td>Ava</td><td>Perf</td><td>Qual</td></tr>';
  sb += '<tr style="background-color:'+color+'"><td>'+data.availability.toFixed(3)*100+'%</td><td>'+data.performance.toFixed(3)*100+'%</td><td>'+data.quality.toFixed(3)*100+'%</td></tr>';
  sb += '</table>'  
  return sb;
}

var gage = [], cnt=0;
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