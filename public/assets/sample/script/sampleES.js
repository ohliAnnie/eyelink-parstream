$(function(){ 
  var date = new Date();
  var timeformat = d3.time.format('%m-%d %H:%M');

  d3.json("/sample/restapi/selectJiraAccScatter", function(error, json) { 
    var data = [];
    json.rtnData.forEach(function(d){
      console.log(d.timestamp);
      console.log(new Date(d.timestamp));
      /*data.push({
        x : new Date(d.timestamp).getTime(),
        y : d.offset,

      });*/
    });
    
  });

  var data = [];
  for(var i=date.getTime() - 17280001; i<date.getTime(); i+=173){
    var num = Math.round(_.random(0, 10000) / _.random(1, 1000));          
    data.push({
      x : i,            
      y : num,
      date : new Date(i),
      hour : d3.time.hour(new Date(i)),            
      type : _.random(0,100) < 80 ? 'Success' : (_.random(0,100) < 80 ? 'Failed' : (_.random(0,100) < 80 ? 'Warning' : 'Others')),            
      term : num < 1000 ? '1s' : (num < 3000 ? '3s' : (num < 5000 ? '5s' : (num < 7000 ? 'Slow' : 'Error'))),
      index : num < 1000 ? 0 : (num < 3000 ? 1 : (num < 5000 ? 2 : (num < 7000 ? 3 : 4)))
    });
  } 
  
  if(Modernizr.canvas){
    doBigScatterChart();
  }
  var oScatterChart;
  function doBigScatterChart(){
    oScatterChart = new BigScatterChart({
      sContainerId : 'chart1',
      nWidth : window.innerWidth*0.2,
      nHeight : 300,
      nXMin: date.getTime() - 17280001, nXMax: date.getTime(),
      nYMin: 0, nYMax: 10000,
      nZMin: 0, nZMax: 5,
      nBubbleSize: 3,
      nPaddingTop : 50,
      nDefaultRadius : 3,
      htTypeAndColor : {
        'Success' : '#b6da54', // type name : color
        'Warning' : '#fcc666',
        'Failed' : '#fd7865',
        'Others' : '#55c7c7'
      },
      sXLabel : '(time)',
      sYLabel : '(ms)',
      htGuideLine : {
        'nLineWidth' : 1,
        'aLineDash' : [2, 5],
        'nGlobalAlpha' : 0.2
      },
      sXLabel : '',
      nPaddingRight : 5,
      fOnSelect : function(htPosition, htXY){
        console.log('fOnSelect', htPosition, htXY);
        console.time('fOnSelect');
        var aData = this.getDataByXY(htXY.nXFrom, htXY.nXTo, htXY.nYFrom, htXY.nYTo);
        console.timeEnd('fOnSelect');
        console.log('adata length', aData.length);
        //alert('Selected data count : ' + aData.length);
      }
    }); 
      oScatterChart.addBubbleAndDraw(data);    
  }   
});