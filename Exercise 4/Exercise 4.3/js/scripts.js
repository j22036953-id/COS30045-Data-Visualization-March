document.addEventListener("DOMContentLoaded", function() {

    // 1. Create SVG canvas
    const svg = d3.select(".responsive-svg-container")
        .append("svg")
        .attr("viewBox", "0 0 1200 600")
        .style("border", "1px solid #ccc")
        .style("background", "#faf8f0");

    // 2. Load and process CSV data
    d3.csv("data/data.csv").then(data => {
        // Count models per brand
        const brandCounts = new Map();
        data.forEach(d => {
            const brand = d.Brand_Reg;
            if (brand) {
                brandCounts.set(brand, (brandCounts.get(brand) || 0) + 1);
            }
        });

        // Convert to array and sort by count (descending)
        let brandArray = Array.from(brandCounts, ([brand, count]) => ({ brand, count }));
        brandArray.sort((a, b) => b.count - a.count);
        const topBrands = brandArray.slice(0, 10);  // show only top 10 brands

        // 3. Set up scales
        const margin = { top: 50, right: 30, bottom: 80, left: 100 };
        const width = 1200 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const xScale = d3.scaleBand()
            .domain(topBrands.map(d => d.brand))
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(topBrands, d => d.count)])
            .range([height, 0]);

        // 4. Create a group to hold the chart (shifted by margins)
        const chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // 5. Draw bars
        chartGroup.selectAll(".bar")
            .data(topBrands)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.brand))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.count))
            .attr("fill", "#fb8c00")
            .attr("rx", 4);

        // 6. Add X axis
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-30)")
            .style("text-anchor", "end")
            .style("font-size", "12px");

        // 7. Add Y axis
        chartGroup.append("g")
            .call(d3.axisLeft(yScale));

        // 8. Axis labels (optional)
        chartGroup.append("text")
            .attr("x", width / 2)
            .attr("y", height + 50)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Brand");

        chartGroup.append("text")
            .attr("x", -40)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Number of Models");
    }).catch(error => {
        console.error("Error loading CSV:", error);
        d3.select(".responsive-svg-container").append("p")
            .text("Error loading data. Make sure data.csv exists in the data/ folder.")
            .style("color", "red");
    });
});