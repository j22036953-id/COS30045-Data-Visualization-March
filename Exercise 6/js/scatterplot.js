function drawScatterplot(data) {
    const svg = d3.select("#scatterplot");
    svg.html("");

    const chartSvg = svg.append("svg")
        .attr("viewBox", `0 0 ${widthS} ${heightS}`)
        .style("background", bodyBackgroundColor);

    const innerChartS = chartSvg.append("g")
        .attr("transform", `translate(${marginS.left}, ${marginS.top})`);

    const plotData = data.filter(d => d.star && !isNaN(d.star) && d.energyConsumption > 0);

    const xScaleS = d3.scaleLinear().domain([0, 7]).range([0, innerWidthS]);
    const maxEnergy = d3.max(plotData, d => d.energyConsumption);
    const yScaleS = d3.scaleLinear().domain([0, maxEnergy]).range([innerHeightS, 0]).nice();

    innerChartS.selectAll(".scatter-circle")
        .data(plotData)
        .join("circle")
        .attr("class", "scatter-circle")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("r", 4)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.6);

    // X axis
    const xAxis = d3.axisBottom(xScaleS).ticks(7);
    innerChartS.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${innerHeightS})`)
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidthS/2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .text("Star Rating");

    // Y axis
    const yAxis = d3.axisLeft(yScaleS);
    innerChartS.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeightS/2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Energy Consumption (kWh/year)");

    // Legend
    const legend = innerChartS.append("g")
        .attr("transform", `translate(${innerWidthS + 10}, 0)`);
    const items = [
        { tech: "LED", color: "#fb8c00" },
        { tech: "LCD", color: "#4caf50" },
        { tech: "OLED", color: "#2196f3" }
    ];
    items.forEach((item, i) => {
        const row = legend.append("g").attr("transform", `translate(0, ${i * 25})`);
        row.append("rect").attr("width", 12).attr("height", 12).attr("fill", item.color);
        row.append("text").attr("x", 18).attr("y", 10).text(item.tech).style("font-size", "12px");
    });
}