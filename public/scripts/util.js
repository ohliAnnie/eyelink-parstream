// 기준날짜에 일자를 더하거나 빼준다.
function addDays(date, numOfDays) {
  date.setTime(date.getTime() + (86400000 * numOfDays));
  return date;
}