<%--
 Class Name  : addSubs.jsp
 Description : 콘텐츠 관리 - 전처리 등록
 
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
			<h3 class="contentTitle">전처리 신규 생성</h3>
			<p class="location">
				홈 > 콘텐츠 관리 > 전처리 관리 > 신규 생성
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->
		
		<!--// 정보안내 시작 -->
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> 대상 키워드에는 정규식 사용을 할 수 있습니다.<br/>
				<span class="bul_txt">&#42;</span> <>"'& 특수문자는 사용 할 수 없습니다.<br/>
			</p>
		</div>
		<!-- 정보안내 끝 //-->

		<!--// 테이블 시작 -->
		<form id="form" method="post">
		<input type="hidden" id="cateId" name="cateId" />
		<input type="hidden" id="find" name="find" />
		<input type="hidden" id="replace" name="replace" />
		<div class="tableWriteBox">
			<ul>
				<li class="title w20p">CP <span class="required"></span></li>
				<li class="content">
					<select class="selectmenu" id="cpId" name="cpId">
						<c:forEach var="cp" items="${result}" varStatus="status">
							<option value="${cp.id}">${cp.label}</option>
						</c:forEach>				
					</select>
				</li>
			</ul>		
			<ul>
				<li class="title w15p">카테고리 <span class="required"></span></li>
				<li class="content">
					<input type="text" class="w70p" id="cateName" name="cateName" readonly />
					<a href="#" onclick="fnCategoryLayer();return false;" class="btnBg"><span class="icon_search"></span>조회</a>
				</li>
			</ul>
			<ul>
				<li class="title">전처리 설정 <span class="required"></span></li>
				<li class="content">
					<div class="sub_table txtL" id="addOption">
						<ul>
							<li class="title">대상 키워드</li>
							<li class="title">정규화 키워드</li>
							<li class="title w4p"></li>
						</ul>
						<ul class="input">
							<li><input type="text" id="tmp_find" name="tmp_find" maxlength="50" /></li>
							<li><input type="text" id="tmp_replace" name="tmp_replace" maxlength="100" /></li>
							<li class="btn"><a href="#" onclick="fnAddOption();return false;" class="btnBg"><span class="icon_plus">추가</span></a></li>
						</ul>
					</div>
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

<!-- 카테고리 검색 팝업 시작 -->
<div class="popLayer categorySearchPop w600px">
	<div class="popTitle">
		<h1>카테고리 검색</h1>
		<a href="javascript:;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popTopContentBox">
		<iframe id="iframeCategory" name="iframeCategory" src="<c:url value='/searchSubsCategory'/>" width="580" height="240" marginwidth="0" marginheight="0" frameborder="no" scrolling="auto"></iframe>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="javascript:;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
		</div>
	</div>
</div>
<!-- 카테고리 검색 팝업 끝 -->

<script type="text/javascript">
	$( "#cpId" ).selectmenu({
	   change: function( event, data ) {
		    $("#cateId").val('');
			$("#cateName").val('');
	   }
	});
	
	//키워드 추가/삭제
	function fnAddOption(){
		// clone
        $.trClone = $("#addOption ul:last").clone().html();
        $.newTr = $("<ul class=\"input\">"+$.trClone+"</ul>");

        // append
        $("#addOption").append($.newTr);

        // delete Button 추가
        $.btnDelete = "<a href=\"javascript:;\" class=\"icon_cancel\" id=\"btnDelete\">삭제</a>";
        $("#addOption ul:last li:last").html("");
        $("#addOption ul:last li:last").append($.btnDelete);

        // 버튼에 클릭 이벤트 추가
        $("#addOption ul>li:last").find("#btnDelete").on('click', function(){
            $(this).parent().parent().remove();
        });
	}
	
	//카테고리 레이어 팝업
	function fnCategoryLayer(){
		$("#iframeCategory").attr("src","/cms/searchSubsCategory?cpId="+$("#cpId").val());
		$(".categorySearchPop, .searchDimm").show();
		$(".categorySearchPop").center();
	}
	
	//카테고리 선택시
	function fnCategory(val){
		var res = val.split("|");
		$("#form #cateId").val(res[0]);
		$("#form #cateName").val(res[1]);
		$(".categorySearchPop, .searchDimm").hide();
	}
	
	//목록
	function fnList(){
		var answer = confirm("편집 중인 내용을 잃게 됩니다.\n그래도 이동 하시겠습니까?");
	    if (answer == true){
	    	location.href = "<c:url value='/listSubs'/>";
	    }
	}
	
	//취소
	function fnCancel(){
		var answer = confirm("편집 중인 내용이 초기화 됩니다.\n취소하시겠습니까?");
	    if (answer == true){
	    	location.reload();  
	    }
	}
	
	//저장
	function fnAdd(){
		if($('#form').valid()){
			
			//중복체크 - 대상 키워드
			if(unique("tmp_find","대상 키워드") != ""){
				alert(unique("tmp_find","대상 키워드"));
				return false;
			}
			
			$("#find").val(arrtostr("tmp_find","text"));
			$("#replace").val(arrtostr("tmp_replace","text"));
			
			var formData = $('#form').serializeArray();
		    var answer = confirm("저장 하시겠습니까?");
		    if (answer == true){
		    	$.ajax({    		
		        	url : "<c:url value='/addSubs'/>",
		        	data: formData, 
		        	type: 'POST', 
		            dataType: 'json', 
		        	success : function(response){  
		        		if (response.status == 'FAIL') {
		        			alert(response.message);
		                } else {
		                	alert("저장 되었습니다.");
		                	location.href = "<c:url value='/listSubs'/>";
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
			cateName: {required:true},
			tmp_find: {required:true,inputbox:true},
			tmp_replace: {required:true,inputbox:true}
		},
		messages: {
			cateName: {
				required:"카테고리를 확인 하세요."
			},
			tmp_find: {
				required:"대상 키워드를 확인 하세요.",
				inputbox:"<>&\'\"는 사용할 수 없습니다."
			},
			tmp_replace: {
				required:"정규화 키워드를 확인 하세요.",
				inputbox:"<>&\'\"는 사용할 수 없습니다."
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