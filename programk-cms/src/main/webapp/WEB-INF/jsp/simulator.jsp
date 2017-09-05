<%--
 Class Name  : simulator.jsp
 Description : 시뮬레이터
 
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
<link type="text/css" href="<c:url value='/js/jquery-ui.min.css'/>" rel="stylesheet"/>
<link rel="shortcut icon" type="image/x-icon" href="<c:url value='/images/favicon_olleh.ico'/>" />
<script type="text/javascript" src="<c:url value='/js/jquery-1.10.2.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/jquery-ui.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/jquery-ui.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/jquery.tmpl.min.js'/>"></script>
<style>
body{position:relative; margin:0; padding:0; font-family:"맑은 고딕", Malgun Gothic, Dotum, "돋움"; font-size:12px; color:#666; overflow-x:hidden; overflow-y:hidden}/*0831 스크롤제어 추가*/
.pointTxt {color:#da0601;}
.popContent .alert p{font-weight:700;}
.popContent{clear:both; display:block; margin:0 10px; padding:15px 0; border-bottom:1px solid #ddd;}
.popContent .alert{clear:both; display:block; padding:20px 10px; text-align:center; line-height:20px;}
.popContent .alert.txtL{text-align:left !important;}
.popContent .alert .alertTxt{display:block; padding-top:10px; font-size:14px; color:#333;}
.popContent .alert p{clear:both; position:relative; display:block;}
.popContent .alert .icon_check{position:absolute; top:50%; left:0; margin-top:-3%; display:inline-block; width:15px; height:15px; background:url('../js/images/ui-icons_cd0a0a_256x240.png') no-repeat -159px -144px;}
.popContent .info{padding:5px;}
</style>
</head>
<body>

<c:if test="${not empty message}">
    <script type="text/javascript">
    	alert("${message}");
    	location.href = "<c:url value='/listMonitoring'/>";
    </script>
</c:if>

<%-- //UI템플릿 --%>
<%@ include file="searchTemplate.jsp" %>
<%-- UI템플릿// --%>

<!-- 시뮬레이터 팝업 시작 -->
<div class="popLayer simulatorPop scroll">
<form id="form" method="post">
	<div class="popTitle">
		<h1>시뮬레이터</h1>
		<a href="#" onclick="self.close();" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popTopContentBox">
		<div class="popTopTable">
			<ul>
				<li class="w80p">
					<select class="selectmenu" id="cpId" name="cpId">
						<c:if test="${sessionScope.userInfo.auth == 'SAA'}">
							<option value="0" ${0 == search.cpId ? 'selected="selected"' : '' }>CP 선택</option>
							</c:if>
						<c:forEach var="cp" items="${result}" varStatus="status">		
							<option value="${cp.id}" ${cp.id == search.cpId ? 'selected="selected"' : '' }>${cp.label}</option>
						</c:forEach>
					</select>
					<select class="selectmenu" id="botType" name="botType">
						<option selected="selected" value="">BOT 선택</option>
						<option value="1">개발</option>
						<option value="2">상용 Standby</option>
						<option value="3">상용 Active</option>
					</select>
				</li>
				<li class="right">
					<a href="#" onclick="fnDeployTest();return false;" class="btnBg" style="display:none;"><span class="icon_reset"></span>개발배포</a>
				</li>
			</ul>
		</div>
	</div>
	<div class="popPreviewContent" id="popPreviewContent"></div>
	<div class="bottomContent">
		<input type="text" id="input" name="input" disabled />
		<a href="#" onclick="fnSearch(2);return false;" class="btnBg fltR"><span class="icon_write"></span>입력</a>
		<p style="color:#0089f2;font-size:10px;">※ BOT을 선택해야만 입력할 수 있으며, 개발 서버에 업로드한 대화가 반영되지 않았을 경우 [개발배포] 버튼을 선택해 주세요.</p>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="#" onclick="self.close();" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
		</div>		
	</div>
</form>
</div>
<!-- 시뮬레이터 팝업 끝 -->

<!-- 검증 로딩안내 시작 -->
<div class="popLayer test" style="width:450px;display:none;">
	<form id="formTest" method="post">
	<input type="hidden" name="filename" id="filename"/>
	<div class="popTitle">
		<h1>안내</h1><a href="javascript:location.reload();" class="btnBg closePopBox" style="display:none;"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popContent" style="border-bottom:0;">
		<div class="alert">
			<p class="pointTxt">배포중입니다.</p>
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
	$( "#cpId" ).selectmenu();
	
	$( "#botType" ).selectmenu({
		change: function( event, data ) {
			//개발배포 버튼 처리
			if(data.item.value == "1"){
				$(".icon_reset").parent().show();
			}else{
				$(".icon_reset").parent().hide();
			}
			
			//입력창 처리
			if(data.item.value != ""){
				$("#input").attr("disabled",false);
			}else{
				$("#input").attr("disabled",true);
			}
	   }
	});
	
	$("#input").keypress(function(e) {
	  if (e.keyCode == 13) {
		  fnSearch(2);
		  return false;
	  }
	});
	
	function fnLayerClose(obj){
		$(obj).hide();
	}
	
	//링크 클릭시
	function fnInput(input){
		$("#input").val(input);
		fnSearch(2);
		return false;
	}	
	
	//검증 - 배포
	function fnDeployTest(){
		if($("#cpId").val() == "0"){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		var cpId = $("#cpId option:selected").val();	
		var label = $("#cpId option:selected").text();	
		var answer = confirm("개발배포 하시겠습니까?");
	    if (answer == true){
	    	$.ajax({    		
	        	url : "<c:url value='/testDeployChat'/>",
	        	data: "cpId="+cpId+"&label="+label, 
	        	type: 'GET', 
	        	success : function(response){ 
	        		if (response.status == 'FAIL') {
	        			$(".test .pointTxt").html(response.message);		        			
	                } else {
	                	$(".test .pointTxt").text("배포가 완료되었습니다.");
	                	fnDisabled(0);
	                }
	            },
	            error: function(request, status, error){
	            	$(".test .pointTxt").html(request.responseText);
	            },
	            beforeSend:function(){
	            	$(".test").show();
	        		$(".test").center();
	        		fnDisabled(1);
	            },
	            complete:function(){
	            	$(".test .closePopBox").show();
	            	$(".test .bottomButton").show();
	            	$(".test").center();
	            }
	    	});
	    }
	}
	
	function fnDisabled(type){
		if(type == 0){
			$("#iconOk").show();
			$("#input").attr("disabled",false);
		}else{
			$("#iconOk").hide();
			$("#input").attr("disabled",true);
		}
	}
	
	//검색하기
	function fnSearch(type){
		if($("#cpId").val() == "0"){
			alert("cp를 선택해주세요.");
			return false;
		}
		
		if($("#botType").val() == ""){
			alert("BOT를 선택해주세요.");
			return false;
		}
		
		$("#input").attr("disabled",false);
		
		//입력 버튼시
		if(type == "2"){
			if($("#input").val() == ""){
				alert("질문을 입력해주세요.");
				return false;
			}
			
			//질문 노출
			var search = new Object();
			search['INPUT'] = $("#input").val();
			search['DATE'] = fnDate();
			$("#TemplateInput").tmpl(search).appendTo(".popPreviewContent");			
			
			//답변 조회 및 노출
			var formData = $('#form').serializeArray();
			$.ajax({    		
	        	url : "<c:url value='/simulatorChat'/>",
	        	data: formData, 
	        	type: 'POST', 
	            dataType: 'json',  
	        	success : function(response){ 	        		   
	        		console.log(response);
	    			if(response.length > 0){	
	        			var search = new Object();
	        			search['OUT'] = response;
	        			search['DATE'] = fnDate();
		        		$("#TemplateOut").tmpl(search).appendTo(".popPreviewContent");
		        		
		        		$("#popPreviewContent").scrollTop($("#popPreviewContent")[0].scrollHeight);
	    			}else if(response.programkResponses != undefined){
	    				var search = new Object();
	        			search['OUT'] = response.programkResponses;
	        			search['DATE'] = fnDate();
		        		$("#TemplateOut").tmpl(search).appendTo(".popPreviewContent");
		        		
		        		$("#popPreviewContent").scrollTop($("#popPreviewContent")[0].scrollHeight);
	    			}else{
						var search = new Object();
	        			search['OUT'] = "API 호출시 오류가 발생하였습니다. <br/>오류 : " + response.message;
	        			search['DATE'] = fnDate();
		        		$("#TemplateFail").tmpl(search).appendTo(".popPreviewContent");
		        		
		        		$("#popPreviewContent").scrollTop($("#popPreviewContent")[0].scrollHeight);
	    			}      	    		
	            },
	            error: function(request, status, error){
	            	var search = new Object();
        			search['OUT'] = "API 호출시 오류가 발생하였습니다. <br/>오류 : " + request.responseText;
        			search['DATE'] = fnDate();
	        		$("#TemplateFail").tmpl(search).appendTo(".popPreviewContent");
	        		$("input[name=time]:last").focus();
	            },
	            complete : function() {
	            	$("#input").val('');
	            	$("#input").focus();
	            }
	    	});		
		}
	}
	
	function fnDate(){
        var now = new Date();
        var nowHour = now.getHours();
        var nowMt = now.getMinutes();
        
        if((nowHour <= 12) && (nowHour >= 6)){
        	return '오전 ' + nowHour + ':' + nowMt;
        }else{
        	return '오후 ' + (nowHour-12) + ':' + nowMt;
        }
	}
</script>

</body>
</html>