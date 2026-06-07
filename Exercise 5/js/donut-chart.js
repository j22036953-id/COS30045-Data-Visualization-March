(function() {
    const width = 550, height = 550, radius = Math.min(width, height) / 2;
    const svg = d3.select("#donut-chart")
        .append("svg").attr("viewBox", `0 0 ${width} ${height}`)
        .style("background", "#faf8f0")
        .append("g").attr("transform", `translate(${width/2}, ${height/2})`);

    d3.csv("data/TV_CLEANED.csv").then(data => {
        const col = data[0].hasOwnProperty("Screen_Tech") ? "Screen_Tech" : "Screen_Techn";
        if (!col) {
            svg.append("text").text("No screen tech column").attr("text-anchor","middle").attr("fill","red");
            return;
        }
        const counts = new Map();
        data.forEach(d => {
            const tech = d[col];
            if (tech && tech.trim()) counts.set(tech, (counts.get(tech)||0)+1);
        });
        if (counts.size === 0) {
            svg.append("text").text("No data").attr("text-anchor","middle").attr("fill","red");
            return;
        }

        const pieData = Array.from(counts, ([tech, count]) => ({ tech, count }));
        const total = pieData.reduce((s, d) => s + d.count, 0);
        const color = d3.scaleOrdinal().domain(pieData.map(d => d.tech)).range(d3.schemeTableau10);

        const pie = d3.pie().value(d => d.count).sort(null);
        const arcGen = d3.arc().innerRadius(radius*0.4).outerRadius(radius*0.8).padAngle(0.02).cornerRadius(4);
        const arcs = pie(pieData);

        const groups = svg.selectAll("g").data(arcs).join("g");
        groups.append("path")
            .attr("d", arcGen)
            .attr("fill", d => color(d.data.tech))
            .attr("stroke", "white").style("stroke-width", "2px");
        groups.append("text")
            .attr("transform", d => `translate(${arcGen.centroid(d)})`)
            .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
            .style("font-size", "12px").style("fill", "white")
            .text(d => `${Math.round((d.data.count/total)*100)}%`);

        // ===== LEGEND =====
        const legend = svg.append("g").attr("transform", `translate(${radius+20}, ${-radius+30})`);
        pieData.forEach((d, i) => {
            const legendRow = legend.append("g").attr("transform", `translate(0, ${i*22})`);
            legendRow.append("rect").attr("width", 14).attr("height", 14).attr("fill", color(d.tech));
            legendRow.append("text").attr("x", 20).attr("y", 12).text(d.tech).style("font-size", "12px").style("fill", "#333");
        });

        svg.append("text").attr("text-anchor","middle").attr("y", radius+25)
            .text("Screen Technology Distribution").style("font-size","14px").style("font-weight","bold");
    }).catch(e => { console.error(e); svg.append("text").text("Load error").attr("text-anchor","middle"); });
})();