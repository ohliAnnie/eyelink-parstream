<%--
 Class Name  : listChatLogProcess.jsp
 Description : 로그 관리 - 로그 처리
 
 Modification Information
 수정일        수정자       수정내용
 ---------------------------------------
 2016. 12. 02. preludio     최초생성
 
 author : preludio
 since  : 2016. 12. 02.
--%>
<!-- 
   Copyright ⓒ 2016 kt corp. All rights reserved.
   
   This is a proprietary software of kt corp, and you may not use this file except in 
   compliance with license agreement with kt corp. Any redistribution or use of this 
   software, with or without modification shall be strictly prohibited without prior written 
   approval of kt corp, and the copyright notice above does not evidence any actual or 
   intended publication of such software. 
 -->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ include file="../include/commonGnb.jsp"%>

<hr class="blind">
<div class="searchGrpContent">
	<!--// 컨텐츠 시작 -->
	<div class="searchGrpContentBox content">
		<!--// 타이틀 및 위치안내 시작 -->
		<div class="titleBox">
			<h3 class="contentTitle">로그 처리</h3>
			<p class="location">홈 > 로그 조회 > 로그 처리</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->

		<!--// 정보안내 시작 -->
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> 검색기간이 길면 오래 걸릴 수 있습니다. 1주일 이내로
				검색하십시오.<br /> <span class="bul_txt">&#42;</span> 대화 처리는 현재 검색조건과는
				무관하게 동작합니다.<br />
			</p>
		</div>
		<!-- 정보안내 끝 //-->

		<!--// topContent -->
		<form id="formPageing" method="get">
			<input type="hidden" id="currentPageNo" name="currentPageNo">
			<input type="hidden" name="cpLabel" value="${search.cpLabel}">
			<input type="hidden" name="searchSDate" value="${search.searchSDate}">
			<input type="hidden" name="searchEDate" value="${search.searchEDate}">
			<input type="hidden" name="userInput" value="${search.userInput}">
			<input type="hidden" name="type" value="${search.type}">
		</form>
		<form id="formSearch" method="get">
			<input type="hidden" id="currentPageNo" name="currentPageNo"
				value="${paging.pageNum}">
			<div class="topContent">
				<div class="left">
					<ul>
						<li class="title w60px">CP</li>
						<li class="content"><select class="selectmenu" id="cpLabel"
							name="cpLabel">
								<c:if test="${sessionScope.userInfo.auth == 'SAA'}">
									<option value=""
										${"" == search.cpLabel ? 'selected="selected"' : '' }>선택</option>
								</c:if>
								<c:forEach var="cp" items="${result}" varStatus="status">
									<option value="${cp.label}"
										${cp.label == search.cpLabel ? 'selected="selected"' : '' }>${cp.label}</option>
								</c:forEach>
						</select></li>

						<li class="title">기간</li>
						<li class="content"><input type="text" class="from iconDate w100px" id="searchSDate" name="searchSDate"
							value="${search.searchSDate}"> ~ <input type="text"
							class="to iconDate w100px" id="searchEDate" name="searchEDate"
							value="${search.searchEDate}">
							<div class="checkDay">
								<span class="padL5">최근</span>
								<a href="#" onclick="fnSetDate(3);return false;" class="btnBg">3일</a>
								<a href="#" onclick="fnSetDate(7);return false;" class="btnBg">7일</a>
								<a href="#" onclick="fnSetDate(15);return false;" class="btnBg">15일</a>
								<a href="#" onclick="fnSetDate(30);return false;" class="btnBg">30일</a>
							</div></li>
					</ul>
				</div>
				<div class="left clearB mgnT5">
					<ul>
						<li class="title">사용자 질문</li>
						<li class="content"><input class="w400px" type="text"
							id="userInput" name="userInput" value="${search.userInput}" /></li>
						<li class="title">상태</li>
						<li class="content"><select class="selectmenu" id="type"
							name="type">
								<option value=""
									${search.type == ""  ? 'selected="selected"' : '' }>전체</option>
								<option value="S"
									${search.type == "S" ? 'selected="selected"' : '' }>신규</option>
								<option value="P"
									${search.type == "P" ? 'selected="selected"' : '' }>검토</option>
								<option value="E"
									${search.type == "E" ? 'selected="selected"' : '' }>완료</option>
						</select></li>
					</ul>
				</div>
				<div class="btnSearch">
					<a href="#" onclick="fnSearch();return false;" class="btnBg"><span
						class="icon_search"></span>조회</a>
				</div>
			</div>
		</form>
		<!-- topContent //-->

		<!--// topButton -->
		<div class="topButton">
			<div class="left">
				<a href="#" onclick="fnUpdateAllReview(); return false;" class="btnBg"><span class="icon_use"></span>검토 처리</a>
				<a href="#" onclick="fnUpdateAllOk(); return false;" class="btnBg"><span class="icon_ok"></span>정상 처리</a>
				<a href="#" onclick="fnUploadLayer(); return false;" class="btnBg"><span class="icon_excelupload"></span>로그 업로드</a>
				<a href="#" onclick="fnUpdateLogProcessLayer(); return false;" class="btnBg"><span class="icon_ok"></span>패턴반영</a>
				<a href="#" onclick="fnDownload(); return false;" class="btnBg"><span class="icon_exceldownload"></span>다운로드</a>
			</div>
			<div class="right">
				<a href="#" onclick="fnChatLogProcess(); return false;"
					class="btnBg"><span class="icon_write"></span>대화 처리</a>
			</div>
		</div>
		<!-- topButton //-->

		<!--// 테이블 시작 -->
		<div class="tableList fixed">
			<table>
				<caption>사용자 질문, 상태, 등록일</caption>
				<colgroup>
					<col class="w1 w8p">
					<col class="w2 w15p">
					<col class="w3 w10p">
					<col class="w4 w15p">
					<col class="w5 w20p">
					<col class="w6 w7p">
					<col class="w7 w7p">
					<col class="w8 w14p">
					<col class="w9 w14p">
				</colgroup>
				<thead>
					<tr>
						<th scope="col"><input type="checkbox" id="allCheck" />NO</th>
						<th scope="col">질문</th>
						<th scope="col">카테고리</th>
						<th scope="col">대화</th>
						<th scope="col">답변</th>
						<th scope="col">요청수</th>
						<th scope="col">상태</th>
						<th scope="col">시작일</th>
						<th scope="col">종료일</th>
					</tr>
				</thead>
				<tbody>
					<c:choose>
						<c:when test="${fn:length(results) > 0}">
							<c:forEach var="item" items="${results}" varStatus="status">
								<tr>
									<td><input type="checkbox" name="chkList"
										value="${item.id}" /> ${(paging.totalCount - status.index) - ((paging.pageNum - 1) * paging.PAGESIZE)}
									</td>
									<td class="txtL eps"><nobr>
											<a href="#" onclick="fnEditLayer(${item.id});return false;"
												title="${fn:escapeXml(item.userInput)}">
												${fn:escapeXml(item.userInput)} </a>
										</nobr></td>
									<td class="txtL eps"><nobr>
											<a href="#" onclick="return false;"
												title="${fn:escapeXml(item.cateName)}">${fn:escapeXml(item.cateName)}</a>
										</nobr></td>
									<td class="txtL eps"><nobr>
											<a href="#" onclick="return false;"
												title="${fn:escapeXml(item.input)}">${fn:escapeXml(item.input)}</a>
										</nobr></td>
									<td class="txtL eps"><nobr>
											<a href="#" onclick="return false;"
												title="${fn:escapeXml(item.reply)}">${fn:escapeXml(item.reply)}</a>
										</nobr></td>
									<td>${item.count}</td>
									<td><c:choose>
											<c:when test="${item.type eq 'S'}">신규</c:when>
											<c:when test="${item.type eq 'P'}">검토</c:when>
											<c:when test="${item.type eq 'E'}">완료</c:when>
											<c:otherwise></c:otherwise>
										</c:choose></td>
									<td><fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss"
											value="${item.mdate}" /></td>
									<td><fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss"
											value="${item.xdate}" /></td>
								</tr>
							</c:forEach>
						</c:when>
						<c:otherwise>
							<tr>
								<td colspan="9">조회 항목과 일치하는 결과가 없습니다.</td>
							</tr>
						</c:otherwise>
					</c:choose>
				</tbody>
			</table>
		</div>
		<!-- 테이블 끝 //-->

		<!--// page number -->
		<%@ include file="../include/commonPaging.jsp"%>
		<!-- page number //-->

	</div>
	<!-- 컨텐츠 끝 //-->

</div>

<!-- 대화처리 팝업 시작 -->
<div class="popLayer chatLogProcessSet">
	<form id="formProcess" method="post">
		<input type="hidden" id="cpLabel" name="cpLabel" /> <input
			type="hidden" id="type" name="type" /> <input type="hidden" id="id"
			name="id" />
		<div class="popTitle">
			<h1>대화 처리</h1>
			<a href="#" onclick="return false;"
				class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
		</div>
		<div class="popTableBox">
			<div class="popTable">
				<ul>
					<li class="title">사용자 질문</li>
					<li class="content"><input type="text" id="userInput"
						name="userInput" class="w100p" readonly /></li>
				</ul>
				<ul>
					<li class="title">카테고리</li>
					<li class="content"><input type="text" id="cateName"
						name="cateName" class="w100p" readonly /></li>
				</ul>
				<ul>
					<li class="title">질문</li>
					<li class="content"><input type="text" id="input" name="input"
						class="w100p" readonly /></li>
				</ul>
				<ul>
					<li class="title">답변</li>
					<li class="content"><textarea name="reply" id="reply"
							rows="10" cols="60" readonly></textarea></li>
				</ul>
			</div>
		</div>
		<div class="bottomButton">
			<div class="right">
				<a href="#" onclick="fnupdateChatLogProcess('P');return false;"
					class="btnBg"><span class="icon_use"></span>검토 처리</a> <a href="#"
					onclick="fnupdateChatLogProcess('E');return false;" class="btnBg"><span
					class="icon_ok"></span>정상 처리</a> <a href="#"
					onclick="javascript:location.reload();" class="btnBg closePop"><span
					class="icon_cancel"></span>닫기</a>
			</div>
		</div>
	</form>
</div>
<!-- 대화처리 팝업 끝 -->

<!-- 대화보기 팝업 시작 -->
<div class="popLayer chatLogProcessEdit">
	<form id="formEdit" method="post">
		<input type="hidden" id="cpLabel" name="cpLabel" /> <input
			type="hidden" id="type" name="type" /> <input type="hidden" id="id"
			name="id" /> <input type="hidden" id="ids" name="ids" />

		<div class="popTitle">
			<h1>대화 보기</h1>
			<a href="#" onclick="return false;"
				class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
		</div>
		<div class="popTableBox">
			<div class="popTable">
				<ul>
					<li class="title">사용자 질문</li>
					<li class="content"><input type="text" id="userInput"
						name="userInput" class="w100p" readonly /></li>
				</ul>
				<ul>
					<li class="title">카테고리</li>
					<li class="content"><input type="text" id="cateName"
						name="cateName" class="w100p" readonly /></li>
				</ul>
				<ul>
					<li class="title">질문</li>
					<li class="content"><input type="text" id="input" name="input"
						class="w100p" readonly /></li>
				</ul>
				<ul>
					<li class="title">답변</li>
					<li class="content"><textarea name="reply" id="reply"
							rows="10" cols="60" readonly></textarea></li>
				</ul>
			</div>
		</div>
		<div class="bottomButton">
			<div class="right">
				<a href="#"
					onclick="fnupdateSingleChatLogProcess('P');return false;"
					class="btnBg closePop" id="formEditButtonP"><span
					class="icon_use"></span>검토 처리</a> <a href="#"
					onclick="fnupdateSingleChatLogProcess('E');return false;"
					class="btnBg closePop" id="formEditButtonE"><span
					class="icon_ok"></span>정상 처리</a> <a href="#" onclick="return false;"
					class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
			</div>
		</div>
	</form>
</div>
<!-- 대화보기 팝업 끝 -->


<!-- 업로드 팝업 시작 -->
<div class="popLayer excelUpload">
	<form id="formFile" method="post" enctype="multipart/form-data">
		<input type="hidden" name="cpLabel" id="cpLabel" />
		<div class="popTitle">
			<h1>로그 업로드</h1>
			<a href="javascript:;" class="btnBg closePopBox closePop"><span
				class="icon_closePop">닫기</span></a>
		</div>
		<div class="popContent">
			<div class="alert">
				<input type="file" name="file" class="fileUpload" />
			</div>
		</div>
		<div class="bottomButton">
			<div class="right">
				<a href="javascript:;" class="btnBg closePop"><span
					class="icon_cancel"></span>취소</a> <a href="#"
					onclick="fnUpload();return false;" class="btnBg"><span
					class="icon_ok"></span>확인</a>
			</div>
		</div>
	</form>
</div>
<!-- 업로드 팝업 끝 -->

<!-- 업로드 로딩안내 시작 -->
<div class="popLayer loading">
	<form id="formUpload" method="post">
		<input type="hidden" name="filename" id="filename" />
		<div class="popTitle">
			<h1>안내</h1>
			<a href="javascript:location.reload();" class="btnBg closePopBox"
				style="display: none;"><span class="icon_closePop">닫기</span></a>
		</div>
		<div class="popContent">
			<div class="alert">
				<p class="pointTxt">업로드중입니다.</p>
				<!-- 			<p id="errorBtn" style="display:none;">
				<a href="#" class="btnBg" onclick="fnErrorDownload(); return false;">
				<span class="icon_exceldownload"></span>결과리스트 다운로드</a>
			</p>
-->
			</div>
		</div>
		<div class="bottomButton" style="display: none;">
			<div class="right">
				<a href="javascript:location.reload();" class="btnBg closeBtn"><span
					class="icon_cancel"></span>닫기</a>
			</div>
		</div>
	</form>
</div>
<!-- 업로드 로딩안내 끝 -->

<!-- 패턴반영 팝업 시작 -->
<div class="popLayer pattern">
	<div class="popTitle">
		<h1>패턴 반영</h1>
		<a href="javascript:;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popContent">
		<div class="alert">
			반영일자 : <input type="text" class="from iconDate w100px" id="patternDate" name="patternDate" readonly="readonly">
		</div>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="javascript:;" class="btnBg closePop"><span class="icon_cancel"></span>취소</a>
			<a href="#" onclick="fnExecuteUpdateLog();return false;" class="btnBg"><span class="icon_ok"></span>확인</a>
		</div>
	</div>
</div>
<!-- 패턴반영 팝업 끝 -->

<!-- 처리 로딩안내 시작 -->
<div class="popLayer updateloading">
	<div class="popTitle">
		<h1>안내</h1>
		<a href="javascript:location.reload();" class="btnBg closePopBox"
			style="display: none;"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popContent">
		<div class="alert">
			<p class="pointTxt">반영중입니다.</p>
		</div>
	</div>
	<div class="bottomButton" style="display: none;">
		<div class="right">
			<a href="javascript:location.reload();" class="btnBg closeBtn"><span
				class="icon_cancel"></span>닫기</a>
		</div>
	</div>
</div>
<!-- 처리 로딩안내 끝 -->

<script type="text/javascript">
	
	$("#allCheck").click(function(){
		if($("#allCheck").prop("checked")) {
			$("input[name=chkList]").prop("checked",true);
		} else {
			$("input[name=chkList]").prop("checked",false);
		}
	});
	
	//시작일
	$("#searchSDate").datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true
	});
	 
	//끝일     
	$("#searchEDate").datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true
	});
	
	//현재부터 1년까지만
	var today = new Date();
	var mindate = new Date();
	mindate.setDate(today.getDate()-365);
	
	$('#searchSDate').datepicker();
	$('#searchSDate').datepicker("option", "minDate", DateFormat(mindate));
	$('#searchSDate').datepicker("option", "maxDate", $("#searchEDate").val());    
	$('#searchSDate').datepicker("option", "onClose", function ( selectedDate ) {
	    $("#searchEDate").datepicker( "option", "minDate", selectedDate );
	});
	
	$('#searchEDate').datepicker();
	$('#searchEDate').datepicker("option", "minDate", $("#searchSDate").val());
	$('#searchEDate').datepicker("option", "onClose", function ( selectedDate ) {
	    $("#searchSDate").datepicker( "option", "maxDate", selectedDate );
	});
	
	function fnSetDate(val){    	
		var today = new Date();
		var sdate = new Date();
		var edate = new Date();
		
		sdate.setDate(today.getDate() - val);
		edate.setDate(today.getDate());
		
		$('#searchSDate').val(DateFormat(sdate));
		$('#searchEDate').val(DateFormat(edate));
	}
	
	$("#formSearch #userInput").keydown(function (key) { 
	    if(key.keyCode == 13){
	    	fnSearch();
	    	return false;
	    } 
	});
	
	var todayStr = DateFormat(new Date());
	// 패턴반영 팝업
	$("#patternDate").datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,
		maxDate: todayStr
	}).val(todayStr);

	//검색 
	function fnSearch(){
		if($("#formSearch #cpLabel").val() == ""){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		if($("#searchSDate").val() == "" || $("#searchEDate").val() == ""){
			alert("기간을 확인해주세요.");
			return false;
		}
		
		$("#formSearch #currentPageNo").val(1);
		$("#formSearch").attr("action", "<c:url value='/listChatLogProcess'/>");
		$("#formSearch").submit();
	}
	
	//목록 - 페이징
	function fnPage(page){		
		$("#formPageing #currentPageNo").val(page);
		$("#formPageing").attr("action", "<c:url value='/listChatLogProcess'/>");
		$("#formPageing").submit();
	}	
	
	//수정 레이어 팝업
	function fnEditLayer(id){
		$("#formEdit")[0].reset(); //초기화
		$('#formEdit #cpLabel').val($("#formSearch #cpLabel").val());
		$('#formEdit #id').val(id);
		$('#formEdit #ids').val(id);
		
		var formData = $('#formEdit').serializeArray();
		$.ajax({    		
			url: "<c:url value='/detailChatLogProcess'/>",
			data: formData, 
        	type: 'POST', 
            dataType: 'json', 
        	success : function(response){
        		var userInput = response.userInput;
        		var cateName = response.cateName;
        		var input = response.input;
        		var reply = response.reply;
        		
        		$("#formEdit #userInput").val(userInput);
        		$("#formEdit #cateName").val(cateName);
        		$("#formEdit #input").val(input);
        		$("#formEdit #reply").val(reply);

        		$(".chatLogProcessEdit, .searchDimm").show();
        		$(".chatLogProcessEdit").center();
            },
            error: function(request, status, error){
            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
            }
    	});
	}
	
	//로그 처리
	function fnChatLogProcess(){
		if($("#formSearch #cpLabel").val() == ""){
			alert("cp를 선택해주세요.");
			return false;
		}
		$("#formProcess")[0].reset(); //초기화
		$("#formProcess #cpLabel").val($("#formSearch #cpLabel").val());
		$('#formProcess #id').val(0);
		
		var formData = $('#formProcess').serializeArray();
		$.ajax({    		
			url: "<c:url value='/updateChatLogProcess'/>",
			data: formData,
        	type: 'POST',
            dataType: 'json',
        	success : function(response){
        		var status = response.status;
        		if(status == 'FAIL') {
        			alert("내역이 없습니다.");
        			return false;
        		}
        		
        		var id = response.id;
        		var userInput = response.userInput;
        		var cateName = response.cateName;
        		var input = response.input;
        		var reply = response.reply;
        		
        		$("#formProcess #id").val(id);
        		$("#formProcess #userInput").val(userInput);
        		$("#formProcess #cateName").val(cateName);
        		$("#formProcess #input").val(input);
        		$("#formProcess #reply").val(reply);
        		
        		$(".chatLogProcessSet, .searchDimm").show();
        		$(".chatLogProcessSet").center();
            },
            error: function(request, status, error){
            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
            }
    	});
	}	
	
	// 업데이트 처리
	function fnupdateChatLogProcess(type)
	{
		$("#formProcess #type").val(type);
		
		var formData = $('#formProcess').serializeArray();
		$.ajax({    		
			url: "<c:url value='/updateChatLogProcess'/>",
			data: formData,
        	type: 'POST',
            dataType: 'json',
        	success : function(response){
        		var status = response.status;
        		if(status == 'FAIL') {
        			alert("추가 내역이 없습니다.");
        			$(".chatLogProcessSet, .searchDimm").hide();
        			return false;
        		}
        		
        		var id = response.id;
        		var userInput = response.userInput;
        		var cateName = response.cateName;
        		var input = response.input;
        		var reply = response.reply;
        		
        		$("#formProcess #id").val(id);
        		$("#formProcess #userInput").val(userInput);
        		$("#formProcess #cateName").val(cateName);
        		$("#formProcess #input").val(input);
        		$("#formProcess #reply").val(reply);
            },
            error: function(request, status, error){
            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
            }
    	});
	}
	//일괄 검토 처리
	function fnUpdateAllReview() {
		if( $(":checkbox[name='chkList']:checked").length==0 ){
		    alert("검토 처리할 항목을 하나이상 체크해주세요.");
			return;
		}
		fnupdateMultiChatLogProcess('P');
		location.reload();
	}
	
	//일괄 완료 처리
	function fnUpdateAllOk() {
		if( $(":checkbox[name='chkList']:checked").length==0 ){
		    alert("정상 처리할 항목을 하나이상 체크해주세요.");
			return;
		}
		fnupdateMultiChatLogProcess('E');
		location.reload();
	}
	
	//체크된 내역 조회
	function getCheckedValues(){
		  var chked_val = "";
		  $(":checkbox[name='chkList']:checked").each(function(pi,po){
		    chked_val += ","+po.value;
		  });
		  if(chked_val!="")chked_val = chked_val.substring(1);
		  return chked_val;
	}
	
	// 업데이트 처리
	function fnupdateSingleChatLogProcess(type)
	{
		$('#formEdit #type').val(type);
		
		var formData = $('#formEdit').serializeArray();
		
		$.ajax({    		
			url: "<c:url value='/updateMultiChatLogProcess'/>",
			data: formData,
        	type: 'POST',
            dataType: 'json',
        	success : function(response){
        		var status = response.status;
        		if(status == 'FAIL') {
        			alert("업데이트 중 오류가 발생했습니다.");
        			return false;
        		}
            },
            error: function(request, status, error){
            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
            }
    	});
	}
	
	// 업데이트 처리
	function fnupdateMultiChatLogProcess(type)
	{
		var formData = {"ids":"","type":""};
		
		formData.ids = getCheckedValues();
		formData.type = type;
		
		$.ajax({    		
			url: "<c:url value='/updateMultiChatLogProcess'/>",
			data: formData,
        	type: 'POST',
            dataType: 'json',
        	success : function(response){
        		var status = response.status;
        		if(status == 'FAIL') {
        			alert("업데이트 중 오류가 발생했습니다.");
        			return false;
        		}
            },
            error: function(request, status, error){
            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
            }
    	});
	}
	
	//업로드
	function fnUploadLayer(){
		if($("#formSearch #cpLabel").val() == ""){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		$("#formFile")[0].reset(); 
		$("#formFile #cpLabel").val($("#formSearch #cpLabel").val());
		$(".excelUpload, .searchDimm").show();
		$(".excelUpload").center();
	}
	
	function fnUpload(){
		if($('#formFile').valid()){				
			var formData = new FormData($("#formFile")[0]);
			var answer = confirm("등록 하시겠습니까?");
		    if (answer == true){
		    	$.ajax({    		
		        	url : "<c:url value='/uploadChatLog'/>",
		        	data: formData, 
		        	type: 'POST', 
		            dataType: 'json', 
		            processData: false,
	        	    contentType: false,
		        	success : function(response){  
		        		if (response.status == 'FAIL') {
		        			$(".loading .pointTxt").html(response.message);        			
		                } else {
		                	$(".loading #filename").val(response.filename);
		                	$(".loading .pointTxt").html(response.message);
		                	$(".loading #errorBtn").show();
		                }
		            },
		            error: function(request, status, error){
		            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
		            },
		            beforeSend:function(){
		            	$(".excelUpload").hide();
		                $(".loading").show();
		        		$(".loading").center();
		            },
		            complete:function(){
		            	$(".loading .closePopBox").show();
		            	$(".loading .bottomButton").show();		            	
		            }
		    	});
		    }
		}
	}
	
	//로그패턴 갱신
	function fnUpdateLogProcessLayer(){
		var cpLabel = $("#formSearch #cpLabel").val();
		if(cpLabel == ""){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		$(".excelUpload, .searchDimm").show();
		$(".excelUpload").hide();
        $(".pattern").show();
        $(".pattern").center();
	}
	
	function fnExecuteUpdateLog(){
		var cpLabel = $("#formSearch #cpLabel").val();
		if(cpLabel == ""){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		var dateStr = $("#patternDate").val();
		if(dateStr == ""){
			alert("갱신 일자를 선택해주세요.");
			return false;
		}
		
		var params = {cpLabel: cpLabel, date:dateStr};
		if (confirm("반영 하시겠습니까?")){
			$(".pattern").hide();
			$(".excelUpload, .searchDimm").show();
			$(".excelUpload").hide();
            $(".updateloading").show();
    		$(".updateloading").center();
        	
			$.post("<c:url value='/updateLogProcessAll'/>", params, function(response) {
				if (response.status == 'FAIL') {
        			$(".updateloading .pointTxt").html(response.message);        			
                } else {
                	$(".updateloading .pointTxt").html(response.message);
                	$(".updateloading #errorBtn").show();
                }
			}).complete(function(){
				$(".updateloading .closePopBox").show();
            	$(".updateloading .bottomButton").show();		
			}).error(function(event) {
				console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
			});
		}
	}
	
	//다운로드
	function fnDownload(){
		if($("#formSearch #cpLabel").val() == ""){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		if($("#searchSDate").val() == "" || $("#searchEDate").val() == ""){
			alert("기간을 확인해주세요.");
			return false;
		}
		
		$("#formSearch").attr("action", "<c:url value='/downloadChatLogProcess'/>");
		$("#formSearch").submit();
	}
	
	//오류파일 다운로드
	function fnErrorDownload(){
		$("#formUpload").attr("action", "<c:url value='/downloadErrorChatLog'/>");
		$("#formUpload").submit();
	}
	
	//유효성 체크
	$('#form').validate({
		rules: {
			find: {required:true},
			replace: {required:true}
		},
		messages: {
			find: {
				required:"대상키워드를 확인 하세요."
			},
			replace: {
				required:"정규화키워드를 확인 하세요."
			}
		},
		onkeyup : false,           
        onclick : false,           
        onfocusout : false,          
        showErrors : function(errorMap, errorList) {
            if(errorList.length) {
                alert(errorList[0].message);
                $(errorList[0].element).focus();
            }
        }    
	});
	
	$('#formFile').validate({
		rules: {
			file: {required:true,fileext:true}
		},
		messages: {
			file: {
				required:"파일을 확인 하세요.",
				fileext:"파일는 .csv만 가능합니다."
			}
		},
		onkeyup : false,           
        onclick : false,           
        onfocusout : false,          
        showErrors : function(errorMap, errorList) {
            if(errorList.length) {
                alert(errorList[0].message);
                $(errorList[0].element).focus();
            }
        }    
	});
</script>

<%@ include file="../include/commonFooter.jsp"%>
