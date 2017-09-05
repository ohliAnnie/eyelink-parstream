<%--
 Class Name  : detailCpUser.jsp
 Description : 사용자 관리 - 사용자 상세
 
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
			<h3 class="contentTitle">사용자 상세</h3>
			<p class="location">
				홈 > 사용자 관리 > 목록 > 사용자 상세
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->

		<!--// 테이블 시작 -->
		<form id="formPageing" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${param.currentPageNo}">
		<input type="hidden" id="cpId" name="cpId" value="${param.cpId}">
		<input type="hidden" id="id" name="id" value="0">
		</form>
		<div class="tableViewBox">
			<ul>
				<li class="title">권한</li>
				<li class="content">
					<c:forEach var="auth" items="${authType}" varStatus="status">
     					<c:if test="${auth.value == result.auth}">${auth.label}</c:if>	
					</c:forEach>
				</li>
			</ul>		
			<ul>
				<li class="title w15p">CP</li>
				<li class="content">
					<ul>
						<c:set var="cpGroup" value=",${result.cpGroup}," />
						<c:forEach var="cp" items="${resultCp}" varStatus="status">
						<c:set var="id" value=",${cp.id}," />
						<c:if test="${fn:indexOf(cpGroup, id) > -1}">
			    			<li><input type="checkbox" id="cpId${status.index}" name="cpId" value="${cp.id}" checked="checked" disabled="disabled"/><label for="cpId${status.index}">${cp.label}</label></li>
						</c:if>
						</c:forEach>
					</ul>
				</li>
			</ul>
			<ul class="colspan">
				<li class="title">ID</li>
				<li class="content">
					<div class="content w35p">
						<c:out value="${fn:substring(result.userId, 0, fn:length(result.userId)-3)}***" />
					</div>
					<div class="title">이름</div>
					<div class="content">
						<p><c:out value="${fn:substring(result.name, 0, fn:length(result.name)-1)}*" /></p>
					</div>
				</li>
			</ul>
			<ul>
				<li class="title">소속</li>
				<li class="content">${result.groupName}</li>
			</ul>
			<ul>
				<li class="title">연락처</li>
				<li class="content">
					<c:set var="cellPhones" value="${fn:split(result.cellPhone, '-')}" />
					<c:forEach var="item" items="${cellPhones}" varStatus="status"><c:if test="${status.count == 1}">${item}</c:if><c:if test="${status.count == 2}">-<c:out value="${fn:substring(item, 0, fn:length(item)-2)}**" /></c:if><c:if test="${status.count == 3}">-<c:out value="*${fn:substring(item, 1, fn:length(item))}" /></c:if></c:forEach>
				</li>
			</ul>
			<ul>
				<li class="title">사용여부</li>
				<li class="content">
					<c:forEach var="enabled" items="${enabledType}" varStatus="status">
     					<input type="radio" disabled="disabled" ${result.enabled == enabled.value ? 'checked="checked"' : '' }/>${enabled.value}
					</c:forEach>
				</li>
			</ul>
			<ul>
				<li class="title">메뉴권한</li>
				<li class="content">
					<ul>
						<c:forEach var="menu" items="${menuType}" varStatus="status">
						<c:if test="${menu.depth == '1'}">
			    			<li><input type="checkbox" disabled="disabled" ${fn:contains(result.menu, menu.value) ? 'checked="checked"' : '' }/><label for="menu${status.index}">${menu.label}</label></li>
						</c:if>
						</c:forEach>
					</ul>
				</li>
			</ul>
			<ul>
				<li class="title">등록일</li>
				<li class="content date"><fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss" value="${result.created}" /></li>
			</ul>
			<ul>
				<li class="title">수정일</li>
				<li class="content date"><fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss" value="${result.modified}" /></li>
			</ul>
			<ul class="tableWriteBox">
				<li class="title">비고</li>
				<li class="content memo">
					<textarea name="description" id="description">${result.description}</textarea>
				</li>
			</ul>
		</div>
		<!-- 테이블 끝 //-->

		<!--// bottom button -->
		<div class="bottomButton">
			<div class="left">
				<a href="#" onclick="fnList();return false;" class="btnBg"><span class="icon_list"></span>목록</a>
			</div>
			<div class="right">
				<c:if test="${sessionScope.userInfo.userId != result.userId}">
				<a href="#" onclick="fnDelete('${result.id}');return false;" onclick="javascript:delUser()" class="btnBg"><span class="icon_delete"></span>삭제</a>
				</c:if>
				<a href="#" onclick="fnEditForm('${result.id}');return false;" class="btnBg"><span class="icon_modify"></span>수정</a>
			</div>
		</div>
		<!-- bottom button //-->

	</div>
	<!-- 컨텐츠 끝 //-->

</div>

<script type="text/javascript">
	//목록
	function fnList(){
		$("#formPageing").attr("action", "<c:url value='/listCpUser'/>");
		$("#formPageing").submit();
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
	
	//수정
	function fnEditForm(id){
		$("#formPageing #id").val(id);
		$("#formPageing").attr("action", "<c:url value='/editCpUser'/>");
		$("#formPageing").submit();
	}
</script>

<%@ include file="../include/commonFooter.jsp" %>		