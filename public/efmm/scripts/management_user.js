$(document).ready(function() {
  TableManaged.init();
  $('a').click(function(event){         
    if ('deleteUser' != $(this).attr('flag')) return;        
    var id = $(this).attr('id');
    if (id == "") {
      return false;
    }
    var dataStr = "{id : "+id+"}";
      var data = JSON.parse(dataStr);
      console.log(data);
    // TODO 메시지 공통 영역으로        
    if (confirm(m.common.confirm.delete)) {
      var link = "/management/users/" + userid;          
      var dataStr = '{id : "'+id+'" }';
      var data = JSON.parse(dataStr);
      var result = ajaxTypeData(link, "DELETE", data);
    }
  });
});