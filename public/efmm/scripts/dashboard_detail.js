$(document).ready(function(e) {          
  getData();    

  
});

function stackingOnChange() {  
  if(document.querySelectorAll('input[name="stacking"]:checked').length == 2){
    if (confirm("비교해 보시겠습니까?")) {
      console.log('go!');
      var value = [], cnt = 0;
      $("input[type='checkbox']:checked").each(function() {
        value[cnt++] = $(this).val().split(',');      
      });      
      location.href ='compare?flag=stacking&com1='+value[0][0]+'&state1='+value[0][1]+'&com2='+value[1][0]+'&state2='+value[1][1];
    }
  };  
}

function notchingOnChange(){
  if(document.querySelectorAll('input[name="notching"]:checked').length == 2){
    if (confirm("비교해 보시겠습니까?")) {
      console.log('go!');
      var value = [], cnt = 0;
      $("input[type='checkbox']:checked").each(function() {
           value[cnt++] = $(this).val().split(',');      
      });
      location.href ='compare?flag=notching&com1='+value[0][0]+'&state1='+value[0][1]+'&com2='+value[1][0]+'&state2='+value[1][1];
    }
  };
}
var urlParams = location.search.split(/[?&]/).slice(1).map(function(paramPair) {
    return paramPair.split(/=(.+)?/).slice(0, 2);
  }).reduce(function(obj, pairArray) {
    obj[pairArray[0]] = pairArray[1];
    return obj;
  }, {});

function getData(){  
  var data = { date : urlParams.date };
  var in_data = { url : "/dashboard/restapi/getDashboardDetail", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {
      var data = result.rtnData;      
      drawTable(data)
    } 
  });  
}

function drawTable(data) {
  var color = { oee : '#1492FF', availability : '#04BBC2', performance : '#78B800', quality : '#FF5F00' };  
  $('#tbody').empty();  
  var sb = new StringBuffer();  
  sb.append('<div class="col-sm-7 five-thre col-xs-12"><div class="row">');
  sb.append(drawType(data.notching, data.notch, 'Notching', 4));
  sb.append(drawType(data.stacking, data.stack, 'Stacking', 4));
  var list = [];
  var testData = { availability : 0.913, performance : 0.821, quality : 0.997, overall_oee : 0.6 };
  testData.cid = 300;  
  sb.append(drawType(testData, list, 'Welding', 4));
  sb.append('</div></div>');
  sb.append('<div class="col-sm-5 five-two col-xs-12"><div class="row">');
  testData.overall_oee = 30;
  testData.cid = 400;  
  sb.append(drawType(testData, list, 'Packaging', 6));
  testData.overall_oee = 10;
  testData.cid = 500;  
  sb.append(drawType(testData, list, 'Degassing', 6));
  sb.append('</div></div>');
  $('#tbody').append(sb.toString());  
  var gCnt = 0;
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, data.notching.overall_oee, size);
  for(i=0; i<data.notch.length; i++){
    var max = 100; 
    gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, data.notch[i].overall_oee, size);
  }
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, data.stacking.overall_oee, size);  
  for(i=0; i<data.stack.length; i++){
    var max = 100; 
    gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, data.stack[i].overall_oee, size);
  }  
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, 0.6, size);
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, 0.3, size);
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, 0.1, size);   
}
function drawType(data, list, id, size){
  var sb = '<div class="col-sm-'+size+' col-xs-12"><div class="portlet light bordered"><div class="portlet-title">';
  sb += '<div class="caption font-dark"> <span class="caption-subject">'+id+'</span><br></div>';
  sb += '<div class="tools"><a href="javascript:;" class="collapse"></a><a href="javascript:;" class="fullscreen"></a></div></div>';
  sb += '<div class="portlet-body chart-mes mes-detail">';
  sb += innerTable(data, false);
  sb += '</div></div>';    
  if(list.length != 0) {
    sb += '<div class="portlet light bordered">';
    for(i=0; i<list.length; i++) {
      sb += '<div class="portlet-body chart-mes mes-detail">';
      sb += innerTable(list[i], true);
      sb += '</div>';
    }  
    sb += '</div>';
  }
  sb += '</div>';
  return sb;
}
function innerTable(data, event){
  //var style = 'style="color:'+color+'; text-align:'+align+'; font-weight:bold;"';  
  var state = ['active', 'alarm'];
  data.state = state[Math.floor(Math.random() * 10)%2];  
  var sb = '';
  if(event){
    sb += '<input type="checkbox" name="'+data.flag+'" value="'+data.id+','+data.state+'" onchange="'+data.flag+'OnChange()" ><br>';
    sb += '<div class="detail-title"><h3>'+data.flag+' '+data.cid+'</h3>';
    sb += '<a class="btn btn-transparent grey-salsa btn-circle btn-sm active" href="info?date=';
    sb += urlParams.date+'&type='+data.flag+'&state='+data.state+'&cid='+data.cid+'"> Info</a></div>';
  }
  sb += '<div class="row"><div class="chart">'; 
  sb += '<div class="gage'+cnt++ +'" style="text-align:center;"></div></div>';
  sb += '<div class="row"><div class="col-sm-12">';
  sb += '<div class="col-xs-12 label mes-status color-'+data.state+'">'+data.state+'</div>';
  sb += '<div class="col-xs-12">'
  sb += '<table class="table table-striped table-bordered">';
  sb += '<tr><th>Ava</th><th>Perf</th><th>Qual</th></tr>';
  sb += '<tr><td>'+(data.availability*100).toFixed(1)+'%</td><td>' + (data.performance*100).toFixed(1);
  sb += '%</td><td>'+(data.quality*100).toFixed(1)+'%</td></tr>';
  sb += '</table></div></div></div></div>';  
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