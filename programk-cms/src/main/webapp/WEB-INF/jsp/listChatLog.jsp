<%--
 Class Name  : listChatLog.jsp
 Description : 로그관리 - 대화로그
 
 Modification Information
 수정일      수정자       수정내용
 ---------------------------------------
 2016. 7. 1. Young     최초생성
 
 author : Young
 since  : 2016. 7. 1.
--%>
<!-- 
   Copyright ⓒ 2016 kt corp. All rights reserved.
   
   This is a proprietary software of kt corp, and you may not use this file except in 
   compliance with license agreement with kt corp. Any redistribution or use of this 
   software, with or without modification shall be strictly prohibited without prior written 
   approval of kt corp, and the copyright notice above does not evidence any actual or 
   intended publication of such software. 
 -->
<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ include file="../include/commonGnb.jsp" %>

<hr class="blind">
<div class="searchGrpContent">
	<!--// 컨텐츠 시작 -->
	<div class="searchGrpContentBox content">
		<!--// 타이틀 및 위치안내 시작 -->
		<div class="titleBox">
			<h3 class="contentTitle">대화 로그</h3>
			<p class="location">
				홈 > 로그 조회 > 대화 로그
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->
		
		<!--// 정보안내 시작 -->
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> 대화 로그는 최대 3개월 단위로만 검색이 가능합니다.<br/>
				<span class="bul_txt">&#42;</span> 1년이 지난 대화 로그는 자동으로 삭제되므로 검색할 수 없습니다.<br/>
			</p>
		</div>
		<!-- 정보안내 끝 //-->

		<!--// topContent -->
		<form id="formPageing" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo">
		<input type="hidden" name="cpLabel" value="${search.cpLabel}">
		<input type="hidden" name="searchSDate" value="${search.searchSDate}">
		<input type="hidden" name="searchEDate" value="${search.searchEDate}">
		<input type="hidden" name="searchType" value="${search.searchType}">
		<input type="hidden" name="searchKeyword" value="${search.searchKeyword}">
		<input type="hidden" name="exSearchType" value="${search.exSearchType}">
		<input type="hidden" name="exSearchKeyword" value="${search.exSearchKeyword}">
		</form>
		<form id="formSearch" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${paging.pageNum}">
		<div class="topContent">
			<div class="left">
				<ul>
					<li class="title w60px">CP</li>
					<li class="content">
						<select class="selectmenu" id="cpLabel" name="cpLabel">
							<c:if test="${sessionScope.userInfo.auth == 'SAA'}">
							<option value="" ${"" == search.cpLabel ? 'selected="selected"' : '' }>선택</option>
							</c:if>
							<c:forEach var="cp" items="${result}" varStatus="status">		
								<option value="${cp.label}" ${cp.label == search.cpLabel ? 'selected="selected"' : '' }>${cp.label}</option>
							</c:forEach>
						</select>
					</li>
					<li class="title">기간</li>
					<li class="content">
						<input type="text" class="from iconDate w100px" id="searchSDate" name="searchSDate" value="${search.searchSDate}">
						~
						<input type="text" class="to iconDate w100px" id="searchEDate" name="searchEDate" value="${search.searchEDate}">
						<div class="checkDay">
							<span class="padL5">최근</span>
							<a href="#" onclick="fnSetDate(3);return false;" class="btnBg">3일</a>
							<a href="#" onclick="fnSetDate(7);return false;" class="btnBg">7일</a>
							<a href="#" onclick="fnSetDate(15);return false;" class="btnBg">15일</a>
							<a href="#" onclick="fnSetDate(30);return false;" class="btnBg">30일</a>
						</div>
					</li>
				</ul>
			</div>
			<div class="left clearB mgnT5">
				<ul>
					<li class="title w60px">조회 항목</li>
					<li class="content">
						<select class="selectmenu" id="searchType" name="searchType">
							<option value="" ${'' == search.searchType ? 'selected="selected"' : '' }>선택</option>
							<option value="userInput" ${'userInput' == search.searchType ? 'selected="selected"' : '' }>질문</option>
							<option value="cateName" ${'cateName' == search.searchType ? 'selected="selected"' : '' }>카테고리</option>
							<option value="input" ${'input' == search.searchType ? 'selected="selected"' : '' }>대화</option>							
							<option value="reply" ${'reply' == search.searchType ? 'selected="selected"' : '' }>답변</option>
							<option value="userId" ${'userId' == search.searchType ? 'selected="selected"' : '' }>사용자 ID</option>
						</select>
						<input class="w500px" type="text" id="searchKeyword" name="searchKeyword" value="${search.searchKeyword}" />
						<span id="btnOption"></span>
				</ul>
			</div>
			<div class="left clearB mgnT5">
				<ul>
					<li class="title w60px">제외 항목</li>
					<li class="content">
						<select class="selectmenu" id="exSearchType" name="exSearchType">
							<option value="" ${'' == search.exSearchType ? 'selected="selected"' : '' }>선택</option>
							<option value="userInput" ${'userInput' == search.exSearchType ? 'selected="selected"' : '' }>질문</option>
							<option value="reply" ${'reply' == search.exSearchType ? 'selected="selected"' : '' }>답변</option>
							<option value="userId" ${'userId' == search.exSearchType ? 'selected="selected"' : '' }>사용자 ID</option>
						</select>
						<input class="w500px" type="text" id="exSearchKeyword" name="exSearchKeyword" value="${search.exSearchKeyword}" />
						<span id="btnOption"></span>
					</li>
				</ul>
			</div>
			<div class="btnSearch">
				<a href="#" onclick="fnSearch();return false;" class="btnBg"><span class="icon_search"></span>조회</a>
			</div>
		</div>
		</form>
		<!-- topContent //-->

		<!--// topButton -->
		<div class="topButton">
			<div class="right">
				<c:if test="${fn:length(results) > 0}">
				<a href="#" onclick="fnDownload(); return false;" class="btnBg"><span class="icon_exceldownload"></span>다운로드</a>
				</c:if>
			</div>
		</div>
		<!-- topButton //-->

		<!--// 테이블 시작 -->
		<div class="tableList fixed">
			<table>
				<caption>대화 로그-NO, 시간, 카테고리, 대화 ID, 질문, 답변, 사용자 ID</caption>
				<colgroup>
					<col class="w1 w5p">
					<col class="w2">
					<col class="w3">
					<col class="w4">
					<col class="w5">
					<col class="w6">
					<col class="w7">
				</colgroup>
				<thead>
					<tr>
						<th scope="col">NO</th>
						<th scope="col">질문</th>
						<th scope="col">카테고리</th>
						<th scope="col">대화</th>
						<th scope="col">답변</th>
						<th scope="col">사용자 ID</th>
						<th scope="col">시간</th>
					</tr>
				</thead>
				<tbody>
					<c:choose>
						<c:when test="${fn:length(results) > 0}">
							<c:forEach var="item" items="${results}" varStatus="status">
							<tr>
								<td>${(paging.totalCount - status.index) - ((paging.pageNum - 1) * paging.PAGESIZE)}</td>
								<td class="txtL eps"><nobr><a href="#" onclick="return false;" title="${fn:escapeXml(item.userInput)}">${fn:escapeXml(item.userInput)}</a></nobr></td>
								<td class="txtL">${item.cateName}</td>								
								<td class="txtL eps"><nobr><a href="#" onclick="return false;" title="${fn:escapeXml(item.input)}">${fn:escapeXml(item.input)}</a></nobr></td>
								<td class="txtL eps"><nobr><a href="#" onclick="return false;" title="${fn:escapeXml(item.reply)}">${fn:escapeXml(item.reply)}</a></nobr></td>
								<td class="txtL"><c:out value="${fn:substring(item.userId, 0, fn:length(item.userId)-2)}**" /></td>
								<td><fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss" value="${item.created}" /></td>
							</tr>
							</c:forEach>
						</c:when>
						<c:otherwise>
							<tr>
								<td colspan="7">등록된 내용이 없습니다.</td>
							</tr>
						</c:otherwise>
					</c:choose>					
				</tbody>
				<tfoot></tfoot>
			</table>
		</div>
		<!-- 테이블 끝 //-->

		<!--// page number -->
		<%@ include file="../include/commonPaging.jsp" %>
		<!-- page number //-->

	</div>
	<!-- 컨텐츠 끝 //-->

</div>

<!-- 카테고리 검색 팝업 시작 -->
<div class="popLayer categorySearchPop w600px">
	<div class="popTitle">
		<h1>카테고리 검색</h1>
		<a href="javascript:;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popTopContentBox">
		<iframe name="iframeCategory" src="<c:url value='/searchChatCategory'/>" width="580" height="240" marginwidth="0" marginheight="0" frameborder="no" scrolling="auto"></iframe>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="javascript:;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
		</div>
	</div>
</div>
<!-- 카테고리 검색 팝업 끝 -->

<!-- 대화 팝업 시작 -->
<div class="popLayer answerPop w600px">
	<div class="popTitle">
		<h1>대화 검색</h1>
		<a href="javascript:;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popTopContentBox">
		<iframe name="iframeThat" src="<c:url value='/searchChat'/>" width="580" height="240" marginwidth="0" marginheight="0" frameborder="no" scrolling="auto"></iframe>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="javascript:;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
		</div>
	</div>
</div>
<!-- 대화 팝업 끝 -->

<script type="text/javascript">
	$(document).ready(function(){
		fnSetSearchType("1",$("#searchType").val());	
	});
	
	//검색조건 변경시에 따라	
	$("#searchType").selectmenu({	   
	   change: function( event, data ) {
		    $("#searchKeyword").val("");
		    fnSetSearchType("0",data.item.value);		
	   }
	});
	$("#exSearchType").selectmenu({	   
	   change: function( event, data ) {
		    $("#exSearchKeyword").val("");
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
    
    function fnSetSearchType(type,val){
    	if(val == "cateName"){
			$("#searchKeyword").attr("readonly",true);
			$("#btnOption").html("<a href=\"#\" onclick=\"fnCategoryLayer();return false;\" class=\"btnBg\"><span class=\"icon_search\"></span>검색</a>");
			
			if (type == "0") fnCategoryLayer();
		}else if(val == "input"){
			$("#searchKeyword").attr("readonly",true);
			$("#btnOption").html("<a href=\"#\" onclick=\"fnAddThatLayer();return false;\" class=\"btnBg\"><span class=\"icon_search\"></span>검색</a>");
			if (type == "0") fnAddThatLayer();
		}else{
			$("#searchKeyword").attr("readonly",false);
			$("#btnOption").html("");
		}
    }
    
	//카테고리 레이어 팝업
	function fnCategoryLayer(){
		$(".categorySearchPop, .searchDimm").show();
		$(".categorySearchPop").center();
	}
	
	//카테고리 선택시
	function fnCategory(val){
		var res = val.split("|");
		$("#formSearch #searchKeyword").val(res[1]);
		$(".categorySearchPop, .searchDimm").hide();
	}
	
	//대화 레이어 팝업
	function fnAddThatLayer(){
		$(".answerPop, .searchDimm").show();
		$(".answerPop").center();
	}
	
	//대화 선택시
	function fnThat(thatId,thatInput){
		$("#formSearch #searchKeyword").val(thatInput);
		$(".answerPop, .searchDimm").hide();
	}
	
	//검색 
	function fnSearch(){
		if($("#cpLabel").val() == ""){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		if($("#searchSDate").val() == "" || $("#searchEDate").val() == ""){
			alert("기간을 확인해주세요.");
			return false;
		}
		
		if(($("#searchType").val() == "" && $("#searchKeyword").val() != "") || ($("#searchType").val() != "" && $("#searchKeyword").val() == "")){
			alert("조회 항목을 확인해주세요.");
			return false;
		}

		if(($("#exSearchType").val() == "" && $("#exSearchKeyword").val() != "") || ($("#exSearchType").val() != "" && $("#exSearchKeyword").val() == "")){
			alert("제외 항목을 확인해주세요.");
			return false;
		}
		
		if(DateDiff.inDays($("#searchSDate").val(), $("#searchEDate").val()) > 90){
			alert("최대 3개월 단위로만 검색이 가능합니다.");
			return false;
		}
		
		$("#formSearch #currentPageNo").val(1);
		$("#formSearch").attr("action", "<c:url value='/listChatLog'/>");
		$("#formSearch").submit();
	}
	
	//목록 - 페이징
	function fnPage(page){
		$("#formPageing #currentPageNo").val(page);
		$("#formPageing").attr("action", "<c:url value='/listChatLog'/>");		
		$("#formPageing").submit();
	}
	
	//다운로드
	function fnDownload(){
		if($("#cpLabel").val() == ""){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		if($("#searchSDate").val() == "" || $("#searchEDate").val() == ""){
			alert("기간을 확인해주세요.");
			return false;
		}
		
		if(($("#searchType").val() == "" && $("#searchKeyword").val() != "") || ($("#searchType").val() != "" && $("#searchKeyword").val() == "")){
			alert("조회 항목을 확인해주세요.");
			return false;
		}
		
		if(DateDiff.inDays($("#searchSDate").val(), $("#searchEDate").val()) > 90){
			alert("최대 3개월 단위로만 검색이 가능합니다.");
			return false;
		}
		
		$("#formSearch").attr("action", "<c:url value='/downloadChatLog'/>");
		$("#formSearch").submit();
	}
</script>

<%@ include file="../include/commonFooter.jsp" %>	