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
      console.log(data);    
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
  sb.append('<tr style="background-color:#353535; color:white;"><td '+style3+'>'+data.notching.dtSensed+'</td><td '+style3+'>');
  sb.append(data.stacking.dtSensed+'</td>');  
  sb.append('<td '+style3+'>Tab Welding</td><td '+style3+'>Packaging</td><td '+style3+'>Degassing</td></tr><tr><td>');  
  var style = 'style="background-color:#9E9E9E;"';
  var style2 = 'text-align:center; background-color:#9E9E9E;';  
  sb.append(innerTable(data.notching, 'notching', false));
  for(i=0; i<data.notch.length; i++) {
    sb.append(innerTable(data.notch[i], 'notching', true));
  }
  sb.append('</td><td>');
  sb.append(innerTable(data.stacking, 'stacking', false));
  for(i=0; i<data.stack.length; i++) {
    sb.append(innerTable(data.stack[i], 'stacking', true));
  }
  sb.append('</td><td>');
  var testData = { availability : 0.913, performance : 0.821, quality : 0.997, overall_oee : 0.6 };
  testData.cid = 300;
  console.log(testData);
  sb.append(innerTable(testData, 'welding', false));
  sb.append('</td><td>');
  testData.overall_oee = 30;
  testData.cid = 400;
  sb.append(innerTable(testData, 'packaging', false));
  sb.append('</td><td>');
  testData.overall_oee = 10;
  testData.cid = 500;
  sb.append(innerTable(testData, 'degassing', false));
  sb.append('</td></tr></table>');    
  $('#tbody').append(sb.toString());
  var gCnt = 0;
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, 'green', data.notching.overall_oee, size);
  for(i=0; i<data.notch.length; i++){
    var max = 100; 
    gage[gCnt] = getGaguChart("gage"+gCnt++, max, 'green', data.notch[i].overall_oee, size);
  }
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, 'green', data.stacking.overall_oee, size);  
  for(i=0; i<data.stack.length; i++){
    var max = 100; 
    gage[gCnt] = getGaguChart("gage"+gCnt++, max, 'green', data.stack[i].overall_oee, size);
  }  
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, 'green', 0.6, size);
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, 'green', 0.3, size);
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, 'green', 0.1, size); 
  console.log(gage);
}

function innerTable(data, type, event){
  //var style = 'style="color:'+color+'; text-align:'+align+'; font-weight:bold;"';
  var state = ['active', 'idle', 'alarm'];
  data.state = state[Math.floor(Math.random() * 10)%3]  
  var alarm = (data.state=='active')?'green':(data.state=='idle')?'blue':'red';
  var color = (data.overall_oee>=0.7)?'#6ABC64':(data.overall_oee>=0.5)?'#79ABFF':'#FF7E7E';  
  var sb = '<table class="table table-striped table-bordered"';
  if(event){
    sb += ' onclick="location.href='+"'info?date="+getParameterByName('date')+'&type='+type+'&state='+data.state+'&cid='+data.cid+"'"+'"';
  }  
  console.log(sb);
  sb += '><tr style="background-color:'+alarm+'"><td colspan="3" style="color:white; text-align:center;" >';
  sb += '<strong style="font-size:18px;">'+data.cid+'</strong><br>'+data.state+'</td></tr>';    
  sb += '<tr><td colspan="3"><div class="gage'+cnt++ +'" style="text-align:center;"></div></td></tr>';
  sb += '<tr style="background-color:'+color+'"><td>Ava<br>'+(data.availability*100).toFixed(1)+'%</td><td>Perf<br>';
  sb += (data.performance*100).toFixed(1)+'%</td><td>Qual<br>'+(data.quality*100).toFixed(1)+'%</td></tr>';
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