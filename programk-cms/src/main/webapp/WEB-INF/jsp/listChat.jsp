<%--
 Class Name  : listAiml.jsp
 Description : 콘텐츠 관리 - 대화 목록
 
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
			<h3 class="contentTitle">대화</h3>
			<p class="location">
				홈 > 콘텐츠 관리 > 대화 관리 > 목록
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->
		
		<!--// 정보안내 시작 -->
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> 질문 패턴에 따른 답변을 생성/수정/삭제 할 수 있습니다.<br/>
			    <span class="bul_txt">&#42;</span> ‘공용’으로 설정된 카테고리의 대화도 노출됩니다.<br/>
				<span class="bul_txt">&#42;</span> 파일 업로드 시 업로드 잠금이 Y로 되어 있지 않는 모든 카테고리의 데이터가 삭제되고 파일의 데이터로 대체됩니다.<br/>
			</p>
		</div>
		<!-- 정보안내 끝 //-->		

		<!--// topContent -->
		<form id="formPageing" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${paging.pageNum}">
		<input type="hidden" id="cateId" name="cateId" value="${search.cateId}">
		<input type="hidden" id="cpId" name="cpId" value="${search.cpId}">
		<input type="hidden" id="searchType" name="searchType" value="${search.searchType}">
		<input type="hidden" id="searchKeyword" name="searchKeyword" value="${search.searchKeyword}">
		<input type="hidden" id="id" name="id" value="0">
		</form>
		<form id="formSearch" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${paging.pageNum}">
		<input type="hidden" id="cateId" name="cateId" value="${search.cateId}">
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
							<option value="id" ${'id' == search.searchType ? 'selected="selected"' : '' }>대화ID</option>
							<option value="cateName" ${'cateName' == search.searchType ? 'selected="selected"' : '' }>카테고리</option>
							<option value="input" ${'input' == search.searchType ? 'selected="selected"' : '' }>질문</option>
							<option value="reply" ${'reply' == search.searchType ? 'selected="selected"' : '' }>답변</option>
							<option value="testInput" ${'testInput' == search.searchType ? 'selected="selected"' : '' }>검증샘플</option>
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
				<a href="#" onclick="fnDeploy(); return false;" class="btnBg"><span class="icon_ok"></span>개발배포</a>
				<a href="#" onclick="fnTest(); return false;" class="btnBg"><span class="icon_ok"></span>개발검증</a>				
			</div>
		</div>
		<!-- topButton //-->

		<!--// 테이블 시작 -->
		<div class="tableList fixed">
			<table>
				<caption>대화 카테고리 설정-NO, 대화 ID, 카테고리, 질문, 답변, 편집(수정, 삭제)</caption>
				<colgroup>
					<col class="w1 w50px">
					<col class="w2 w25p">
					<col class="w3 w25p">
					<col class="w4 w25p">
					<col class="w5 w25p">
					<col class="w6 w260px">
				</colgroup>
				<thead>
					<tr>
						<th scope="col">NO</th>
						<th scope="col">대화 ID</th>
						<th scope="col">카테고리</th>
						<th scope="col">질문</th>
						<th scope="col">답변</th>
						<th scope="col">편집</th>
					</tr>
				</thead>
				<tbody>
					<c:choose>
						<c:when test="${fn:length(results) > 0}">
							<c:forEach var="item" items="${results}" varStatus="status">
							<tr>
								<td>${(paging.totalCount - status.index) - ((paging.pageNum - 1) * paging.PAGESIZE)}</td>
				      			<td>${item.id}</td>
				      			<td class="txtL">${item.cateName}</td>
				      			<td class="txtL eps tooltip"><nobr><a href="#" onclick="return false;" title="${fn:escapeXml(item.input)}">${fn:escapeXml(item.input)}</a></nobr></td>				      			
				      			<td class="txtL eps tooltip"><nobr><a href="#" onclick="return false;" title="${fn:escapeXml(item.reply)}">${fn:escapeXml(item.reply)}</a></nobr></td>
				      			<td class="btnBox">
				      				<a href="#" onclick="fnDetail('${item.id}');return false;" class="btnBg"><span class="icon_ok"></span>상세</a>
				      				<c:if test="${(sessionScope.userInfo.auth == 'SAA') || (sessionScope.userInfo.auth == 'CPA' && item.restriction != 'all')}">
			      						<a href="#" onclick="fnEdit('${item.id}');return false;" class="btnBg"><span class="icon_modify"></span>수정</a>
			      						<a href="#" onclick="fnDelete('${item.cateId}','${item.id}');return false;" class="btnBg"><span class="icon_delete"></span>삭제</a>
			      						<a href="#" onclick="fnCopy('${item.id}');return false;" class="btnBg"><span class="icon_copy"></span>복사</a>
			      					</c:if>
				      			</td>
							</tr>
							</c:forEach>
						</c:when>
						<c:otherwise>
							<tr>
			                  	<td colspan="6">조회 항목과 일치하는 결과가 없습니다.</td>
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

<!-- 검증 로딩안내 시작 -->
<div class="popLayer test" style="width:450px;">
	<form id="formTest" method="post">
	<input type="hidden" name="filename" id="filename"/>
	<div class="popTitle">
		<h1>안내</h1><a href="javascript:location.reload();" class="btnBg closePopBox" style="display:none;"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popContent">
		<div class="alert">
			<p class="pointTxt">배포중입니다.</p>
			<p id="errorBtn" style="display:none;">
				<a href="#" class="btnBg" onclick="fnTestErrorDownload(); return false;">
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
<!-- 검증 로딩안내 끝 -->
	
<script type="text/javascript">
	$("#formSearch #searchKeyword").keydown(function (key) { 
	    if(key.keyCode == 13){
	    	
	    	if(($("#formSearch #searchType").val() == "" && $("#formSearch #searchKeyword").val() != "") || ($("#formSearch #searchType").val() != "" && $("#formSearch #searchKeyword").val() == "")){
				alert("검색 조건을 확인해주세요.");
				return false;
			}
			
			if($("#formSearch #searchType").val() == "id"){
				if(!/^[0-9]+$/.test($("#formSearch #searchKeyword").val())){
					alert("대화 ID는 숫자만 가능합니다.");
					return false;
				}
			}
			
	    	fnSearch();
	    } 
	});
	
	//검색 
	function fnSearch(){
		if(($("#formSearch #searchType").val() == "" && $("#formSearch #searchKeyword").val() != "") || ($("#formSearch #searchType").val() != "" && $("#formSearch #searchKeyword").val() == "")){
			alert("검색 조건을 확인해주세요.");
			return false;
		}
		
		if($("#formSearch #searchType").val() == "id"){
			if(!/^[0-9]+$/.test($("#formSearch #searchKeyword").val())){
				alert("대화 ID는 숫자만 가능합니다.");
				return false;
			}
		}
		
		$("#formSearch #currentPageNo").val(1);
		$("#formSearch").attr("action", "<c:url value='/listChat'/>");
		$("#formSearch").submit();
	}
	
	//목록 - 페이징
	function fnPage(page){		
		$("#formPageing #currentPageNo").val(page);
		$("#formPageing").attr("action", "<c:url value='/listChat'/>");
		$("#formPageing").submit();
	}
	
	//신규등록
	function fnAdd(){
		$("#formPageing").attr("action", "<c:url value='/addChat'/>");
		$("#formPageing").submit();
	}
	
	//상세
	function fnDetail(id){
		$("#formPageing #id").val(id);
		$("#formPageing").attr("action", "<c:url value='/detailChat'/>");
		$("#formPageing").submit();
	}
	
	//수정
	function fnEdit(id){
		$("#formPageing #id").val(id);
		$("#formPageing").attr("action", "<c:url value='/editChat'/>");
		$("#formPageing").submit();
	}
	
	//복사
	function fnCopy(id){
		$("#formPageing #id").val(id);
		$("#formPageing").attr("action", "<c:url value='/copyChat'/>");
		$("#formPageing").submit();
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
			var answer = confirm("파일 업로드 시 업로드 잠금이 Y로 되어 있지 않는 모든 카테고리의 데이터가 삭제되고 파일의 데이터로 대체됩니다. 업로드 하시겠습니까?");
		    if (answer == true){
		    	$.ajax({    		
		        	url : "<c:url value='/uploadChat'/>",
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

		$("#formSearch").attr("action", "<c:url value='/downloadChat'/>");
		$("#formSearch").submit();
	}
	
	//샘플파일 다운로드
	function fnSampleDownload(){
		location.href = "<c:url value='/downloadSampleChat'/>";
	}
	
	//오류파일 다운로드
	function fnErrorDownload(){
		$("#formUpload").attr("action", "<c:url value='/downloadErrorChat'/>");
		$("#formUpload").submit();
	}
	
	//배포
	function fnDeploy(){
		if($("#formSearch #cpId").val() == "0"){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		var cpId = $("#formSearch #cpId option:selected").val();	
		var label = $("#formSearch #cpId option:selected").text();	
		var answer = confirm("개발배포 하시겠습니까?");
	    if (answer == true){
	    	$.ajax({    		
	        	url : "<c:url value='/testDeployChat'/>",
	        	data: "cpId="+cpId+"&label="+label, 
	        	type: 'GET', 
	        	success : function(response){ 
	        		if (response.status == 'FAIL') {
	        			$(".test .pointTxt").html(response.message.replace("null",""));		        			
	                } else {
	                	$(".test .pointTxt").html("개발배포가 완료되었습니다.");
	                }
	            },
	            error: function(request, status, error){
	            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
	            },
	            beforeSend:function(){
	            	$(".test, .searchDimm").show();
	        		$(".test").center();
	            },
	            complete:function(){
	            	$(".test .closePopBox").show();
	            	$(".test .bottomButton").show();
	            	$(".test").center();
	            }
	    	});
	    }
	}
	
	//검증
	function fnTest(){
		if($("#formSearch #cpId").val() == "0"){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		var cpId = $("#formSearch #cpId option:selected").val();	
		var label = $("#formSearch #cpId option:selected").text();	
		var answer = confirm("최신 데이터를 검증하시려면 개발배포를 먼저 진행해 주세요.\n검증 하시겠습니까?");
	    if (answer == true){
			$.ajax({    		
	        	url : "<c:url value='/testChat'/>",
	        	data: "cpId="+cpId+"&label="+label, 
	        	type: 'GET', 
	        	success : function(response){ 
	        		if (response.status == 'FAIL') {
	        			$(".test .pointTxt").html(response.message.replace("null",""));	        			
	                } else {
	                	$(".test #filename").val(response.filename);
	                	$(".test .pointTxt").html(response.message);	                	
		            	$(".test #errorBtn").show();
	                }
	            },
	            error: function(request, status, error){
	            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
	            },
	            beforeSend:function(){
	            	$(".test .pointTxt").text("검증중입니다.");
	            	$(".test, .searchDimm").show();
	        		$(".test").center();
	            },
	            complete:function(){
	            	$(".test .closePopBox").show();
                	$(".test .bottomButton").show();
	            }
	    	});	
	    }
	}
	
	//검증파일 다운로드
	function fnTestErrorDownload(){
		if($("#formSearch #cpId").val() == "0"){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		$("#formTest").attr("action", "<c:url value='/downloadErrorTest'/>");
		$("#formTest").submit();
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
	                	location.reload();
	                }
	            },
	            error: function(request, status, error){
	            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
	            }
	    	});
	    }
	}
	
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