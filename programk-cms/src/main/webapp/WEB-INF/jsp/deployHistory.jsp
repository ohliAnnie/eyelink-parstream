<%--
 Class Name  : deployHistory.jsp
 Description : 배포관리 - 배포히스토리
 
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
			<h3 class="contentTitle">히스토리</h3>
			<p class="location">
				홈 > 배포 관리 > 히스토리
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->

		<!--// topButton -->
		<form id="formPageing" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo">
		<input type="hidden" id="cpId" name="cpId" value="${search.cpId}">
		</form>
		<form id="formSearch" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${paging.pageNum}">
		<div class="topButton">
			<div class="left">
				<ul>
					<li class="title">CP</li>
					<li class="content">
						<select class="selectmenu" id="cpId" name="cpId">
							<c:forEach var="cp" items="${result}" varStatus="status">		
								<option value="${cp.id}" ${cp.id == search.cpId ? 'selected="selected"' : '' }>${cp.label}</option>
							</c:forEach>
						</select>
					</li>
				</ul>
			</div>
<!-- 			<div class="btnSearch"> -->
<!-- 				<a href="#" onclick="fnSearch();return false;" class="btnBg"><span class="icon_search"></span>조회</a> -->
<!-- 			</div> -->
		</div>
		</form>
		<!-- topButton //-->

		<!--// 테이블 시작 -->
		<div class="tableList fixed">
			<table>
				<caption>히스토리-작업구분, 일자, 사유, 처리결과, 작업자, 다운로드</caption>
				<colgroup>
					<col class="w1 w10p">
					<col class="w2 w150px">
					<col class="w3 w120px">
					<col class="w4">
					<col class="w5">
					<col class="w6 w10p">
					<col class="w7 w15p">
				</colgroup>
				<thead>
					<tr>
						<th scope="col">작업구분</th>
						<th scope="col">일자</th>
						<th scope="col">BOT</th>
						<th scope="col">사유</th>
						<th scope="col">처리결과</th>
						<th scope="col">작업자</th>
						<th scope="col">다운로드</th>
					</tr>
				</thead>
				<tbody>
					<c:choose>
						<c:when test="${fn:length(results) > 0}">
							<c:forEach var="item" items="${results}" varStatus="status">
							<tr>
								<td>${item.gubun}</td>
								<td><fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss" value="${item.deployDate}" /></td>
								<td>${item.subLabel}<c:if test="${item.gubun == 'BOT변경'}"><br/>(active)</c:if></td>
								<td class="txtL">${item.description}</td>
								<td class="txtL">
									<c:forEach var="completed" items="${completed}">		
				      				<c:if test="${completed.value == item.completed}">
				      					${completed.label}
				      				</c:if>
									</c:forEach>
									<c:if test="${item.message != null and item.message != ''}"> : ${item.message}</c:if>
								</td>
								<td><c:out value="${fn:substring(item.userId, 0, fn:length(item.userId)-2)}**" /></td>
								<td>
									<c:if test="${item.gubun == '배포' and item.fileInfo != null and item.fileInfo != ''}">
									<c:set var="fileInfo" value="${fn:split(item.fileInfo,',')}" />
									<c:forEach var="fileVal" items="${fileInfo}" varStatus="g">
								     	<p>${fn:split(fileVal,'|')[0]} : <a href="#" onclick="fnFileDownload('${fn:split(fileVal,'|')[1]}');return false;" class="btnBg"><span class="icon_sortDown"></span>다운로드</a></p>
									</c:forEach>
									</c:if>
								</td>
							</tr>
							</c:forEach>
						</c:when>
						<c:otherwise>
							<tr>
								<td colspan="7">조회 항목과 일치하는 결과가 없습니다.</td>
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

<script type="text/javascript">
	$("#formSearch #cpId").selectmenu({
	   change: function( event, data ) {
		   fnSearch();
	   }
	});
	
	//검색 
	function fnSearch(){
		$("#formSearch #currentPageNo").val(1);
		$("#formSearch").attr("action", "<c:url value='/deployHistory'/>");
		$("#formSearch").submit();
	}
	
	//목록 - 페이징
	function fnPage(page){
		$("#formPageing #currentPageNo").val(page);
		$("#formPageing").attr("action", "<c:url value='/deployHistory'/>");
		$("#formPageing").submit();
	}
	
	//파일 다운로드
	function fnFileDownload(id){
		location.href = "<c:url value='/deployHistoryFileDownload?id="+ id +"'/>";
	}
</script>

<%@ include file="../include/commonFooter.jsp" %>	