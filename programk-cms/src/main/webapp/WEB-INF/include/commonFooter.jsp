<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!-- 마지막 로그인 안내 시작 -->
<div class="popLayer login">
	<form id="formLogin" method="post">
	<input type="hidden" name="type" id="type" value="login"/>
	<div class="popTitle">
		<h1>안내</h1><a href="#" onclick="fnUpdateLastLogin();return false;" class="btnBg closePopBox"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popContent">
		<div class="alert">
			<p>마지막 로그인 시간</p>
			<p class="pointTxt">
				<fmt:formatDate pattern="yyyy-MM-dd HH:mm:ss" value="${sessionScope.lastLogin}" />
			</p>
		</div>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="#" href="#" onclick="fnUpdateLastLogin();return false;" class="btnBg closePop"><span class="icon_ok"></span>확인</a>
		</div>
	</div>
	</form>
</div>
<!-- 마지막 로그인 안내 끝 -->

<c:if test="${sessionScope.lastLogin != null && sessionScope.lastLogin != ''}">
<script type="text/javascript">
	$(".login, .searchDimm").show();
	$(".login").center();
</script>
</c:if>

<script type="text/javascript">
	//셀렉트 박스 스타일 적용
	$(".selectmenu").selectmenu();
	
	//리스트 툴팁 설정
	$( document ).tooltip({
		track: true
	});
	
	//페이지,버튼별 권한 노출 정책(등록,수정,삭제 등)
	$(document).ready(function(){
		var accessVal = '<c:out value="${sessionScope.userInfo.auth}"/>';
		var currentUrl = location.pathname;
		currentUrl = currentUrl.slice(currentUrl.lastIndexOf("/") + 1);
		
		//cp관리
		if(currentUrl == "listCp" && accessVal != "SAA"){
			$(".icon_write").parent().parent().hide(); //신규등록
			$(".icon_modify").parent().hide(); //수정
		}else if(currentUrl == "detailCp" && accessVal != "SAA"){
			$(".icon_modify").parent().hide(); //수정
		}else if((currentUrl == "addCp" || currentUrl == "editCp") && accessVal != "SAA"){
			alert("해당 페이지 권한이 없습니다.");
			history.go(-1);
		}	
		
		//사용자 관리
		if(currentUrl == "listCpUser" && accessVal != "SAA"){
			$(".icon_write").parent().parent().hide(); //신규등록
			$(".icon_delete").parent().hide(); //삭제
			$(".icon_modify").parent().hide(); //수정
		}else if(currentUrl == "detailCpUser" && accessVal != "SAA"){
			$(".icon_modify").parent().hide(); //수정
			$(".icon_delete").parent().hide(); //삭제
		}else if((currentUrl == "addCpUser" || currentUrl == "editCpUser") && accessVal != "SAA"){
			alert("해당 페이지 권한이 없습니다.");
			history.go(-1);
		}	
		
		//모니터링
		if(currentUrl == "listMonitoring" && accessVal != "SAA"){
			$(".icon_write").parent().hide(); //bots 파일 리로드
			$(".icon_exceldownload").parent().hide(); //bots 파일 다운로드
		}
	});
	
	//로그인시간 업데이트
	function fnUpdateLastLogin(){
		$(".login, .searchDimm").hide();
		
		var formData = $('#formLogin').serializeArray();
		$.ajax({    		
        	url : "<c:url value='/editCpUser'/>",
        	data: formData, 
        	type: 'POST', 
            dataType: 'json', 
        	success : function(response){ 
        		console.log("status : " +  response.status  + "\r\nmessage : " + response.message);
            },
            error: function(request, status, error){
            	console.log("code : " +  request.statusText  + "\r\nmessage : " + request.responseText);
            }
    	});			
	}
</script>
</body>
</html>