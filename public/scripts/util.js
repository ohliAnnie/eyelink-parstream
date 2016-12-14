// 기준날짜에 일자를 더하거나 빼준다.
function addDays(date, numOfDays) {
  date.setTime(date.getTime() + (86400000 * numOfDays));
  return date;
}

var StringBuffer = function() {
    this.buffer = new Array();
};
StringBuffer.prototype.append = function(str) {
    this.buffer[this.buffer.length] = str;
};
StringBuffer.prototype.toString = function() {
    return this.buffer.join("");
};
