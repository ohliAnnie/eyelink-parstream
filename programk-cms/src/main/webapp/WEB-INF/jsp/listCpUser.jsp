<%--
 Class Name  : listCpUser.jsp
 Description : 사용자 관리 - 목록
 
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
	<div class="searchGrpContentBox user">
		<!--// 타이틀 및 위치안내 시작 -->
		<div class="titleBox">
			<h3 class="contentTitle">사용자 관리</h3>
			<p class="location">
				홈 > 사용자 관리 > 목록
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->

		<!--// topButton -->
		<form id="formPageing" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${paging.pageNum}">
		<input type="hidden" id="cpId" name="cpId" value="${cpId}">
		<input type="hidden" id="id" name="id" value="0">
		</form>
		<form id="formSearch" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="1">
		<div class="topButton">
			<div class="left">
				<ul>
					<li class="title">CP</li>
					<li class="content">
						<select class="selectmenu" id="cpId" name="cpId">
							<c:if test="${sessionScope.userInfo.auth == 'SAA'}">
							<option value="0" ${0 == cpId ? 'selected="selected"' : '' }>전체</option>
							</c:if>
							<c:forEach var="cp" items="${result}" varStatus="status">		
								<option value="${cp.id}" ${cp.id == cpId ? 'selected="selected"' : '' }>${cp.label}</option>
							</c:forEach>
						</select>
					</li>
				</ul>
				<a href="#" onclick="fnSearch();return false;" class="btnBg"><span class="icon_search"></span>조회</a>
			</div>
			<div class="right">
				<a href="#" onclick="fnAdd(); return false;" class="btnBg"><span class="icon_write"></span>신규생성</a>
			</div>
		</div>
		</form>
		<!-- topButton //-->

		<!--// 테이블 시작 -->		
		<div class="tableList">
			<table>
				<caption>사용자관리-NO, ID, 이름, 소속, 등록일, 사용여부, 권한, 편집(상세, 수정, 삭제)</caption>
				<colgroup>
					<col class="w1 w5p">
					<col class="w2">
					<col class="w3 w10p">
					<col class="w4 w15p">
					<col class="w5 w150px">
					<col class="w6 w80px">
					<col class="w7 w10p">
					<col class="w8 wBtn">
				</colgroup>
				<thead>
					<tr>
						<th scope="col">NO</th>
						<th scope="col">ID</th>
						<th scope="col">이름</th>
						<th scope="col">소속</th>
						<th scope="col">등록일</th>
						<th scope="col">사용여부</th>
						<th scope="col">권한</th>
						<th scope="col">편집</th>
					</tr>
				</thead>
				<tbody>
					<c:choose>
						<c:when test="${fn:length(results) > 0}">
							<c:forEach var="item" items="${results}" varStatus="status">
							<tr>
								<td>${(paging.totalCount - status.index) - ((paging.pageNum - 1) * paging.PAGESIZE)}</td>
				      			<td><c:out value="${fn:substring(item.userId, 0, fn:length(item.userId)-3)}***" /></td>
				      			<td><c:out value="${fn:substring(item.name, 0, fn:length(item.name)-1)}*" /></td>
				      			<td>${item.groupName}</td>
				      			<td class="date"><fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss" value="${item.created}" /></td>
				      			<td>${item.enabled}</td>
				      			<td>
				      				<c:forEach var="auth" items="${authType}" varStatus="status">
				      					<c:if test="${auth.value == item.auth}">${auth.label}</c:if>	
									</c:forEach>
				      			</td>
				      			<td class="btnBox">
				      				<a href="#" onclick="fnDetail('${item.id}');return false;" class="btnBg"><span class="icon_ok"></span>상세</a>
				      				<a href="#" onclick="fnEdit('${item.id}');return false;" class="btnBg"><span class="icon_modify"></span>수정</a>
				      				<c:if test="${sessionScope.userInfo.userId != item.userId}">
				      				<a href="#" onclick="fnDelete('${item.id}');return false;"class="btnBg"><span class="icon_delete"></span>삭제</a>
				      				</c:if>
				      			</td>
							</tr>
							</c:forEach>
						</c:when>
						<c:otherwise>
							<tr>
								<td colspan="8">조회 항목과 일치하는 결과가 없습니다.</td>
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
	//신규등록
	function fnAdd(){
		$("#formPageing").attr("action", "<c:url value='/addCpUser'/>");
		$("#formPageing").submit();
	}
	
	//상세
	function fnDetail(id){
		$("#formPageing #id").val(id);
		$("#formPageing").attr("action", "<c:url value='/detailCpUser'/>");
		$("#formPageing").submit();
	}
	
	//수정
	function fnEdit(id){
		$("#formPageing #id").val(id);
		$("#formPageing").attr("action", "<c:url value='/editCpUser'/>");
		$("#formPageing").submit();
	}
	
	//목록 - 페이징
	function fnPage(page){
		$("#formPageing #currentPageNo").val(page);
		$("#formPageing").attr("action", "<c:url value='/listCpUser'/>");
		$("#formPageing").submit();
	}
	
	//목록 - 조회
	function fnSearch(){
		$("#formSearch").attr("action", "<c:url value='/listCpUser'/>");
		$("#formSearch").submit();
	}
	
	//삭제
	function fnDelete(id){
		var answer = confirm("삭제 하시면 사용자에 대한 모든 정보를 잃게 됩니다.\n삭제 하시겠습니까?");
	    if (answer == true){
	    	$.ajax({    		
	        	url : "<c:url value='/deleteCpUser'/>",
	        	data: "id="+ id, 
	        	type: 'GET', 
	            dataType: 'json', 
	        	success : function(response){  
	        		if (response.status == 'FAIL') {
	        			alert(response.message);
	                } else {
	                	location.href = "<c:url value='/listCpUser'/>";
	                }
	            },
	            error: function(request, status, error){
	            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
	            }
	    	});
	    }		
	}
</script>

<%@ include file="../include/commonFooter.jsp" %>	