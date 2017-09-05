<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko" />
<head>
<title>대화플랫폼 CMS</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta http-equiv="Expires" content="-1"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Cache-Control" content="No-Cache"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<link type="text/css" href="<c:url value='/css/reset.css'/>" rel="stylesheet" />
<link type="text/css" href="<c:url value='/css/common.css'/>" rel="stylesheet" />
<link type="text/css" href="<c:url value='/css/table.css'/>" rel="stylesheet" />
<link type="text/css" href="<c:url value='/js/jquery-ui.min.css'/>" rel="stylesheet"/>
<link rel="shortcut icon" type="image/x-icon" href="<c:url value='/images/favicon_olleh.ico'/>" />
<script type="text/javascript" src="<c:url value='/js/jquery-1.10.2.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/jquery-ui.min.js'/>" ></script>
<script type="text/javascript" src="<c:url value='/js/jquery-ui.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/jquery.validate.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/jquery.base64.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/common.js'/>"></script>
</head>
<body>

<!--// Dimm 영역 시작 -->
<div class="searchDimm">
	<img src="<c:url value='/images/bgDimm.png'/>" alt=""/>
</div>
<!-- Dimm 영역 끝 //-->

<hr class="blind"/>
<div class="searchGrpHead">
	<div class="searchGrpHeadBox">
		<h1 class="searchGrpLogo"><a href="<c:url value='/listMonitoring'/>"><span class="txtHidn">olleh 플러스검색 관리자 사이트</span></a></h1>
		
		<div class="searchGrpUser">
			<span class="userNameBox"><c:out value="${fn:substring(sessionScope.userInfo.name, 0, fn:length(sessionScope.userInfo.name)-1)}*" /></span>님 환영합니다.
<!-- 			<a href="https://psso.olleh.com/Join_Olleh/update.asp?site=dialogcms.kt.com&clientkey=HKig2Ydq9y" class="btnBg"><span class="icon_partnerid"></span>파트너ID정보변경</a> -->
			    <!-- <a href="http://psso.olleh.com/logon/logoff.asp?url=http://dialogcms.kt.com:8080/cms/logout&clientKey=HKig2Ydq9y" class="btnBg"><span class="icon_logout"></span>로그아웃</a> -->
				<a href="<c:url value='/logout'/>" class="btnBg"><span class="icon_logout"></span>로그아웃</a>
		</div>
	</div>
</div>

<%-- //왼쪽 메뉴 --%>
<c:import url="/menuLeft" charEncoding="UTF-8"/>
<%-- 왼쪽메뉴// --%>