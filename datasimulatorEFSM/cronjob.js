var CronJob = require('cron').CronJob;
require('date-utils');
var simulconfig = require('./dataSimul.json');
var ds = require('./dataSimulator');

new CronJob(simulconfig.schedule.power, function() {
  var d = new Date();
  console.log('+++++++++++++++++++++++++++++++++++++++++++');
  console.log('    time : %s', d.toFormat('YYYY-MM-DD HH24:MI:SS'))
  console.log('    simulate Power Data');
  ds.process('tb_node_raw_simul.csv', false);
}, true, true, 'Asia/Seoul');

new CronJob(simulconfig.schedule.event, function() {
  console.log('+++++++++++++++++++++++++++++++++++++++++++');
  console.log('    simulate Event Data');
  ds.process('tb_node_raw_event_simul.csv', true);
}, true, true, 'Asia/Seoul');
