<%--
 Class Name  : statOrderIserInput.jsp
 Description : 통계 - 질문 통계
 
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
<%@ include file="../include/commonGnb.jsp" %>

<hr class="blind">
<div class="searchGrpContent">
	<!--// 컨텐츠 시작 -->
	<div class="searchGrpContentBox content">
		<!--// 타이틀 및 위치안내 시작 -->
		<div class="titleBox">
			<h3 class="contentTitle">질문 통계</h3>
			<p class="location">
				홈 > 통계 > 검색 순위 통계 > 질문 통계
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->
		
		<!--// 정보안내 시작 -->
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> 통계는 최대 1년 단위로만 검색이 가능합니다.<br/>
			</p>
		</div>
		<!-- 정보안내 끝 //-->

		<!--// topContent -->
		<form id="formSearch" method="get">
		<div class="topContent styleB">
			<div class="left">
				<ul>
					<li class="title">CP</li>
					<li class="content">
						<select class="selectmenu" id="label" name="label">
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
						<input type="text" class="from iconDate w100px" id="startTime" name="startTime" value="${search.startTime}"/>
						~
						<input type="text" class="to iconDate w100px" id="endTime" name="endTime" value="${search.endTime}">
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
			<div class="btnSearch">
				<a href="#" onclick="fnSearch();return false;" class="btnBg"><span class="icon_search"></span>조회</a>
			</div>
		</div>
		<!-- topContent //-->
		
		<!--// topButton -->
		<div class="topButton">
			<div class="right">
				<c:if test="${fn:length(results) > 0}">
				조회건수 : <input type="text" class="w50px" id="viewCount" name="viewCount" value="${search.viewCount}"/>
				<a href="#" onclick="fnDownload(); return false;" class="btnBg"><span class="icon_exceldownload"></span>다운로드</a>
				</c:if>
			</div>
		</div>
		</form>
		<!-- topButton //-->

		<!--// 테이블 시작 -->
		<div class="tableList fixed">
			<table>
				<caption>질문 통계-순위, 질문, 검색 건수</caption>
				<colgroup>
					<col class="w1 w10p">
					<col class="w2">
					<col class="w3">
				</colgroup>
				<thead>
					<tr>
						<th scope="col">순위</th>
						<th scope="col">질문</th>
						<th scope="col">검색 건수</th>
					</tr>
				</thead>
				<tbody>
					<c:choose>
						<c:when test="${fn:length(results) > 0}">
							<c:forEach var="item" items="${results}" varStatus="status">
							<tr>
								<td>${status.count}</td>
								<td>${item.userInput}</td>
								<td>${item.totalCnt}</td>
							</tr>
							</c:forEach>
						</c:when>
						<c:otherwise>
							<tr>
								<td colspan="3">조회 항목과 일치하는 결과가 없습니다.</td>
							</tr>
						</c:otherwise>
					</c:choose>										
				</tbody>
				<tfoot></tfoot>
			</table>
		</div>
		<!-- 테이블 끝 //-->

		<!--// bottomButton -->
		<div class="bottomButton">
			<div class="right">
				※ 성능상 최대 100건 노출. 대량 조회는 엑셀 다운로드 이용
			</div>
		</div>
		<!-- topButton //-->

	</div>
	<!-- 컨텐츠 끝 //-->

</div>

<script type="text/javascript">	
	//시작시간
	$("#startTime").datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true
	});
	 
	//종료시간
	$("#endTime").datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true
	});
	
	$('#startTime').datepicker();
	$('#startTime').datepicker("option", "maxDate", $("#endTime").val());    
	$('#startTime').datepicker("option", "onClose", function ( selectedDate ) {
	    $("#endTime").datepicker( "option", "minDate", selectedDate );
	});
	
	$('#endTime').datepicker();
	$('#endTime').datepicker("option", "minDate", $("#startTime").val());
	$('#endTime').datepicker("option", "onClose", function ( selectedDate ) {
	    $("#startTime").datepicker( "option", "maxDate", selectedDate );
	});
	
	//최근 - 날자세팅
    function fnSetDate(val){    	
    	var today = new Date();
    	var sdate = new Date();
    	var edate = new Date();
    	
    	sdate.setDate(today.getDate() - val);
    	edate.setDate(today.getDate());
    	
    	$('#startTime').val(DateFormat(sdate));
    	$('#endTime').val(DateFormat(edate));
    }
	
	//검색 
	function fnSearch(){
		if($("#label").val() == ""){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		if($("#startTime").val() == "" || $("#endTime").val() == ""){
			alert("기간을 확인해주세요.");
			return false;
		}
		
		if(DateDiff.inDays($("#startTime").val(), $("#endTime").val()) > 365){
			alert("최대 1년 단위로만 검색이 가능합니다.");
			return false;
		}
		
		$("#formSearch").attr("action", "<c:url value='/statOrderUserInput'/>");
		$("#formSearch").submit();
	}	
	
	//다운로드
	function fnDownload(){
		if($("#label").val() == ""){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		if($("#startTime").val() == "" || $("#endTime").val() == ""){
			alert("기간을 확인해주세요.");
			return false;
		}
		
		if(DateDiff.inDays($("#startTime").val(), $("#endTime").val()) > 365){
			alert("최대 1년 단위로만 검색이 가능합니다.");
			return false;
		}
		
		var regexp = /[^[0-9]/gi;
		if($('#viewCount').val() == ""){
			alert("조회건수를 확인해주세요.");
			return false;
		}else if(regexp.test($('#viewCount').val())){
			alert("숫자만 입력해주세요.");
			return false;
		}else if($('#viewCount').val() > 100000){
			alert("10만원건 까지만 등록해 주세요.");
			return false;
		}
		
		$("#formSearch").attr("action", "<c:url value='/statOrderUserInputDownload'/>");
		$("#formSearch").submit();
	}
</script>

<%@ include file="../include/commonFooter.jsp" %>	