$(function() {
  getMenu();
  var $sourceFields = $("#sourceFields");
  var $destinationFields = $("#destinationFields");
  var $chooser = $("#fieldChooser").fieldChooser(sourceFields, destinationFields);  
});


function getMenu() {        
  $.ajax({
    url: "/management/restapi/getMenuList" ,
    dataType: "json",
    type: "get",
    data: {     
      type : "menu"
    },
    success: function(result) {
      if (result.rtnCode.code == "0000") {              
        drawMenuList(result.rtnData);        
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}

function drawMenuList(data){
  $('#call').empty();
  var sb = new StringBuffer();  
  sb.append('<table class="table tree-2 table-bordered table-striped table-condensed">');
  data.forEach(function(d){    
    d = d._source;    
    var name = d.name;
    if(d.upcode == "0000"){
     sb.append('<tr class="treegrid-'+ parseInt(d.code) +' treegrid-parent-'+ parseInt(d.upcode)+'"><td>'+d.name+'</td></tr>');
    } else if(d.upcode != null && (parseInt(d.code)%1000 != 0)){
      sb.append('<tr class="treegrid-'+ parseInt(d.code) +' treegrid-parent-'+ parseInt(d.upcode)+'"><td onclick="javascript:clickTrEvent('+d.code+')">'+d.name+'</td></tr>');
    } else if(d.upcode != null && (parseInt(d.code)%1000 != 0)){
      sb.append('<tr class="treegrid-'+ parseInt(d.code) +' treegrid-parent-'+ parseInt(d.upcode)+'"><td>'+d.name+'</td></tr>');
    } else {
       sb.append('<tr class="treegrid-'+ parseInt(d.code) +'"><td></td></tr>');         
    }     
  });
  sb.append('</table></div>');  
  console.log(sb.toString());
  $('#call').append(sb.toString());  
    $('.tree-2').treegrid({
    expanderExpandedClass: 'glyphicon glyphicon-minus',
    expanderCollapsedClass: 'glyphicon glyphicon-plus'
  }); 
}

function clickTrEvent(code){
  console.log(code);
  $.ajax({
    url: "/management/restapi/getRoleMenu" ,
    dataType: "json",
    type: "get",
    data: {  code : code   },
    success: function(result) {
      if (result.rtnCode.code == "0000") {     
        console.log(result);        
      } else {
        //- $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  });
}