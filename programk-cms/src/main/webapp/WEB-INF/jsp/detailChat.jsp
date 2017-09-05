<%--
 Class Name  : detailChat.jsp
 Description : 콘텐츠 관리 - 대화 상세
 
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
<%@ include file="../include/commonGnb.jsp" %>

<link type="text/css" href="<c:url value='/js/mindmap.css'/>" rel="stylesheet"/>
<script type="text/javascript" src="<c:url value='/js/mindmap.min.js'/>"></script>

<hr class="blind">
<div class="searchGrpContent">
	<!--// 컨텐츠 시작 -->
	<div class="searchGrpContentBox user">
		<!--// 타이틀 및 위치안내 시작 -->
		<div class="titleBox">
			<h3 class="contentTitle">대화 상세</h3>
			<p class="location">
				홈 > 콘텐츠 관리 > 대화 관리 > 목록 > 대화 상세
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->
		
		<form id="formPageing" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${param.currentPageNo}">
		<input type="hidden" id="cateId" name="cateId" value="${param.cateId}">
		<input type="hidden" id="cpId" name="cpId" value="${param.cpId}">
		<input type="hidden" id="searchType" name="searchType" value="${param.searchType}">
		<input type="hidden" id="searchKeyword" name="searchKeyword" value="${param.searchKeyword}">
		<input type="hidden" id="id" name="id" value="0">
		</form>
		<form id="form" method="post">
		<input type="hidden" id="cateId" name="cateId" />
		<h4 class="tableTitle2">1. 기본 답변 등록(필수)</h4>
		<!--// 테이블 시작 -->
		<div class="tableWriteBox">
			<ul>
				<li class="title w20p">대화ID</li>
				<li class="content">
					${result.id}
				</li>
			</ul>
			<ul>
				<li class="title w20p">카테고리명</li>
				<li class="content">
					${result.cateName}
				</li>
			</ul>
			<ul>
				<li class="title">질문 </li>
				<li class="content">
					${fn:escapeXml(result.input)}
					<a href="#" onclick="fnViewTestLayer();return false;" class="btnBg"><span class="icon_utility"></span>검증 샘플 보기</a>
				</li>
			</ul>
			<ul>
				<li class="title">답변 </li>
				<li class="content memo">					
					<textarea name="reply" id="reply" readonly>${result.reply}</textarea>
				</li>
			</ul>
			<ul>
				<li class="title">이미지</li>
				<li class="content imgURL">
					<c:forEach var="item" items="${images}" varStatus="status">
						<input type="text" class="w70p" id="imageUrl" name="imageUrl" value="${item.url}" readonly/>
						<a href="#" onclick="fnViewImageLayer();return false;" class="btnBg"><span class="icon_search"></span>미리보기</a>
					</c:forEach>
				</li>
			</ul>
			<ul>
				<li class="title">이미지 대체 텍스트</li>
				<li class="content">
				    <c:forEach var="item" items="${images}" varStatus="status">
						<input type="text" class="w70p" id="imageAlt" name="imageAlt" value="${item.alt}" readonly/>
					</c:forEach>
				</li>
			</ul>
		</div>
		
		<h4 class="tableTitle2 lineT0">2. 텍스트 링크(선택)</h4>
		<div class="tableWriteBox">
			<ul>
				<li class="title w20p">텍스트 링크</li>
				<li class="content">
					<c:if test="${fn:length(link) > 0}">
					<div class="sub_table txtL">
						<ul>
							<li class="title w25p">링크 제목</li>
							<li class="title w25p">설명(선택)</li>
							<li class="title">연결 URL</li>
						</ul>
						<c:forEach var="item" items="${link}" varStatus="status">
						<ul class="box">
							<li>${fn:escapeXml(item.title)}</li>
							<li>${fn:escapeXml(item.comment)}</li>
							<li>${fn:escapeXml(item.url)}</li>
						</ul>
						</c:forEach>
					</div>
					</c:if>
				</li>
			</ul>
		</div>
		
		<h4 class="tableTitle2 lineT0">3. 이전답변/추천질문 설정(선택)</h4>
		<div class="mindmap">
			<c:if test="${result.thatId != ''}">
			<ol class="children children_leftbranch">				
				<li class="children__item">
					<div class="node">
						<div class="node__text">${thatInput.input}</div>
						<input type="text" class="node__input" name="thatId" id="thatId" value="${result.thatId}">
					</div>
				</li>				
			</ol>
			</c:if>
			<div class="node node_root">
				<div class="node__text">${fn:escapeXml(result.input)}</div>
				<input type="text" class="node__input">
			</div>
			<c:if test="${fn:length(recommend) > 0}">
			<ol class="children children_rightbranch">		
				<c:forEach var="item" items="${recommend}" varStatus="status">
					<li class="children__item">
						<div class="node">
							<div class="node__text">${fn:escapeXml(item.recommendInput)}</div>
							<input type="text" class="node__input" name="recommendInput" id="recommendInput" value="${fn:escapeXml(item.recommendInput)}"/>
						</div>		
					</li>
				</c:forEach>	
			</ol>
			</c:if>
		</div>
		<!-- 테이블 끝 //-->

		<h4 class="tableTitle2 lineT0">4. 추가 답변 등록(선택)</h4>
		<!--// 테이블 시작 -->
		<div class="tableWriteBox">
			<ul>
				<li class="title w20p">답변 등록</li>
				<li class="content">
					<c:forEach var="item" items="${reply}" varStatus="status">
						<div class="sub_table">
							<ul class="box">
								<li>${fn:escapeXml(item.replyInput)}</li>
							</ul>
						</div>
					</c:forEach>
				</li>
			</ul>
		</div>
		
		<h4 class="tableTitle2 lineT0">5. 추가 옵션 등록(선택)</h4>
		<!--// 테이블 시작 -->
		<div class="tableWriteBox">
			<c:forEach var="item" items="${option}" varStatus="status">
			<ul>
				<li class="title w20p">옵션${item.seq}</li>
				<li class="content">
					${fn:escapeXml(item.val)}
				</li>
			</ul>
			</c:forEach>
		</div>
		</form>
		<!-- 테이블 끝 //-->

		<!--// bottom button -->
		<div class="bottomButton">
			<div class="left">
				<a href="#" onclick="fnList();return false;" class="btnBg"><span class="icon_list"></span>목록</a>
			</div>
			<div class="right">
				<c:if test="${(sessionScope.userInfo.auth == 'SAA') || (sessionScope.userInfo.auth == 'CPA' && result.restriction != 'all')}">
					<a href="#" onclick="fnDelete('${result.cateId}','${result.id}');return false;" class="btnBg"><span class="icon_delete"></span>삭제</a>
					<a href="#" onclick="fnEditForm('${result.id}');return false;" class="btnBg"><span class="icon_modify"></span>수정</a>
				</c:if>
			</div>
		</div>
		<!-- bottom button //-->

	</div>
	<!-- 컨텐츠 끝 //-->

</div>

<!-- 검증 샘플 팝업 시작 -->
<div class="popLayer definiteWritePop">
	<form id="formTest" method="get">
	<div class="popTitle">
		<h1>검증 샘플 입력</h1>
		<a href="#" onclick="return false;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popContent">
		<div class="sub_table" id="addTestOption">
			<c:forEach var="item" items="${test}" varStatus="status">
			<ul class="box">
				<li class="w96p">${fn:escapeXml(item.testInput)}</li>
				<li class="btn"></li>
			</ul>
			</c:forEach>
		</div>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="#" onclick="return false;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
		</div>
	</div>
	</form>
</div>
<!-- 검증 샘플 팝업 끝 -->

<!-- 이미지 미리보기 팝업 시작 -->
<div class="popLayer previewPop">
	<div class="popTitle">
		<h1>이미지 미리보기</h1>
		<a href="#" onclick="return false;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popPreviewContent">
		<ul>
			<li class="ktConsultant"><img src="./images/kt_logo.png" alt="kt로고"/></li>
			<li class="consultation">
				<div class="answer">
					<p class="top">질문입니다</p>
					<p class="center"><img src="./images/sample.png" id="imageTempUrl" /></p>
					<p class="bottom"><span class="title">답변입니다.</span></p>
				</div>
			</li>
		</ul>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="#" onclick="return false;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
		</div>
	</div>
</div>
<!-- 이미지 미리보기 팝업 끝 -->

<script type="text/javascript">
	//검증샘플 보기 레이어 팝업
	function fnViewTestLayer(){
		$(".definiteWritePop, .searchDimm").show();
		$(".definiteWritePop").center();
	}
	
	//이미지 미리보기 레이어 팝업
	function fnViewImageLayer(){
		if($("#imageUrl").val() == ""){
			alert("이미지 url를 등록하세요.");
			return false;
		}
		
		$("#imageTempUrl").attr("src",$("#imageUrl").val());
		$(".previewPop, .searchDimm").show();
		$(".previewPop").center();
	}
	
	//목록
	function fnList(){
		$("#formPageing").attr("action", "<c:url value='/listChat'/>");
		$("#formPageing").submit();
	}
	
	//삭제
	function fnDelete(cateId,id){
		var answer = confirm("삭제 하시겠습니까?");
	    if (answer == true){
	    	$.ajax({    		
	        	url : "<c:url value='/deleteChat'/>",
	        	data: "cateId="+ cateId +"&id="+ id, 
	        	type: 'GET', 
	            dataType: 'json', 
	        	success : function(response){  
	        		if (response.status == 'FAIL') {
	        			alert(response.message);
	                } else {
	                	alert("삭제 되었습니다.");
	                	location.href = "<c:url value='/listChat'/>";
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
		$("#formPageing").attr("action", "<c:url value='/editChat'/>");
		$("#formPageing").submit();
	}
</script>

<%@ include file="../include/commonFooter.jsp" %>	