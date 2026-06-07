function addLegend() {
    const legendDiv = d3.select("#legend");
    legendDiv.html(""); // clear

    formatsInfo.forEach(f => {
        const item = legendDiv.append("div").attr("class", "legend-item");
        item.append("div")
            .attr("class", "legend-color")
            .style("background-color", f.color);
        item.append("span").text(f.label);
    });
}