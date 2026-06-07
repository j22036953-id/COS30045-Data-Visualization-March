console.log("Script loaded");

document.addEventListener("DOMContentLoaded", function() {
    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 30, bottom: 80, left: 100 };
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

    d3.csv("data/TV_CLEANED.csv", d => {
        return { brand: d.Brand_Reg, count: +d.Model_No };
    }).then(data => {
        const valid = data.filter(d => !isNaN(d.count) && d.brand);
        valid.sort((a, b) => b.count - a.count);
        const top = valid.slice(0, 10);

        // ---- Inspection text (same as 4.4) ----
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
            `;
        }

        // ---- DRAW BARS (Exercise 4.5) ----
        const barHeight = 20;
        const spacing = 5;
        svg.selectAll("rect")
            .data(top)
            .join("rect")
            .attr("class", d => `bar bar-${d.count}`)
            .attr("width", d => d.count)
            .attr("height", barHeight)
            .attr("x", 0)
            .attr("y", (d, i) => i * (barHeight + spacing))
            .attr("fill", "#fb8c00");

        // Brand labels
        svg.selectAll("text.brand-label")
            .data(top)
            .join("text")
            .attr("class", "brand-label")
            .attr("x", -10)
            .attr("y", (d, i) => i * (barHeight + spacing) + barHeight / 2 + 4)
            .attr("text-anchor", "end")
            .style("font-size", "12px")
            .text(d => d.brand);

        console.log("Bars drawn, count:", top.length);
    }).catch(error => {
        console.error(error);
    });
});