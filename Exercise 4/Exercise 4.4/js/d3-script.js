console.log("Script loaded");

document.addEventListener("DOMContentLoaded", function() {
    d3.csv("data/TV_CLEANED.csv").then(data => {
        console.log("✅ CSV loaded. Rows:", data.length);
        console.log("📋 Column names:", Object.keys(data[0]));
        console.log("📌 First row:", data[0]);
    }).catch(error => {
        console.error("❌ Error:", error);
    });
});