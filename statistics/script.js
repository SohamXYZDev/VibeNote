
const energyScale = ["Thrilled", "Energetic", "Motivated", "Calm", "Indifferent", "Restless", "Anxious", "Stressed", "Exhausted"];
const moodScale = ["Joyful", "Content", "Chill", "Neutral", "Indifferent", "Disappointed", "Sad", "Hopeless", "Suicidal"];
const clarityScale = ["Sharp", "Focused", "Clear-headed", "Balanced", "Distracted", "Foggy", "Confused", "Overwhelmed", "Mentally Numb"];
const senseOfPurposeScale = ["Driven", "Focused", "Aligned", "Curious", "Uncertain", "Lost", "Conflicted", "Empty", "Detached"];

function getAllEntries() {
    const notes = [];
    const totalNotes = parseInt(localStorage.getItem("noteNo")) || 0;

    for (let i = 1; i <= totalNotes; i++) {
        const noteData = JSON.parse(localStorage.getItem("note" + i));
        if (noteData) notes.push(noteData);
    }

    return notes;
}


function extractDateFromTitle(title) {
    const datePattern = /\((.*?)\)/; 
    const match = title.match(datePattern);
    if (match && match[1]) {
        return new Date(match[1]); 
    }
    return null;
}

function filterNotesByTimePeriod(entries, period) {
    const now = new Date();
    return entries.filter((entry) => {
        const noteDate = extractDateFromTitle(entry.title);
        if (!noteDate) return false;

        switch (period) {
            case "weekly":
                const oneWeekAgo = new Date(now);
                oneWeekAgo.setDate(now.getDate() - 7);
                return noteDate >= oneWeekAgo;
            case "monthly":
                const oneMonthAgo = new Date(now);
                oneMonthAgo.setMonth(now.getMonth() - 1);
                return noteDate >= oneMonthAgo;
            case "yearly":
                const oneYearAgo = new Date(now);
                oneYearAgo.setFullYear(now.getFullYear() - 1);
                return noteDate >= oneYearAgo;
            default:
                return false;
        }
    });
}

function prepareChartData(entries) {
    const labels = [];
    const energyData = [];
    const moodData = [];
    const clarityData = [];
    const purposeData = [];

    const originalEnergyData = [];
    const originalMoodData = [];
    const originalClarityData = [];
    const originalPurposeData = [];

    entries.forEach((entry, index) => {
        labels.push(`Entry ${index + 1}`);

        if (!entry.emotion_tags) {
            return;
        }
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = entry.emotion_tags;

        
        const tags = Array.from(tempDiv.querySelectorAll(".emotion-span")).map(span => span.textContent.trim());
        

        energyData.push(energyScale.indexOf(tags[0]) + 1 || 0);
        moodData.push(moodScale.indexOf(tags[1]) + 1 || 0);
        clarityData.push(clarityScale.indexOf(tags[2]) + 1 || 0);
        purposeData.push(senseOfPurposeScale.indexOf(tags[3]) + 1 || 0);

        originalEnergyData.push(tags[0]);
        originalMoodData.push(tags[1]);
        originalClarityData.push(tags[2]);
        originalPurposeData.push(tags[3]);
    });

    return {
        labels,
        energyData,
        moodData,
        clarityData,
        purposeData,
        originalEnergyData,
        originalMoodData,
        originalClarityData,
        originalPurposeData,
    };
}


function renderChart(chartData, canvasId) {
    const ctx = document.getElementById(canvasId).getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: "Energy",
                    data: chartData.energyData,
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 255, 255, 0)",
                    fill: false,
                },
                {
                    label: "Mood",
                    data: chartData.moodData,
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: "rgba(255, 255, 255, 0)",
                    fill: false,
                },
                {
                    label: "Clarity",
                    data: chartData.clarityData,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(255, 255, 255, 0)",
                    fill: false,
                },
                {
                    label: "Purpose",
                    data: chartData.purposeData,
                    borderColor: "rgba(153, 102, 255, 1)",
                    backgroundColor: "rgba(255, 255, 255, 0)",
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: "Your Vibes",
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const datasetLabel = context.dataset.label;

                            const moodDetails = `Mood: ${chartData.originalMoodData[index]}`;
                            const energyDetails = `Energy: ${chartData.originalEnergyData[index]}`;
                            const clarityDetails = `Clarity: ${chartData.originalClarityData[index]}`;
                            const purposeDetails = `Purpose: ${chartData.originalPurposeData[index]}`;

                            switch (datasetLabel) {
                                case "Energy": return `${datasetLabel} - ${energyDetails}`;
                                case "Mood": return `${datasetLabel} - ${moodDetails}`;
                                case "Clarity": return `${datasetLabel} - ${clarityDetails}`;
                                case "Purpose": return `${datasetLabel} - ${purposeDetails}`;
                                default: return datasetLabel;
                            }
                        },
                    },
                },
            },
            scales: {
                y: {
                    reverse: true,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            return moodScale[value - 1] || "";
                        },
                    },
                },
            },
        },
    });
}



document.addEventListener("DOMContentLoaded", () => {
    const allEntries = getAllEntries(); 

    
    const hasSuicidalEntries = allEntries.some((entry) => {
        if (!entry.emotion_tags) return false;

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = entry.emotion_tags;

        
        const tags = Array.from(tempDiv.querySelectorAll(".emotion-span")).map((span) =>
            span.textContent.trim()
        );

        return tags.includes("Suicidal");
    });

    
    const healthLabel = document.getElementById("health-label");
    if (hasSuicidalEntries) {
        healthLabel.innerHTML = `
            <p style="color: #c0392b; font-weight: bold;">
                We're here for you. If you're feeling overwhelmed, please reach out to someone you trust or contact a hotline in your area. You are not alone.
            </p>
            <p>
                <strong>Hotlines:</strong><br>
                - <a href="https:
                - US: <a href="tel:988" style="color: #4b7057;">988 Suicide & Crisis Lifeline</a><br>
                - UK: <a href="tel:116123" style="color: #4b7057;">Samaritans (116 123)</a><br>
                - Canada: <a href="tel:1-833-456-4566" style="color: #4b7057;">Talk Suicide Canada (1-833-456-4566)</a>
            </p>
        `;
    } else {
        healthLabel.innerHTML = `
            <p style="color: #4b7057; font-weight: bold;">
                Keep reflecting and growing. Your journey matters, and we're here to support you.
            </p>
        `;
    }

    
    const chartData = prepareChartData(allEntries);
    renderChart(chartData, "vibesChart");

    const weeklyEntries = filterNotesByTimePeriod(allEntries, "weekly");
    if (weeklyEntries.length > 0) {
        const weeklyData = prepareChartData(weeklyEntries);
        renderChart(weeklyData, "weeklyChart");
    }

    const monthlyEntries = filterNotesByTimePeriod(allEntries, "monthly");
    if (monthlyEntries.length > 0) {
        const monthlyData = prepareChartData(monthlyEntries);
        renderChart(monthlyData, "monthlyChart");
    }

    const yearlyEntries = filterNotesByTimePeriod(allEntries, "yearly");
    if (yearlyEntries.length > 0) {
        const yearlyData = prepareChartData(yearlyEntries);
        renderChart(yearlyData, "yearlyChart");
    }
});

const menu = document.getElementById("mobile-menu")
function toggleMenu() {
    console.log("clicked")
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}