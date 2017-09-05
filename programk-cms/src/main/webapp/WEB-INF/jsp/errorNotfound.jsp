<%--
 Class Name  : erroNotfound.jsp
 Description : 404 오류페이지
 
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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">
<head>
<title>대화플랫폼 CMS</title>
<meta http-equiv="Expires" content="-1" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Cache-Control" content="No-Cache" />
<meta http-equiv="content-Type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" type="image/x-icon" href="./images/error/favicon_olleh.ico" />
<style type="text/css">
	html,body {position:relative;width:100%;height:100%;min-height:600px;margin:0;padding:0;font-family:"Malgun Gothic","Dotum","Arial";}
	a,img{border:0;}
	p{margin:0;padding:0;}
	.skip{display:none;}
	.blind{position:absolute;left:-999;top:-999px;overflow:hidden;width:1;height:1px;line-height:999px;}
	.errorWrap404{position:absolute;left:50%;top:50%;margin-left:-250px;margin-top:-240px;width:500px;height:480px;text-align:center;color:#666;}
	.typeA{margin-top:20px;letter-spacing:-0.1em;color:#ed2a26;line-height:33px;}
	.typeA strong{display:block;font-size:26px;}
	.typeA span{font-size:22px;}
	.typeB{margin-top:20px;font-size:15px;}
	.typeC, .btn{margin-top:30px;}
	.btn a:first-child{margin-right:5px;}
</style>
</head>
<body>

<div class="errorWrap404">
	<h1 class="blind">에러 페이지</h1>
	<p><img src="./images/error/logo_error.png" alt="올레닷컴 플러스검색 관리자 사이트 로고" /></p>
	<p class="typeA">
		<strong>죄송합니다.</strong>
		<span>요청하신 페이지를 찾을 수 없습니다.</span>
	</p>
	<p class="typeB">
		접속하시려는 페이지의 주소(URL)가 잘못 입력되거나,<br/>
		페이지의 주소가 변경 또는 삭제되어 해당 페이지에 접속할 수 없습니다.
	</p>
	<p class="typeC">
		<img src="./images/error/icon_not_found.png" alt="페이지없음(404)"/>
	</p>
	<div class="btn">
		<a href="#" onclick="history.back(); return false;"><img src="./images/error/btn_error_before.png" alt="이전 페이지로 이동"/></a>
		<a href="./"><img src="./images/error/btn_error_home.png" alt="관리자 사이트 메인 페이지로 이동"/></a>
	</div>
</div>

</body>
</html>
