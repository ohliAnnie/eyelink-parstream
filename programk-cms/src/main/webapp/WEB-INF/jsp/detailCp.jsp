<%--
 Class Name  : detailCp.jsp
 Description : cp 관리 - cp 상세
 
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
	<div class="searchGrpContentBox cp">
		<!--// 타이틀 및 위치안내 시작 -->
		<div class="titleBox">
			<h3 class="contentTitle">CP 상세</h3>
			<p class="location">
				홈 > CP 관리 > 목록 > CP 상세
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->

		<!--// 테이블 시작 -->
		<form id="formPageing" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${param.currentPageNo}">
		<input type="hidden" id="id" name="id" value="0">
		</form>
		<div class="tableViewBox">
			<ul>
				<li class="title w15p">CP 명</li>
				<li class="content">${result.label}</li>
			</ul>
			<ul>
				<li class="title">CP ID</li>
				<li class="content">${result.id}</li>
			</ul>
			<ul>
				<li class="title">토큰</li>
				<li class="content">${result.token}</li>
			</ul>			
			<ul>
				<li class="title">홈페이지 URL</li>
				<li class="content">${result.url}</li>
			</ul>
			<ul>
				<li class="title">호스트 IP</li>
				<li class="content hostIP">
					<c:set var="ip" value="${fn:split(result.hostIp,',')}" />
					<c:forEach var="item" items="${ip}" varStatus="g">
						<p>${item}</p>
					</c:forEach> 
				</li>
			</ul>
			<ul>
				<li class="title">등록일</li>
				<li class="content date"><fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss" value="${result.created}" /></li>
			</ul>
			<ul>
				<li class="title">사용여부</li>
				<li class="content">
					<c:forEach var="enabled" items="${enabledType}" varStatus="status">
     					<input type="radio" disabled="disabled" ${result.enabled == enabled.value ? 'checked="checked"' : '' }/>${enabled.value}
					</c:forEach>
				</li>
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
<%-- 				<a href="#" onclick="fnDelete('${result.id}');return false;" class="btnBg"><span class="icon_delete"></span>삭제</a> --%>
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
		$("#formPageing").attr("action", "<c:url value='/listCp'/>");
		$("#formPageing").submit();
	}
	
	//삭제
	function fnDelete(id){
		var answer = confirm("삭제 하시면 CP에 등록된 모든 정보를 잃게 됩니다.\n삭제 하시겠습니까?");
	    if (answer == true){
	    	if (answer == true){
		    	$.ajax({    		
		        	url : "<c:url value='/deleteCp'/>",
		        	data: "id="+ id, 
		        	type: 'GET', 
		            dataType: 'json', 
		        	success : function(response){  
		        		if (response.status == 'FAIL') {
		        			alert(response.message);
		                } else {
		                	alert("삭제 되었습니다.");
		                	location.href = "<c:url value='/listCp'/>";
		                }
		            },
		            error: function(request, status, error){
		            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
		            }
		    	});
		    }		
	    }
	}
	
	//수정
	function fnEditForm(id){
		$("#formPageing #id").val(id);
		$("#formPageing").attr("action", "<c:url value='/editCp'/>");
		$("#formPageing").submit();
	}
</script>

<%@ include file="../include/commonFooter.jsp" %>		