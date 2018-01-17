$(document).ready(function(e) {
  var server = $("#server").val();      
  var type = $("#type").val();   
  if(cyclick == ''){ cyclick = "jira";  }
  var now = new Date();      
  if(server === "test-agent"||server === "pp2"){
    getAgentData(now);
    displayCountAgent();        
  } else if(server === "jira_access"){
    displayCount();        
    makeDatabyDay(now);
    drawWeekly();
  } else if(server === "all"){      
    getAllData(now.getTime());
  }
  $( "#btn_sankey" ).click(function() {      
    $( "#cy" ).slideToggle( "slide" );
  });
  $( "#btn_search" ).click(function() {          
    location.href='/dashboard/?server='+$("select[name=server]").val();        
  });
  $("#btn_timeseries").click(function(){        
    var server = $("#server").val();        
    var type = $("#type").val();                   
    if(server=="all"){
      if(cyclick == "TESTAPP") {
        location.href='/timeseries/timeseriesAgent?server=test-agent';
      } else if(cyclick == "jira") {
        location.href='/timeseries/timeseriesLog?server=jira_access';
      }
    } else {
      location.href='/timeseries/timeseries'+type+'?server='+server;
    }
  });  
  $('input[type="radio"]').on('click change', function(e) {
    var time = { '1min' : 1*60*1000, '5min' : 5*60*1000, '10min' : 10*60*1000,  '15min' : 15*60*1000, '30min' : 30*60*1000, '1hour' : 60*60*1000, '3hour' : 3*60*60*1000 };
    var server = $("#server").val();      
    var data = { date : new Date().getTime(), gap : time[e.target.id] };
    if(server == "jira_access"){          
      getDash(data);
      getMap(data);
    } else if(server == "test-agent") {        
      drawDashAgent(data);
    } else if(server == "all") { 
      if(cyclick == "jira") {
        getDash(data);            
      } else if(cyclick == "TESTAPP") {
        drawDashAgent(data);
      }
    }        
  });
});

function getAllData(day){ 
  var in_data = { url : "/dashboard/restapi/getAllMapData", type : "GET", data : { date : day } };
  ajaxTypeData(in_data, function(result){
    if (result.rtnCode.code == "0000") {                
      var elseJson = { nodes : result.nodes, edges : result.edges };                      
      getServerMap(elseJson);
    }
  }); 
}

