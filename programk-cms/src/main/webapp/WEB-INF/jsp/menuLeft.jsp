<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:if test="${not empty message}">
    <script type="text/javascript">
    	alert("${message}");
    	location.href = "<c:url value='/listMonitoring'/>";
    </script>
</c:if>

<hr class="blind"/>
<div class="searchGrpLnbWrap">
	<div class="searchGrpLnb">
		<div class="menuBox">
			<c:forEach var="menuDepth1" items="${menuType}" varStatus="status">				
			<c:if test="${menuDepth1.depth == '1' && fn:indexOf(menuUser.menu, menuDepth1.value) > -1}">
   			<ul>
				<li>
					<c:choose>
					<c:when test="${fn:substring(menuCode, 0, 1) == fn:substring(menuDepth1.value, 0, 1)}">
						<a href="<c:url value='${menuDepth1.url}'/>" class="on"><span class="${menuDepth1.icon}"></span><span class="menuTxt">${menuDepth1.label}</span></a>
						<div class="depth2Box">
							<h2 class="searchGrpLnbTitle">${menuDepth1.label}</h2>
							<c:forEach var="menuDepth2" items="${menuType}" varStatus="status">	
							<c:if test="${menuDepth2.depth == '2' && fn:substring(menuDepth1.value, 0, 1) == fn:substring(menuDepth2.value, 0, 1)}">
							<ul>
								<li>
									<c:if test="${fn:substring(menuCode, 0, 2) == fn:substring(menuDepth2.value, 0, 2)}">
										<a href="#" onclick="fnMenuToggle(this,1);return false;" class="minusOn">${menuDepth2.label}</a>
									</c:if>
									<c:if test="${fn:substring(menuCode, 0, 2) != fn:substring(menuDepth2.value, 0, 2)}">
										<a href="#" onclick="fnMenuToggle(this,2);return false;" class="minus">${menuDepth2.label}</a>
									</c:if>									
									<ul>
										<c:forEach var="menuDepth3" items="${menuType}" varStatus="status">	
										<c:if test="${menuDepth3.depth == '3' && fn:substring(menuDepth2.value, 0, 2) == fn:substring(menuDepth3.value, 0, 2)}">
										<c:if test="${menuDepth3.value != 'A102' || (sessionScope.userInfo.auth == 'SAA' && menuDepth3.value == 'A102')}">
											<li><a href="<c:url value='${menuDepth3.url}'/>"  <c:if test="${menuCode == menuDepth3.value}">class="on"</c:if>>${menuDepth3.label}</a></li>
										</c:if>
										</c:if>
										</c:forEach>
									</ul>
								</li>
							</ul>
							</c:if>
							</c:forEach>
						</div>
					</c:when>
					<c:otherwise>
						<c:if test="${fn:substring(menuDepth1.value, 0, 1) == 'H'}">
						<a href="#" onclick="openPopup('<c:url value='${menuDepth1.url}'/>','시뮬레이터','700','680','no','no','no','no','no','yes');return false;"><span class="${menuDepth1.icon}"></span><span class="menuTxt">${menuDepth1.label}</span></a>
						</c:if>
						<c:if test="${fn:substring(menuDepth1.value, 0, 1) != 'H'}">
						<a href="<c:url value='${menuDepth1.url}'/>"><span class="${menuDepth1.icon}"></span><span class="menuTxt">${menuDepth1.label}</span></a>
						</c:if>
					</c:otherwise>
					</c:choose>
				</li>
			</ul>
			</c:if>
			</c:forEach>			
		</div>
	</div>
</div>
<div class="searchGrpToggle">
	<a href="javascript:;" class="btnToggle toggle_close" title="대화플랫폼 CMS메뉴 닫기"></a>
</div>

<script>
// 토글버튼
$( ".btnToggle" ).click(
	function() {
		$("body").toggleClass( "bg_body" ); //배경 왼쪽으로 이동
		$(".searchGrpLnbWrap").toggleClass( "clearLnbWrap" ); //왼쪽메뉴 숨기기
		$(".searchGrpContent").toggleClass( "fullScreen" ); //컨텐츠 100%
		$(".searchGrpToggle").toggleClass( "clearToggle" ); //왼쪽메뉴 숨기기
		$(".btnToggle").toggleClass( "toggle_open" ); //열기이미지로 바뀜
		
		if($(".searchGrpLnbWrap").hasClass("clearLnbWrap")){
			$(".searchGrpToggle a").attr("title","대화플랫폼 CMS메뉴 열기");
		}else{
			$(".searchGrpToggle a").attr("title","대화플랫폼 CMS메뉴 닫기");
		}
	}
);

//메뉴토글
function fnMenuToggle(obj,type){	
	if(type == "1"){
		if($(obj).hasClass("minusOn")){
			$(obj).removeClass("minusOn").addClass("plusOn");
			$(obj).parent().find("ul").hide();
		}else{
			$(obj).removeClass("plusOn").addClass("minusOn");
			$(obj).parent().find("ul").show();	
		}
	}else{
		if($(obj).hasClass("minus")){
			$(obj).removeClass("minus").addClass("plus");
			$(obj).parent().find("ul").hide();
		}else{
			$(obj).removeClass("plus").addClass("minus");
			$(obj).parent().find("ul").show();	
		}
	}
}

//시뮬레이터
function openPopup(popupUrl, popupName, w, h) {
	//시뮬레이터 메뉴 선택
	//$(".menuBox ul>li a").removeClass("on");
	//$(".menuBox ul>li:last a").addClass("on");
	
	leftPosition = (screen.width) ? (screen.width-w)/2 : 0;
	topPosition = 10;//(screen.height) ? (screen.height-h)/2 : 0;
	option = 'height='+h+',width='+w+',top='+ topPosition+',left='+leftPosition;
	window.open(popupUrl, popupName, option);
}
</script>