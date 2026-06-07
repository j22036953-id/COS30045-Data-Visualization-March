d3.csv("data/Ex6_TVdata.csv", d => ({
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,
    screenTech: d.screenTech,
    energyConsumption: +d.energyConsumption,
    star: +d.star
})).then(data => {
    currentData = data.filter(d => !isNaN(d.energyConsumption) && d.energyConsumption > 0);
    console.log("Data loaded:", currentData.length, "rows");

    const maxEnergy = d3.max(currentData, d => d.energyConsumption);
    binGenerator = d3.bin().domain([0, maxEnergy]).thresholds(20);

    drawHistogram(currentData);
    drawScatterplot(currentData);
    createTooltip();
    handleMouseEvents();

    populateFilters(currentData, "screen", filters_screen, "#filters_screen", updateHistogram);
    populateFilters(currentData, "size", filters_size, "#filters_size", updateHistogram);
}).catch(error => {
    console.error("Error loading CSV:", error);
    d3.select("#histogram").append("p").text("Error loading data.").style("color", "red");
    d3.select("#scatterplot").append("p").text("Error loading data.").style("color", "red");
});