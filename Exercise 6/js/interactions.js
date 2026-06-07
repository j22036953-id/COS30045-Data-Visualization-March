function populateFilters(data, filterType, filtersArray, containerId, updateCallback) {
    const container = d3.select(containerId);
    container.html("");

    filtersArray.forEach(filter => {
        const btn = container.append("button")
            .attr("class", `filter-btn ${filter.isActive ? "active" : ""}`)
            .attr("data-id", filter.id)
            .text(filter.label);

        btn.on("click", function() {
            filtersArray.forEach(f => f.isActive = false);
            filter.isActive = true;
            container.selectAll(".filter-btn").classed("active", (d, i) => filtersArray[i].isActive);

            if (filterType === "screen") activeTech = filter.id;
            else activeSize = filter.id;

            const filtered = filterData(currentData);
            updateHistogram(filtered);
        });
    });
}

function updateHistogram(filteredData) {
    const svg = d3.select("#histogram svg");
    if (svg.empty()) return;
    const innerChart = svg.select("g");

    const bins = createBins(filteredData);
    if (!bins || bins.length === 0) return;

    const xScale = d3.scaleLinear()
        .domain([bins[0].x0, bins[bins.length-1].x1])
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([innerHeight, 0])
        .nice();

    const bars = innerChart.selectAll(".bar").data(bins);
    bars.join(
        enter => enter.append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
            .attr("height", d => innerHeight - yScale(d.length))
            .attr("fill", barColor),
        update => update.transition().duration(500)
            .attr("x", d => xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
            .attr("height", d => innerHeight - yScale(d.length)),
        exit => exit.remove()
    );

    // Update axes
    innerChart.select(".axis-x").remove();
    innerChart.select(".axis-y").remove();

    const xAxis = d3.axisBottom(xScale).tickFormat(d => `${Math.round(d)} kWh`);
    innerChart.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    innerChart.append("g")
        .attr("class", "axis axis-y")
        .call(yAxis);
}

// Tooltip functions
let tooltipGroup = null;

function createTooltip() {
    const scatterSvg = d3.select("#scatterplot svg");
    if (scatterSvg.empty()) return;
    let innerChartS = scatterSvg.select("g");
    if (innerChartS.empty()) return;

    tooltipGroup = innerChartS.append("g")
        .attr("class", "tooltip-group")
        .style("opacity", 0);

    tooltipGroup.append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 6)
        .attr("fill", "#333")
        .attr("fill-opacity", 0.8);

    tooltipGroup.append("text")
        .attr("class", "tooltip-text")
        .attr("x", tooltipPadding)
        .attr("y", tooltipHeight/2 + 4)
        .style("fill", "white")
        .style("font-size", "12px");
}

function handleMouseEvents() {
    const circles = d3.selectAll(".scatter-circle");
    if (circles.empty()) return;

    circles.on("mouseenter", function(event, d) {
        if (!tooltipGroup) return;
        const cx = parseFloat(d3.select(this).attr("cx"));
        const cy = parseFloat(d3.select(this).attr("cy"));
        tooltipGroup.attr("transform", `translate(${cx + 10}, ${cy - tooltipHeight - 5})`);
        tooltipGroup.select(".tooltip-text").text(`Size: ${d.screenSize}"`);
        tooltipGroup.transition().duration(200).style("opacity", 1);
    }).on("mouseleave", function() {
        if (tooltipGroup) tooltipGroup.transition().duration(200).style("opacity", 0);
    });
}