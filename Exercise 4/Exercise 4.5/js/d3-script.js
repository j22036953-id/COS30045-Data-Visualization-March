console.log("Script loaded");

document.addEventListener("DOMContentLoaded", function() {
    // Dimensions and margins for the chart
    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 30, bottom: 80, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create the SVG canvas inside the responsive container
    const svg = d3.select(".responsive-svg-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "#faf8f0")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Load the CSV data (make sure the path is correct)
    d3.csv("data/TV_CLEANED.csv", d => {
        return {
            brand: d.Brand_Reg,
            count: +d.Model_No   // convert to number
        };
    }).then(data => {
        // Filter out invalid rows
        const valid = data.filter(d => !isNaN(d.count) && d.brand);
        valid.sort((a, b) => b.count - a.count);
        const top = valid.slice(0, 10);

        // ----- Display inspection info (keeps Exercise 4.4 happy) -----
        const outputDiv = document.getElementById("output");
        if (outputDiv) {
            outputDiv.innerHTML = `
                <h3>✅ CSV Loaded Successfully</h3>
                <p><strong>Total rows:</strong> ${top.length}</p>
                <p><strong>Max count:</strong> ${d3.max(top, d => d.count)}</p>
                <p><strong>Min count:</strong> ${d3.min(top, d => d.count)}</p>
                <p><strong>Extent:</strong> [${d3.min(top, d => d.count)}, ${d3.max(top, d => d.count)}]</p>
                <p><strong>Sorted data (top 10):</strong></p>
                <pre>${JSON.stringify(top, null, 2)}</pre>
                <p>✅ Bars drawn below (Exercise 4.5)</p>
            `;
        }

        // ----- DRAW THE BARS (Exercise 4.5) -----
        const barHeight = 20;
        const spacing = 5;
        svg.selectAll("rect")
            .data(top)
            .join("rect")
            .attr("class", d => `bar bar-${d.count}`)
            .attr("width", d => d.count)          // bar width = count value
            .attr("height", barHeight)
            .attr("x", 0)                         // all bars start at x=0
            .attr("y", (d, i) => i * (barHeight + spacing))
            .attr("fill", "#fb8c00")              // orange colour
            .attr("rx", 4);                       // rounded corners

        // ----- Add brand labels to the left of each bar -----
        svg.selectAll("text.brand-label")
            .data(top)
            .join("text")
            .attr("class", "brand-label")
            .attr("x", -10)
            .attr("y", (d, i) => i * (barHeight + spacing) + barHeight / 2 + 4)
            .attr("text-anchor", "end")
            .style("font-size", "12px")
            .text(d => d.brand);

        console.log("Bar chart drawn with", top.length, "bars");
    }).catch(error => {
        console.error("CSV load error:", error);
        const outputDiv = document.getElementById("output");
        if (outputDiv) {
            outputDiv.innerHTML = `<p style="color:red">Error loading CSV: ${error.message}</p>`;
        }
    });
});