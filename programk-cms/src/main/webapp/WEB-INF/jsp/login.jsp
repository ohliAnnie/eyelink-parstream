<%--
 Class Name  : login.jsp
 Description : 로그인 페이지
 
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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">
<head>
<title>대화플랫폼 CMS</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta http-equiv="Expires" content="-1"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Cache-Control" content="No-Cache"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<link type="text/css" href="<c:url value='/css/login.css'/>" rel="stylesheet" />
<link type="text/css" href="<c:url value='/js/jquery-ui.min.css'/>" rel="stylesheet"/>
<script type="text/javascript" src="<c:url value='/js/jquery-1.10.2.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/jquery-ui.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/jquery.base64.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/common.js'/>"></script>
<link rel="shortcut icon" type="image/x-icon" href="<c:url value='/images/favicon_olleh.ico'/>" />
</head>
<body>

<div class="searchGrpLoginWrap">
	<div class="searchGrpLoginBox">
		<h1 class="searchGrpLogo"><span class="txtHidn">olleh 플러스검색 관리자 사이트</span></h1>
		<form id="loginFrm" method="post" autocomplete="off" accept-charset="EUC-KR" onsubmit="return fnLogin();">
		<!-- <input type="hidden" name="URL" id="url" value="${pssoInfo.returnURL}" /> 
		<input type="hidden" name="clientkey" id="clientkey" value="${pssoInfo.pssoKey}" /> -->
		<input type="hidden" name="password" id="password" /> 
			<fieldset class="loginForm">
			<h2 class="txtHidn">로그인</h2>
				<div class="loginBox">
					<dl>
						<dt><label class="txtId" for="input_id"><span class="txtHidn">아이디</span></label></dt>
						<dd><input type="text" class="intLogin" name="id" id="input_id" title="아이디" /></dd>
					</dl>
					<dl>
						<dt><label class="txtPw" for="input_pw"><span class="txtHidn">비밀번호</span></label></dt>
						<dd><input type="password" class="intLogin" name="input_pw" id="input_pw" title="비밀번호" /></dd>
					</dl>
					<div class="checkIDBox">
						<c:if test="${errCode != 0}">
							<c:if test="${errCode == -1}">
								<span><font color="red">* ID가 존재 하지 않습니다.</font></span>
							</c:if>
							<c:if test="${errCode == -2}">
								<span><font color="red">* 패스워드가 틀립니다.</font></span>
							</c:if>
							<c:if test="${errCode == -3}">
								<span><font color="red">* System 장애입니다.</font></span>
							</c:if>
							<c:if test="${errCode == -11}">
								<span><font color="red">* 로그인 불가 입니다.</font></span>
							</c:if>
							<c:if test="${errCode == 99}">
								<span><font color="red">* CMS 접근권한이 없습니다. 관리자에게 문의하세요.</font></span>
							</c:if>
							<c:if test="${errCode == 999}">
								<span><font color="red">* 다른곳에서 동일한 계정으로 로그인 되었습니다.</font></span>
							</c:if>
						</c:if>
					</div>
				</div>
				<div class="btnLoginBox">
					<input type="submit" value="로그인" class="btnLogin" />
				</div>
			<!-- <div class="checkInfo">
				<a href="#" class="btnJoin" onclick="fnJoin();return false;"><span>파트너ID회원가입</span></a>
				<a href="#" class="btnIdPw" onclick="fnFindLoginInfo();return false;"><span>ID&#47;PW찾기</span></a>
			</div> -->
		</fieldset>
		</form>
	</div>
</div>

<script type="text/javascript">
$(document).ready(function() {
	// 아이디 필드로 포커스 이동
	$("#input_id").focus();
});

//로그인 처리
function fnLogin(){

	var pattern = /[^(a-zA-Z0-9)]/gi;
	var input_id = $("#input_id").val();
	var input_pw = $("#input_pw").val();
	
	if(pattern.test(input_id)){
		alert("아이디는 영문 또는 숫자로만 입력해 주세요.");
		$("#input_id").focus();
		input_id = $("#input_id").val().replace(pattern, "");
		return false;
	}

	if (input_id == "") {
		alert("아이디를 입력하세요.");
		$("#input_id").focus();
		return false;
	}

	if (input_pw == "") {
		alert("비밀번호를 입력하세요.");
		$("#input_pw").focus();
		return false;
	}
	
	$("#loginFrm #password").val(fnBase64($("#loginFrm #input_pw").val()));
	
	$("#loginFrm").attr("action","login");
	$("#loginFrm").attr("method", "post");
	return true;
}

function fnJoin() {
	location.href = "${pssoInfo.pssoJoinURL}?site=${pssoInfo.site}&clientkey=${pssoInfo.pssoKey}";
}

function fnFindLoginInfo() {
	location.href = "${pssoInfo.pssoFindLoginInfoURL}?site=${pssoInfo.site}&clientkey=${pssoInfo.pssoKey}";
}
</script>

</body>
</html>

