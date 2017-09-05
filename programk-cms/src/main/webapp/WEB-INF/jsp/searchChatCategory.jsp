<%--
 Class Name  : searchChatCategory.jsp
 Description : 콘텐츠 관리 - 대화 카테고리 검색 목록
 
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
<input type="hidden" name="cpId" value="${search.cpId}"/>
<input type="hidden" name="name" value="${search.name}"/>
</form>
<form id="formSearch" method="get">
<input type="hidden" id="currentPageNo" name="currentPageNo" value="${paging.pageNum}"/>
<input type="hidden" name="cpId" value="${search.cpId}"/>
<input type="text" id="name" name="name" value="${search.name}"/>
<a href="#" onclick="fnSearch();return false;" class="btnBg"><span class="icon_search"></span>조회</a>
</form>
<br/><br/>
<table style="width:98%;">
	<colgroup>
		<col width="60"/>
		<col width="100"/>
		<col/>
	</colgroup>
	<thead>
		<tr>
			<th scope="col">선택</th>
			<th scope="col">CP</th>
          	<th scope="col">카테고리</th>
		</tr>
	</thead>
	<tbody>
		<c:choose>
			<c:when test="${fn:length(results) > 0}">
				<c:forEach var="item" items="${results}" varStatus="status">
				<tr>
					<td><input type="radio" id="id${status.index}" name="id" value="${item.id}|${item.name}" /></td>
	      			<td>${item.cpLabel}</td>
	      			<td>${item.name}</td>
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
</table>
<%@ include file="../include/commonPaging.jsp" %>

<script type="text/javascript">
	//선택
	$(document).ready(function(){
		$("input[name='id']").click(function(){
			var chk = $(this).is(":checked");
			if(chk){
				$(this).prop('checked', true);
				parent.fnCategory($(this).val()); //부모창으로
			}else {
				$(this).prop('checked', false);
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