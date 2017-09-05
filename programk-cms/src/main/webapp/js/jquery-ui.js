jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
}
/*CP 관리 저장 팝업*/
saveCpPop = function() {
$(".saveCpPop, .searchDimm").show();
$(".saveCpPop").center();
}
/*사용자 관리 저장 팝업*/
saveUserPop = function() {
$(".saveUserPop, .searchDimm").show();
$(".saveUserPop").center();
}
/*대화 저장 팝업*/
saveDialogPop = function() {
$(".saveDialogPop, .searchDimm").show();
$(".saveDialogPop").center();
}
/*수정 팝업*/
modifyPop = function() {
$(".modifyPop, .searchDimm").show();
$(".modifyPop").center();
}
/*삭제 (CP 삭제 문구) 팝업*/
delCp = function() {
$(".delCp, .searchDimm").show();
$(".delCp").center();
}
/*삭제 (사용자 삭제 문구) 팝업*/
delUser = function() {
$(".delUser, .searchDimm").show();
$(".delUser").center();
}
/*삭제 (카테고리 삭제 문구) 팝업*/
delCategory = function() {
$(".delCategory, .searchDimm").show();
$(".delCategory").center();
}
/*삭제 (대화 삭제 문구) 팝업*/
delTalk = function() {
$(".delTalk, .searchDimm").show();
$(".delTalk").center();
}
/*삭제 (호스트IP 삭제 문구) 팝업*/
delHostIP = function() {
$(".delHostIP, .searchDimm").show();
$(".delHostIP").center();
}
/*삭제 (대화) 팝업*/
delContentPop = function() {
$(".delContentPop, .searchDimm").show();
$(".delContentPop").center();
}
/*복사 (대화) 팝업*/
copyContentPop = function() {
$(".copyContentPop, .searchDimm").show();
$(".copyContentPop").center();
}
/*취소 팝업*/
cancelPop = function() {
$(".cancelPop, .searchDimm").show();
$(".cancelPop").center();
}
/*목록 팝업*/
listPop = function() {
$(".listPop, .searchDimm").show();
$(".listPop").center();
}
/*BOT ID 정상 동작 팝업*/
botCheck1 = function() {
$(".botCheck1, .searchDimm").show();
$(".botCheck1").center();
}
/*BOT ID 이상 동작 팝업*/
botCheck2 = function() {
$(".botCheck2, .searchDimm").show();
$(".botCheck2").center();
}
/*카테고리 생성 팝업*/
writeCategorySet = function() {
$(".writeCategorySet, .searchDimm").show();
$(".writeCategorySet").center();
}
/*카테고리 상세 팝업*/
viewCategorySet = function() {
$(".viewCategorySet, .searchDimm").show();
$(".viewCategorySet").center();
}
/*카테고리 수정 팝업*/
modifyCategorySet = function() {
$(".modifyCategorySet, .searchDimm").show();
$(".modifyCategorySet").center();
}
/*카테고리 생성, 수정 미입력시 팝업*/
saveCategorySet = function() {
$(".saveCategorySet, .searchDimm").show();
$(".writeCategorySet, modifyCategorySet").hide();
$(".saveCategorySet").center();
}
/*카테고리 검색 팝업*/
categorySearchPop = function() {
$(".categorySearchPop, .searchDimm").show();
$(".categorySearchPop").center();
}
/*검증 팝업*/
definitePop = function() {
$(".definitePop, .searchDimm").show();
$(".definitePop").center();
}
/*검증 샘플 입력 팝업*/
definiteWritePop = function() {
$(".definiteWritePop, .searchDimm").show();
$(".definiteWritePop").center();
}
/*검증 취소 팝업*/
definiteCancel = function() {
$(".definiteCancel, .searchDimm").show();
$(".definitePop").hide();
$(".definiteCancel").center();
}
/*검증 취소 완료 팝업*/
definiteCancelOk = function() {
$(".definiteCancelOk, .searchDimm").show();
$(".definitePop").hide();
$(".definiteCancelOk").center();
}
/*검증 완료 팝업*/
definiteOk = function() {
$(".definiteOk, .searchDimm").show();
$(".definitePop").hide();
$(".definiteOk").center();
}
/*이미지 미리보기 팝업*/
previewPop = function() {
$(".previewPop, .searchDimm").show();
$(".previewPop").center();
}
/*시뮬레이터 팝업*/
simulatorPop = function() {
$(".simulatorPop, .searchDimm").show();
$(".simulatorPop").center();
}
/*이전답변 팝업*/
answerPop = function() {
$(".answerPop, .searchDimm").show();
$(".answerPop").center();
}
/*추천질문 팝업*/
questionPop = function() {
$(".questionPop, .searchDimm").show();
$(".questionPop").center();
}
/*전처리 수정 팝업*/
modifyPretreatmentPop = function() {
$(".modifyPretreatmentPop, .searchDimm").show();
$(".modifyPretreatmentPop").center();
}
/*Properties 수정 팝업*/
modifyPropertiesPop = function() {
$(".modifyPropertiesPop, .searchDimm").show();
$(".modifyPropertiesPop").center();
}
/*Predicates 수정 팝업*/
modifyPredicatesPop = function() {
$(".modifyPredicatesPop, .searchDimm").show();
$(".modifyPredicatesPop").center();
}
/*배포 팝업*/
distributePop = function() {
$(".distributePop, .searchDimm").show();
$(".distributePop").center();
}
/*배포 완료 팝업*/
distributeOk = function() {
$(".distributeOk, .searchDimm").show();
$(".distributePop").hide();
$(".distributeOk").center();
}
/*BOT 변경 팝업*/
bootchangePop = function() {
$(".bootchangePop, .searchDimm").show();
$(".bootchangePop").center();
}
/*BOT 변경 완료 팝업*/
bootchangeOk = function() {
$(".bootchangeOk, .searchDimm").show();
$(".bootchangePop").hide();
$(".bootchangeOk").center();
}
/*저장 완료 팝업*/
saveOk = function() {
$(".saveOk, .searchDimm").show();
$(".writeCategorySet, .answerPop, .questionPop, .definiteWritePop, .modifyPretreatmentPop").hide();
$(".saveOk").center();
}
/*수정 완료 팝업*/
modifyOk = function() {
$(".modifyOk, .searchDimm").show();
$(".modifyCategorySet").hide();
$(".modifyOk").center();
}
/*삭제 완료 팝업*/
delOk = function() {
$(".delOk, .searchDimm").show();
$(".delCp, .delUser, .delCategory, .delTalk, .delHostIP").hide();
$(".delOk").center();
}
/*복사 완료 팝업*/
copyOk = function() {
$(".copyOk, .searchDimm").show();
$(".copyContentPop").hide();
$(".copyOk").center();
}
/*엑셀 업로드 팝업*/
excelUpload = function() {
$(".excelUpload, .searchDimm").show();
$(".excelUpload").center();
}
/*팝업창 닫기*/
$(document).ready(function() {
	$(".closePop").click(function() {
		$(".popLayer, .searchDimm").hide();
	});
});
/*토픽 Y 선택 - 생성*/
function radioTopics(flag) { 
	var strFlag = flag;
	var strLayer1 = document.getElementById("inputTopicsY");
	
	if (strFlag == "1")
	{
		strLayer1.style.display="block";
	} 
	else if (strFlag == "2")
	{
		strLayer1.style.display="none";
	} 
}
/*토픽 Y 선택 - 수정*/
function radioTopics2(flag) { 
	var strFlag = flag;
	var strLayer1 = document.getElementById("inputTopics2Y");
	
	if (strFlag == "1")
	{
		strLayer1.style.display="block";
	} 
	else if (strFlag == "2")
	{
		strLayer1.style.display="none";
	} 
}

function openPopup(popupUrl, popupName, w, h) {
	leftPosition = (screen.width) ? (screen.width-w)/2 : 0;
	topPosition = (screen.height) ? (screen.height-h)/2 : 0;
	option = 'height='+h+',width='+w+',top='+topPosition+',left='+leftPosition;
	window.open(popupUrl, popupName, option);
}