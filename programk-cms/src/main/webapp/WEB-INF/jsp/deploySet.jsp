<%--
 Class Name  : deploySet.jsp
 Description : 배포관리 - 배포설정
 
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

<jsp:useBean id="now" class="java.util.Date" />

<hr class="blind">
<div class="searchGrpContent">
	<!--// 컨텐츠 시작 -->
	<div class="searchGrpContentBox content">
		<!--// 타이틀 및 위치안내 시작 -->
		<div class="titleBox">
			<h3 class="contentTitle">배포 설정</h3>
			<p class="location">
				홈 > 배포 관리 > 배포 설정
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->
		
		<!--// 정보안내 시작 -->
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> 배포 실행 시 개발서버의 데이터가 상용서버에 배포됩니다.<br/>
			</p>
		</div>
		<!-- 정보안내 끝 //-->

		<!--// topButton -->
		<form id="formSearch" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${paging.pageNum}">
		<div class="topButton">
			<div class="left">
				<ul>
					<li class="title">CP</li>
					<li class="content">
						<select class="selectmenu" id="cpId" name="cpId">
							<c:forEach var="cp" items="${result}" varStatus="status">		
								<option value="${cp.id}" ${cp.id == search.cpId ? 'selected="selected"' : '' }>${cp.label}</option>
							</c:forEach>
						</select>
					</li>
				</ul>
			</div>
<!-- 			<div class="btnSearch"> -->
<!-- 				<a href="#" onclick="fnSearch();return false;" class="btnBg"><span class="icon_search"></span>조회</a> -->
<!-- 			</div> -->
		</div>
		</form>
		<!-- topButton //-->

		<!--// 테이블 시작 -->
		<div class="tableList fixed">
			<table>
				<caption>배포 설정-BOT id, 최종 배포일, 상태, BOT 변경</caption>
				<colgroup>
					<col class="w1">
					<col class="w2">
					<col class="w3">
					<col class="w4">
				</colgroup>
				<thead>
					<tr>
						<th scope="col">BOT id</th>
						<th scope="col">최종 배포일</th>
						<th scope="col">상태</th>
						<th scope="col">BOT 변경</th>
					</tr>
				</thead>
				<tbody>
					<c:choose>
						<c:when test="${fn:length(results) > 0}">
							<c:forEach var="item" items="${results}" varStatus="status">
							<tr>
								<td>${item.subLabel}</td>
								<td><fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss" value="${item.lastLoaded}" /></td>
								<td>
									<c:if test="${item.active == 'Y'}">
										Active
									</c:if>
									<c:if test="${item.active == 'N'}">
										Standby 
										<a href="#" onclick="fnCheck(1,'${item.subLabel}');return false;" class="btnBg on"><span class="icon_ok"></span>배포</a>
										<a href="#" onclick="fnCheck(3,'${item.subLabel}');return false;" class="btnBg on"><span class="icon_delete"></span>정리</a>
									</c:if>
								</td>
								<td>
									<fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss" value="${now}" var="today" />
									<fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss" value="${item.deployDate}" var="deployDate" />
									<c:if test="${item.active == 'N'}">
									<c:choose>
										<c:when test="${today < deployDate}">
										          변경예약일 : ${deployDate} <br/>
											<a href="#" onclick="fnBotCancelLayer('${item.subLabel}');return false;" class="btnBg on"><span class="icon_modify"></span>예약취소</a>
										</c:when>
										<c:otherwise>
											<a href="#" onclick="fnCheck(2,'${item.subLabel}');return false;" class="btnBg on"><span class="icon_modify"></span>변경</a>
										</c:otherwise>
									</c:choose>
									</c:if>
								</td>
							</tr>
							</c:forEach>
						</c:when>
					</c:choose>
				</tbody>
			</table>
		</div>
		<!-- 테이블 끝 //-->

	</div>
	<!-- 컨텐츠 끝 //-->

</div>

<!-- 배포 팝업 시작 -->
<div class="popLayer distributePop">
	<form id="form" method="post">
	<input type="hidden" id="type" name="type" value="1" />
	<input type="hidden" id="cpId" name="cpId" value="${search.cpId}" />
	<input type="hidden" id="subLabel" name="subLabel" />
	<div class="popTitle">
		<h1>배포</h1>
		<a href="javascript:;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popTableBox">
	           배포 사유를 입력해 주세요.
		<div class="popTable">
			<ul>
				<li class="title">사유</li>
				<li class="content">
					<textarea class="styleB" name="description" id="description"></textarea>
				</li>
			</ul>
		</div>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="javascript:;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
			<a href="#" onclick="fnDeploy();return false;" class="btnBg"><span class="icon_ok"></span>배포</a>
		</div>
	</div>
	</form>
</div>
<!-- 배포 팝업 끝 -->

<!-- BOT 변경 팝업 시작 -->
<div class="popLayer bootchangePop">
	<form id="formBot" method="post">
	<input type="hidden" id="type" name="type" value="2" />
	<input type="hidden" id="cpId" name="cpId" value="${search.cpId}" />
	<input type="hidden" id="deployDate" name="deployDate" />
	<input type="hidden" id="subLabel" name="subLabel" />
	<div class="popTitle">
		<h1>BOT 변경</h1>
		<a href="javascript:;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popTableBox">
		<div class="popTable">
			<ul>
				<li class="title">BOT 변경일 <span class="required"></span></li>
				<li class="content">
					<input type="radio" name="deployType" id="deployType1" value="1">즉시변경
					<input type="radio" name="deployType" id="deployType2" value="2" checked>예약변경
				</li>
			</ul>
			<ul id="datepicker">
				<li></li>
				<li class="content">
					<input type="text" class="datepicker iconDate w100px" name="deployDay" id="deployDay"/>					
					<select class="selectmenu w50px" name="deployHour" id="deployHour">
						<c:forEach var="i" begin="0" end="23" step="1">
							<option value="${i}">${i}</option>
						</c:forEach>
					</select>
					<span class="padR5">시</span>
					<select class="selectmenu w50px" name="deployMinute" id="deployMinute">
						<c:forEach var="i" begin="0" end="59" step="1">
							<option value="${i}">${i}</option>
						</c:forEach>
					</select>
					<span>분</span>
				</li>
			</ul>
			<ul>
				<li class="title">사유</li>
				<li class="content">
					<textarea class="styleB" name="description" id="description"></textarea>
				</li>
			</ul>
		</div>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="javascript:;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
			<a href="#" onclick="fnBotEdit();return false;" class="btnBg"><span class="icon_ok"></span>변경</a>
		</div>
	</div>	
	</form>
</div>
<!-- BOT 변경 팝업 끝 -->

<!-- 예약취소 팝업 시작 -->
<div class="popLayer distributeCancelPop">
	<form id="formCancel" method="post">
	<input type="hidden" id="cpId" name="cpId" value="${search.cpId}" />
	<input type="hidden" id="subLabel" name="subLabel" />
	<div class="popTitle">
		<h1>BOT 변경</h1>
		<a href="javascript:;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popTableBox">
	    BOT 변경 예약취소 사유를 입력해 주세요.
		<div class="popTable">
			<ul>
				<li class="title">사유</li>
				<li class="content">
					<textarea class="styleB" name="description" id="description"></textarea>
				</li>
			</ul>
		</div>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="javascript:;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
			<a href="#" onclick="fnBotCancel();return false;" class="btnBg"><span class="icon_ok"></span>예약취소</a>
		</div>
	</div>
	</form>
</div>
<!-- 예약취소 팝업 끝 -->

<!-- bot 체크 로딩안내 시작 -->
<div class="popLayer loading">
	<div class="popTitle">
		<h1>안내</h1><a href="javascript:;" class="btnBg closePop closePopBox"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popContent">
		<div class="alert">
			<p class="pointTxt">정상입니다.</p>
		</div>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="javascript:;" class="btnBg closePop closeBtn"><span class="icon_cancel"></span>닫기</a>
		</div>
	</div>
</div>
<!-- bot 체크안내 끝 -->

<script type="text/javascript">
	$("#formSearch #cpId").selectmenu({
	   change: function( event, data ) {
		   fnSearch();
	   }
	});
	
	//BOT 변경 타입
	$("input[name=deployType]").change(function() {
		if($(this).val() == "1"){
			$("#datepicker").hide();
		}else{
			$("#datepicker").show();
		}
	});
	
	//변경일
	$("#deployDay").datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,
		minDate: 0
	});

	//검색 
	function fnSearch(){
		$("#currentPageNo").val(1);
		$("#formSearch").submit();
	}
	
	//변경 레이어 팝업
	function fnBotEditLayer(label){
		$("#formBot")[0].reset(); //초기화
		$("#formBot #datepicker").show();	
		$("#formBot #deployHour").val("0");
		$("#formBot #deployMinute").val("0");
		$("#formBot #deployHour").selectmenu("refresh");
		$("#formBot #deployMinute").selectmenu("refresh");
		
		$('#formBot #subLabel').val(label);
		$(".bootchangePop, .searchDimm").show();
		$(".bootchangePop").center();
	}
	
	//변경
	function fnBotEdit(){	
		var type = $("input[name=deployType]:checked").val();
		var url = "";
		
		if(type == "1"){//즉시변경-플래그만변경
			url = "<c:url value='/editBot'/>";			
			
			var date = new Date();
			$("#deployDate").val(date);
		}else{//예약변경-스케쥴등록
			url = "<c:url value='/addDeploy'/>";
			
			var now = new Date();
			var date = new Date($("#deployDay").val().substring(0,4)+"-"+$("#deployDay").val().substring(5,7)+"-"+$("#deployDay").val().substring(8,10)+" "+$("#deployHour").val()+":"+$("#deployMinute").val()+":00");
			
			if (now >= date) {
				alert("현재 시간이후로 설정해 주세요.");
				return false;
			}
			
			$("#deployDate").val(date);
		}
		
		if($('#formBot').valid()){	
			var formData = $('#formBot').serializeArray();
			var answer = confirm("변경 하시겠습니까?");
		    if (answer == true){
		    	$.ajax({    		
		        	url : url,
		        	data: formData, 
		        	type: 'POST', 
		            dataType: 'json', 
		        	success : function(response){  
		        		if (response.status == 'FAIL') {
		        			alert(response.message);
		                } else {
		                	alert("변경 되었습니다.");
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
	
	//배포 레이어 팝업
	function fnDeployLayer(label){
		$("#form")[0].reset(); //초기화
		$('#form #subLabel').val(label);
		$(".distributePop, .searchDimm").show();
		$(".distributePop").center();	
	}
	
	//배포
	function fnDeploy(){
		if($('#form').valid()){	
			var formData = $('#form').serializeArray();
		    var answer = confirm("배포 하시겠습니까?");
		    if (answer == true){
		    	$.ajax({    		
		        	url : "<c:url value='/addDeploy'/>",
		        	data: formData, 
		        	type: 'POST', 
		            dataType: 'json', 
		        	success : function(response){  
		        		if (response.status == 'FAIL') {
		        			alert(response.message);
		                } else {
		                	alert("성공적으로 배포 하였습니다.\n배포 관리 메뉴에서 BOT의 상태를 변경해야 최종 반영 됩니다.");
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
	//정리
	function fnCleanBot(label){
		$('#form #subLabel').val(label);
		if($('#form').valid()){	
			var formData = $('#form').serializeArray();
		    var answer = confirm("봇에 저장된 모든 데이터가 삭제됩니다.\n메모리를 정리 하시겠습니까?");
		    if (answer == true){
		    	$.ajax({    		
		        	url : "<c:url value='/cleanDeploy'/>",
		        	data: formData, 
		        	type: 'POST', 
		            dataType: 'json', 
		        	success : function(response){  
		        		if (response.status == 'FAIL') {
		        			alert(response.message);
		                } else {
		                	alert("성공적으로 정리 하였습니다.");
		                	location.reload();
		                }
		            },
		            error: function(request, status, error){
		            	alert(request.responseText);
		            	//console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
		            }
		    	});
		    }			
		}		
	}
	
	//BOT 변경 예약 취소 레이어
	function fnBotCancelLayer(label){
		$("#formCancel")[0].reset(); //초기화
		$('#formCancel #subLabel').val(label);
		$(".distributeCancelPop, .searchDimm").show();
		$(".distributeCancelPop").center();
	}
	
	//BOT 변경 예약 취소
	function fnBotCancel(){
		if($('#formCancel').valid()){	
			var formData = $('#formCancel').serializeArray();
		    var answer = confirm("예약 취소 하시겠습니까?");
		    if (answer == true){
		    	$.ajax({    		
		        	url : "<c:url value='/editDeploy'/>",
		        	data: formData, 
		        	type: 'POST', 
		            dataType: 'json', 
		        	success : function(response){  
		        		if (response.status == 'FAIL') {
		        			alert(response.message);
		                } else {
		                	alert("예약취소 되었습니다.");
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
	
	//bot 상태체크
	function fnCheck(type,label){
		$.ajax({    		
        	url : "<c:url value='/checkMonitoring'/>",
        	data: "label="+ label, 
        	type: 'POST', 
            dataType: 'json', 
            timeout: 2000, // sets timeout to 2 seconds
        	success : function(response){  
        		console.log(response);
        		if (response.status == 'FAIL') {
        			var message = "";
        			//try {
        			//	var jsonData = JSON.parse(response.message);
        			//	message = jsonData.message;
					//} catch (e) {
					//	message = "서버에 연결할 수 없습니다.";
					//}
        			
        			fnDone(type,label,message);
                } else {
                	fnDone(type,label,'');
                }
            },
			error: function(request, status, error){
				fnDone(type,label,request.responseText);
			}
    	});
	}
	
	//결과 레이어 노출
	function fnDone(type,label,message){
		if(message == ""){
			if(type == "1"){
				fnDeployLayer(label);
			}else if(type == "2"){
				<c:if test="${clean == 1}">
					var answer = confirm("메모리가 정리되어 저장된 데이터가 없습니다.\n봇을 변경하시겠습니까?\n봇 변경 시 서비스에 영향이 있을 수 있습니다.");
				    if (answer != true){
				    	return;
				    }
			    </c:if>
				fnBotEditLayer(label);
			}else if(type == "3"){
				fnCleanBot(label);
			}
		}else{
			$(".loading, .searchDimm").show();
    		$(".loading").center();
			$(".loading .pointTxt").html(message);
		}		
	}
	
	$('#form').validate({
		rules: {
			description: {required:true,maxlength:200}
		},
		messages: {
			description: {
				required:"사유 확인 하세요.",
				maxlength:"사유는 200자 까지만 입력해주세요."
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
	
	$('#formCancel').validate({
		rules: {
			description: {required:true,maxlength:200}
		},
		messages: {
			description: {
				required:"사유 확인 하세요.",
				maxlength:"사유는 200자 까지만 입력해주세요."
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
	
	$('#formBot').validate({
		rules: {
			deployDay: {required:true},
			description: {required:true,maxlength:200}
		},
		messages: {
			deployDay: {
				required:"배포일 확인 하세요."
			},
			description: {
				required:"사유 확인 하세요.",
				maxlength:"사유는 200자 까지만 입력해주세요."
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