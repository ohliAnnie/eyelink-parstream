$(document).ready(function(e) {          
  getData(urlParams.date);  
  $("#refresh").change(function(){
    if($("#refresh").is(":checked")){
      check = true;      
      (function loop() {              
        getData(new Date().getTime());
        if(check){
          setTimeout(loop, 30*1000);
        }
      })();      
    } else {    
      check = false;  
    }
  });    
});
var check = false;

var urlParams = location.search.split(/[?&]/).slice(1).map(function(paramPair) {
    return paramPair.split(/=(.+)?/).slice(0, 2);
  }).reduce(function(obj, pairArray) {
    obj[pairArray[0]] = pairArray[1];
    return obj;
  }, {});

function stackingOnChange() {  
  if(document.querySelectorAll('input[name="stacking"]:checked').length == 2){
    if (confirm(m.dashboard.confirm.compare)) {      
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
    if (confirm(m.dashboard.confirm.compare)) {      
      var value = [], cnt = 0;
      $("input[type='checkbox']:checked").each(function() {
           value[cnt++] = $(this).val().split(',');      
      });
      location.href ='compare?flag=notching&com1='+value[0][0]+'&state1='+value[0][1]+'&com2='+value[1][0]+'&state2='+value[1][1];
    }
  };
}

function getData(date){  
  var data = { date : date };
  var in_data = { url : "/dashboard/restapi/getDashboardDetail", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){  
    if (result.rtnCode.code == "0000") {    
      drawTable(result.rtnData, result.total)
    } 
  });  
}

var gCnt = 0;   
var gtest = '';
function drawTable(data, total) {
  console.log(data)
  console.log(total)
  var color = { oee : '#1492FF', availability : '#04BBC2', performance : '#78B800', quality : '#FF5F00' };  
  $('#tbody').empty();  
  var sb = new StringBuffer();  
  sb.append('<div class="col-sm-7 five-thre col-xs-12"><div class="row">');
  sb.append(drawType(data.notching, total.notching, 'Notching', 4));
  sb.append(drawType(data.stacking, total.stacking, 'Stacking', 4));
  var list = [];
  var testData = { availability : 0.913, performance : 0.821, quality : 0.997, overall_oee : 0.6 };
  testData.cid = 300;  
  testData.status = 0;
  sb.append(drawType(list, testData, 'Welding', 4));
  sb.append('</div></div>');
  sb.append('<div class="col-sm-5 five-two col-xs-12"><div class="row">');
  testData.overall_oee = 30;
  testData.cid = 400; 
  testData.status = 0; 
  sb.append(drawType(list, testData, 'Packaging', 6));
  testData.overall_oee = 10;
  testData.cid = 500; 
  testData.status = 0; 
  sb.append(drawType(list, testData, 'Degassing', 6));
  sb.append('</div></div>');  
  $('#tbody').append(sb.toString());    
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, total.notching.overall_oee, size);
  for(i=0; i<data.notching.length; i++){
    var max = 100; 
    gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, data.notching[i].overall_oee, size);
  }
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, total.stacking.overall_oee, size);  
  for(i=0; i<data.stacking.length; i++){
    var max = 100; 
    gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, data.stacking[i].overall_oee, size);
  }  
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, 0.6, size);
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, 0.3, size);
  gage[gCnt] = getGaguChart("gage"+gCnt++, max, color.oee, 0.1, size);   
}

function drawType(list, data, id, size){  
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
  data.state = (data.status > new Date().getTime()-1*60*1000)?'alarm':'active';
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
  sb += '<div class="col-xs-12 label mes-status color-'+data.state+'">'+data.state;
  if(data.alarmCount != undefined) {
    sb += ' <button type="button" class="btn btn-warning btn-xs" onclick="drawAlarmModal('+"'"+data.flag+"','"+data.cid+"'"+')">'+data.alarmCount+'</button>';
  }
  sb += '</div>';
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

function drawAlarmModal(flag, cid){  
  $('#mbody').empty();    
  var sbM = new StringBuffer(); 
  sbM.append('<div id="datatable_container" style="height:360px; overflow:auto;">')
  sbM.append('<table id="sample" class="table table-striped table-bordered table-hover">');
  sbM.append('<thead><tr><th style="text-align:center;">Date</th><th style="text-align:center;">List</th>');
  sbM.append('<th>check</th></tr></thead>');
  sbM.append('</table></div>');  
  $('#mbody').append(sbM.toString());
  $('#sample').DataTable( {
    "order": [[ 0, "desc" ]],
    "searching": false,
    "processing": true,
    "serverSide": true,
    "paging" : true,
    "ajax": {
      url : "/dashboard/restapi/getAlarmListPaging",
      type : 'GET',
      //dataType: "jsonp",
      data: function ( d ) {             
        d.cid = cid;
        d.flag = flag;         
        d.search_key = d.search.value;         
      }      
    },
    "columns" : [
      { data: "date" },
      { "targets" : -1,
        "data": null,
        render: function(data, type, full, meta){         
          var d = '';
          for(i=0; i<full.list.length; i++){
            if(i!=0){ d += '<br>'; }
            d += full.list[i];
          }
          return d;
        }
      },
   //  { data : null, "defaultContent": '<button onclick="update()">Click!</button>', "targets": -1, "bSortable": false },
      {
        "targets": -1,
        "data": null,
        render : function(data, type, full, meta){          
          if(type === 'display'){
            data =  '<button onclick="updateAlarm('+"'"+full.id+"','"+cid+"','"+flag+"'"+')">Click!</button>';
          }
          return data;
        }
     }]
  });  
  showAlarmView();
}

function showAlarmView() {      
  $('#modal-alarm').modal("show");  
}

function updateAlarm(id, cid, flag){    
  if (confirm("확인 하셨습니까?")) { 
    var data = { id : id, flag : flag, cid : cid };    
    var in_data = { url : "/dashboard/alarm/"+id, type : "PUT", data : data };
    ajaxTypeData(in_data, function(result){        
      console.log(result)
      if (confirm(result.rtnCode.message)) { 
        drawAlarmModal(flag, cid);
      }
    });  
  }
}