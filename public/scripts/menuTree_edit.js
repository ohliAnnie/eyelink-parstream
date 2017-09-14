function getMenu(id, date) {        
  $.ajax({
    url: "/management/restapi/getMenuList" ,
    dataType: "json",
    type: "get",
    data: {
      index : "management",
      type : "menu"
    },
    success: function(result) {
      if (result.rtnCode.code == "0000") {              
        drawList(result.rtnData);        
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

function drawList(data){
  $('#call').empty();
  var sb = new StringBuffer();  
  sb.append('<table class="table tree-2 table-bordered table-striped table-condensed">');
  data.forEach(function(d){    
    d = d._source;    
    if(d.upcode == "0000"){
     sb.append('<tr class="treegrid-'+ parseInt(d.code) +' treegrid-parent-'+ parseInt(d.upcode)+'"><td>'+d.name+'</td><td>'+d.code+'</td><td></td></tr>');          
    } else if(d.upcode != null){
        sb.append('<tr class="treegrid-'+ parseInt(d.code) +' treegrid-parent-'+ parseInt(d.upcode)+'"><td>'+d.name+'</td><td>'+d.code+'</td><td>');
        sb.append('<a class="btn default btn-xs balck" onclick="deleteMenu('+d.code+')"><i class="fa fa-trash-o"></i> Delete </a></td></tr>');         
    } else {
       sb.append('<tr class="treegrid-'+ parseInt(d.code) +'"><td>name</td><td>code</td><td></td></tr>');         
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

function deleteMenu(id){
  console.log('error');  
  console.log(id)  

  // TODO 메시지 공통 영역으로
  if (confirm("삭제 하시겠습니까? ")) {
    $.ajax({
      url: "/management/menu/" + id,
      dataType: "json",
      type: "DELETE",
      data: {id : id},
      success: function(result) {
        alert('(' + result.rtnCode.code + ')' +result.rtnCode.message);
        if (result.rtnCode.code == "D003") {
          location.href = "/management/menu";
        }
      },
      error: function(req, status, err) {

        //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
      }
    });
  }
}
