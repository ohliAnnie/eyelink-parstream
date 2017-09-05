<%--
 Class Name  : listMonitoring.jsp
 Description : 모니터링  - 목록
 
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
	<div class="searchGrpContentBox">
		<!--// 타이틀 및 위치안내 시작 -->
		<div class="titleBox">
			<h3 class="contentTitle">모니터링</h3>
			<p class="location">
				홈 > 모니터링 > 목록
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->
		
		<!--// 정보안내 시작 -->
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> [체크] 버튼 선택 시 수동으로 BOT의 현재 상태를 확인 할 수 있습니다.<br/>
			</p>
		</div>
		<!-- 정보안내 끝 //-->

		<!--// 테이블 시작 -->
		<div class="tableList">
			<table>
				<caption>모니터링-CP명, BOT ID, 상태, BOT 상태 체크</caption>
				<colgroup>
					<col class="w1 w20p">
					<col class="w2">
					<col class="w3 w20p">
					<col class="w4 w20p">
				</colgroup>
				<thead>
					<tr>
						<th scope="col">CP명</th>
						<th scope="col">BOT ID</th>
						<th scope="col">상태</th>
						<th scope="col"></th>
					</tr>
				</thead>
				<tbody>
					<c:choose>
						<c:when test="${fn:length(results) > 0}">
							<c:forEach var="item" items="${results}" varStatus="status">
							<tr>
								<c:if test="${fn:indexOf(item.subLabel, '-01') > 0}">
								<td class="first" rowspan="2">${fn:replace(item.subLabel, 
                                '-01', '')}</td>
								<td class="txtL">
									${item.subLabel} / 
									<c:if test="${item.active == 'Y'}">
										Active
									</c:if>
									<c:if test="${item.active == 'N'}">
										Standby 
									</c:if>
								</td>
								</c:if>
								<c:if test="${fn:indexOf(item.subLabel, '-02') > 0}">
								<td class="txtL lineL">
									${item.subLabel} / 
									<c:if test="${item.active == 'Y'}">
										Active
									</c:if>
									<c:if test="${item.active == 'N'}">
										Standby 
									</c:if>
								</td>
								</c:if>
								<td id="${item.subLabel}">-</td>
								<td>
									<a href="javascript:;" onclick="javascript:fnCheck('${item.subLabel}');" class="btnBg"><span class="icon_ok"></span>체크</a>
								</td>
							</tr>
							</c:forEach>
						</c:when>
					</c:choose>
				</tbody>
				<tfoot></tfoot>
			</table>
		</div>
		<!-- 테이블 끝 //-->

	</div>
	<!-- 컨텐츠 끝 //-->

</div>

<!-- BOT ID 정상 동작 팝업 시작 -->
<div class="popLayer botCheck1">
	<div class="popTitle">
		<h1>BOT 체크</h1>
		<a href="javascript:;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popContent">
		<div class="alert"><span class="blackTxt fontB" id="alertLabel">“BOT ID”</span>가 <span class="txtPoint fontB">정상</span> 동작하고 있습니다.</div>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="javascript:;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
		</div>
	</div>
</div>
<!-- BOT ID 정상 동작 팝업 끝 -->

<!-- BOT ID 이상 동작 팝업 시작 -->
<div class="popLayer botCheck2">
	<div class="popTitle">
		<h1>BOT 체크</h1>
		<a href="javascript:;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popContent">
		<div class="alert">
			<span class="blackTxt fontB" id="alertLabel">“BOT ID”</span>가 <span class="pointTxt fontB">이상</span> 동작하고 있습니다.<br/>확인하시기 바랍니다.
			<span id="message"></span>
		</div>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="javascript:;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
		</div>
	</div>
</div>
<!-- BOT ID 이상 동작 팝업 끝 -->

<!-- BOT ID 로딩 팝업 시작 -->
<div class="popLayer loading">
	<div class="popTitle">
		<h1>BOT 체크</h1>
	</div>
	<div class="popContent">
		<div class="alert">
			<p class="pointTxt">확인중입니다.</p>
		</div>
	</div>
</div>
<!-- BOT ID 로딩  팝업 끝 -->

<script type="text/javascript">
	//체크
	function fnCheck(label){
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
        			try {
        				var jsonData = JSON.parse(response.message);
        				message = jsonData.message;
					} catch (e) {
						message = "서버에 연결할 수 없습니다.";
					}
        			
        			fnDone(".botCheck2","1",label,message);
                } else {
                	fnDone(".botCheck1","0",label,'');
                }
            },
			beforeSend:function(){
                $(".loading, .searchDimm").show();
        		$(".loading").center();
            },
			error: function(request, status, error){
				fnDone(".botCheck2","1",label,request.responseText);
			}
    	});
	}
	
	//결과 레이어 노출
	function fnDone(name,type,label,message){
		$(".loading").hide();
		$(name + " #alertLabel").html("“"+ label +"”");
		$(name).show();
		$(name).center();
		$(".searchDimm").show();

		if(type == "0"){
			$("#"+label).html("정상");
		}else{
			$(".botCheck2 #message").html("<br/>오류 : "+ message);
			$("#"+label).html("이상 <img src=\"./images/icon_error.png\" alt=\"BOT 상태 이상\" class=\"icon_error\">");
		}
	}
</script>

<%@ include file="../include/commonFooter.jsp" %>	