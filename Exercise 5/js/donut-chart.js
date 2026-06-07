(function() {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("background", "#faf8f0")
        .append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);

    d3.csv("data/TV_CLEANED.csv").then(data => {
        // Count per Screen_Techn
        const techCounts = new Map();
        data.forEach(d => {
            const tech = d.Screen_Techn;
            if (tech) techCounts.set(tech, (techCounts.get(tech) || 0) + 1);
        });

        const pieData = Array.from(techCounts, ([tech, count]) => ({ tech, count }));
        if (pieData.length === 0) {
            svg.append("text").text("No data").attr("text-anchor", "middle");
            return;
        }

        const color = d3.scaleOrdinal()
            .domain(pieData.map(d => d.tech))
            .range(d3.schemeTableau10);

        const pie = d3.pie().value(d => d.count).sort(null);
        const arcGen = d3.arc().innerRadius(80).outerRadius(radius - 20).padAngle(0.02).cornerRadius(4);
        const arcs = pie(pieData);

        svg.selectAll("path")
            .data(arcs)
            .join("path")
            .attr("d", arcGen)
            .attr("fill", d => color(d.data.tech))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        svg.append("text")
            .text("TV Tech")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-size", "16px");
    }).catch(error => console.error("Donut error:", error));
})();(function() {
    const width = 400, height = 400, radius = Math.min(width, height) / 2;
    const svg = d3.select("#donut-chart")
        .append("svg").attr("viewBox", `0 0 ${width} ${height}`)
        .append("g").attr("transform", `translate(${width/2}, ${height/2})`);

    d3.csv("data/TV_CLEANED.csv").then(data => {
        const counts = new Map();
        data.forEach(d => { const t = d.Screen_Techn; if (t) counts.set(t, (counts.get(t) || 0) + 1); });
        if (counts.size === 0) { svg.append("text").text("No data").attr("text-anchor", "middle"); return; }
        const pieData = Array.from(counts, ([k,v]) => ({ tech: k, count: v }));
        const color = d3.scaleOrdinal().domain(pieData.map(d => d.tech)).range(d3.schemeTableau10);
        const pie = d3.pie().value(d => d.count).sort(null);
        const arc = d3.arc().innerRadius(80).outerRadius(radius-20).padAngle(0.02);
        svg.selectAll("path").data(pie(pieData)).join("path")
            .attr("d", arc).attr("fill", d => color(d.data.tech)).attr("stroke", "white");
        svg.append("text").text("TV Tech").attr("text-anchor", "middle").attr("dominant-baseline", "middle");
    }).catch(e => { console.error(e); svg.append("text").text("Load error").attr("text-anchor", "middle"); });
})();