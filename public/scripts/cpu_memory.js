function drawChart() {
  
  var sdate = $('#sdate').val();  
  sdate =new Date(new Date(sdate).getTime()-24*60*60*1000);
  var edate = $('#edate').val();
  console.log(sdate, edate);
  var date = [], cnt = 0;
  for(i=sdate.getTime(); i <= new Date(edate).getTime(); i+=24*60*60*1000){    
    var day = new Date(i);    
    date[cnt++] = "metricbeat-"+day.getFullYear()+'.'+(day.getMonth()+1)+'.'+day.getDate();    
  }
  var index = date.toString();
  console.log(index);


}