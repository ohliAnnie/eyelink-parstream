<%--
 Class Name  : addChat.jsp
 Description : 콘텐츠 관리 - 대화 등록
 
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

<link type="text/css" href="<c:url value='/js/mindmap.css'/>" rel="stylesheet"/>
<script type="text/javascript" src="<c:url value='/js/mindmap.min.js'/>"></script>

<hr class="blind">
<div class="searchGrpContent">
	<!--// 컨텐츠 시작 -->
	<div class="searchGrpContentBox user">
		<!--// 타이틀 및 위치안내 시작 -->
		<div class="titleBox">
			<h3 class="contentTitle">대화 신규 생성</h3>
			<p class="location">
				홈 > 콘텐츠 관리 > 대화 관리 > 목록 > 대화 신규 생성
			</p>
		</div>
		<!-- 타이틀 및 위치안내 끝 //-->
		
		<!--// 정보안내 시작 -->
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> 추천질문과 추가답변으로 등록한 질문의 답변이 대화로 등록되어 있어야 합니다.<br/>
			    <span class="bul_txt">&#42;</span> 추가 옵션은 정의된 기능이 아니며, Client 담당자와 협의 후 활용해야 합니다.<br/>
				<span class="bul_txt">&#42;</span> 질문은 아래의 예시에 대한 수식을 활용하여 등록할 수 있습니다.<br/>
				1) {*} 요금제 {*} : ‘요금제’ 앞/뒤로 랜덤한 여러 단어(0개 포함)가 입력되어도 해당 질문의 답변 제공<br/>
				2) 요금제+ : ‘요금제’ 뒤로 랜덤한 여러 글자(0개 포함)가 입력되어도 해당 질문의 답변 제공<br/>
				3) (요금제|상품) : 요금제 또는 상품으로 입력되어도 해당 질문의 답변 제공<br/>
			</p>
		</div>
		<!-- 정보안내 끝 //-->	
		
		<form id="form" method="post">
		<input type="hidden" id="cateId" name="cateId" />
		<input type="hidden" id="linkTitle" name="linkTitle" />
		<input type="hidden" id="linkComment" name="linkComment" />
		<input type="hidden" id="linkUrl" name="linkUrl" />
		<input type="hidden" id="recommendInput" name="recommendInput" />
		<input type="hidden" id="replyInput" name="replyInput" />		
		<h4 class="tableTitle2">1. 기본 답변 등록(필수)</h4>
		<!--// 테이블 시작 -->
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
				<li class="title w20p">카테고리 <span class="required"></span></li>
				<li class="content">
					<input type="text" class="w200px" id="cateName" name="cateName" readonly/>
					<a href="#" onclick="fnCategoryLayer();return false;" class="btnBg"><span class="icon_search"></span>조회</a>
				</li>
			</ul>
			<ul>
				<li class="title">질문 <span class="required"></span></li>
				<li class="content">					
					<input type="text" class="w70p" id="input" name="input" maxlength="255"/>
					<input type="hidden" id="testInput" name="testInput" id="testInput" />
					<a href="#" onclick="fnAddTestLayer();return false;" class="btnBg"><span class="icon_utility"></span>검증 샘플 등록</a>
					<p class="info txtPoint">※ 검증 시 사용할 질문 예시를 1개 이상 입력해 주세요.</p>					
				</li>
			</ul>
			<ul>
				<li class="title">답변 <span class="required"></span></li>
				<li class="content">
					<div class="sub_content">
						<ul>
							<li class="title">Aiml</li>
							<li class="content">
								<select class="selectmenu" id="aimlTag" name="aimlTag">
									<option value="">선택</option>
									<c:forEach var="tag" items="${aimlTag}" varStatus="status">		
										<option value="${tag.tag}">${tag.value}</option>
									</c:forEach>
								</select>								
							</li>
<!-- GS리테일 설치시 주석처리 함 (카톡에서 지원하지 않음)-->							
<!--						<li class="title">html</li>
							<li class="content">
								<select class="selectmenu" id="htmlTag" name="htmlTag">
									<option value="">선택</option>
									<c:forEach var="tag" items="${htmlTag}" varStatus="status">		
										<option value="${tag.tag}">${tag.value}</option>
									</c:forEach>
								</select>
							</li>
							<li class="title">Color</li>
							<li class="content">
								<span id="circle"></span>
								<select class="selectmenu" name="color" id="color">
									<option value="">선택</option>
									<c:forEach var="color" items="${htmlColor}" varStatus="status">		
										<option value="${color.color}">${color.value}</option>
									</c:forEach>
								</select>
							</li>
-->						</ul>
					</div>
					<div class="memo">
						<textarea name="reply" id="reply"></textarea>
					</div>
					<p class="info txtPoint">※ AMIL 기능을 활용하여 답변을 등록할 수 있으며, 일반 답변 등록 시 입력란에 < > 문자는 사용할 수 없습니다.</p>	
				</li>
			</ul>
			<ul>
				<li class="title">이미지</li>
				<li class="content imgURL">
					<input type="text" class="w70p" id="imageUrl" name="imageUrl" maxlength="255"/>
					<a href="#" onclick="fnViewImageLayer();return false;" class="btnBg"><span class="icon_search"></span>미리보기</a>
				</li>
			</ul>
<!-- GS리테일 설치시 주석처리 함 (카톡에서 지원하지 않음)-->
<!--		<ul>
				<li class="title">이미지 대체 텍스트</li>
				<li class="content">
					<input type="text" class="w70p" id="imageAlt" name="imageAlt" maxlength="255" />
				</li>
			</ul>
-->		</div>
		
		<h4 class="tableTitle2 lineT0">2. 텍스트 링크(선택)</h4>
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> 링크제목은 답변과 함께 노출되며, 사용자가 링크 제목 선택 시 연결 URL 페이지로 이동합니다.<br/>
			</p>
		</div>
		<div class="tableWriteBox">
			<ul>
				<li class="title w20p">텍스트 링크</li>
				<li class="content">
					<div class="sub_table txtL" id="addLinkOption">
						<ul>
							<li class="title w25p">링크 제목</li>
							<li class="title w25p">설명(선택)</li>
							<li class="title">연결 URL</li>
							<li class="title w4p"></li>
						</ul>
						<ul class="input">
							<li><input type="text" name="tmp_linkTitle" maxlength="100" /></li>
							<li><input type="text" name="tmp_linkComment" maxlength="255" /></li>
							<li><input type="text" name="tmp_linkUrl" maxlength="255" /></li>
							<!-- GS리테일 설치시 주석처리 함 ( 카톡 연동시 한 개 밖에 사용 못하기 때문 )-->
							<!-- <li class="btn"><a href="#" onclick="fnAddLinkOption();return false;" class="btnBg"><span class="icon_plus">추가</span></a></li> -->
						</ul>
					</div>
				</li>
			</ul>
		</div>
		
		<h4 class="tableTitle2 lineT0">3. 이전답변/추천질문 설정(선택)</h4>
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> 추천질문은 답변과 함께 노출되며, 사용자가 추천질문 선택 시 해당 질문으로 다시 한번 검색을 실행합니다.<br/>
			</p>
		</div>
		<div class="mindmap">
			<ol class="children children_leftbranch">
				<li class="children__item">
					<div class="node">
						<div class="node__text"><span id="thatInput">이전답변</span>  <a href="#" onclick="fnAddThatLayer();return false;" class="btnBg"><span class="icon_plus"></span></a></div>
						<input type="text" class="node__input" name="thatId" id="thatId" value="0">
					</div>
				</li>
			</ol>
			<div class="node node_root">
				<div class="node__text">질문</div>
				<input type="text" class="node__input">
			</div>
			<ol class="children children_rightbranch">				
				<li class="children__item" id="addRecommend">
					<div class="node">
						<div class="node__text">추천질문  <a href="#" onclick="fnAddRecommendLayer();return false;" class="btnBg"><span class="icon_plus"></span></a></div>
						<input type="text" class="node__input">
					</div>		
				</li>
			</ol>
		</div>

<!-- GS리테일 설치시 주석처리 함 (카톡에서 지원하지 않음)-->
<!--
		<h4 class="tableTitle2 lineT0">4. 추가 답변 등록(선택)</h4>
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> ‘답변 등록’에 질문을 추가하면, 해당 질문에 대한 답변 내용이 같이 전달됩니다.<br/>
			</p>
		</div>
		<div class="tableWriteBox">
			<ul>
				<li class="title w20p">답변 등록</li>
				<li class="content">
					<div class="sub_table" id="addReplyOption">
						<ul class="input">
							<li><input type="text" class="w400px" name="tmp_replyInput" maxlength="255"/></li>
							<li class="btn"><a href="#" onclick="fnAddReplyOption();return false;" class="btnBg"><span class="icon_plus">추가</span></a></li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
		
		<h4 class="tableTitle2 lineT0">5. 추가 옵션 등록(선택)</h4>
		<div class="txt mgnB7">
			<p>
				<span class="bul_txt">&#42;</span> 연동 규격서를 참조하여 활용해야 하며, 입력란에 & 문자는 사용할 수 없습니다.<br/>
			</p>
		</div>
		<div class="tableWriteBox">
			<c:forEach var="i" begin="1" end="5">
			<ul>
				<li class="title w20p">옵션${i}</li>
				<li class="content">
					<div class="memo">
						<textarea style="height:50px;" id="option${i}" name="optionInput"></textarea>
					</div>
				</li>
			</ul>
			</c:forEach>
		</div>
-->
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
		<iframe id="iframeCategory" name="iframeCategory" src="<c:url value='/searchChatCategory'/>" width="580" height="240" marginwidth="0" marginheight="0" frameborder="no" scrolling="auto"></iframe>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="javascript:;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
		</div>
	</div>
</div>
<!-- 카테고리 검색 팝업 끝 -->

<!-- 검증 샘플 입력 팝업 시작 -->
<div class="popLayer definiteWritePop">
	<form id="formTest" method="get">
	<div class="popTitle">
		<h1>검증 샘플 입력</h1>
		<a href="#" onclick="return false;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popContent">
		<p class="info txtPoint">※ 검증 시 사용할 질문 예시를 1개 이상 입력해 주세요.</p>
		<div class="sub_table" id="addTestOption">
			<ul class="input">
				<li class="w96p"><input type="text" class="w100p" name="test" /></li>
				<li class="btn"><a href="#" onclick="fnAddTestOption();return false;" class="btnBg"><span class="icon_plus">추가</span></a></li>
			</ul>
		</div>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="#" onclick="return false;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
			<a href="#" onclick="fnAddTest();return false;" class="btnBg"><span class="icon_ok"></span>적용</a>
		</div>
	</div>
	</form>
</div>
<!-- 검증 샘플 입력 팝업 끝 -->

<!-- 이미지 미리보기 팝업 시작 -->
<div class="popLayer previewPop">
	<div class="popTitle">
		<h1>이미지 미리보기</h1>
		<a href="#" onclick="return false;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popPreviewContent">
		<ul>
			<li class="ktConsultant"><img src="./images/kt_logo.png" alt="kt로고"/></li>
			<li class="consultation">
				<div class="answer">
					<p class="top">질문입니다</p>
					<p class="center"><img src="./images/sample.png" id="imageTempUrl" /></p>
					<p class="bottom"><span class="title">답변입니다.</span></p>
				</div>
			</li>
		</ul>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="#" onclick="return false;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
		</div>
	</div>
</div>
<!-- 이미지 미리보기 팝업 끝 -->

<!-- 추천질문 팝업 시작 -->
<div class="popLayer questionPop">
	<div class="popTitle">
		<h1>추천질문 추가</h1>
		<a href="javascript:;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popContent">
		<div class="alert">
			<input type="text" class="w100p" name="tempRecommend" id="tempRecommend" />
		</div>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="javascript:;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
			<a href="javascript:;" onclick="fnAddRecommend();return false;" class="btnBg"><span class="icon_ok"></span>적용</a>
		</div>
	</div>
</div>
<!-- 추천질문 팝업 끝 -->

<!-- 이전답변 팝업 시작 -->
<div class="popLayer answerPop w600px">
	<div class="popTitle">
		<h1>이전답변 검색</h1>
		<a href="javascript:;" class="btnBg closePopBox closePop"><span class="icon_closePop">닫기</span></a>
	</div>
	<div class="popTopContentBox">
		<iframe id="iframeThat" name="iframeThat" src="<c:url value='/searchChat'/>" width="580" height="240" marginwidth="0" marginheight="0" frameborder="no" scrolling="auto"></iframe>
	</div>
	<div class="bottomButton">
		<div class="right">
			<a href="javascript:;" class="btnBg closePop"><span class="icon_cancel"></span>닫기</a>
		</div>
	</div>
</div>
<!-- 이전답변 팝업 끝 -->

<script type="text/javascript">
	var circle = $( "#circle" );
	
	$(document).ready(function(){
		$( "#form #cpId" ).selectmenu({
		   change: function( event, data ) {
			    $("#form #cateId").val('');
				$("#form #cateName").val('');
				$("#form #thatId").val('0');
				$("#form #thatInput").text('이전답변');
		   }
		});
		
		$( "#color" ).selectmenu({
		   change: function( event, data ) {
				circle.css( "background", data.item.value );
				reply.value += data.item.value;
		   }
		});
		
		$( "#aimlTag" ).selectmenu({
		   change: function( event, data ) {
				reply.value += "\n" + data.item.value;
		   }
		});
		
		$( "#htmlTag" ).selectmenu({
		   change: function( event, data ) {
				reply.value += "\n" + data.item.value;
		   }
		});
		
		$( "#input" ).blur(function() {
			if($(this).val() == ""){
				$(".node_root .node__text").text("질문");
			}else{
				$(".node_root .node__text").text($(this).val());
			}			
		});
		
		$("#formTest input[name=test]").keydown(function (key) { 
		    if(key.keyCode == 13){
		    	return false;
		    } 
		});
	});	
	
	//테스트 질문 추가/삭제
	function fnAddTestOption(){
		// clone
        $.trClone = $("#addTestOption ul:last").clone().html();
        $.newTr = $("<ul class=\"input\">"+$.trClone+"</ul>");

        // append
        $("#addTestOption").append($.newTr);

        // delete Button 추가
        $.btnDelete = "<a href=\"javascript:;\" class=\"icon_cancel\" id=\"btnDelete\">삭제</a>";
        $("#addTestOption ul:last li:last").html("");
        $("#addTestOption ul:last li:last").append($.btnDelete);

        // 버튼에 클릭 이벤트 추가
        $("#addTestOption ul>li:last").find("#btnDelete").on('click', function(){
            $(this).parent().parent().remove();
        });
	}
 
	//텍스트 링크 추가/삭제
	function fnAddLinkOption(){
		// clone
        $.trClone = $("#addLinkOption ul:last").clone().html();
        $.newTr = $("<ul class=\"input\">"+$.trClone+"</ul>");

        // append
        $("#addLinkOption").append($.newTr);

        // delete Button 추가
        $.btnDelete = "<a href=\"javascript:;\" class=\"icon_cancel\" id=\"btnDelete\">삭제</a>";
        $("#addLinkOption ul:last li:last").html("");
        $("#addLinkOption ul:last li:last").append($.btnDelete);

        // 버튼에 클릭 이벤트 추가
        $("#addLinkOption ul>li:last").find("#btnDelete").on('click', function(){
            $(this).parent().parent().remove();
        });
	}
	
	//추가 답변  추가/삭제
	function fnAddReplyOption(){
		// clone
        $.trClone = $("#addReplyOption ul:last").clone().html();
        $.newTr = $("<ul>"+$.trClone+"</ul>");

        // append
        $("#addReplyOption").append($.newTr);

        // delete Button 추가
        $.btnDelete = "<a href=\"javascript:;\" class=\"icon_cancel\" id=\"btnDelete\">삭제</a>";
        $("#addReplyOption ul:last li:last").html("");
        $("#addReplyOption ul:last li:last").append($.btnDelete);

        // 버튼에 클릭 이벤트 추가
        $("#addReplyOption ul>li:last").find("#btnDelete").on('click', function(){
            $(this).parent().parent().remove();
        });
	}
	
	//카테고리 레이어 팝업
	function fnCategoryLayer(){
		$("#iframeCategory").attr("src","/cms/searchChatCategory?cpId="+$("#form #cpId").val());
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
	
	//검증샘플 등록 레이어 팝업
	function fnAddTestLayer(){	
		var testInput = $("#testInput").val();	
		if(testInput != ""){
			$("#formTest input[name=test]:not(:eq(0))").parent().parent().remove();
			
			var tmpTestInput = testInput.split("&!&");
			for(var i=0;i<tmpTestInput.length;i++){
				if(i != 0) fnAddTestOption();
				$("#formTest input[name=test]:eq("+ i +")").val(tmpTestInput[i]);			
			}	
		}else{
			$("#formTest")[0].reset(); //초기화
		}
		
		$(".definiteWritePop, .searchDimm").show();
		$(".definiteWritePop").center();
	}
	
	//검증샘플 레이어 팝업 - 적용버튼
	function fnAddTest(){
		if($('#formTest').valid()){			
			//중복체크 - 검증샘플
			if(unique("test","검증샘플") != ""){
				alert(unique("test","검증샘플"));
				return false;
			}	
			
			var test = $("#formTest input[name=test]");
			var val = "";
			
			for(var i=0;i<test.length;i++){
				if(i != 0) val += "&!&";	
				val += test[i].value;				
			}		
			
			$("#testInput").val(val);
			$(".definiteWritePop, .searchDimm").hide();
		}
	}
	
	//이전 답변 레이어 팝업
	function fnAddThatLayer(){
		$("#iframeThat").attr("src","/cms/searchChat?cpId="+$("#form #cpId").val());
		$(".answerPop, .searchDimm").show();
		$(".answerPop").center();
	}
	
	//이전 답변 선택시
	function fnThat(thatId,thatInput){
		$("#form #thatId").val(thatId);
		$("#form #thatInput").text(thatInput);
		$(".answerPop, .searchDimm").hide();
	}
	
	//추천 질문 레이어 팝업
	function fnAddRecommendLayer(){
		$("#tempRecommend").val("");
		$(".questionPop, .searchDimm").show();
		$(".questionPop").center();
	}
	
	//추천 질문 등록
	function fnAddRecommend(){
		if($("#tempRecommend").val() == ""){
			alert("추천 질문을 확인하세요.");
			$("#tempRecommend").focus();
			return false;
		}else{
			var str = XSSCharacter($("#tempRecommend").val());
			var html = "";
			html += "<li class=\"children__item\">";
			html += "<div class=\"node\">";
			html += "	<div class=\"node__text\">"+ str +"<a href=\"#\" onclick=\"fnDeleteRecommend(this);return false;\" class=\"btnBg\"><span class=\"icon_cancel\"></span></a></div>";
			html += "	<input type=\"text\" class=\"node__input\" name=\"tmp_recommendInput\" value=\""+ str +"\"/></a>";
			html += "</div>";		
			html += "</li>";
			
			$(".children_rightbranch #addRecommend").before(html);			
			$(".questionPop, .searchDimm").hide();			
			$("#tempRecommend").val("");
		}
	}
	
	//추천 질문 삭제
	function fnDeleteRecommend(obj){
		$(obj).parent().parent().parent().remove();
	}
	
	//이미지 미리보기 레이어 팝업
	function fnViewImageLayer(){
		if($("#imageUrl").val() == ""){
			alert("이미지 url를 등록하세요.");
			return false;
		}	
		
		$("#imageTempUrl").attr("src",$("#imageUrl").val());		
		$(".previewPop, .searchDimm").show();
		$(".previewPop").center();
	}
	
	//목록
	function fnList(){
		var answer = confirm("편집 중인 내용을 잃게 됩니다.\n그래도 이동 하시겠습니까?");
	    if (answer == true){
	    	location.href = "<c:url value='/listChat'/>";
	    }
	}
	
	//취소
	function fnCancel(){
		var answer = confirm("편집 중인 내용이 초기화 됩니다.\n취소하시겠습니까?");
	    if (answer == true){
	    	location.href = "<c:url value='/listChat'/>";
	    }
	}
	
	//저장
	function fnAdd(){
		if($('#form').valid()){
			
			/*
			if($("#form #imageUrl").val() != "" && $("#form #imageAlt").val().trim() == ""){
				alert("이미지에 대한 대체 텍스트가 필요합니다.");
				return false;
			}
			
			if($("#form #imageUrl").val() == "" && $("#form #imageAlt").val().trim() != ""){
				alert("이미지를 입력하세요.");
				return false;
			}
			*/
			if($("#testInput").val() == ""){
				alert("검증 샘플를 등록해주세요.");
				return false;
			}	
			
			for(var i=0; i<$("input[name='linkTitle']").length; i++){
				if($("input[name='linkTitle']:eq("+ i +")").val() != "" && $("input[name='linkUrl']:eq("+ i +")").val() == ""){
					alert("텍스트 링크 제목과 url를 확인 하세요.");
					return false;
				}
			}
			
			//중복체크-링크 제목
			if(unique("tmp_linkTitle","링크 제목") != ""){
				alert(unique("tmp_linkTitle","링크 제목"));
				return false;
			}	
			
			//중복체크-추천 질문
			if(unique("tmp_recommendInput","추천 질문") != ""){
				alert(unique("tmp_recommendInput","추천 질문"));
				return false;
			}	
			
			//중복체크-추가 답변
			if(unique("tmp_replyInput","추가 답변") != ""){
				alert(unique("tmp_replyInput","추가 답변"));
				return false;
			}	
			
			$("#linkTitle").val(arrtostr("tmp_linkTitle","text"));
			$("#linkComment").val(arrtostr("tmp_linkComment","text"));
			$("#linkUrl").val(arrtostr("tmp_linkUrl","text"));
			$("#recommendInput").val(arrtostr("tmp_recommendInput","text"));
			$("#replyInput").val(arrtostr("tmp_replyInput","text"));
			
			var formData = $('#form').serializeArray();
		    var answer = confirm("저장 하시겠습니까?");
		    if (answer == true){
		    	$.ajax({    		
		        	url : "<c:url value='/addChat'/>",
		        	data: formData, 
		        	type: 'POST', 
		            dataType: 'json', 
		        	success : function(response){  
		        		if (response.status == 'FAIL') {
		        			alert(response.message);
		                } else {
		                	alert("저장 되었습니다.");
		                	location.href = "<c:url value='/listChat'/>";
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
			input: {required:true,aimlpattern:true},
			reply: {required:true},
			imageUrl: {url:true},
			imageAlt: {nospecialchar:true},
			linkUrl: {url:true},
			testInput: {required:true}
		},
		messages: {
			cateName: {
				required:"카테고리를 확인 하세요."
			},
			input: {
				required:"질문을 확인 하세요.",
				aimlpattern:"허용되는 특수기호(#_()|{}+*)만 입력해주세요."
			},
			reply: {
				required:"답변을 확인 하세요."
			},
			imageUrl: {
				url:"URL을 형식에 맞게 입력해주세요."
			},
			imageAlt: {
				nospecialchar:"특수기호는 허용되지 않습니다."
			},
			linkUrl: {
				url:"URL을 형식에 맞게 입력해주세요."
			},
			testInput: {
				required:"검증 샘플를 등록해주세요."
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
	
	$('#formTest').validate({
		rules: {
			test: {required:true}
		},
		messages: {
			test: {
				required:"검증 샘플를 확인 하세요."
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