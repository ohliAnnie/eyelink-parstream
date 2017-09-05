<%--
 Class Name  : statPeriodUser.jsp
 Description : 통계 - 사용자별 통계
 
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
			<h3 class="contentTitle">사용자별 통계</h3>
			<p class="location">
				홈 > 통계 > User 통계 > 사용자별 통계
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
		<form id="formPageing" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo">
		<input type="hidden" name="order" value="${search.order}">
		<input type="hidden" name="label" value="${search.cpLabel}">
		<input type="hidden" name="startTime" value="${search.startTime}">
		<input type="hidden" name="endTime" value="${search.endTime}">
		</form>
		<form id="formSearch" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${paging.pageNum}">
		<input type="hidden" id="order" name="order" value="${search.order}">
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
				<caption>사용자별 통계-사용자, 검색 건수, 응답 건수, 응답율(%)</caption>
				<colgroup>
					<col class="w1 w10p">
					<col class="w2">
					<col class="w3">
					<col class="w4">
				</colgroup>
				<thead>
					<tr>
						<th scope="col">사용자</th>
						<th scope="col">
							<p class="keyword">검색 건수</p>
							<div class="up_down">
								<a href="#" onclick="fnOrder('searchCountDesc');return false;" class="btnBg up"><span class="icon_up"></span></a>
								<a href="#" onclick="fnOrder('searchCountAsc');return false;" class="btnBg down"><span class="icon_down"></span></a>
							</div>
						</th>
						<th scope="col">
							<p class="keyword">응답 건수</p>
							<div class="up_down">
								<a href="#" onclick="fnOrder('responseCountDesc');return false;" class="btnBg up"><span class="icon_up"></span></a>
								<a href="#" onclick="fnOrder('responseCountAsc');return false;" class="btnBg down"><span class="icon_down"></span></a>
							</div>
						</th>
						<th scope="col">
							<p class="keyword">응답율(%)</p>
							<div class="up_down">
								<a href="#" onclick="fnOrder('searchPercentDesc');return false;" class="btnBg up"><span class="icon_up"></span></a>
								<a href="#" onclick="fnOrder('searchPercentAsc');return false;" class="btnBg down"><span class="icon_down"></span></a>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					<c:if test="${fn:length(resultAll) > 0}">
						<c:forEach var="item" items="${resultAll}" varStatus="status">
							<c:set var= "searchCountSum" value="${searchCountSum + item.searchCount}"/>
							<c:set var= "responseCountSum" value="${responseCountSum + item.responseCount}"/>
						</c:forEach>
						<tr class="bgA">
							<td><span class="txtPoint">합계</span></td>
							<td>${searchCountSum}</td>
							<td>${responseCountSum}</td>
							<td><fmt:formatNumber value="${(responseCountSum*100.0)/searchCountSum}" pattern=".00"/>%</td>
						</tr>
						<tr class="bgA">
							<td><span class="txtPoint">사용자 평균</span></td>
							<td><fmt:formatNumber value="${searchCountSum/fn:length(resultAll)}" pattern=".00" var="searchCountAvg"/>${searchCountAvg}</td>
							<td><fmt:formatNumber value="${responseCountSum/fn:length(resultAll)}" pattern=".00" var="responseCountAvg"/>${responseCountAvg}</td>
							<td><fmt:formatNumber value="${(responseCountAvg*100.0)/searchCountAvg}" pattern=".00"/>%</td>
						</tr>
					</c:if>
					<c:choose>
						<c:when test="${fn:length(results) > 0}">
							<c:forEach var="item" items="${results}" varStatus="status">
							<tr>
								<td><c:out value="${fn:substring(item.userId, 0, fn:length(item.userId)-2)}**" /></td>
								<td>${item.searchCount}</td>
								<td>${item.responseCount}</td>
								<td><fmt:formatNumber value="${(item.responseCount*100.0)/item.searchCount}" pattern=".00"/>%</td>
							</tr>
							</c:forEach>
						</c:when>
						<c:otherwise>
							<tr>
								<td colspan="4">조회 항목과 일치하는 결과가 없습니다.</td>
							</tr>
						</c:otherwise>
					</c:choose>		
				</tbody>
			</table>
		</div>
		<!-- 테이블 끝 //-->

		<!--// page number -->
		<%@ include file="../include/commonPaging.jsp" %>
		<!-- page number //-->

	</div>
	<!-- 컨텐츠 끝 //-->

</div>

<script type="text/javascript">
	$("#formSearch #type").selectmenu({
	   change: function( event, data ) {
		   if(data.item.value == "month"){
			   location.href = "<c:url value='/statPeriodMonth'/>";
		   }else{
			   location.href = "<c:url value='/statPeriodDay'/>";
		   }
	   }
	});
	
	//시작일
	$("#formSearch #startTime").datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true
	});
	 
	//끝일
	$("#formSearch #endTime").datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true
	});
	
	$('#formSearch #startTime').datepicker();
    $('#formSearch #startTime').datepicker("option", "maxDate", $("#formSearch #endTime").val());    
    $('#formSearch #startTime').datepicker("option", "onClose", function ( selectedDate ) {
        $("#formSearch #endTime").datepicker( "option", "minDate", selectedDate );
    });
 
    $('#formSearch #endTime').datepicker();
    $('#formSearch #endTime').datepicker("option", "minDate", $("#formSearch #startTime").val());
    $('#formSearch #endTime').datepicker("option", "onClose", function ( selectedDate ) {
        $("#formSearch #startTime").datepicker( "option", "maxDate", selectedDate );
    });
    
	//최근 - 날자세팅
    function fnSetDate(val){    	
    	var today = new Date();
    	var sdate = new Date();
    	var edate = new Date();
    	
    	sdate.setDate(today.getDate() - val);
    	edate.setDate(today.getDate());
    	
    	$('#formSearch #startTime').val(DateFormat(sdate));
    	$('#formSearch #endTime').val(DateFormat(edate));
    }
	
	//목록 - 오더링
	function fnOrder(order){
		$("#formSearch #order").val(order);
		$("#formSearch #currentPageNo").val(1);
		$("#formSearch").attr("action", "<c:url value='/statPeriodUser'/>");
		$("#formSearch").submit();
	}

	//목록 - 페이징
	function fnPage(page){		
		$("#formPageing #currentPageNo").val(page);
		$("#formPageing").attr("action", "<c:url value='/statPeriodUser'/>");
		$("#formPageing").submit();
	}
	
	//검색 
	function fnSearch(){
		if($("#formSearch #label").val() == ""){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		if($("#formSearch #startTime").val() == "" || $("#formSearch #endTime").val() == ""){
			alert("기간을 확인해주세요.");
			return false;
		}
		
		if(DateDiff.inDays($("#formSearch #startTime").val(), $("#formSearch #endTime").val()) > 365){
			alert("최대 1년 단위로만 검색이 가능합니다.");
			return false;
		}
		
		$("#formSearch").attr("action", "<c:url value='/statPeriodUser'/>");
		$("#formSearch").submit();
	}
	
	//다운로드
	function fnDownload(){
		if($("#formSearch #label").val() == ""){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		if($("#formSearch #startTime").val() == "" || $("#formSearch #endTime").val() == ""){
			alert("기간을 확인해주세요.");
			return false;
		}
		
		if(DateDiff.inDays($("#formSearch #startTime").val(), $("#formSearch #endTime").val()) > 365){
			alert("최대 1년 단위로만 검색이 가능합니다.");
			return false;
		}

		$("#formSearch").attr("action", "<c:url value='/statPeriodUserDownload'/>");
		$("#formSearch").submit();
	}
</script>

<%@ include file="../include/commonFooter.jsp" %>	