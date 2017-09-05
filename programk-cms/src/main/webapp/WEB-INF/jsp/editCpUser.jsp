<%--
 Class Name  : editCpUser.jsp
 Description : 사용자 관리 - 사용자 수정
 
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
	<div class="searchGrpContentBox user">
		<!--// 타이틀 및 위치안내 시작 -->
		<div class="titleBox">
			<h3 class="contentTitle">사용자 수정</h3>
			<p class="location">
				홈 > 사용자 관리 > 목록 > 사용자 수정
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->
		
		<!--// 정보안내 시작 -->
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> SuperBot은 모든 CP의 권한을 가지고 있는 슈퍼관리자 전용 CP 입니다.<br/>
			</p>
		</div>
		<!-- 정보안내 끝 //-->

		<!--// 테이블 시작 -->
		<form id="formPageing" method="get">
		<input type="hidden" id="currentPageNo" name="currentPageNo" value="${param.currentPageNo}">
		<input type="hidden" id="cpId" name="cpId" value="${param.cpId}">
		<input type="hidden" id="id" name="id" value="0">
		</form>
		<form id="formSubmit" method="post">
			<input type="hidden" id="id" name="id" value="${result.id}"/>
			<input type="hidden" id="userPwd" name="userPwd"/>
			<input type="hidden" id="cpGroup" name="cpGroup"/>
			<input type="hidden" id="groupName" name="groupName"/>
			<input type="hidden" id="cellPhone" name="cellPhone"/>
			<input type="hidden" id="enabled" name="enabled"/>
			<input type="hidden" id="auth" name="auth"/>
			<input type="hidden" id="menu" name="menu"/>
			<input type="hidden" id="description" name="description"/>
		</form>
		<form id="form" method="post">		
		<div class="tableWriteBox">
			<ul>
				<li class="title">권한 <span class="required"></span></li>
				<li class="content">
					<select class="selectmenu" id="auth" name="auth">
						<c:forEach var="auth" items="${authType}" varStatus="status">
						<c:if test="${(sessionScope.userInfo.auth == 'SAA') || (sessionScope.userInfo.auth == 'CPA' && auth.value == result.auth)}">
			    			<option value="${auth.value}" ${auth.value == result.auth ? 'selected="selected"' : '' }>${auth.label}</option>
			    		</c:if>		
						</c:forEach>
					</select>
				</li>
			</ul>
			<ul>
				<li class="title w15p">CP <span class="required"></span></li>
				<li class="content">
					<ul id="cpIdCheckbox">
						<c:set var="cpGroupList" value=",${result.cpGroup}," />
					</ul>
				</li>
			</ul>
			<ul class="colspan">
				<li class="title">ID <span class="required"></span></li>
				<li class="content">
					<div class="content w35p"><input type="text" class="w200px" id="userId" name="userId" maxlength="50" value="${result.userId}" disabled/></div>
					<div class="title">이름 <span class="required"></span></div>
					<div class="content"><input type="text" class="w200px" id="name" name="name" maxlength="50" value="${result.name}" disabled/></div>
				</li>
			</ul>
			
			<ul class="colspan">
				<li class="title">비밀번호 <span class=""></span></li>
				<li class="content">
					<div class="content w35p"><input type="password" class="w200px" id="userPwd" name="userPwd" maxlength="50"/></div>
					<div class="title">비밀번호 확인 <span class=""></span></div>
					<div class="content"><input type="password" class="w200px" id="userPwdVrfy" name="userPwdVrfy" maxlength="50"/></div>
				</li>
			</ul>
			
			<ul>
				<li class="title">소속</li>
				<li class="content"><input type="text" id="groupName" name="groupName" maxlength="100" value="${result.groupName}"/></li>
			</ul>
			<ul>
				<li class="title">연락처 <span class="required"></span></li>
				<li class="content"><input type="text" class="w200px" id="cellPhone" name="cellPhone" maxlength="20" value="${result.cellPhone}"/> (ex:02-0000-0000)</li>
			</ul>
			<ul>
				<li class="title">사용여부 <span class="required"></span></li>
				<li class="content">
					<c:forEach var="enabled" items="${enabledType}" varStatus="status">
     					<input type="radio" id="enabled${status.index}" name="enabled" value="${enabled.value}" ${enabled.value == result.enabled ? 'checked="checked"' : '' }/><label for="enabled${status.index}">${enabled.value}</label>
					</c:forEach>
				</li>
			</ul>
			<ul>
				<li class="title">메뉴권한</li>
				<li class="content">
					<ul id="menuCheckbox">
						<c:set var="menuList" value=",${result.menu}," />
					</ul>
				</li>
			</ul>
			<ul>
				<li class="title">등록일</li>
				<li class="content date"><fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss" value="${result.created}"/></li>
			</ul>
			<ul>
				<li class="title">비고</li>
				<li class="content memo">
					<textarea name="description" id="description">${result.description}</textarea>
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
				<c:if test="${sessionScope.userInfo.userId != result.userId}">
				<a href="#" onclick="fnDelete('${result.id}');return false;" class="btnBg"><span class="icon_delete"></span>삭제</a>
				</c:if>
				<a href="#" onclick="fnEdit();return false;" class="btnBg"><span class="icon_save"></span>저장</a>
			</div>
		</div>
		<!-- bottom button //-->

	</div>
	<!-- 컨텐츠 끝 //-->

</div>

<script type="text/javascript">
	var tmpCpId = new Array; //cp그룹 목록
	var tmpMenu = new Array; //메뉴 목록
	
	$(document).ready(function(){		
		<c:forEach var="cp" items="${resultCp}" varStatus="status">
		var json = new Object();
		json.id = "${cp.id}";
		json.label = "${cp.label}";
		tmpCpId.push(json);
		</c:forEach>
		
		<c:forEach var="menu" items="${menuType}" varStatus="status">
		<c:if test="${menu.depth == '1'}">
		var json = new Object();
		json.value = "${menu.value}";
		json.label = "${menu.label}";
		tmpMenu.push(json);
		</c:if>
		</c:forEach>
		
		$("#form #auth").selectmenu({
			change: function( event, data ) {
				fnCpGroup(data.item.value);
				fnMenu(data.item.value);
			}			
		});
		
		fnCpGroup($("#form #auth option:selected").val());
		fnMenu($("#form #auth option:selected").val());
	});
	
	//권한별 cp
	function fnCpGroup(val){
		var cpGroup = "${cpGroupList}";
		$("#form #cpIdCheckbox").html('');
		if(val == "SAA"){
		   for(var i=0;i<tmpCpId.length;i++){
			   if(tmpCpId[i].label == "SuperBot"){
				   $("#form #cpIdCheckbox").append("<li><input type=\"checkbox\" id=\"cpId"+ i +"\" name=\"cpId\" value=\""+ tmpCpId[i].id +"\" checked=\"checked\"/><label for=\"cpId"+ i +"\">"+ tmpCpId[i].label +"</label></li>");
			   }
		   }
		}else{
		   for(var i=0;i<tmpCpId.length;i++){
			   if(tmpCpId[i].label != "SuperBot"){
				   if(cpGroup.indexOf(','+tmpCpId[i].id+',') > -1){
					   $("#form #cpIdCheckbox").append("<li><input type=\"checkbox\" id=\"cpId"+ i +"\" name=\"cpId\" value=\""+ tmpCpId[i].id +"\" checked=\"checked\"/><label for=\"cpId"+ i +"\">"+ tmpCpId[i].label +"</label></li>");
				   }else{
					   $("#form #cpIdCheckbox").append("<li><input type=\"checkbox\" id=\"cpId"+ i +"\" name=\"cpId\" value=\""+ tmpCpId[i].id +"\"/><label for=\"cpId"+ i +"\">"+ tmpCpId[i].label +"</label></li>");  
				   }
			   }
		   }
		}
	}
	
	//권한별 메뉴
	function fnMenu(val){
		var menu = "${menuList}";
		$("#form #menuCheckbox").html('');
		for(var i=0;i<tmpMenu.length;i++){	
			if(val == "SAA"){
				$("#form #menuCheckbox").append("<li><input type=\"checkbox\" id=\"menu"+ i +"\" name=\"menu\" value=\""+ tmpMenu[i].value +"\" checked=\"checked\" disabled=\"disabled\"/><label for=\"cpId"+ i +"\">"+ tmpMenu[i].label +"</label></li>");
			}else{
				if(menu.indexOf(','+tmpMenu[i].value+',') > -1){
					$("#form #menuCheckbox").append("<li><input type=\"checkbox\" id=\"menu"+ i +"\" name=\"menu\" value=\""+ tmpMenu[i].value +"\" checked=\"checked\"/><label for=\"cpId"+ i +"\">"+ tmpMenu[i].label +"</label></li>");
				}else{
					$("#form #menuCheckbox").append("<li><input type=\"checkbox\" id=\"menu"+ i +"\" name=\"menu\" value=\""+ tmpMenu[i].value +"\"/><label for=\"cpId"+ i +"\">"+ tmpMenu[i].label +"</label></li>");
				}
			}
		}
	}
	
	//목록
	function fnList(){
		var answer = confirm("편집 중인 내용을 잃게 됩니다.\n그래도 이동 하시겠습니까?");
	    if (answer == true){
	    	$("#formPageing").attr("action", "<c:url value='/listCpUser'/>");
			$("#formPageing").submit();
	    }
	}
	
	//취소
	function fnCancel(){
		var answer = confirm("편집 중인 내용이 초기화 됩니다.\n취소하시겠습니까?");
	    if (answer == true){
	    	$("#formPageing").attr("action", "<c:url value='/listCpUser'/>");
			$("#formPageing").submit();
	    }
	}
	
	//삭제
	function fnDelete(id){
		var answer = confirm("삭제 하시면 사용자에 대한 모든 정보를 잃게 됩니다.\n삭제 하시겠습니까?");
	    if (answer == true){
	    	$.ajax({    		
	        	url : "<c:url value='/deleteCpUser'/>",
	        	data: "id="+ id, 
	        	type: 'GET', 
	            dataType: 'json', 
	        	success : function(response){  
	        		if (response.status == 'FAIL') {
	        			alert(response.message);
	                } else {
	                	location.href = "<c:url value='/listCpUser'/>";
	                }
	            },
	            error: function(request, status, error){
	            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
	            }
	    	});
	    }		
	}
	
	//수정
	function fnEdit(){
		if($('#form').valid()){
			if(!$("#form input:checkbox[name='menu']:checkbox[value='A000']").is(":checked")){
				alert("모니터링는 필수 권한입니다.");
				$("#form input:checkbox[name='menu']:checkbox[value='A000']").prop("checked", true);
				return false;
			}
			
			if($("#form #userPwd").val() !== $("#form #userPwdVrfy").val()){
				alert("입력된 비밀번호가 일치하지 않습니다.");
				$("#form #userPwdVrfy").focus();
				return false;
			}
			
			var cpGroup = "";
			$("#form input:checkbox[name='cpId']:checked").each(function(index){
			    if(index != 0) cpGroup += ",";
			    cpGroup += $(this).val();
			});
			
			var menus = "";
			$("#form input:checkbox[name='menu']:checked").each(function(index){
			    if(index != 0) menus += ",";
			    menus += $(this).val();
			});
			
			$("#formSubmit #userPwd").val(fnBase64($("#form #userPwd").val()));
			$("#formSubmit #cpGroup").val(cpGroup);
			$("#formSubmit #groupName").val(fnBase64($("#form #groupName").val()));
			$("#formSubmit #cellPhone").val(fnBase64($("#form #cellPhone").val()));
			$("#formSubmit #enabled").val($("#form input:radio[name='enabled']:checked").val());
			$("#formSubmit #auth").val($("#form #auth option:selected").val());
			$("#formSubmit #menu").val(menus);
			$("#formSubmit #description").val($("#form #description").val());
			
			var formData = $('#formSubmit').serializeArray();
		    var answer = confirm("수정 하시겠습니까?");
		    if (answer == true){
		    	$.ajax({    		
		        	url : "<c:url value='/editCpUser'/>",
		        	data: formData, 
		        	type: 'POST', 
		            dataType: 'json', 
		        	success : function(response){  
		        		if (response.status == 'FAIL') {
		        			alert(response.message);
		                } else {
		                	alert("수정 되었습니다.");
		                	$("#formPageing").attr("action", "<c:url value='/listCpUser'/>");
		        			$("#formPageing").submit();
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
			cpId: {required:true},
			userId: {required:true},
			name: {required:true},
			cellPhone: {required:true,tel:true},
			auth: {required:true},
			menu: {required:true},
			description: {maxlength:200}
		},
		messages: {
			cpId: {
				required:"CP명을 확인하세요."
			},
			userId: {
				required:"ID를 확인하세요."
			},
			name: {
				required:"이름을 확인하세요."
			},
			cellPhone: {
				required:"연락처를 확인하세요.",
				tel:"연락처 형식에 맞게 입력해주세요."
			},
			auth: {
				required:"권한을 선택하세요."
			},
			menu: {
				required:"메뉴를 하나이상 선택하세요."
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