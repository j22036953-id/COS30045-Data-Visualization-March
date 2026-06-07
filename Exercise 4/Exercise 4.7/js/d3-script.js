console.log("Script loaded – Exercise 4.7 with labels");

document.addEventListener("DOMContentLoaded", function() {
    // Dimensions (you can keep the reduced width to test scaling)
    const width = 700;
    const height = 500;
    const margin = { top: 40, right: 30, bottom: 80, left: 120 };
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

        // Display info on the page
        const outputDiv = document.getElementById("output");
        if (outputDiv) {
            outputDiv.innerHTML = `
                <h3>✅ CSV Loaded – Labels Added (Exercise 4.7)</h3>
                <p><strong>Total rows:</strong> ${top.length}</p>
                <p><strong>Max count:</strong> ${d3.max(top, d => d.count)}</p>
                <p><strong>Min count:</strong> ${d3.min(top, d => d.count)}</p>
                <p><strong>Extent:</strong> [${d3.min(top, d => d.count)}, ${d3.max(top, d => d.count)}]</p>
                <p><strong>SVG inner width:</strong> ${innerWidth}px</p>
            `;
        }

        // ---------- SCALES (same as 4.6) ----------
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(top, d => d.count)])
            .range([0, innerWidth]);

        const yScale = d3.scaleBand()
            .domain(top.map(d => d.brand))
            .range([0, innerHeight])
            .padding(0.2);

        // ---------- 4.7: GROUP each bar with its labels ----------
        // Create a group for each data item, translated vertically by yScale
        const barAndLabel = svg.selectAll("g")
            .data(top)
            .join("g")
            .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

        // 1. Add the rectangle (bar)
        barAndLabel.append("rect")
            .attr("class", d => `bar bar-${d.count}`)
            .attr("width", d => xScale(d.count))
            .attr("height", yScale.bandwidth())
            .attr("x", 0)                 // now x=0 inside the group
            .attr("y", 0)                 // y=0 because group already moved
            .attr("fill", "#fb8c00")
            .attr("rx", 4);

        // 2. Add the brand label (text at the left of the bar)
        barAndLabel.append("text")
            .text(d => d.brand)
            .attr("x", -10)               // position to the left of the bar
            .attr("y", yScale.bandwidth() / 2 + 4)   // vertically centre
            .attr("text-anchor", "end")
            .style("font-family", "sans-serif")
            .style("font-size", "12px")
            .style("fill", "#333");

        // 3. Add the count label (text at the right end of the bar)
        barAndLabel.append("text")
            .text(d => d.count)
            .attr("x", d => xScale(d.count) + 5)   // just after the bar
            .attr("y", yScale.bandwidth() / 2 + 4)
            .style("font-family", "sans-serif")
            .style("font-size", "12px")
            .style("fill", "#333");

        // ---------- ADD AXES (unchanged) ----------
        svg.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale).ticks(5))
            .style("font-size", "12px");

        svg.append("g")
            .call(d3.axisLeft(yScale))
            .style("font-size", "12px");

        // Axis labels
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

        console.log("Bar chart with labels drawn");
    }).catch(error => {
        console.error("CSV load error:", error);
        const outputDiv = document.getElementById("output");
        if (outputDiv) outputDiv.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
    });
});