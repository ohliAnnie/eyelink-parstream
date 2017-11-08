$(function() {
  getMenu();    
});
var old = '';

function getMenu() {        
  var in_data = { url :  "/management/restapi/getMenuList", type : "GET", data : { type : "menu" } };
  ajaxTypeData(in_data, function(result){
    if (result.rtnCode.code == "0000") {              
      drawMenuList(result.rtnData);
    }
  });
}

function drawMenuList(data){
  $('#call').empty();
  var sb = new StringBuffer();  
  sb.append('<table class="table tree-2 table-bordered table-striped table-condensed">');
  data.forEach(function(d){    
    var name = d._source.name;
    if(d._source.upcode == "0000"){
     sb.append('<tr class="treegrid-'+ parseInt(d._source.code) +' treegrid-parent-'+ parseInt(d._source.upcode)+'"><td>'+d._source.name+'</td></tr>');
    } else if(d._source.upcode != null && (parseInt(d._source.code)%1000 != 0)){
      sb.append('<tr class="treegrid-'+ parseInt(d._source.code) +' treegrid-parent-'+ parseInt(d._source.upcode)+'"><td id="click" onclick="javascript:clickTrEvent('+d._source.code+",'"+d._id+"'"+')">'+d._source.name+'</td></tr>');    
    } else {
       sb.append('<tr class="treegrid-'+ parseInt(d._source.code) +'"><td></td></tr>');         
    }     
  });
  sb.append('</table></div>');  
  $('#call').append(sb.toString());  
    $('.tree-2').treegrid({
    expanderExpandedClass: 'glyphicon glyphicon-minus',
    expanderCollapsedClass: 'glyphicon glyphicon-plus'
  }); 
  var old = '';
  $('td#click').click( function() {
    if(old != ''){
       old.css("background", "#fff"); //reset to original color
    }    
    $(this).css('background', "#FAED7D");
    old = $(this);
  });
}

function clickTrEvent(code, id){  
  $('td#click').click( function() {
    if(old != ''){
       old.css("background", "#fff"); //reset to original color
    }
    console.log($(this).css);
    $(this).css('background', "#FAED7D");
    old = $(this);
  });

  var data = { code : code, id : id };
  var in_data = { url : "/management/restapi/getAuthMenu", type : "GET", data : data };
  ajaxTypeData(in_data, function(result){
    if (result.rtnCode.code == "0000") {     
      drawRoleList(result.menuAuth, result.roleList, code, id);
    }
  });
}

function drawRoleList(menuAuth, roleList, code, id){  
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
        print = false;
      }; 
    }
    if(print){
      sbRole.append('<div>'+d._source.role_id+'-'+d._source.role_name+'</div>');      
    }    
  });  
  sbMenu.append('</div></div>');
  sbMenu.append('<button onclick="saveMenuAuth('+"'"+id+"',"+code+')" type="button" class="btn btn-info">Save</button>');  
  sbRole.append('</div></div>');  
  $('#menu').append(sbMenu.toString());  
  $('#role').append(sbRole.toString());  
  var $sourceFields = $("#sourceFields");
  var $destinationFields = $("#destinationFields");

  var $chooser = $("#fieldChooser").fieldChooser(sourceFields, destinationFields);    
}

function saveMenuAuth(id, code){
  var $sourceFields = $("#sourceFields");
  var $destinationFields = $("#destinationFields");
  var $chooser = $("#fieldChooser").fieldChooser(sourceFields, destinationFields);          

  var role = [];
  for(i=0; i<$destinationFields[0].children.length;i++){        
    role[i] = $destinationFields[0].children[i].innerText.split('-')[0];    
  }   

  var data = { id : id, role : role };
  var in_data = { url : "/management/menu_auth/"+code, type : "PUT", data : data };
  ajaxTypeData(in_data, function(result){
    if (result.rtnCode.code == "D002") {        
      location.href='/management/authority';
    } else {
      $("#errormsg").html(result.message);
    }    
  }); 
}