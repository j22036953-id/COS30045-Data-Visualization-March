(function() {
    const rainyDays = 110;
    const dryDays = 255;
    const percentageRain = (rainyDays / (rainyDays + dryDays)) * 100;

    const pieData = [
        { label: "Rain", value: rainyDays, color: "#6EB7C2" },
        { label: "Dry", value: dryDays, color: "#e8e0d0" }
    ];

    const pieChartWidth = 300;
    const pieChartHeight = 300;

    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${pieChartWidth} ${pieChartHeight}`)
        .style("background", "#faf8f0")
        .style("border", "1px solid #ccc")
        .append("g")
        .attr("transform", `translate(${pieChartWidth/2}, ${pieChartHeight/2})`);

    const arcGenerator = d3.arc()
        .innerRadius(80)
        .outerRadius(120)
        .padAngle(0.02)
        .cornerRadius(6);

    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const arcs = pie(pieData);

    svg.selectAll("path")
        .data(arcs)
        .join("path")
        .attr("d", d => arcGenerator(d))
        .attr("fill", d => d.data.color)
        .attr("stroke", "white")
        .style("stroke-width", "2px");

    const centroid = arcGenerator
        .startAngle(0)
        .endAngle(2 * Math.PI * (percentageRain / 100))
        .centroid();

    svg.append("text")
        .text(`${percentageRain.toFixed(0)}%`)
        .attr("x", centroid[0])
        .attr("y", centroid[1])
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .attr("fill", "white");
})();