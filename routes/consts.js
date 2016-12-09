function define(name, value) {
	Object.defineProperty(exports, name, {
		value: value,
		enumerable : true,
	});
}

define("CONFIG", {
	"UPLOADPATH_OFFICE": {real: "/Users/baesunghan/git/dentalJobs/public/upload/office/",
						  relative: "/upload/office/"},
	"ROADING_DAY" : 7,
	"ROADING_TIME" : 1,
});

define(	"CODE", {
	"OFFICE_TYPE" : {"P": "개인병원", "T": "종합병원", "G": "국가기관"},
	"MEMBER_TYPE" : {"B": "PERSONAL", "C": "OFFICE"}
});

define("ERROR_CODE", {
	"0000": "SUCCESS!!!",
	"0001": "데이터가 존재하지 않습니다.",
	"E001": "일치하는 ID가 없습니다.",
	"E002": "비밀번호가 틀립니다.",
	"E003": "Upload할 파일이 없습니다.",
	"E004": "이미지 파일이 아닙니다.",
	"D001": "동일한 #1 #2가 이미 존재합니다.",
	"D002": "DB에 접속할 수 없습니다. 시스템관리자에게 연락하세요.",
	"ER_DUP_ENTRY": "Duplicate entry for key 'PRIMARY'!!!",
	"ER_BAD_NULL_ERROR": "Column 'user_id' cannot be null",
});

function getErrData(key) {
	var msg = exports.ERROR_CODE[key];
	if (typeof msg == 'undefined')
		msg = "오류 코드(" + key + ")에 대한 메시지가 정의되어 있지 않습니다..";
	return {code: key, message : msg};
}

function getCodeValue(category, key) {
	console.log(key);
	if (key == "*") {
		return exports.CODE[category];
	} else {
		return exports.CODE[category][key];
	}
}

exports.getErrData = getErrData;
exports.getCodeValue = getCodeValue;
exports.UPLOADPATH_OFFICE = exports.CONFIG["UPLOADPATH_OFFICE"];
