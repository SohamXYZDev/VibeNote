const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Gemini with API key from .env
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY);

app.post("/generate-tags", async (req, res) => {
    console.log("Received request");
    const { title, content } = req.body;

    const prompt = `Generate 4 relevant tags for the following note that a user has added:

Title: "${title}"
Content: "${content}"

You may select one from each of these scales:
energyScale = ["Thrilled", "Energetic", "Motivated", "Calm", "Indifferent", "Restless", "Anxious", "Stressed", "Exhausted"],
moodScale = ["Joyful", "Content", "Chill", "Neutral", "Indifferent", "Disappointed", "Sad", "Hopeless", "Suicidal"],
clarityScale = ["Sharp", "Focused", "Clear-headed", "Balanced", "Distracted", "Foggy", "Confused", "Overwhelmed", "Mentally Numb"],
senseOfPurposeScale = ["Driven", "Focused", "Aligned", "Curious", "Uncertain", "Lost", "Conflicted", "Empty", "Detached"]

Return the tags in a comma-separated format, without double quotes, and without any additional text.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const tags = text.trim().split(",").map((tag) => tag.trim());
        console.log(tags);
        res.json({ tags });
    } catch (error) {
        console.error("Gemini API error:", error);
        res.status(500).json({ error: "Failed to generate tags" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));