<%--
 Class Name  : listAimlCategory.jsp
 Description : 콘텐츠 관리 - 대화 카테고리 목록
 
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
			<h3 class="contentTitle">대화 카테고리 설정</h3>
			<p class="location">
				홈 > 콘텐츠 관리 > 대화 관리 > 카테고리 설정
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->
		
		<!--// 정보안내 시작 -->
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> 대화들을 카테고리로 묶어서 관리할 수 있습니다.<br/>
				<span class="bul_txt">&#42;</span> ‘공용’으로 설정된 카테고리도 노출됩니다.<br/>
					1)배포여부를'Y'로 설정하면, 각 CP에 배포됩니다.<br/>
					2)등록 및 수정은 슈퍼관리자만 가능합니다.<br/>
				<span class="bul_txt">&#42;</span> 배포여부를 'Y'로 설정한 카테고리만 배포됩니다.<br/>
			</p>
		</div>
		<!-- 정보안내 끝 //-->

		<!--// topContent -->
		<form id="formPageing" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo">
		<input type="hidden" id="cpId" name="cpId" value="${search.cpId}">
		<input type="hidden" id="restriction" name="restriction" value="${search.restriction}">
		<input type="hidden" id="name" name="name" value="${search.name}">
		</form>
		<form id="formSearch" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${paging.pageNum}">
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
					<li class="title">유형</li>
					<li class="content">
						<select class="selectmenu" id="restriction" name="restriction">
							<option value="" ${'' == search.restriction ? 'selected="selected"' : '' }>전체</option>
							<c:forEach var="category" items="${categoryType}" varStatus="status">		
								<option value="${category.value}" ${category.value == search.restriction ? 'selected="selected"' : '' }>${category.label}</option>
							</c:forEach>
						</select>
					</li>
					<li class="title">검색</li>
					<li class="content">
						<input type="text" id="name" name="name" value="${search.name}" />
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
			<div class="right">
				<a href="#" onclick="fnAddLayer(); return false;" class="btnBg"><span class="icon_write"></span>신규생성</a>
			</div>
		</div>
		<!-- topButton //-->

		<!--// 테이블 시작 -->
		<div class="tableList">
			<table>
				<!--<caption>대화 카테고리 설정-NO, 카테고리, 토픽, 토픽 설정, 유형, 등록건수, 사용여부, 배포여부, 업로드 잠금, 편집(수정, 삭제)</caption>-->
				<caption>대화 카테고리 설정-NO, 카테고리, 유형, 등록건수, 사용여부, 배포여부, 업로드 잠금, 편집(수정, 삭제)</caption>
				<colgroup>
					<col class="w1 w5p">
					<col class="w2">
				<!--<col class="w3">
					<col class="w4 w50px"> -->
					<col class="w5 w10p">					
					<col class="w6 w10p">
				<!--<col class="w7 w50px">
					<col class="w8 w50px">
					<col class="w9 w60px"> -->
					<col class="w7 w10p">
					<col class="w8 w10p">
					<col class="w9 w10p">
					<col class="w10 w150px">
				</colgroup>
				<thead>
					<tr>
						<th scope="col">NO</th>
						<th scope="col">카테고리</th>
					<!--<th scope="col">토픽</th>
						<th scope="col">토픽 설정</th> -->
						<th scope="col">유형</th>						
						<th scope="col">등록건수</th>
						<th scope="col">사용 여부</th>
						<th scope="col">배포 여부</th>
						<th scope="col">업로드 잠금</th>
						<th scope="col">편집</th>
					</tr>
				</thead>
				<tbody>
					<c:choose>
						<c:when test="${fn:length(results) > 0}">
							<c:forEach var="item" items="${results}" varStatus="status">
							<tr>
								<td>${(paging.totalCount - status.index) - ((paging.pageNum - 1) * paging.PAGESIZE)}</td>
				      			<td class="txtL"><a href="#" onclick="fnDetailChat('${item.id}');return false;">${item.name}</a></td>
				      		<!--<td>${item.topicName}</td>
				      			<td>${item.topic}</td> -->
				      			<td>
				      				<c:forEach var="category" items="${categoryType}">		
				      				<c:if test="${category.value == item.restriction}">
				      					${category.label}
				      				</c:if>
									</c:forEach>
				      			</td>
				      			<td>${item.count}</td>
				      			<td>${item.enabled}</td>
				      			<td>${item.deploy}</td>
				      			<td>${item.uploadLock}</td>
				      			<td class="btnBox">
				      				<c:choose>
				      					<c:when test="${sessionScope.userInfo.auth == 'CPA' && item.restriction == 'all' && item.enabled == 'N'}">
				      					</c:when>
				      					<c:when test="${sessionScope.userInfo.auth == 'CPA' && item.restriction == 'all' && item.enabled == 'Y'}">
				      						<a href="#" onclick="fnEditLayer(2,'${item.id}');return false;" class="btnBg"><span class="icon_modify"></span>배포</a>
				      					</c:when>
				      					<c:otherwise>
				      						<a href="#" onclick="fnEditLayer(1,'${item.id}');return false;" class="btnBg"><span class="icon_modify"></span>수정</a>
				      						<a href="#" onclick="fnDelete('${item.id}','${item.cpId}');return false;" class="btnBg"><span class="icon_delete"></span>삭제</a>
				      					</c:otherwise>
				      				</c:choose>				      				
				      			</td>
							</tr>
							</c:forEach>
						</c:when>
						<c:otherwise>
							<tr>
								<td colspan="9">조회 항목과 일치하는 결과가 없습니다.</td>
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

<!-- 카테고리 생성 팝업 시작 -->
<div class="popLayer writeCategorySet">
	<form id="form" method="post">
	<input type="hidden" id="type" name="type"/>	
	<input type="hidden" id="id" name="id" value="0"/>
	<input type="hidden" id="isName" name="isName" value="1" />
	<div class="popTitle">
		<h1>카테고리 생성</h1>
		<a href="#" onclick="return false;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popTableBox">
		<div class="popTable">
			<ul id="cpUl">
				<li class="title">CP <span class="required"></span></li>
				<li class="content">
					<select id="tmp_cpId" name="tmp_cpId" style="display:none;">
						<c:forEach var="cp" items="${result}" varStatus="status">
							<option value="${cp.id}">${cp.label}</option>
						</c:forEach>				
					</select>
					<select class="selectmenu w100p" id="cpId" name="cpId">
						<c:forEach var="cp" items="${result}" varStatus="status">
							<option value="${cp.id}">${cp.label}</option>
						</c:forEach>				
					</select>
				</li>
			</ul>
			<ul id="restrictionUl">
				<li class="title">유형 <span class="required"></span></li>
				<li class="content">
					<select class="selectmenu w100p" id="restriction" name="restriction">
						<c:forEach var="category" items="${categoryType}" varStatus="status">		
							<c:choose>
								<c:when test="${sessionScope.userInfo.auth != 'SAA'}">
									<c:if test="${category.value == 'owner'}">
									<option value="${category.value}">${category.label}</option>
									</c:if>
								</c:when>
								<c:otherwise>
									<option value="${category.value}">${category.label}</option>
								</c:otherwise>
							</c:choose>
						</c:forEach>
					</select>
				</li>
			</ul>
			<ul id="nameUl">
				<li class="title">카테고리 <span class="required"></span></li>
				<li class="content">
					<input type="text" id="name" name="name"  maxlength="128"/>
					<a href="#" onclick="fnIsName();return false;" class="btnBg"><span class="icon_search"></span>중복확인</a>
				</li>
			</ul>
		<!--<ul id="topicUl">
			<li class="title">토픽설정</li>
				<li class="content">
					<c:forEach var="topic" items="${topicType}" varStatus="status">	
						<input type="radio" id="topic${status.index}" name="topic" value="${topic.value}"/><label for="topic${status.index}">${topic.value}</label>
					</c:forEach>
					<div id="topicNameInput" style="display:none"><input type="text" class="inputTopics" id="topicName" name="topicName"  maxlength="128"/></div>
				</li>
			</ul> -->
			<ul id="enabledUl">
				<li class="title">사용여부</li>
				<li class="content">
					<c:forEach var="enabled" items="${enabledType}" varStatus="status">		
						<input type="radio" id="enabled${status.index}" name="enabled" value="${enabled.value}"/><label for="enabled${status.index}">${enabled.value}</label>
					</c:forEach>
				</li>
			</ul>
			<ul id="deployUI">
				<li class="title">배포여부</li>
				<li class="content">
					<c:forEach var="deploy" items="${enabledType}" varStatus="status">		
						<input type="radio" id="deploy${status.index}" name="deploy" value="${deploy.value}"/><label for="deploy${status.index}">${deploy.value}</label>
					</c:forEach>
				</li>
			</ul>
			<ul id="uploadLockUl">
				<li class="title">업로드 잠금</li>
				<li class="content">
					<c:forEach var="uploadLock" items="${enabledType}" varStatus="status">		
						<input type="radio" id="uploadLock${status.index}" name="uploadLock" value="${uploadLock.value}"/><label for="uploadLock${status.index}">${uploadLock.value}</label>
					</c:forEach>
				</li>
			</ul>
			
		</div>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="#" onclick="return false;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
			<a href="#" onclick="fnAction();return false;" class="btnBg"><span class="icon_save"></span>저장</a>
		</div>
	</div>
	</form>
</div>
<!-- 카테고리 생성 팝업 끝 -->
	
<script type="text/javascript">
	$(document).ready(function(){
		//cpid 변경 될때		
		$("#form #cpId").selectmenu({
		   change: function( event, data ) {
		   		fnRestriction(data.item.label,'');
		   }
		});
		
		fnRestriction('','');
		
		//카테고리명 변경 될때
		$("#form input[name='name']").change(function(){
			$("#isName").val("");
		});	
		
		$("#form input[name='name']").keydown(function (key) { 
		    if(key.keyCode == 13){
		    	fnIsName();
		    } 
		});	
		
		//토픽여부 변경 될때
	/*$("#form input[name='topic']").click(function(){			
			if($(this).val() == "Y"){
				$("#topicNameInput").show();
			}else{
				$("#topicNameInput").hide();
			}
		});*/
	});
	
	//유형 세팅
	function fnRestriction(val,selval){		
		if(val == ""){
			val = $("#form #cpId option:eq(0)").text();
		}
		
        $("#form #restriction option").each(function(){
        	if(selval != "") {
        		if($(this).val() == selval){
                	$(this).attr("disabled", false);
                }else{
                	$(this).attr("disabled", true);
                }
        	}else{
        		if(val != "SuperBot" && $(this).val() == "all"){
                	$(this).attr("disabled", true);
                }else{
                	$(this).attr("disabled", false);
                }
        	}            
        });
        
        if(selval == "") selval = "owner";
        
        $("#form #restriction").val(selval);
        $("#form #restriction").selectmenu({ width : "200px"});
        $("#form #restriction").selectmenu("refresh");
	}

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
	
	//목록 - 해당 카테고리 대화 
	function fnDetailChat(cateId){
		location.href = "<c:url value='/listChat?cateId="+ cateId +"'/>";
	}
	
	//등록 레이어 팝업
	function fnAddLayer(){
		var obj = $("#form");
		obj[0].reset(); //초기화
		
		obj.find("#cpId option").remove();
		obj.find("#tmp_cpId option").each(function() {
			obj.find("#cpId").append("<option value='"+ $(this).val() +"'>"+ $(this).text() +"</option>");
		});		
		obj.find("#cpId").selectmenu("refresh");
		
	//	obj.find("input:radio[name=topic]:input[value=N]").prop("checked", true);
		obj.find("input:radio[name=enabled]:input[value=Y]").prop("checked", true);
		obj.find("input:radio[name=deploy]:input[value=N]").prop("checked", true);
		obj.find("input:radio[name=uploadLock]:input[value=N]").prop("checked", true);
		obj.find("#topicNameInput").hide();
		obj.find(".popTitle h1").text("카테고리 생성");
		
		$("#restrictionUl").show();
		$("#nameUl").show();
	//	$("#topicUl").show();
		$("#enabledUl").show();
		
		fnRestriction('',''); //유형
		
		$(".writeCategorySet, .searchDimm").show();
		$(".writeCategorySet").center();
	}
	
	//수정 레이어 팝업
	function fnEditLayer(type,id){
		$.ajax({    		
			url: "<c:url value='/detailChatCategory'/>",
			data: "id="+ id +"&cpId=${search.cpId}",  
        	type: 'GET', 
            dataType: 'json', 
        	success : function(response){ 
        		var obj = $("#form");
        		var cpId = response.cpId;
        		var name = response.name;
        		var restriction = response.restriction;
        	//	var topic = response.topic;
        	//	var topicName = response.topicName;
        		var enabled = response.enabled;
        		var deploy = response.deploy;
        		var uploadLock = response.uploadLock;
        		var selCpId = "${search.cpId}";
        		
        		obj.find("#cpId option").remove();
        		obj.find("#tmp_cpId option").each(function() {
        			if(type == "2" && ($(this).val() == selCpId)){//배포시에는 선택한 cp로
        				obj.find("#cpId").append("<option value='"+ $(this).val() +"'>"+ $(this).text() +"</option>");
        			}else if(type == "1" && ($(this).val() == cpId)){
        				obj.find("#cpId").append("<option value='"+ $(this).val() +"'>"+ $(this).text() +"</option>");
        			}
        		});
        		obj.find("#cpId").selectmenu("refresh");
        		
        		obj.find("#type").val(type);
        		obj.find("#id").val(id);        		
        	//	obj.find("#name").val(name);        		
        	//	obj.find("#topicName").val(topicName);
        	//	obj.find("input:radio[name=topic]:input[value="+ topic +"]").prop("checked", true);
        		obj.find("input:radio[name=enabled]:input[value="+ enabled +"]").prop("checked", true);
        		obj.find("input:radio[name=deploy]:input[value="+ deploy +"]").prop("checked", true);
        		obj.find("input:radio[name=uploadLock]:input[value="+ uploadLock +"]").prop("checked", true);
        		obj.find(".popTitle h1").text("카테고리 수정");
        		
        		fnRestriction('',restriction); //유형
        		
        	/*	if(topic == "Y"){
        			$("#topicNameInput").show();
        		}else{
        			$("#topicNameInput").hide();
        		}*/
        		
        		//배포만 수정시
        		if(type == "2"){
        			$("#restrictionUl").hide();
        			$("#nameUl").hide();
        		//	$("#topicUl").hide();
        			$("#enabledUl").hide();
        			$("#uploadLockUl").hide();
        		}else{
        			$("#restrictionUl").show();
        			$("#nameUl").show();
        		//	$("#topicUl").show();
        			$("#enabledUl").show();
        			$("#uploadLockUl").show();
        		}
        		
        		$(".writeCategorySet, .searchDimm").show();
        		$(".writeCategorySet").center();
            },
            error: function(request, status, error){
            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
            }
    	});		
	}
	
	//카테고리 중복여부
	function fnIsName(){
		var obj = $("#form");
		
		if(obj.find("#name").val() != ""){
			var formData = $('#form').serializeArray();
			$.ajax({    		
				url: "<c:url value='/isChatCategory'/>",
				data: formData, 
	        	type: 'POST', 
	            dataType: 'json', 
	        	success : function(response){  
	        		if (response.status == 'FAIL') {
	        			alert("사용중인 카테고리 입니다.");
	        			obj.find("#name").focus();
	                }else{
	                	alert("생성 가능한 카테고리 입니다.");
	                	obj.find("#isName").val(1);
	                }
	            },
	            error: function(request, status, error){
	            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
	            }
	    	});
		}else{
			alert("카테고리를 확인 하세요.");
			obj.find("#name").focus();
		}
	}
	
	//등록 및 수정
	function fnAction(){
		var url = "";
		
		if($("#id").val() == "0"){//등록
			url = "<c:url value='/addChatCategory'/>";
	    }else{//수정
	    	url = "<c:url value='/editChatCategory'/>";
	    }
		
		if($('#form').valid()){			
			if($("#isName").val() != "1"){
				alert("카테고리 중복확인을 하세요.");
				return false;
			}
			
			if($("input:radio[name=enabled]:checked").val() == "N" && $("input:radio[name=deploy]:checked").val() == "Y"){
				alert("미사용일 경우에는 배포를 할 수 없습니다.");
				$("input:radio[name=deploy]:input[value=N]").prop("checked", true);
				return false;
			}
			
			if($("input[name='topic']:checked").val() == "N"){
				$("#topicName").val('');
			}

			if($("input[name='uploadLock']:checked").val() == "N"){
				$("#uploadLock").val('');
			}
			
			var formData = "";
		    var answer = confirm("저장 하시겠습니까?");
		    if (answer == true){		 
		    	$("#form #cpId").attr("disabled",false);
		    	formData = $('#form').serializeArray();
		    	
		    	$.ajax({    		
		        	url : url,
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
	function fnDelete(id,cpId){
		var answer = confirm("삭제 하시면 하위에 등록된 모든 정보를 잃게 됩니다.\n삭제 하시겠습니까?");
	    if (answer == true){
	    	$.ajax({    		
	        	url : "<c:url value='/deleteChatCategory'/>",
	        	data: "id="+ id+"&cpId="+ cpId, 
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
	
	//유효성 체크
	$('#form').validate({
		rules: {
			restriction: {required:true},
			name: {required:true}
		//	topicName: {required:true,inputbox:true}
		},
		messages: {
			restriction: {
				required:"유형을 확인 하세요."
			},
			name: {
				required:"카테고리를 확인 하세요."
			}
		/*	topicName: {
				required:"토픽명을 확인 하세요.",
				inputbox:"<>&\'\"는 사용할 수 없습니다."
			}*/
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