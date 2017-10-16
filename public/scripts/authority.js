$(function() {
  getMenu();    
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
  $('td').click( function() {
    console.log($(this).css);
    $(this).css('background', 'yellow')  
  });

}

function clickTrEvent(code){
  
  $('td').click( function() {
    console.log($(this));
    $(this).css('background', 'yellow')  
  });  
  $.ajax({
    url: "/management/restapi/getAuthMenu" ,
    dataType: "json",
    type: "get",
    data: {  code : code   },
    success: function(result) {      
      if (result.rtnCode.code == "0000") {     
        drawRoleList(result.menuAuth, result.roleList, code);
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

function drawRoleList(menuAuth, roleList, code){  
  $('#menu').empty();
  $('#role').empty();
  var sbMenu = new StringBuffer();    
  var sbRole = new StringBuffer();    
  sbMenu.append('<div id="fieldChooser" tabIndex="1"><div id="destinationFields">');
  sbRole.append('<div id="fieldChooser" tabIndex="1"><div id="sourceFields">');  
  console.log(menuAuth)
  roleList.forEach(function(d){        
    var print = true;
    for(i=0; i<menuAuth.role.length;i++){
      if(menuAuth.role[i] == d._source.role_id){                
        sbMenu.append('<div>'+d._source.role_id+'-'+d._source.role_name+'</div>');    
        print = false
      }; 
    }
    if(print){
      sbRole.append('<div>'+d._source.role_id+'-'+d._source.role_name+'</div>');      
    }    
  });  
  sbMenu.append('</div></div>');
  sbMenu.append('<button onclick="saveMenuAuth('+code+')" type="button" class="btn btn-info">Save</button>');  
  sbRole.append('</div></div>');  
  $('#menu').append(sbMenu.toString());  
  $('#role').append(sbRole.toString());  
  var $sourceFields = $("#sourceFields");
  var $destinationFields = $("#destinationFields");

  var $chooser = $("#fieldChooser").fieldChooser(sourceFields, destinationFields);    
}

function saveMenuAuth(code){
  var $sourceFields = $("#sourceFields");
  var $destinationFields = $("#destinationFields");
  var $chooser = $("#fieldChooser").fieldChooser(sourceFields, destinationFields);          

  var role = [];
  for(i=0; i<$destinationFields[0].children.length;i++){        
    role[i] = $destinationFields[0].children[i].innerText.split('-')[0];    
  } 
  console.log(menu, code)  
  $.ajax({
    url: "/management/menu_auth/"+code,
    dataType: "json",
    type: "put",
    data: {   code : code,    role : role   },
    success: function(result) {
      console.log(result);
      if (result.rtnCode.code == "D002") {        
        location.href='/management/authority';
      } else {
        $("#errormsg").html(result.message);
      }
    },
    error: function(req, status, err) {
      //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
    }
  }); 
}