console.log("Script loaded – Exercise 4.6 with scales");

document.addEventListener("DOMContentLoaded", function() {
    // ----- Dimensions (temporarily make width small to test scaling) -----
    const width = 500;          // 👈 Reduced to 500px – you will see the bars scale automatically
    const height = 500;
    const margin = { top: 40, right: 30, bottom: 80, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG canvas
    const svg = d3.select(".responsive-svg-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid #ccc")
        .style("background", "#faf8f0")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Load data
    d3.csv("data/TV_CLEANED.csv", d => {
        return { brand: d.Brand_Reg, count: +d.Model_No };
    }).then(data => {
        const valid = data.filter(d => !isNaN(d.count) && d.brand);
        valid.sort((a, b) => b.count - a.count);
        const top = valid.slice(0, 10);
        console.log("Top brands:", top);

        // ---- Display inspection info (same as 4.4/4.5) ----
        const outputDiv = document.getElementById("output");
        if (outputDiv) {
            outputDiv.innerHTML = `
                <h3>✅ CSV Loaded – Scaling Active (Exercise 4.6)</h3>
                <p><strong>Total rows:</strong> ${top.length}</p>
                <p><strong>Max count:</strong> ${d3.max(top, d => d.count)}</p>
                <p><strong>Min count:</strong> ${d3.min(top, d => d.count)}</p>
                <p><strong>Extent:</strong> [${d3.min(top, d => d.count)}, ${d3.max(top, d => d.count)}]</p>
                <p><strong>SVG inner width:</strong> ${innerWidth}px (scaled)</p>
            `;
        }

        // ========== 4.6 SCALES ==========
        // 1. Linear scale for the bar widths (count data)
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(top, d => d.count)])   // from 0 to max count (e.g., 219)
            .range([0, innerWidth]);                  // map to the full inner width

        // 2. Band scale for the categories (brands) on the y-axis
        const yScale = d3.scaleBand()
            .domain(top.map(d => d.brand))            // list of brand names
            .range([0, innerHeight])                  // use full inner height
            .padding(0.2);                           // gap between bars

        // ========== DRAW BARS (using scales) ==========
        svg.selectAll("rect")
            .data(top)
            .join("rect")
            .attr("class", d => `bar bar-${d.count}`)
            .attr("x", 0)                            // bars start at x=0
            .attr("y", d => yScale(d.brand))          // position from band scale
            .attr("width", d => xScale(d.count))      // scaled width
            .attr("height", yScale.bandwidth())       // height from band scale
            .attr("fill", "#fb8c00")
            .attr("rx", 4);

        // ========== ADD AXES ==========
        // X axis (bottom) – linear scale
        svg.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale).ticks(5))
            .style("font-size", "12px");

        // Y axis (left) – band scale
        svg.append("g")
            .call(d3.axisLeft(yScale))
            .style("font-size", "12px");

        // Optional: axis labels
        svg.append("text")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight + 40)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Number of Models");

        svg.append("text")
            .attr("x", -40)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Brand");

        console.log("Scaled bar chart drawn");
    }).catch(error => {
        console.error("CSV load error:", error);
        const outputDiv = document.getElementById("output");
        if (outputDiv) outputDiv.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
    });
});