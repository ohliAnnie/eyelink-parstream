$(document).ready(function(e) {    
  drawGage();
  console.log('ttttttttt')
});


function drawGage(){
   var overall = new RadialProgressChart('.overall', {
    diameter: 200,
    max: 4,
    round: false,
    series: [
    {
      value: 0.75,
      color: ['yellow', '#7CFC00']
    }
    ],
    center: function (d) {
      return d.toFixed(2) + '%'
    }
  });
  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  var availability = new RadialProgressChart('.availability', {
    diameter: 200,
    max: 4,
    round: false,
    series: [
    {
      value: 2.75,
      color: ['blue', '#0054FF']
    }
    ],
    center: function (d) {
      return d.toFixed(2) + '%'
    }
  });
  
   var performance = new RadialProgressChart('.performance', {
    diameter: 200,
    max: 4,
    round: false,
    series: [
    {
      value: 0.75,
      color: ['orange', '#FF7012']
    }
    ],
    center: function (d) {
      return d.toFixed(2) + '%'
    }
  });

  var quality = new RadialProgressChart('.quality', {
    diameter: 200,
    max: 4,
    round: false,
    series: [
    {
      value: 3.75,
      color: ['green', '#1DDB16']
    }
    ],
    center: function (d) {
      return d.toFixed(2) + '%'
    }
  });
  
}


