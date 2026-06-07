document.addEventListener("DOMContentLoaded", function() {
    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 30, bottom: 80, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(".responsive-svg-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid #ccc")
        .style("background", "#faf8f0")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("data/data.csv").then(data => {
        // Use the Model_No column directly (not counting rows)
        const brandData = data.map(row => ({
            brand: row.Brand_Reg,
            count: +row.Model_No   // convert to number
        })).filter(d => d.brand && !isNaN(d.count));

        // Sort descending and take top 10
        brandData.sort((a, b) => b.count - a.count);
        const top = brandData.slice(0, 10);

        // Scales
        const x = d3.scaleBand()
            .domain(top.map(d => d.brand))
            .range([0, innerWidth])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(top, d => d.count)])
            .range([innerHeight, 0]);

        // Draw bars
        svg.selectAll("rect")
            .data(top)
            .enter()
            .append("rect")
            .attr("x", d => x(d.brand))
            .attr("y", d => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", d => innerHeight - y(d.count))
            .attr("fill", "#fb8c00")
            .attr("rx", 4);

        // Axes
        svg.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-30)")
            .style("text-anchor", "end");

        svg.append("g").call(d3.axisLeft(y));

        // Labels
        svg.append("text")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight + 45)
            .attr("text-anchor", "middle")
            .text("Brand");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -innerHeight / 2)
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .text("Number of Models");
    }).catch(err => {
        console.error(err);
        svg.append("text").attr("x", 10).attr("y", 20).text("Error loading CSV").attr("fill", "red");
    });
});