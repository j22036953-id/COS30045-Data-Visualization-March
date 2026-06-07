(function() {
    const margin = {top:70, right:40, bottom:80, left:90}, w=600, h=500;
    const iw = w - margin.left - margin.right, ih = h - margin.top - margin.bottom;
    const svg = d3.select("#scatter-plot").append("svg").attr("viewBox", `0 0 ${w} ${h}`)
        .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("data/TV_CLEANED.csv").then(data => {
        const sizeCol = data[0].hasOwnProperty("screensize_inches") ? "screensize_inches" : "screenshot_inches";
        const powerCol = "Avg_mode_power";
        const filtered = data.filter(d => {
            const size = +d[sizeCol];
            const power = +d[powerCol];
            return !isNaN(size) && !isNaN(power) && size > 0 && power > 0;
        });
        if (filtered.length === 0) {
            svg.append("text").text("No valid data").attr("x",10).attr("y",20).attr("fill","red");
            return;
        }
        const x = d3.scaleLinear().domain([0, d3.max(filtered, d => +d[sizeCol])]).range([0, iw]);
        const y = d3.scaleLinear().domain([0, d3.max(filtered, d => +d[powerCol])]).range([ih, 0]);
        svg.selectAll("circle").data(filtered).join("circle")
            .attr("cx", d => x(+d[sizeCol]))
            .attr("cy", d => y(+d[powerCol]))
            .attr("r", 3).attr("fill", "#1f77b4").attr("opacity", 0.5);
        svg.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));
        svg.append("text").attr("x", iw/2).attr("y", ih+45).attr("text-anchor","middle").text("Screen Size (inches)");
        svg.append("text").attr("x", -65).attr("y", 25).attr("text-anchor","middle").text("Power Consumption (Watts)");
        svg.append("text").attr("x", iw/2).attr("y", -30).attr("text-anchor","middle").style("font-size","14px").style("font-weight","bold")
            .text("Screen Size vs. Power Consumption");
    }).catch(e => console.error(e));
})();