<%--
 Class Name  : searchChat.jsp
 Description : 콘텐츠 관리 - 대화  검색 목록
 
 Modification Information
 수정일      수정자       수정내용
 ---------------------------------------
 2016. 7. 1. Young     최초생성
 
 author : Young
 since  : 2016. 7. 1.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">
<head>
<title>대화플랫폼 CMS</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta http-equiv="Expires" content="-1"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Cache-Control" content="No-Cache"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<link type="text/css" href="<c:url value='/css/popup.css'/>" rel="stylesheet" />
<link type="text/css" href="<c:url value='/css/table.css'/>" rel="stylesheet" />
<link type="text/css" href="<c:url value='/js/jquery-ui.min.css'/>" rel="stylesheet"/>
<script type="text/javascript" src="<c:url value='/js/jquery-1.10.2.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/jquery-ui.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/jquery-ui.js'/>"></script>
</head>
<body>

<form id="formPageing" method="get">
<input type="hidden" id="currentPageNo" name="currentPageNo" value="${paging.pageNum}"/>
<input type="hidden" name="inputId" value="${search.id}"/>
<input type="hidden" name="input" value="${search.input}"/>
</form>
<form id="formSearch" method="get">
<input type="hidden" id="currentPageNo" name="currentPageNo" value="${paging.pageNum}"/>
<input type="hidden" id="inputId" name="inputId" value="${search.id}"/>
<input type="hidden" id="cpId" name="cpId" value="${search.cpId}"/>
<input type="text" id="input" name="input" value="${search.input}"/>
<a href="#" onclick="fnSearch();return false;" class="btnBg"><span class="icon_search"></span>조회</a>
</form>
<br/><br/>
<div class="tableList fixed">
	<table style="width:98%;">
		<colgroup>
			<col width="60"/>
			<col width="100"/>
			<col/>
			<col/>
		</colgroup>
		<thead>
			<tr>
				<th scope="col">선택</th>
				<th scope="col">카테고리</th>
	          	<th scope="col">질문</th>
	          	<th scope="col">답변</th>
			</tr>
		</thead>
		<tbody>
			<c:choose>
				<c:when test="${fn:length(results) > 0}">
					<c:forEach var="item" items="${results}" varStatus="status">
					<tr>
						<td>
							<input type="hidden" id="text${status.index}" name="text" value="${fn:escapeXml(item.input)}"/>
							<input type="radio" id="id${status.index}" name="id" value="${item.id}" />
						</td>
		      			<td class="txtL">${item.cateName}</td>
		      			<td class="txtL eps tooltip"><nobr><a href="#" onclick="return false;" title="${fn:escapeXml(item.input)}">${fn:escapeXml(item.input)}</a></nobr></td>				      			
				      	<td class="txtL eps tooltip"><nobr><a href="#" onclick="return false;" title="${fn:escapeXml(item.reply)}">${fn:escapeXml(item.reply)}</a></nobr></td>
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
<%@ include file="../include/commonPaging.jsp" %>

<script type="text/javascript">
	//선택
	$(document).ready(function(){
		$("input[name='id']").click(function(){
			var chk = $(this).is(":checked");
			if(chk){
				if($(this).val() == $("#inputId").val()){
					alert("현 답변과 동일합니다. 다른 답변을 선택해 주세요.");
				}else{
					var thatId = $(this).val();
					var thatInput = $(this).parent().find("input[name='text']").val();					
					parent.fnThat(thatId,thatInput); //부모창으로
				}				
			}
		});	
	});
	
	//검색 
	function fnSearch(){
		$("#formSearch #currentPageNo").val(1);
		$("#formSearch").submit();
	}
	
	//목록 - 페이징
	function fnPage(page){
		$("#formPageing #currentPageNo").val(page);
		$("#formPageing").submit();
	}
</script>

</body>
</html>