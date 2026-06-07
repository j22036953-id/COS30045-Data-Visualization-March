// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {
    // Define SVG dimensions and margins
    const width = 900;
    const height = 500;
    const margin = { top: 50, right: 30, bottom: 80, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Select the container and create SVG
    const svg = d3.select(".responsive-svg-container")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid #ccc")  // Temporary border to see the canvas (remove later)
        .style("background", "#faf8f0")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Load the CSV data
    d3.csv("data/data.csv").then(data => {
        // Count models per brand
        const brandCounts = new Map();
        data.forEach(d => {
            const brand = d.Brand_Reg;
            if (brand) {
                brandCounts.set(brand, (brandCounts.get(brand) || 0) + 1);
            }
        });

        // Convert to array, sort by count (descending), and take top 10
        let brandArray = Array.from(brandCounts, ([brand, count]) => ({ brand, count }));
        brandArray.sort((a, b) => b.count - a.count);
        const topBrands = brandArray.slice(0, 10);

        // Set up scales
        const xScale = d3.scaleBand()
            .domain(topBrands.map(d => d.brand))
            .range([0, innerWidth])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(topBrands, d => d.count)])
            .range([innerHeight, 0]);

        // Draw bars
        svg.selectAll(".bar")
            .data(topBrands)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.brand))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(d.count))
            .attr("fill", "#fb8c00")
            .attr("rx", 4);

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-30)")
            .style("text-anchor", "end")
            .style("font-size", "12px");

        // Add Y axis
        svg.append("g")
            .call(d3.axisLeft(yScale));

        // Add X axis label
        svg.append("text")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight + 50)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Brand");

        // Add Y axis label
        svg.append("text")
            .attr("x", -40)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Number of Models");
    }).catch(error => {
        console.error("Error loading CSV:", error);
        d3.select(".responsive-svg-container")
            .append("p")
            .text("Error loading data. Make sure data.csv exists in the data/ folder.")
            .style("color", "red");
    });
});