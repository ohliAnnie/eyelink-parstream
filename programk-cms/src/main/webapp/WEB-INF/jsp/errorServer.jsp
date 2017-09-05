<%--
 Class Name  : erroServer.jsp
 Description : 500 오류페이지
 
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
	p,ul{margin:0;padding:0;}
	.skip{display:none;}
	.blind{position:absolute;left:-999;top:-999px;overflow:hidden;width:1;height:1px;line-height:999px;}
	.errorWrap500{position:absolute;left:50%;top:50%;margin-left:-250px;margin-top:-255px;width:500px;height:510px;text-align:center;color:#666;}
	.typeA{margin-top:20px;letter-spacing:-0.1em;color:#ed2a26;line-height:33px;}
	.typeA strong{display:block;font-size:26px;}
	.typeA span{font-size:22px;}
	.typeB{display:inline-block;width:332px;margin-top:20px;text-align:left;font-size:13px;}
	.typeB p{margin-bottom:3px;color:#555;font-weight:700;}
	.typeB ul{text-align:left;list-style:none;}
	.typeB ul li span{display:inline-block;vertical-align:2px;}
	.typeC, .btn{margin-top:30px;}
	.btn a:first-child{margin-right:5px;}
</style>
</head>
<body>

<div class="errorWrap500">
	<h1 class="blind">에러 페이지</h1>
	<p><img src="./images/error/logo_error.png" alt="올레닷컴 플러스검색 관리자 사이트 로고" /></p>
	<p class="typeA">
		<strong>죄송합니다.</strong>
		<span>페이지 오류가 발생했습니다.</span>
	</p>
	<div class="typeB">
		<p>아래와 같은 사유로 해당 페이지에 접속할 수 없습니다.</p>
		<ul>
			<li><span>&#9312;</span> 서비스 수행 중에 장애가 발생한 경우</li>
			<li><span>&#9313;</span> 일시적으로 이용량이 급격히 증가한 경우</li>
			<li><span>&#9314;</span> 해당 페이지에 대한 접근권한이 부여되지 않은 경우</li>
		</ul>
	</div>
	<p class="typeC">
		<img src="./images/error/icon_error.png" alt="페이지없음(404)"/>
	</p>
	<div class="btn">
		<a href="#" onclick="history.back(); return false;"><img src="./images/error/btn_error_before.png" alt="이전 페이지로 이동"/></a>
		<a href="./"><img src="./images/error/btn_error_home.png" alt="관리자 사이트 메인 페이지로 이동"/></a>
	</div>
</div>

</body>
</html>
