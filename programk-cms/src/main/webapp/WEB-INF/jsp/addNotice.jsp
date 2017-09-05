<%--
 Class Name  : addNotice.jsp
 Description : 모니터링 - 작업공지
 
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
	<div class="searchGrpContentBox cp">
		<!--// 타이틀 및 위치안내 시작 -->
		<div class="titleBox">
			<h3 class="contentTitle">작업공지</h3>
			<p class="location">
				홈 > 모니터링 > 작업공지
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->
		
		<!--// 정보안내 시작 -->
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> 사용여부를 'Y'로 설정할 경우 모든 BOT에 적용되기 때문에 특정 서비스 명칭이 안내문구에 포함되어서는 안됩니다.<br/>
			</p>
		</div>
		<!-- 정보안내 끝 //-->		

		<!--// 테이블 시작 -->
		<form id="form" method="post">
		<div class="tableWriteBox">
			<ul>
				<li class="title">사용여부 <span class="required"></span></li>
				<li class="content">
					<c:forEach var="enabled" items="${enabledType}" varStatus="status">
     					<input type="radio" name="active" value="${enabled.value}" ${enabled.value == notice.active ? 'checked="checked"' : '' }/><label for="enabled${status.index}">${enabled.value}</label>
					</c:forEach>
				</li>
			</ul>			
			<ul>
				<li class="title">안내문구</li>
				<li class="content memo">
					<textarea name="message" id="message">${notice.message}</textarea>
				</li>
			</ul>
		</div>
		</form>
		<!-- 테이블 끝 //-->

		<!--// bottom button -->
		<div class="bottomButton">
			<div class="right">
				<a href="#" onclick="fnCancel();return false;" class="btnBg"><span class="icon_cancel"></span>취소</a>
				<a href="#" onclick="fnAdd();return false;" class="btnBg"><span class="icon_save"></span>저장</a>
			</div>
		</div>
		<!-- bottom button //-->

	</div>
	<!-- 컨텐츠 끝 //-->

</div>

<script type="text/javascript">
	//취소
	function fnCancel(){
		var answer = confirm("편집 중인 내용이 초기화 됩니다.\n취소하시겠습니까?");
	    if (answer == true){
	    	$("form")[0].reset();    
	    }
	}
	
	//저장
	function fnAdd(){
		if($('#form').valid()){
			if($("input:radio[name='active']:checked").val() == "Y" && $("#message").val() == ""){
				alert("안내문구를 확인하세요.");
				$("#message").focus();
				return false;
			}
			
			var formData = $('#form').serializeArray();
		    var answer = confirm("저장 하시겠습니까?");
		    if (answer == true){
		    	$.ajax({    		
		        	url : "<c:url value='/addNotice'/>",
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
	
	//유효성 체크
	$('#form').validate({
		rules: {
			message: {maxlength:1000}
		},
		messages: {
			message: {
				maxlength:"1000자 까지만 등록가능합니다."
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