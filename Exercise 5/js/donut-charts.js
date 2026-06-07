function drawDonutCharts(data) {
    const years = [1991, 2010, 2020, 2024];
    const donutContainer = d3.select("#donut-charts");

    // For each year, create a card and an SVG
    years.forEach(year => {
        // Find the data row for this year
        const yearData = data.find(d => d.year === year);
        if (!yearData) return;

        // Prepare data for pie: array of objects { format, production }
        const pieData = formatsInfo.map(f => ({
            format: f.id,
            production: yearData[f.id]
        }));

        // Create a card div
        const card = donutContainer.append("div")
            .attr("class", "donut-card");

        // Add year title
        card.append("h3").text(year).style("margin", "0 0 10px 0");

        // Create SVG container inside the card
        const pieChartSize = 200;
        const svg = card.append("svg")
            .attr("width", pieChartSize)
            .attr("height", pieChartSize)
            .append("g")
            .attr("transform", `translate(${pieChartSize/2}, ${pieChartSize/2})`);

        // Pie generator
        const pie = d3.pie()
            .value(d => d.production)
            .sort(null);   // keep order as in pieData

        const arcs = pie(pieData);

        // Arc generator for donut (inner radius > 0)
        const arcGen = d3.arc()
            .innerRadius(60)
            .outerRadius(90)
            .padAngle(0.02)
            .cornerRadius(4);

        // Draw arcs
        svg.selectAll("path")
            .data(arcs)
            .join("path")
            .attr("d", arcGen)
            .attr("fill", d => colorScale(d.data.format))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        // Add small percentage label in the centre (optional)
        svg.append("text")
            .text(`${year}`)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-size", "14px")
            .style("fill", "#555");
    });
}