// JavaScript Document

// CSV 데이터를 불러옴
d3.csv("../data/data.csv", function(error, data) {

	// SVG요소의 넓이와 높이를 구함
	var svgEle = document.getElementById("myGraph")
	var svgWidth = window.getComputedStyle(svgEle, null).getPropertyValue("width");
	var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");

	svgWidth = parseFloat(svgWidth);
	svgHeight = parseFloat(svgHeight);

	var offsetX = 30;
	var offsetY = 20;

	var xScale;									// 가로축의 스케일
	var yScale;									// 세로축의 스케일
	var yAxisHeight = svgHeight - 20;			// 세로축의 높이
	var xAxisWidth = svgWidth - 40;				// 가로축의 길이

	var svg = d3.select("#myGraph");

	// 데이터를 불러와 설정함
	var dataSet = new Array();
	data.forEach(function(d, i) {
		dataSet.push([d.total/100, d.bug*1, d.time*1]);	// *1 로 숫자 변환 (타입변환)
	})

	// 눈금과 그리드를 먼저 표시
	drawScale();


	// 산포도 그리기
	var circleElements = svg
		.selectAll("circle")
		.data(dataSet)
	circleElements
		.enter()
		.append("circle")				// 데이터의 개수만큼 circle 요소가 추가됨
		.attr("class", "mark")			// CSS 클래스 지정
		.attr("cx", svgWidth / 2 + offsetX)	// X 좌표의 눈금 가운데로 함
		.attr("cy", svgHeight / 2 - offsetY)	// Y 좌표의 눈금 가운데로 함
		.attr("r", 100)
		.attr("opacity", 0)

		.transition()
		.duration(2000)
		.ease("bounce")

		.attr("cx", function(d, i) {
			return xScale(d[0]) + offsetX;				// 최초 요소를 X 좌표로 함
		})
		.attr("cy", function(d, i) {
			return yScale(d[1]);		// 2번째의 요소를 Y좌표로 함
		})
		.attr("r", 5)					// 반지름을 지정
		.attr("opacity", 1.0)

	// 눈금 표시
	function drawScale() {
		var maxX = d3.max(dataSet, function(d, i) {
			return d[0];							// X 좌표값
		});

		var maxY = d3.max(dataSet, function(d, i) {
			return d[1];							// Y 좌표값
		});

		// 세로 눈금을 표시하고자 D3 스케일을 설정
		yScale = d3.scale.linear()				// 스케일 설정
			.domain([0, maxY])						// 원래 데이터 범위
			.range([yAxisHeight, 0])						// 실제 표시 크기

		// 눈금 표시
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + offsetX + ", " + (svgHeight-yAxisHeight-offsetY)+")")
			.call(
				d3.svg.axis()
				.scale(yScale)						// 스케일 적용
				.orient("left")						// 눈금 표시 위치를 왼쪽으로 지정
			)

		// 가로 눈금을 표시하고자 D3 스케일 설정
		xScale = d3.scale.linear()
			.domain([0, maxX])
			.range([0, xAxisWidth])

		// 눈금 표시
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + offsetX + ", " + (svgHeight-offsetY) + ")")
			.call(
				d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
			)


		// 그리드 표시
		var grid = svg.append("g")
		// 가로 방향과 세로 방향의 그리드 간격 자동 생성
		var rangeX = d3.range(50, maxX+50, 50);
		var rangeY = d3.range(20, maxY, 20);

		// 세로 방향 그리드 생성
		grid.selectAll("line.y")							//	line 요소의 y 클래스를 선택
			.data(rangeY)
			.enter()
			.append("line")									// line 요소 추가
			.attr("class", "grid")							// CSS 클래스의 grid를 지정

			// (x1,y1) - (x2,y2)의 좌표값을 설정
			.attr("x1", offsetX)
			.attr("y1", function(d, i) {
				return svgHeight - yScale(d) - offsetY;
			})
			.attr("x2", xAxisWidth + offsetX)
			.attr("y2", function(d, i) {
				return svgHeight - yScale(d) - offsetY;
			})

		// 가로방향의 그리드 생성
		grid.selectAll("line.x")
			.data(rangeX)
			.enter()
			.append("line")
			.attr("class", "grid")
			// (x1,y1) - (x2,y2)의 좌표값을 설정
			.attr("x1", function(d, i) {
				return xScale(d) + offsetX;
			})
			.attr("y1", svgHeight - offsetY)
			.attr("x2", function(d, i) {
				return xScale(d) + offsetX;
			})
			.attr("y2", svgHeight - offsetY - yAxisHeight)
	}

	// 풍선 도움말을 생성
	var tooltip = d3.select("body")
		.append("div")
		.attr("class", "tip")

	// 풍선도움말을 표시
	circleElements
		.on("mouseover", function(d) {
			var x = parseInt(xScale(d[0]));				// 원의 X좌표
			var y = parseInt(yScale(d[1]));				// 원의 Y좌표
			var t = parseInt(d[2]);

			tooltip
				.style("left", offsetX + x + "px")
				.style("top", offsetY + 30 + y + "px")
				.style("visibility", "visible")
				.text(t+"시간")
		})
		.on("mouseout", function() {
			tooltip.style("visibility", "hidden")	// 풍선 도움말 숨김
		})



	// 눈금과 그리드를 표시
	drawScale();

})