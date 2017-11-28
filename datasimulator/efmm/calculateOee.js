var logger = log4js.getLogger('calculateOEE');

var fs = require('fs');
var oee = require('./oee_init.json');

function initiateOee() {
  oee.total_shift_length = 0;
  oee.total_short_break = 0;
  oee.total_meal_break = 0;
  oee.total_down_time = 0;
  oee.total_accept_pieces = 0;
  oee.total_reject_pieces = 0;

  oee.planned_production_time  = 0;
  oee.operating_time  = 0;
  oee.total_pieces  = 0;

  oee.availability = 0;
  oee.performance = 0;
  oee.quality = 0;
  oee.overall_oee = 0;

}

function calculateOee(data) {
  // logger.debug(JSON.stringify(oee));
  oee.total_shift_length += data.data[0].shift_length;
  oee.total_short_break += data.data[0].short_break;
  oee.total_meal_break += data.data[0].meal_break;
  oee.total_down_time += data.data[0].down_time;
  oee.total_accept_pieces += data.data[0].accept_pieces;
  oee.total_reject_pieces += data.data[0].reject_pieces;
  oee.planned_production_time = oee.total_shift_length - oee.total_short_break - oee.total_meal_break;
  oee.operating_time = oee.planned_production_time - oee.total_down_time;
  oee.total_expected_unit = oee.planned_production_time * data.data[0].ideal_run_rate;
  oee.total_pieces = oee.total_accept_pieces + oee.total_reject_pieces;

  oee.availability = (oee.planned_production_time == 0) ? 0 : oee.operating_time / oee.planned_production_time;
  oee.performance = (oee.operating_time == 0) ? 0 : (oee.total_pieces / oee.operating_time) / oee.ideal_run_rate;
  oee.quality = (oee.total_pieces == 0) ? 0 : oee.total_accept_pieces / oee.total_pieces;
  oee.overall_oee = oee.availability * oee.performance * oee.quality;

  data.data[0].total_shift_length = oee.total_shift_length;
  data.data[0].total_short_break = oee.total_short_break;
  data.data[0].total_meal_break = oee.total_meal_break;
  data.data[0].total_down_time = oee.total_down_time;
  data.data[0].total_accept_pieces = oee.total_accept_pieces;
  data.data[0].total_reject_pieces = oee.total_reject_pieces;
  data.data[0].planned_production_time = oee.planned_production_time;
  data.data[0].operating_time = oee.operating_time;
  data.data[0].total_expected_unit = oee.total_expected_unit;
  data.data[0].total_pieces = oee.total_pieces;
  data.data[0].availability = oee.availability;
  data.data[0].performance = oee.performance;
  data.data[0].quality = oee.quality;
  data.data[0].overall_oee = oee.overall_oee;

  logger.debug(oee);
}

module.exports.initiateOee = initiateOee;
module.exports.calculateOee = calculateOee;
