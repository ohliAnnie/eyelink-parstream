<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<script type="text/template" id="TemplateOut">
{{each(i,OUT) OUT}}
<ul>
	<li class="ktConsultant"><img src="./images/gs_logo.png" alt="kt로고"/></li>	
	<li class="consultation">
		<div class="answer">			
			<p class="top">{{html OUT.body}}</p>
			{{if OUT.image != null}}
				{{each(j,img) OUT.image}}
				<p class="center"><img src="\${img}" alt="\${OUT.image_alt_text}" title="\${OUT.image_alt_text}"/></p>
				{{/each}}
			{{/if}}
			{{if OUT.responses != null}}
			<ul class="list">
				{{each(j,response) OUT.responses}}
				<li><span onclick="fnInput('\${response}');return false;">\${response}</span></li>
				{{/each}}
			</ul>
			{{/if}}
			{{if OUT.urls != null}}
			<ul class="list">
				{{each(j,link) OUT.urls}}
				<li><a href="\${link.url}" target="_blank">\${link.title}</a></li>
				{{/each}}
			</ul>
			{{/if}}		
			{{if OUT.option1 != null}}
			<ul class="list">
				{{each(j,opt1) OUT.option1}}
				{{if opt1 == "키워드 검색"}}
					{{each(j,opt2) OUT.option2}}
					{{if opt2 != ""}}
						<li><a href="http://m.search.olleh.com/?k=\${opt2}" target="_blank">키워드 검색으로 찾아보기</a></li>
					{{else}}
						<li><a href="http://m.search.olleh.com/" target="_blank">키워드 검색으로 찾아보기</a></li>
					{{/if}}
					{{/each}}
				{{/if}}
				{{/each}}
			</ul>
			{{/if}}	
			<p class="time">\${DATE}</p>
		</div>		
	</li>
</ul>
{{/each}}
</script>

<script type="text/template" id="TemplateInput">
<ul class="right">
	<li class="consultation">
		<div class="question">
			<p class="txt">\${INPUT}</p>
			<p class="time">\${DATE}</p>
		</div>
	</li>
</ul>
</script>

<script type="text/template" id="TemplateFail">
<ul>
	<li class="ktConsultant"><img src="./images/gs_logo.png" alt="kt로고"/></li>
	<li class="consultation">
		<div class="answer">
			<p class="top">{{html OUT}}</p>
			<p class="time">\${DATE}</p>
		</div>
	</li>
</ul>
</script>