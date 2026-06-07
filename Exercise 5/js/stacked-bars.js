function drawStackedBars(data) {
    // Clear previous content
    d3.select("#bars").html("");

    // Create SVG container
    const svg = d3.select("#bars")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("background", "#faf8f0")
        .style("border", "1px solid #ccc")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Stack generator
    const stackGen = d3.stack()
        .keys(formatsInfo.map(f => f.id))
        .order(d3.stackOrderNone);   // keep original order (beef, pig, poultry, sheep)

    const stackedData = stackGen(data);

    // Y‑scale: from 0 to max total production
    const maxTotal = d3.max(stackedData[stackedData.length-1], d => d[1]);
    const yScale = d3.scaleLinear()
        .domain([0, maxTotal])
        .range([innerHeight, 0])
        .nice();

    // Draw each series (meat type)
    stackedData.forEach(series => {
        svg.selectAll(`.bar-${series.key}`)
            .data(series)
            .join("rect")
            .attr("class", `bar-${series.key}`)
            .attr("x", d => xScale(d.data.year))
            .attr("y", d => yScale(d[1]))
            .attr("width", xScale.bandwidth())
            .attr("height", d => yScale(d[0]) - yScale(d[1]))
            .attr("fill", colorScale(series.key))
            .attr("stroke", "white")
            .attr("stroke-width", "0.5");
    });

    // X axis
    const xAxis = d3.axisBottom(xScale)
        .tickValues(d3.range(1991, 2025, 5))
        .tickFormat(d3.format("d"));
    svg.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end");

    // Y axis
    svg.append("g").call(d3.axisLeft(yScale));

    // Axis labels
    svg.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 45)
        .attr("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("x", -40)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text("Production (thousand tonnes)");
}