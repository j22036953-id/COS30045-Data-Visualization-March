function drawHistogram(data) {
    const svg = d3.select("#histogram");
    svg.html("");

    const chartSvg = svg.append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("background", bodyBackgroundColor);

    const innerChart = chartSvg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const bins = createBins(data);
    if (!bins || bins.length === 0) return;

    const xScale = d3.scaleLinear()
        .domain([bins[0].x0, bins[bins.length-1].x1])
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([innerHeight, 0])
        .nice();

    innerChart.selectAll(".bar")
        .data(bins)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor);

    // X axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d => `${Math.round(d)} kWh`);
    innerChart.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth/2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .text("Energy Consumption (kWh/year)");

    // Y axis
    const yAxis = d3.axisLeft(yScale);
    innerChart.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight/2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Frequency");
}