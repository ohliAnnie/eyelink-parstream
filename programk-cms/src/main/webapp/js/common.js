//달력 Datapicker 셋팅
$.datepicker.regional['ko'] = {
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
		dayNamesShort: ['일','월','화','수','목','금','토'],
		dayNamesMin: ['일','월','화','수','목','금','토'],
		dateFormat: 'yy-mm-dd', 
		firstDay: 0,
		prevText: '이전달',
		nextText: '다음달',
		closeText: '닫기',
		isRTL: false};

// 달력 지역 설정
$.datepicker.setDefaults($.datepicker.regional['ko']);

// 날자 포맷
function DateFormat(date) { 
	var year = date.getFullYear();   
	var month = pad((1 + date.getMonth()),2);  
	var day = pad(date.getDate(),2); 
	
	return  year + '-' + month + '-' + day;
}

// 날짜 비교
var DateDiff = {
    inDays: function(d1, d2) {
    	d1 = new Date(d1);
    	d2 = new Date(d2);
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*3600*1000));
    },
    inWeeks: function(d1, d2) {
    	d1 = new Date(d1);
    	d2 = new Date(d2);
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*3600*1000*7));
    },
    inMonths: function(d1, d2) {
    	d1 = new Date(d1);
    	d2 = new Date(d2);
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M+12*d2Y)-(d1M+12*d1Y);
    },
    inYears: function(d1, d2) {
    	d1 = new Date(d1);
    	d2 = new Date(d2);
        return d2.getFullYear()-d1.getFullYear();
    }
}

// n은 숫자, width는 글자수 표현
function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

//정규화에서 사용되는 특수문자 치환
function replaceCharacter(str){
	if(str != "" && str.length == 1){
		str = str.replace(/[+]/g,"\\+");
		str = str.replace(/[.]/g,"\\.");
		str = str.replace(/[|]/g,"\\|");
		str = str.replace(/[*]/g,"\\*");
		str = str.replace(/[?]/g,"\\?");
		str = str.replace(/[\^]/g,"\\^");		
		str = str.replace(/[$]/g,"\\$");		
		str = str.replace(/[\/]/g,"\\/");
	}
	
	return str;
}

//중복 체크
function unique(name,text) {
	var result = [];
	var array = [];
	var message = "";
	
	if(name != ""){
		$("input[name="+ name +"]").each(function(index){
			if ($.inArray($(this).val(), result) == -1) {  // result 에서 값을 찾는다.  //값이 없을경우(-1)
				result.push($(this).val());                // result 배열에 값을 넣는다.
			}else{
				message += "," + $(this).val();
			}
		});
	}
	
	if(message != ""){
		message = text +" 필드에 `"+ message.substring(1, message.length) +"`이(가) 중복된 데이터입니다.";
	}
	
	return message;
}

//배열-문자열(&&)
function arrtostr(name,type){
	var result = "";
	
	if(name != ""){
		if(type == "select"){
			$("select[name="+ name +"]").each(function(idx){
				if(idx == 0){
					result += $('option:selected',this).val();
				}else{
					result += "&!&" + $('option:selected',this).val();
				}				
			});	
		}else{
			$("input[name="+ name +"]").each(function(idx){  
				if(idx == 0){
					result += $(this).val();
				}else{
					result += "&!&" + $(this).val();
				}				
			});	
		}		
	}	
	
	return result;
}

//XSS 특수문자 치환
function XSSCharacter(str){
	if(str != ""){
		str = str.replace(/[<]/g,"&lt;");
		str = str.replace(/[>]/g,"&gt;");
		str = str.replace(/["]/g,"&quot;");
		str = str.replace(/[']/g,"&apos;");
	}
	
	return str;
}

//Base64 인코딩
function fnBase64(str){
	var result = "";
	
	if(str == ""){
		result = "";
	}else{
		result = $.base64.encode(encodeURIComponent(str));
	}
	
	return result;
}