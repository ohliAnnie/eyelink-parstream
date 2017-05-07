$(function(){
  $('#png-down').click(function(e){
    var sImageUrl = oScatterChart.getChartAsPNG();
    $(this).attr('href', sImageUrl);
  });
  $('#jpg-down').click(function(e){
    var sImageUrl = oScatterChart.getChartAsJPEG();
    $(this).attr('href', sImageUrl);
  });
  var date = new Date();
  if(Modernizr.canvas){
    doBigScatterChart();
  }
  var oScatterChart;
  function doBigScatterChart(){
    oScatterChart = new BigScatterChart({
      sContainerId : 'chart1',
      nWidth : 800,
      nHeight : 600,
      nXMin: date.getTime() - (2880 * 60 * 1000), nXMax: date.getTime(), // 5m : 5, 20m : 20, 1h : 60, 6h : 360, 1d : 1440, 2d : 2880
      nYMin: 0, nYMax: 10000,
      nZMin: 0, nZMax: 5,
      nBubbleSize: 3,
      nDefaultRadius : 3,
      htTypeAndColor : {
      'Success' : '#b6da54', // type name : color
      'Warning' : '#fcc666',
      'Failed' : '#fd7865',
      'Others' : '#55c7c7'
    },
    sXLabel : '(time)',
    sYLabel : '(ms)',
    fOnSelect : function(htPosition, htXY){
      console.log('fOnSelect', htPosition, htXY);
      console.time('fOnSelect');
      var aData = this.getDataByXY(htXY.nXFrom, htXY.nXTo, htXY.nYFrom, htXY.nYTo);
      console.timeEnd('fOnSelect');
      console.log('adata length', aData.length);
      //alert('Selected data count : ' + aData.length);
    }
  });
    var htDataSource = {
      sUrl : function(nFetchIndex) {
        if(nFetchIndex === 0) {
          return "http://114.111.41.36:8080/getLastScatterData.hippo";
        } else {
          return "http://114.111.41.36:8080/getScatterData.hippo";
        }
      },
      htParam : function(nFetchIndex, htLastFetchParam, htLastFetchedData) {
      // calculate parameter
      var htData;
      if(nFetchIndex === 0 || typeof(htLastFetchParam) === 'undefined' || typeof(htLastFetchedData) === 'undefined'){
        htData = {
          'application' : 'apigw-t',
          'period' : 172800000,
          'limit' : 5000
        };
      }else{
        htData = {
          'application' : 'apigw-t',
          'from' : htLastFetchedData.scatter[htLastFetchedData.scatter.length - 1].x + 1,
          'to' : date.getTime(),
          'limit' : 5000
        };
      }
      return htData;
    },
    nFetch : function(htLastFetchParam, htLastFetchedData) {
      console.log('htLastFetchParam', htLastFetchParam)
      if (htLastFetchedData.scatter.length != 0) {
        return 0;
      }
      if (htLastFetchedData.scatter[htLastFetchedData.scatter.length - 1] &&
        htLastFetchedData.scatter[htLastFetchedData.scatter.length - 1].x < date.getTime()) {
        return 0;
    }
    return -1;
  },
  htOption : {
    dataType : 'jsonp',
    jsonp : '_callback'
  }
};
oScatterChart.drawWithDataSource(htDataSource);
      // oScatterChart.drawWithDataSourceInRealtime({
      // }, 10000);
      // oScatterChart.stopRealtime();
    }

  });