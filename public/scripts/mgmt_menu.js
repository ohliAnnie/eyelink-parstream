$(document).ready(function() {
  getMenu();
  TableManaged.init();      
});

function getMenu(id, date) {
  var in_data = { url : "/management/restapi/getMenuList", type : "GET", data : {} };
  ajaxTypeData(in_data, function(result){
    if (result.rtnCode.code == "0000") {              
      drawMenuList(result.rtnData);        
    }
  });
}

function drawMenuList(data){
  $('#call').empty();
  var sb = new StringBuffer();
  sb.append('<div class="portlet light bordered">');
  sb.append('<table class="table tree-2 table-bordered table-striped table-condensed">');
  data.forEach(function(d){    
    d = d._source;    
    if(d.upcode != null){
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