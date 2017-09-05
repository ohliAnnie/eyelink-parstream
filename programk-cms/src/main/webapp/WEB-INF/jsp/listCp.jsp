<%--
 Class Name  : listCp.jsp
 Description : cp 관리 - 목록
 
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
			<h3 class="contentTitle">CP 관리</h3>
			<p class="location">
				홈 > CP 관리 > 목록
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->

		<!--// topButton -->
		<c:if test="${sessionScope.userInfo.auth == 'SAA'}">
		<div class="topButton">
			<div class="left">
				<!-- 				<a href="#" class="btnBg" onclick="fnLoadBots(); return false;"><span class="icon_write"></span>bots 파일 리로드</a> -->
				<a href="#" class="btnBg" onclick="fnDownLoadBots(); return false;"><span class="icon_exceldownload"></span>bots 파일 다운로드</a>
			</div>
			<div class="right">
				<a href="#" class="btnBg" onclick="fnAdd(); return false;"><span class="icon_write"></span>신규등록</a>
			</div>
		</div>
		</c:if>
		<!-- topButton //-->

		<!--// 테이블 시작 -->
		<form id="formPageing" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${paging.pageNum}">
		<input type="hidden" id="id" name="id" value="0">
		</form>
		<div class="tableList">
			<table>
				<caption>CP관리-NO, CP명, 사용여부, 최종 변경일, 편집</caption>
				<colgroup>
					<col class="w1 w8p">
					<col class="w2">
					<col class="w3 w25p">
					<col class="w4 w150px">
					<col class="w5 w140px">
				</colgroup>
				<thead>
					<tr>
						<th scope="col">NO</th>
						<th scope="col">CP 명</th>
						<th scope="col">사용여부</th>
						<th scope="col">최종 변경일</th>
						<th scope="col">편집</th>
					</tr>
				</thead>
				<tbody>
					<c:choose>
						<c:when test="${fn:length(results) > 0}">
							<c:forEach var="item" items="${results}" varStatus="status">
							<tr>
								<td>${(paging.totalCount - status.index) - ((paging.pageNum - 1) * paging.PAGESIZE)}</td>
				      			<td class="txtL">${item.label}</td>
				      			<td>${item.enabled}</td>
				      			<td class="date"><fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss" value="${item.modified}" /></td>
				      			<td>
				      				<a href="#" class="btnBg" onclick="fnDetail('${item.id}');return false;"><span class="icon_ok"></span>상세</a>
				      				<a href="#" class="btnBg" onclick="fnEdit('${item.id}');return false;"><span class="icon_modify"></span>수정</a>
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
		$("#formPageing").attr("action", "<c:url value='/addCp'/>");
		$("#formPageing").submit();
	}
	
	//상세
	function fnDetail(id){
		$("#formPageing #id").val(id);
		$("#formPageing").attr("action", "<c:url value='/detailCp'/>");
		$("#formPageing").submit();
	}
	
	//수정
	function fnEdit(id){
		$("#formPageing #id").val(id);
		$("#formPageing").attr("action", "<c:url value='/editCp'/>");
		$("#formPageing").submit();
	}
	
	//목록 - 페이징
	function fnPage(page){
		$("#formPageing #currentPageNo").val(page);
		$("#formPageing").attr("action", "<c:url value='/listCp'/>");
		$("#formPageing").submit();
	}	
	
	
	//bots 파일 리로드
	function fnLoadBots(){
		var answer = confirm("리로드 하시겠습니까?");
	    if (answer == true){
	    	$.ajax({    		
	        	url : "<c:url value='/loadBots'/>",
	        	data: "", 
	        	type: 'POST', 
	            dataType: 'json', 
	        	success : function(response){  
	        		if (response.status == 'FAIL') {
	        			alert(response.message);
	                } else {
	                	alert("리로드 되었습니다.");
	                }
	            },
	            error: function(request, status, error){
	            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
	            }
	    	});
	    }			
	}
	
	//bots 파일 다운로드
	function fnDownLoadBots(){
		location.href = "<c:url value='/downLoadBots'/>";
	}
</script>

<%@ include file="../include/commonFooter.jsp" %>	