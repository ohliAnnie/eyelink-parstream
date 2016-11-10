// JavaScript Document

// CSV 파일을 불러와 그래프 그리기
d3.csv("../data/mydata.csv", function(error, data) {	
	if(error) throw error;	
    var dataSet = new Array();
     console.log(data); 
	for (var i = 0; i < data.length; i++)
	{
		dataSet[i] = data[i].item1;
		
	}


d3.select("#myGraph1")
	.selectAll("rect")			// 추후 생성될 rect 를 선택하라는 뜻, 지금은 생성전
	.data(dataSet)				// 상단 dataSet 배열의 값을 데이터로 받겠다는 뜻
	.enter()					// 표시할 요소보다 데이터가 많을 때 사용하며 데이터가 적을때는 exit()메서드를 사용한다. 			
	.append("rect")						// SVG 사각형 생성
	.attr("x", 10)						// 가로형 막대그래프이므로 X좌표를 0으로 함
	.attr("y", function(d, i) {		// d : 데이터값 i : 인덱스순서
		return i * 25;					// 막대그래프의 높이를 25px 단위로 계산
	})		
	.attr("height", "20px")				// 막대그래프의 높이를 20px로 지정
	.attr("width", "0px")				// 최초 막대그래프의 넓이를 0px로 지정
	.on("mousedown", function() {		// on 이벤트는 애니메이션 처리 전에 삽입
		d3.select(this)
		.style("fill", "cyan")
	})
	.transition()
	.delay(function(d, i) {
		return i * 500;					// 0.5초마다 그리도록 대기 시간을 설정
	})
	.duration(2500)
	.attr("width", function(d, i) {
		return d + "px";
	})
	
	// 눈금을 표시하고자 선형 스케일을 설정
	var xScale = d3.scale.linear()		// 선형 스케일 설정
	.domain([0, 300])					// 원래 데이터 범위
	.range([0, 300])					// 실제 출력 크기
	
	d3.select("#myGraph1")
	.append("g")					// 그룸화함
	.attr("class", "axis")			// 스타일시트 클래스 설정
	.attr("transform", "translate(10, "+((1+dataSet.length) * 20 + 5)+")")	// 표시위치 조정
	.call(d3.svg.axis()				// call()로 눈금을 표시할 함수를 호출
		.scale(xScale)				// 스케일을 적용
		.orient("bottom")			// 눈금의 표시 위치를 아래쪽으로 지정
	)
	
	
})


	
	
	
	
	

	
