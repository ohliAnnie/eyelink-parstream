<%--
 Class Name  : statPeriodTime.jsp
 Description : 통계 - 시간대별 통계
 
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
			<h3 class="contentTitle">시간대별 통계</h3>
			<p class="location">
				홈 > 통계 > User 통계 > 시간대별 통계
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
				<caption>시간대별 통계-기간, 검색 건수, 응답 건수, 응답율(%), 평균 유니크 사용자 수</caption>
				<colgroup>
					<col class="w1 w10p">
					<col class="w2">
					<col class="w3">
					<col class="w4">
					<col class="w5">
				</colgroup>
				<thead>
					<tr>
						<th scope="col">기간</th>
						<th scope="col">검색 건수</th>
						<th scope="col">응답 건수</th>
						<th scope="col">응답률(%)</th>
						<th scope="col">평균 유니크 사용자 수</th>
					</tr>
				</thead>
				<tbody>
					<c:if test="${fn:length(results) > 0}">
						<c:forEach var="item" items="${results}" varStatus="status">
							<c:set var="searchCountSum" value="${searchCountSum + item.searchCount}"/>
							<c:set var="responseCountSum" value="${responseCountSum + item.responseCount}"/>
							<c:set var="userCountSum" value="${userCountSum + (item.userCount)/(search.diff+1)}"/>
						</c:forEach>
						<tr class="bgA">
							<td><span class="txtPoint">합계</span></td>
							<td>${searchCountSum}</td>
							<td>${responseCountSum}</td>
							<td>
								<c:choose>
									<c:when test="${responseCountSum > 0 && searchCountSum > 0}">
									<fmt:formatNumber value="${(responseCountSum*100.0)/searchCountSum}" pattern="0.00"/>%
									</c:when>
									<c:otherwise>0%</c:otherwise>
								</c:choose>
							</td>
							<td><fmt:formatNumber value="${userCountSum}" pattern="0.00"/></td>
						</tr>
						<tr class="bgA">
							<td><span class="txtPoint">시간대 평균</span></td>
							<td><fmt:formatNumber value="${searchCountSum/fn:length(results)}" pattern="0.00" var="searchCountAvg"/>${searchCountAvg}</td>
							<td><fmt:formatNumber value="${responseCountSum/fn:length(results)}" pattern="0.00" var="responseCountAvg"/>${responseCountAvg}</td>
							<td>
								<c:choose>
									<c:when test="${responseCountAvg > 0.00 && searchCountAvg > 0.00}">
									<fmt:formatNumber value="${(responseCountAvg*100.0)/searchCountAvg}" pattern="0.00"/>%
									</c:when>
									<c:otherwise>0%</c:otherwise>
								</c:choose>
							</td>
							<td><fmt:formatNumber value="${userCountSum/fn:length(results)}" pattern="0.00" var="userCountAvg"/>${userCountAvg}</td>
						</tr>
					</c:if>
					<c:choose>
						<c:when test="${fn:length(results) > 0}">
							<c:forEach var="item" items="${results}" varStatus="status">
							<tr>
								<td>
									<fmt:formatNumber minIntegerDigits="2" value="${item.time}"/>시~
									<fmt:formatNumber minIntegerDigits="2" value="${item.time+1}"/>시
									
									<!--<fmt:formatNumber minIntegerDigits="2" value="${status.index}"/>시~
									<fmt:formatNumber minIntegerDigits="2" value="${status.count}"/>시 -->
								</td>
								<td>${item.searchCount}</td>
								<td>${item.responseCount}</td>
								<td>
									<c:choose>
										<c:when test="${item.searchCount > 0 && item.responseCount > 0}">
										<fmt:formatNumber value="${(item.responseCount*100.0)/item.searchCount}" pattern="0.00"/>%
										</c:when>
										<c:otherwise>0%</c:otherwise>
									</c:choose>
								</td>
								<td>
									<c:choose>
										<c:when test="${search.diff > 0 && item.userCount > 0}">
										<fmt:formatNumber value="${(item.userCount)/(search.diff+1)}" pattern="0.00"/>
										</c:when>
										<c:otherwise>${item.userCount}</c:otherwise>
									</c:choose>				
								</td>
							</tr>
							</c:forEach>
						</c:when>
						<c:otherwise>
							<tr>
								<td colspan="5">조회 항목과 일치하는 결과가 없습니다.</td>
							</tr>
						</c:otherwise>
					</c:choose>										
				</tbody>
				<tfoot></tfoot>
			</table>
		</div>
		<!-- 테이블 끝 //-->

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
		
		$("#formSearch").attr("action", "<c:url value='/statPeriodTime'/>");
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

		$("#formSearch").attr("action", "<c:url value='/statPeriodTimeDownload'/>");
		$("#formSearch").submit();
	}
</script>

<%@ include file="../include/commonFooter.jsp" %>	