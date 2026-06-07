(function() {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("background", "#faf8f0")
        .append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);

    d3.csv("data/TV_CLEANED.csv").then(data => {
        // Count models per Screen_tech
        const techCounts = new Map();
        data.forEach(d => {
            const tech = d.Screen_tech;
            if (tech) techCounts.set(tech, (techCounts.get(tech) || 0) + 1);
        });

        const pieData = Array.from(techCounts, ([tech, count]) => ({ tech, count }));

        const color = d3.scaleOrdinal()
            .domain(pieData.map(d => d.tech))
            .range(d3.schemeTableau10);

        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        const arcGen = d3.arc()
            .innerRadius(80)   // donut hole
            .outerRadius(radius - 20)
            .padAngle(0.02)
            .cornerRadius(4);

        const arcs = pie(pieData);

        svg.selectAll("path")
            .data(arcs)
            .join("path")
            .attr("d", arcGen)
            .attr("fill", d => color(d.data.tech))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        // Add a centre label
        svg.append("text")
            .text("TV Tech")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-size", "16px")
            .style("fill", "#333");
    }).catch(error => console.error("Error loading TV data:", error));
})();