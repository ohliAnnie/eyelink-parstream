<%--
 Class Name  : listPred.jsp
 Description : 콘텐츠 관리 - Properties 목록
 
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

<hr class="blind">
<div class="searchGrpContent">
	<!--// 컨텐츠 시작 -->
	<div class="searchGrpContentBox content">
		<!--// 타이틀 및 위치안내 시작 -->
		<div class="titleBox">
			<h3 class="contentTitle">Properties</h3>
			<p class="location">
				홈 > 콘텐츠 관리 > Properties 관리 > 목록
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->
		
		<!--// 정보안내 시작 -->
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> BOT이 사용하는 글로벌한 상수값을 설정 할 수 있습니다.<br/>
				<span class="bul_txt">&#42;</span> ‘공용’으로 설정된 카테고리의 Properties도 노출됩니다.<br/>
			</p>
		</div>
		<!-- 정보안내 끝 //-->

		<!--// topContent -->
		<form id="formPageing" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo">
		<input type="hidden" id="cateId" name="cateId" value="${search.cateId}">
		<input type="hidden" id="order" name="order" value="${search.order}">
		<input type="hidden" id="cpId" name="cpId" value="${search.cpId}">
		<input type="hidden" id="searchType" name="searchType" value="${search.searchType}">
		<input type="hidden" id="searchKeyword" name="searchKeyword" value="${search.searchKeyword}">
		</form>
		<form id="formSearch" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${paging.pageNum}">
		<input type="hidden" id="cateId" name="cateId" value="${search.cateId}">
		<input type="hidden" id="order" name="order" value="${search.order}">
		<div class="topContent">
			<div class="left">
				<ul>
					<li class="title">CP</li>
					<li class="content">
						<select class="selectmenu" id="cpId" name="cpId">
							<c:if test="${sessionScope.userInfo.auth == 'SAA'}">
							<option value="0" ${0 == search.cpId ? 'selected="selected"' : '' }>전체</option>
							</c:if>
							<c:forEach var="cp" items="${result}" varStatus="status">		
								<option value="${cp.id}" ${cp.id == search.cpId ? 'selected="selected"' : '' }>${cp.label}</option>
							</c:forEach>
						</select>
					</li>
					<li class="title">검색</li>
					<li class="content">
						<select class="selectmenu" id="searchType" name="searchType">
							<option value="" ${'' == search.searchType ? 'selected="selected"' : '' }>선택</option>
							<option value="cateName" ${'cateName' == search.searchType ? 'selected="selected"' : '' }>카테고리</option>
							<option value="name" ${'name' == search.searchType ? 'selected="selected"' : '' }>이름</option>
							<option value="val" ${'val' == search.searchType ? 'selected="selected"' : '' }>값</option>
						</select>
						<input type="text" id="searchKeyword" name="searchKeyword" value="${search.searchKeyword}" />
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
			<div class="left">
				<a href="#" onclick="fnUploadLayer(); return false;" class="btnBg"><span class="icon_excelupload"></span>업로드</a>
				<a href="#" onclick="fnDownload(); return false;" class="btnBg"><span class="icon_exceldownload"></span>다운로드</a>				
			</div>
			<div class="right">
				<a href="#" onclick="fnAdd(); return false;" class="btnBg"><span class="icon_write"></span>신규생성</a>				
			</div>
		</div>
		<!-- topButton //-->

		<!--// 테이블 시작 -->
		<div class="tableList fixed">
			<table>
				<caption>Properties-NO, 카테고리, 이름(name), 값(value), 편집(수정, 삭제)</caption>
				<colgroup>
					<col class="w1 w5p">
					<col class="w2">
					<col class="w3">
					<col class="w4">
					<col class="w5 w150px">
				</colgroup>
				<thead>
					<tr>
						<th scope="col">NO</th>
						<th scope="col">카테고리</th>
						<th scope="col">
							<p class="keyword">이름(name)</p>
							<div class="up_down">
								<a href="#" onclick="fnOrder('nameDesc');return false;" class="btnBg up"><span class="icon_up"></span></a>
								<a href="#" onclick="fnOrder('nameAsc');return false;" class="btnBg down"><span class="icon_down"></span></a>
							</div>
						</th>
						<th scope="col">값(value)</th>
						<th scope="col">편집</th>
					</tr>
				</thead>
				<tbody>
					<c:choose>
						<c:when test="${fn:length(results) > 0}">
							<c:forEach var="item" items="${results}" varStatus="status">
							<tr>
								<td>${(paging.totalCount - status.index) - ((paging.pageNum - 1) * paging.PAGESIZE)}</td>
				      			<td class="txtL">${item.cateName}</td>
				      			<td>${item.name}</td>
				      			<td>${item.val}</td>
				      			<td class="btnBox">
				      				<c:if test="${(sessionScope.userInfo.auth == 'SAA') || (sessionScope.userInfo.auth == 'CPA' && item.restriction != 'all')}">
			      						<a href="#" onclick="fnEditLayer('${item.cateId}','${item.name}');return false;" class="btnBg"><span class="icon_modify"></span>수정</a>
				      					<a href="#" onclick="fnDelete('${item.cateId}','${item.name}');return false;" class="btnBg"><span class="icon_delete"></span>삭제</a>
			      					</c:if>				      				
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

<!-- 수정 팝업 시작 -->
<div class="popLayer writeCategorySet">
	<form id="form" method="post">
	<input type="hidden" id="cateId" name="cateId" />
	<div class="popTitle">
		<h1>수정</h1>
		<a href="#" onclick="return false;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popTableBox">
		<div class="popTable">
			<ul>
				<li class="title">이름 <span class="required"></span></li>
				<li class="content">
					<input type="text" id="name" name="name"  maxlength="128" readonly/>
				</li>
			</ul>
			<ul>
				<li class="title">값 <span class="required"></span></li>
				<li class="content">
					<input type="text" id="val" name="val"  maxlength="128"/>
				</li>
			</ul>
		</div>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="#" onclick="return false;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
			<a href="#" onclick="fnEdit();return false;" class="btnBg"><span class="icon_save"></span>저장</a>
		</div>
	</div>
	</form>
</div>
<!-- 수정 팝업 끝 -->

<!-- 업로드 팝업 시작 -->
<div class="popLayer excelUpload">
	<form id="formFile" method="post" enctype="multipart/form-data">
	<input type="hidden" name="cpId" id="cpId"/>
	<div class="popTitle">
		<h1>안내</h1>
		<a href="javascript:;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popContent">
		<div class="alert">
			<input type="file" name="file" class="fileUpload"/>
		</div>
	</div>
	<div class="bottomButton">
		<div class="left">&nbsp;
			<a href="#" class="btnBg" onclick="fnSampleDownload(); return false;" id="sampleBtn">
			<span class="icon_exceldownload"></span>샘플 다운로드</a> 	
		</div>
		<div class="right">
			<a href="javascript:;" class="btnBg closePop"><span class="icon_cancel"></span>취소</a>
			<a href="#" onclick="fnUpload();return false;" class="btnBg"><span class="icon_ok"></span>확인</a>
		</div>
	</div>
	</form>
</div>
<!-- 업로드 팝업 끝 -->

<!-- 업로드 로딩안내 시작 -->
<div class="popLayer loading">
	<form id="formUpload" method="post">
	<input type="hidden" name="filename" id="filename"/>
	<div class="popTitle">
		<h1>안내</h1><a href="javascript:location.reload();" class="btnBg closePopBox" style="display:none;"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popContent">
		<div class="alert">
			<p class="pointTxt">업로드중입니다.</p>
			<p id="errorBtn" style="display:none;">
				<a href="#" class="btnBg" onclick="fnErrorDownload(); return false;">
				<span class="icon_exceldownload"></span>결과리스트 다운로드</a>
			</p>
		</div>
	</div>
	<div class="bottomButton" style="display:none;">
		<div class="right">
			<a href="javascript:location.reload();" class="btnBg closeBtn"><span class="icon_cancel"></span>닫기</a>
		</div>
	</div>
	</form>
</div>
<!-- 업로드 로딩안내 끝 -->
	
<script type="text/javascript">
	$("#formSearch #searchKeyword").keydown(function (key) { 
	    if(key.keyCode == 13){
	    	fnSearch();
	    	return false;
	    } 
	});

	//검색 
	function fnSearch(){
		if(($("#formSearch #searchType").val() == "" && $("#formSearch #searchKeyword").val() != "") || ($("#formSearch #searchType").val() != "" && $("#formSearch #searchKeyword").val() == "")){
			alert("검색 조건을 확인해주세요.");
			return false;
		}
		
		$("#formSearch #currentPageNo").val(1);
		$("#formSearch").attr("action", "<c:url value='/listProp'/>");
		$("#formSearch").submit();
	}
	
	//목록 - 오더링
	function fnOrder(order){
		$("#formSearch #order").val(order);
		$("#formSearch #currentPageNo").val(1);
		$("#formSearch").attr("action", "<c:url value='/listProp'/>");
		$("#formSearch").submit();
	}

	//목록 - 페이징
	function fnPage(page){		
		$("#formPageing #currentPageNo").val(page);
		$("#formPageing").attr("action", "<c:url value='/listProp'/>");
		$("#formPageing").submit();
	}

	//신규등록
	function fnAdd(){
		location.href = "<c:url value='/addProp'/>";
	}
	
	//수정 레이어 팝업
	function fnEditLayer(cateId,name){
		$("#form")[0].reset(); //초기화
		$('#form #cateId').val(cateId);
		$('#form #name').val(name);
		
		var formData = $('#form').serializeArray();
		$.ajax({    		
			url: "<c:url value='/detailProp'/>",
			data: formData, 
        	type: 'POST', 
            dataType: 'json', 
        	success : function(response){
        		var val = response.val;
        		
        		$("#form #val").val(val);
        		$(".writeCategorySet, .searchDimm").show();
        		$(".writeCategorySet").center();
            },
            error: function(request, status, error){
            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
            }
    	});		
	}
	
	//수정
	function fnEdit(){
		if($('#form').valid()){	
			var formData = $('#form').serializeArray();
		    var answer = confirm("저장 하시겠습니까?");
		    if (answer == true){
		    	$.ajax({    		
		        	url : "<c:url value='/editProp'/>",
		        	data: formData, 
		        	type: 'POST', 
		            dataType: 'json', 
		        	success : function(response){  
		        		if (response.status == 'FAIL') {
		        			alert(response.message);
		                } else {
		                	alert("저장 되었습니다.");
		                	location.reload();
		                }
		            },
		            error: function(request, status, error){
		            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
		            }
		    	});
		    }			
		}		
	}
	
	//삭제
	function fnDelete(cateId,name){
		$("#form")[0].reset(); //초기화
		$('#form #cateId').val(cateId);
		$('#form #name').val(name);
		
		var formData = $('#form').serializeArray();
		var answer = confirm("삭제 하시겠습니까?");
	    if (answer == true){
	    	$.ajax({    		
	        	url : "<c:url value='/deleteProp'/>",
	        	data: formData, 
	        	type: 'GET', 
	            dataType: 'json', 
	        	success : function(response){  
	        		if (response.status == 'FAIL') {
	        			alert(response.message);
	                } else {
	                	alert("삭제 되었습니다.");
	                	location.reload();
	                }
	            },
	            error: function(request, status, error){
	            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
	            }
	    	});
	    }
	}
	
	//업로드
	function fnUploadLayer(){	
		if($("#formSearch #cpId").val() == "0"){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		$("#formFile")[0].reset(); 
		$("#formFile #cpId").val($("#formSearch #cpId").val());
		$(".excelUpload, .searchDimm").show();
		$(".excelUpload").center();
	}
	
	function fnUpload(){
		if($('#formFile').valid()){				
			var formData = new FormData($("#formFile")[0]);
			var answer = confirm("등록 하시겠습니까?");
		    if (answer == true){
		    	$.ajax({    		
		        	url : "<c:url value='/uploadProp'/>",
		        	data: formData, 
		        	type: 'POST', 
		            dataType: 'json', 
		            processData: false,
	        	    contentType: false,
		        	success : function(response){  
		        		if (response.status == 'FAIL') {
		        			$(".loading .pointTxt").html(response.message);        			
		                } else {
		                	$(".loading #filename").val(response.filename);
		                	$(".loading .pointTxt").html(response.message);
		                	$(".loading #errorBtn").show();
		                }
		            },
		            error: function(request, status, error){
		            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
		            },
		            beforeSend:function(){
		            	$(".excelUpload").hide();
		                $(".loading").show();
		        		$(".loading").center();
		            },
		            complete:function(){
		            	$(".loading .closePopBox").show();
		            	$(".loading .bottomButton").show();
		            }
		    	});
		    }
		}
	}
	
	//다운로드
	function fnDownload(){
		if($("#formSearch #cpId").val() == "0"){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		$("#formSearch").attr("action", "<c:url value='/downloadProp'/>");
		$("#formSearch").submit();
	}
	
	//샘플파일 다운로드
	function fnSampleDownload(){
		location.href = "<c:url value='/downloadSampleProp'/>";
	}
	
	//오류파일 다운로드
	function fnErrorDownload(){
		$("#formUpload").attr("action", "<c:url value='/downloadErrorProp'/>");
		$("#formUpload").submit();
	}
	
	//유효성 체크
	$('#form').validate({
		rules: {
			name: {required:true},
			val: {required:true}
		},
		messages: {
			name: {
				required:"이름을 확인 하세요."
			},
			val: {
				required:"값를 확인 하세요."
			}
		},
		onkeyup : false,           
        onclick : false,           
        onfocusout : false,          
        showErrors : function(errorMap, errorList) {
            if(errorList.length) {
                alert(errorList[0].message);
                $(errorList[0].element).focus();
            }
        }    
	});
	
	$('#formFile').validate({
		rules: {
			file: {required:true,fileext:true}
		},
		messages: {
			file: {
				required:"파일을 확인 하세요.",
				fileext:"파일는 .csv만 가능합니다."
			}
		},
		onkeyup : false,           
        onclick : false,           
        onfocusout : false,          
        showErrors : function(errorMap, errorList) {
            if(errorList.length) {
                alert(errorList[0].message);
                $(errorList[0].element).focus();
            }
        }    
	});
</script>

<%@ include file="../include/commonFooter.jsp" %>	