<%--
 Class Name  : addCp.jsp
 Description : cp 관리 - cp 등록
 
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
			<h3 class="contentTitle">CP 신규등록</h3>
			<p class="location">
				홈 > CP 관리 > 목록 > CP 신규등록
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->
		
		<!--// 정보안내 시작 -->
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> 등록한 호스트 IP에서만 대화플랫폼  API에 접속할 수 있습니다.<br/>
				<span class="bul_txt">&#42;</span> CP의 사용여부를 N으로 설정할 경우, 해당 CP는 대화플랫폼  API에 접속할 수 없습니다.<br/>
				<span class="bul_txt">&#42;</span> CP 신규생성 시 Active Bot과 Standby Bot 2개가 생성됩니다.<br/>
				<span class="bul_txt">&#42;</span> CP 신규생성 후 CP 관리 페이지에서 bots 파일을 다운로드 받아 상용 서버에 적용해야 반영이 완료됩니다.(서버 reload 필요)<br/>
			</p>
		</div>
		<!-- 정보안내 끝 //-->

		<!--// 테이블 시작 -->
		<form id="form" method="post">
		<div class="tableWriteBox">
			<ul>
				<li class="title w15p">CP 명 <span class="required"></span></li>
				<li class="content">
					<input type="text" id="label" name="label" maxlength="50"/><br/>
					<p class="info txtPoint">※ 영문+숫자 공백없이 입력해 주세요.</p>
				</li>
			</ul>
			<ul>
				<li class="title">홈페이지 URL <span class="required"></span></li>
				<li class="content"><input type="text" id="url" name="url" maxlength="100"/></li>
			</ul>
			<ul>
				<li class="title">호스트 IP <span class="required"></span></li>
				<li class="content hostIP">
					<p>
						<input type="text" id="hostIp1" name="hostIp" maxlength="16"/>
					</p>	
					<span id="addHostIp"></span>				
					<a href="#" class="btnBg" title="호스트 IP 추가"  onclick="fnAddHostIp();return false;"><span class="icon_plus"></span></a>
				</li>
			</ul>
			<ul>
				<li class="title">사용여부 <span class="required"></span></li>
				<li class="content">
					<c:forEach var="enabled" items="${enabledType}" varStatus="status">
     					<input type="radio" id="enabled${status.index}" name="enabled" value="${enabled.value}" ${enabled.value == 'Y' ? 'checked="checked"' : '' }/><label for="enabled${status.index}">${enabled.value}</label>
					</c:forEach>
				</li>
			</ul>
			<ul>
				<li class="title">비고</li>
				<li class="content memo">
					<textarea name="description" id="description"></textarea>
				</li>
			</ul>
		</div>
		</form>
		<!-- 테이블 끝 //-->

		<!--// bottom button -->
		<div class="bottomButton">
			<div class="left">
				<a href="#" onclick="fnList();return false;" class="btnBg"><span class="icon_list"></span>목록</a>
			</div>
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
	//호스트 ip 추가
	function fnAddHostIp(){
		var index = $("input[name=hostIp]").length + 1;
		
		//삽입될 Form Tag
		var frmTag = "";
		frmTag += "<p id=\"divHostIp"+ index +"\">";
		frmTag += "<input type=\"text\" id=\"hostIp"+ index +"\" name=\"hostIp\" maxlength=\"16\"/>  ";
		frmTag += "<a href=\"#\" class=\"icon_del\" onclick=\"fnDeleteHostIp('"+ index +"');return false;\">X</a>";
		frmTag += "</p>";
		$("#addHostIp").append(frmTag);
	}
	
	//호스트 ip 삭제
	function fnDeleteHostIp(index){
		$("#addHostIp").find("#divHostIp"+index).remove();
	}
	
	//목록
	function fnList(){
		var answer = confirm("편집 중인 내용을 잃게 됩니다.\n그래도 이동 하시겠습니까?");
	    if (answer == true){
	    	location.href = "<c:url value='/listCp'/>";
	    }
	}
	
	//취소
	function fnCancel(){
		var answer = confirm("편집 중인 내용이 초기화 됩니다.\n취소하시겠습니까?");
	    if (answer == true){
	    	location.href = "<c:url value='/listCp'/>";
	    }
	}
	
	//저장
	function fnAdd(){
		if($('#form').valid()){
			var formData = $('#form').serializeArray();
		    var answer = confirm("저장 하시겠습니까?");
		    if (answer == true){
		    	$.ajax({    		
		        	url : "<c:url value='/addCp'/>",
		        	data: formData, 
		        	type: 'POST', 
		            dataType: 'json', 
		        	success : function(response){  
		        		if (response.status == 'FAIL') {
		        			alert(response.message);
		                } else {
		                	alert("저장 되었습니다.");
		                	location.href = "<c:url value='/listCp'/>";
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
			label: {required:true,engnumber:true},
			id: {required:true},
			user_id: {required:true},
			url: {required:true,url:true},
			hostIp: {required:true,ip:true},
			description: {maxlength:200}
		},
		messages: {
			label: {
				required:"CP명을 입력해주세요.",
				engnumber:"CP명은 영문,숫자만 입력해주세요."
			},
			id: {
				required:"CPID를 입력해주세요."
			},
			user_id: {
				required:"관리자 이름을 입력해주세요."
			},
			url: {
				required:"홈페이지 URL을 입력해주세요.",
				url:"홈페이지 URL을 형식에 맞게 입력해주세요."
			},
			hostIp: {
				required:"호스트 IP를 입력해주세요.",
				ip:"호스트 IP를 형식에 맞게 입력해주세요."
			},
			description: {
				maxlength:"비고는 200자 까지만 입력해주세요."
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