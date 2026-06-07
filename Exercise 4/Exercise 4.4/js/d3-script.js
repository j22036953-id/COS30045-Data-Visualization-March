console.log("Script loaded");

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM ready");

    // Check if D3 is loaded
    if (typeof d3 === "undefined") {
        console.error("D3 is not loaded!");
        return;
    }
    console.log("D3 version:", d3.version);

    // Try to load CSV
    d3.csv("data/tvBrandCount.csv").then(data => {
        console.log("CSV loaded successfully. Rows:", data.length);
        console.log("First row:", data[0]);
    }).catch(error => {
        console.error("CSV load error:", error);
    });
});