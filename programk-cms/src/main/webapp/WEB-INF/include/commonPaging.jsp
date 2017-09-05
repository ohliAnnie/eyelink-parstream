<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<div class="pageNumber"> 
	<c:if test="${paging.pageNum > 1}">
<!-- 		<a href="#" onclick="fnPage(1); return false;">처음</a>  -->
		<a href="#" class="pre" onclick="fnPage(${(paging.pageNum - 1)}); return false;"><span class="icon_pre"></span>이전</a> 
	</c:if>
	<c:forEach var="i" begin="${paging.startPage}" end="${paging.endPage}" step="1">
		<c:if test="${i <= paging.totalPageCount}">
			<c:if test="${paging.pageNum != i}">
				<a href="#" onclick="fnPage(${i}); return false;">${i}</a> 
			</c:if>
			<c:if test="${paging.pageNum == i}">
				<span class="on">${i}</span>
			</c:if>
		</c:if>
	</c:forEach>
	<c:if test="${(paging.pageNum + 1) <= paging.totalPageCount}">
		<a href="#" class="next" onclick="fnPage(${(paging.pageNum + 1)}); return false;"><span class="icon_next"></span>다음</a> 
<%-- 		<a href="#" onclick="fnPage(${paging.totalPageCount}); return false;">끝</a> 		 --%>
	</c:if>
</div>