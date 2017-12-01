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
  console.log(data)
  $('#tbody').empty();  
  var sb = new StringBuffer();
  var style3 = 'style="text-align:center;"';
  sb.append('<table class="table table-striped table-bordered">');  
  sb.append('<tr style="background-color:#353535; color:yellow;"><th '+style3+'>Notching</th><th '+style3+'>Stacking</th>');  
  sb.append('<th '+style3+'>Tab Welding</th><th '+style3+'>Packaging</th><th '+style3+'>Degassing</th></tr>');
  sb.append('<tr style="background-color:#353535; color:white;"><td '+style3+'>'+data.notching[0].dtSensed+'</td><td '+style3+'>');
  sb.append(data.stacking[0].dtSensed+'</td>');  
  sb.append('<td '+style3+'>Tab Welding</td><td '+style3+'>Packaging</td><td '+style3+'>Degassing</td></tr><tr><td>');  
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
  var testData = { availability : 91.3, performance : 82.1, quality : 99.7, overall_oee : 60 };
  testData.cid = 300;
  sb.append(innerTable(testData, 'welding'));
  sb.append('</td><td>');
  testData.overall_oee = 30;
  testData.cid = 400;
  sb.append(innerTable(testData, 'packaging'));
  sb.append('</td><td>');
  testData.overall_oee = 10;
  testData.cid = 500;
  sb.append(innerTable(testData, 'degassing'));
  sb.append('</td></tr></table>');    
  $('#tbody').append(sb.toString());
  for(i=0; i<data.notching.length; i++){
    var max = 100; 
    gage[i] = getGaguChart("gage"+i, max, 'green', data.notching[i].overall_oee, size);  
  }
  for(i=0; i<data.stacking.length; i++){
    var max = 100; 
    gage[i+data.notching.length] = getGaguChart("gage"+(i+data.notching.length), max, 'green', data.stacking[i].overall_oee, size);
  }
  var i = data.notching.length+data.stacking.length; 
  gage[i] = getGaguChart("gage"+i, max, 'green', 0.6, size);
  gage[++i] = getGaguChart("gage"+i, max, 'green', 0.3, size);
  gage[++i] = getGaguChart("gage"+i, max, 'green', 0.1, size);  
}

function innerTable(data, type){
  //var style = 'style="color:'+color+'; text-align:'+align+'; font-weight:bold;"';
  var state = ['active', 'idle', 'alarm'];
  data.state = state[Math.floor(Math.random() * 10)%3]  
  var alarm = (data.state=='active')?'green':(data.state=='idle')?'blue':'red';
  var color = (data.overall_oee>=0.7)?'#6ABC64':(data.overall_oee>=0.5)?'#79ABFF':'#FF7E7E';  
  var sb = '<table class="table table-striped table-bordered" onclick="location.href=';
  sb += "'info?date="+getParameterByName('date')+'&type='+type+'&state='+data.state+'&cid='+data.cid+"'"+'">';
  console.log(sb);
  sb += '<tr style="background-color:'+alarm+'"><td colspan="3" style="color:white; text-align:center;" >';
  sb += '<strong style="font-size:18px;">'+data.cid+'</strong><br>'+data.state+'</td></tr>';    
  sb += '<tr><td colspan="3"><div class="gage'+cnt++ +'" style="text-align:center;"></div></td></tr>';
  sb += '<tr style="background-color:'+color+'"><td>Ava<br>'+data.availability.toFixed(1)+'%</td><td>Perf<br>';
  sb += data.performance.toFixed(1)+'%</td><td>Qual<br>'+data.quality.toFixed(1)+'%</td></tr>';
  sb += '</table>'  
  return sb;
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