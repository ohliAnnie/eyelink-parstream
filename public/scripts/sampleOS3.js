d3.csv("../data/os.csv", 
	function(row){	// 전처리 수행
		return {
			vendor : row.vendor,	// 운영체제 이름은 그대로
			volume : parseInt(row.volume)	// 문자열에서 숫자로 변환
		}
	},
	function(error, dataSet){
		// 그래프 관계의 데이터를 변수에 설정			
		var svgWidth = 735;	// svg 요소의 높이
		var svgHeight = 440;	// svg 요소의 높이
		var color = d3.scale.category10();  // D3.js가 준비한 표준 10색을 지정
		var sum = 0;
		var dataVolume = [];		
		for(var i=0;i<dataSet.length;i++){			
			dataVolume.push(dataSet[i].volume);
			sum+=dataSet[i].volume;
		}
		// 계두도 하나의 부채꼴의 비율로 각도를 계산(360도를 데이터 수로 나눔)		
		for(var i=0; i<dataSet.length; i++){
			if(i!=0){
				dataSet[i].startAngle = dataSet[i-1].endAngle
			} else {
				dataSet[i].startAngle = 0;
			}
			dataSet[i].endAngle = dataSet[i].startAngle + (360/sum)*dataVolume[i] * Math.PI / 180;			
		}
		// 원 그래프의 좌표값을 계산하는 메서드
		var pie = d3.layout.pie()	// 원 그래프 레이아웃			
		// 원 그래프의 안쪽 반지름, 바깥쪽 반지름 설정
		var arc = d3.svg.arc().innerRadius(30).outerRadius(200)		
		// 원 그래프 그리기
		var pieElements = d3.select("#myGraph3")	  
			.selectAll("g")	// g 요소 지정
			.data(dataSet)	// 데이터를 요소에 연결
			.enter()
			.append("g")	// 무게 중심 계산을 위하 그룹화하기
			.attr("transform", "translate("+svgWidth/2+", "+svgHeight/2+")")    // 원 그래프의 중심으로	 함
			// 데이터 추가
			pieElements	// 데이터 수만큼 반복
			 .append("path")	// 데이터의 수만큼 path 요소가 추가됨
			 .attr("class", "pie")	// CSS 클래스 설정
			 .style("fill", function(d, i){
				 var col = color(i);
					return color(i);	// 통신사의 색을 반환
			})
			.on("mouseover", function(){
				d3.select(this).annimate({borderColor:'red'},200)
			})
			.on("mouseout", function(){
				pieElements
				.style("fill", function(d, i){
					 var col = color(i);
						return color(i);	// 통신사의 색을 반환
				})
			})
			 .transition()
			 .duration(200)
			 .delay(function(d,i){   // 그릴 원 그래프의 시간을 어긋나게 표시
					return i*200;
			})
			 .ease("linear")	// 직선적인 움직임으로 변경
			 .attrTween("d", function(d, i){	// 보간 처리
				 var interpolate = d3.interpolate(
						{ startAngle : d.startAngle, endAngle : d.startAngle }, // 각 부분의 시작 각도
						{ startAngle : d.startAngle, endAngle : d.endAngle }    // 각 부분의 종료 각도
	       	);
				 return function(t){
						return arc(interpolate(t)); // 시간에 따라 처리
					}
			 })
		// 문자 그리기
			d3.select("#myGraph3")
			  .selectAll("text")
			  .data(dataSet)	// 데이터 세팅			  
			  .enter()
			  .append("text") // 원호는 패스로 지정
			  .attr("class", "pie")	// CSS 클래스에 pie를 지정
			  .attr("transform", function(d, i){	// 표시 위치 지정
				  console.log(arc.centroid(d));
					var c = arc.centroid(d);	// 부채꼴 중심을 구함
					var x = c[0]*1.4-20 + svgWidth/2;	// X 좌표 읽어오기
					var y = c[1]*1.4 + svgHeight/2;	// Y 좌표 읽어오기
					return "translate("+x+", "+y+")";
				})
			  .text(function(d, i){	// 문자 표시
					return d.vendor;
				})

			
				 
	/*	// 합계와 문자 표시
		var textElements = d3.select("#myGraph3")
		  .append("text")	// text 요소 추가
		  .data(dataVolume)
		  .enter()
		  .attr("class", "total")	// CSS 클래스 설정
		  .attr("transform", "translate("+svgWidth/2+", "+(svgHeight/2+5)+")")    // 중심에
																					// 표시
		  .text(function(d,i) {
			  return "합계 :" + d3.sum(d.volume)	// 합계 표시
		  })
		// 숫자를 부채꼴의 가운데에 표시●↓
	/*	pieElements
		  .append("text")	// 데이터 수만큼 text 요소가 추가됨
		  .attr("class", "pieNum")	// CSS 클래스 설정
		  .attr("transform", function(d, i){
				return "translate("+arc.centroid(d)+")";    // 부채꼴의 중심으로 함(무게 중심 계산)
			})
		  .text(function(d, i){
				return d.vendor + "(" + d.volume + ")";
			})*/
})