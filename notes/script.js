const apiUrl = "https://vibenote.onrender.com"; 
const fallbackApiUrl = "http://localhost:3000"; // Fallback URL

const energyScale = ["Thrilled", "Energetic", "Motivated", "Calm", "Indifferent", "Restless", "Anxious", "Stressed", "Exhausted"];
const moodScale = ["Joyful", "Content", "Chill", "Neutral", "Indifferent", "Disappointed", "Sad", "Hopeless", "Suicidal"];
const clarityScale = ["Sharp", "Focused", "Clear-headed", "Balanced", "Distracted", "Foggy", "Confused", "Overwhelmed", "Mentally Numb"];
const senseOfPurposeScale = [
    "Driven",         
    "Focused",        
    "Aligned",        
    "Curious",        
    "Uncertain",      
    "Lost",          
    "Conflicted",     
    "Empty",          
    "Detached"        
];

const date = new Date();
const options = { year: 'numeric', month: 'short', day: 'numeric' };
const formattedDate = date.toLocaleDateString('en-US', options);


// Open "Add Note" Modal
function openModal() {
    document.getElementById("noteModal").style.display = "block";
    document.querySelector(".content-wrapper").classList.add("blurred"); // Add blur effect
    document.getElementById("overlay").classList.add("active"); // Show overlay
}

// Close "Add Note" Modal
function closeModal() {
    document.querySelector(".content-wrapper").classList.remove("blurred"); // Remove blur effect
    document.getElementById("overlay").classList.remove("active"); // Hide overlay
    document.getElementById("noteModal").style.display = "none";
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";
}

// Open Full Note Modal
function openFullNote(recieved_id, emotion_tags, title, content) {
    localStorage.setItem("openedNote", recieved_id)
    console.log(recieved_id);
    const fullNoteTitle = document.getElementById("fullNoteTitle");
    const fullNoteContent = document.getElementById("fullNoteContent");
    const fullNoteEmotionTags = document.getElementById("fullNoteEmotionTags");

    // unpack json info from localstorage item "recieved_id"
    fullNoteTitle.textContent = JSON.parse(localStorage.getItem(recieved_id)).title;
    console.log(JSON.parse(localStorage.getItem(recieved_id)))
    fullNoteContent.textContent = JSON.parse(localStorage.getItem(recieved_id)).content;
    fullNoteEmotionTags.innerHTML = emotion_tags.innerHTML;

    document.getElementById("fullNoteModal").style.display = "block";
    document.querySelector(".content-wrapper").classList.add("blurred"); // Add blur effect
    document.getElementById("overlay").classList.add("active"); // Show overlay
}

// Close Full Note Modal and Save Changes
function closeFullNote(caller) {
    const noteId = localStorage.getItem("openedNote")
    const fullNoteTitle = document.getElementById("fullNoteTitle");
    const fullNoteContent = document.getElementById("fullNoteContent");
    const fullNoteEmotionTags = document.getElementById("fullNoteEmotionTags");

    const updatedNote = {
        title: fullNoteTitle.innerText,
        content: fullNoteContent.innerText,
    };

    console.log(localStorage.getItem("noteNo"))
    var is_pinned = false;
    if (document.getElementById(noteId).parentElement.id == "pinnedNotesContainer") {
        is_pinned = true;
    }
    editNote(noteId, updatedNote.title, updatedNote.content, fullNoteEmotionTags.innerHTML , is_pinned); // Update note in localStorage
    
    document.getElementById("fullNoteModal").style.display = "none";
    document.querySelector(".content-wrapper").classList.remove("blurred"); // Remove blur effect
    document.getElementById("overlay").classList.remove("active"); // Hide overlay
    localStorage.removeItem("openedNote")
}

function editNote(caller, title, content, emotion_tags_passed, pinned = false){
    
    const note = document.getElementById(caller);
    const emotion_tags = note.querySelector(".emotion_tags"); // Select the emotion tags div
    let spinner = document.createElement("div");
    spinner.classList.add("spinner");
    spinner.style = "margin: 10px auto;"; // Center the spinner
    emotion_tags.appendChild(spinner);
    console.log(title)
    console.log(content)
    console.log(caller)
    console.log(note)
    note.querySelector(".note-card h3").innerText = title;
    note.querySelector(".note-card p").innerText = content;
    generateTags(title, content).then((generatedTags) => {
        console.log("Generated Tags:", generatedTags);

        // Remove the spinner once tags are generated
        spinner.remove();

        // Add the generated tags to the note
        
        // clear existing tags
        emotion_tags.innerHTML = ""; // Clear existing tags
        generatedTags.forEach((tag) => {
            let tagElement = document.createElement("span");
            tagElement.classList.add("emotion-span");
            tagElement.textContent = tag;

            // Assign a predefined background color to the tag
            tagElement.style.backgroundColor = getTagColor(tag);
            emotion_tags.appendChild(tagElement);
        });

        // Save the note with the generated tags
        saveNote(note.id, title, content, emotion_tags.innerHTML, pinned);
    }); // Save updated note to localStorage
}

// Add Note to Page and Save to Local Storage
function addNote() {
    localStorage.setItem("noteNo", parseInt(localStorage.getItem("noteNo")) + 1 || 1); // Increment note number
    let title = document.getElementById("noteTitle").value + "    " + "(" + formattedDate + ")";
    let content = document.getElementById("noteContent").value;

    if (title.trim() === "" || content.trim() === "") {
        alert("Please enter both title and content.");
        return;
    }

    let noteContainer = document.getElementById("notesContainer");
    let newNote = document.createElement("div");

    newNote.classList.add("note-card");
    newNote.id = "note" + localStorage.getItem("noteNo"); // Set unique ID for the note

    addNoteContent(newNote, title, content);
    noteContainer.appendChild(newNote);

    // Save the note with pinned = false
    saveNote(newNote.id, title, content, "", false);

    closeModal();
}

function saveNote(noteId, title, content, emotion_tags, pinned = false) {
    const noteData = {
        title,
        content,
        emotion_tags,
        pinned, // Add pinned property
        date: new Date().toISOString(), // Add the current date in ISO format
    };
    localStorage.setItem(noteId, JSON.stringify(noteData)); // Save note to localStorage
}

function togglePinnedNotesHeading() {
    const pinnedContainer = document.getElementById("pinnedNotesContainer");
    const pinnedHeading = document.getElementById("pinned_notes_heading") // Select the first h2 (Pinned Notes)

    if (pinnedContainer.children.length === 0) {
        pinnedHeading.style.display = "none"; // Hide the heading if no pinned notes
        pinnedContainer.style.display = "none"
    } else {
        pinnedContainer.style.display = "flex"; // Show the pinned notes container
        pinnedHeading.style.display = "block"; // Show the heading if there are pinned notes
    }
}

// Function to get predefined colors for tags
function getTagColor(tag) {
    const tagColors = {
        suicidal: "#ff4d4d", // Bright red for "Suicidal"
        hopeless: "#ff9999", // Light red for "Hopeless"
        sad: "#ffcccb", // Pinkish red for "Sad"
        joyful: "#90ee90", // Light green for "Joyful"
        content: "#98fb98", // Pale green for "Content"
        chill: "#add8e6", // Light blue for "Chill"
        neutral: "#d3d3d3", // Light gray for "Neutral"
        indifferent: "#f0e68c", // Khaki for "Indifferent"
        disappointed: "#f5deb3", // Wheat for "Disappointed"
        restless: "#ffb347", // Light orange for "Restless"
        thrilled: "#ff69b4", // Hot pink for "Thrilled"
        energetic: "#ffd700", // Gold for "Energetic"
        motivated: "#ffa500", // Orange for "Motivated"
        calm: "#87ceeb", // Sky blue for "Calm"
        anxious: "#ffb6c1", // Light pink for "Anxious"
        frustrated: "#ff6347", // Tomato red for "Stressed"
        exhausted: "#d2b48c", // Tan for "Exhausted"
        sharp: "#f0e68c", // Khaki for "Sharp"
        focused: "#f5deb3", // Wheat for "Focused"
        "clear-headed": "#fffacd", // Lemon Chiffon for "Clear-headed"
        balanced: "#f5f5dc", // Beige for "Balanced"
        distracted: "#dcdcdc", // Gainsboro for "Distracted"
        foggy: "#d3d3d3", // Light gray for "Foggy"
        confused: "#f0e68c", // Khaki for "Confused"
        overwhelmed: "#ffb6c1", // Light pink for "Overwhelmed"
        mentally: "#d8bfd8", // Thistle for "Mentally Numb"
        driven: "#98fb98", // Pale green for "Driven"
        aligned: "#90ee90", // Light green for "Aligned"
        curious: "#add8e6", // Light blue for "Curious"
        uncertain: "#d3d3d3", // Light gray for "Uncertain"
        lost: "#dcdcdc", // Gainsboro for "Lost"
        conflicted: "#f0e68c", // Khaki for "Conflicted"
        empty: "#f5deb3", // Wheat for "Empty"
        detached: "#fffacd", // Lemon Chiffon for "Detached"

        // Add more tags and colors as needed
    };

    // Return the color for the tag, or a default color if the tag is not in the map
    return tagColors[tag.toLowerCase()] || "#e2e3e5"; // Default light gray
}

function addNoteContent(newNote, title, content, tags, pinned = false) {
    let emotion_tags = document.createElement("div");
    emotion_tags.classList.add("emotion_tags");

    // Add a spinner inside the note while generating tags
    let spinner = document.createElement("div");
    spinner.classList.add("spinner");
    spinner.style = "margin: 10px auto;"; // Center the spinner
    emotion_tags.appendChild(spinner);

    if (!tags) {
        console.log("function called without tags, generating tags USING AI");
        generateTags(title, content).then((generatedTags) => {
            console.log("Generated Tags:", generatedTags);

            // Remove the spinner once tags are generated
            spinner.remove();

            // Add the generated tags to the note
            generatedTags.forEach((tag) => {
                let tagElement = document.createElement("span");
                tagElement.classList.add("emotion-span");
                tagElement.textContent = tag;

                // Assign a predefined background color to the tag
                tagElement.style.backgroundColor = getTagColor(tag);

                emotion_tags.appendChild(tagElement);
            });

            // Save the note with the generated tags
            saveNote(newNote.id, title, content, emotion_tags.innerHTML, pinned);
        });
    } else {
        console.log("function called with tags.");
        console.log(tags);

        // Parse existing tags and assign colors
        emotion_tags.innerHTML = tags;
        Array.from(emotion_tags.children).forEach((tagElement) => {
            tagElement.style.backgroundColor = getTagColor(tagElement.textContent);
        });
    }

    let title_field = document.createElement("h3");
    title_field.textContent = title;
    title_field.style = "min-height: 3em; margin-left: 3px; margin-top: 5px; margin-bottom: 5px;";
    let content_field = document.createElement("p");
    content_field.style =
        "min-height: 6em; margin-left: 2px; margin-top: 5px; margin-bottom: 5px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical;";
    content_field.textContent = content;

    // Create delete button with trash icon
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.style =
        "margin-top: 10px; background-color: white; color: #c0392b; cursor: pointer; border: none;";
    deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
    `;
    deleteButton.onclick = function (event) {
        localStorage.setItem("noteNo", parseInt(localStorage.getItem("noteNo")) - 1); // Decrement note number
        event.stopPropagation(); // Prevent triggering the note click event
        localStorage.removeItem(newNote.id); // Remove note from localStorage
        newNote.remove(); // Remove note from the DOM
        reorderNotes();
        togglePinnedNotesHeading(); // Check and toggle the visibility of the heading
    };

    // Create pin/unpin button
    let pinButton = document.createElement("button");
    pinButton.classList.add("pin-btn");
    pinButton.style =
        "margin-top: 10px; background-color: white; color: #4b7057; cursor: pointer; border: none;";
    pinButton.textContent = pinned ? "📍 Unpin" : "📌 Pin"; // Set button text based on pinned status
    pinButton.onclick = function (event) {
        event.stopPropagation();
        const pinnedContainer = document.getElementById("pinnedNotesContainer");
        const notesContainer = document.getElementById("notesContainer");

        if (newNote.parentElement === pinnedContainer) {
            // If the note is already pinned, unpin it
            notesContainer.appendChild(newNote);
            pinButton.textContent = "📌 Pin";

            // Update the pinned status in localStorage
            const noteData = JSON.parse(localStorage.getItem(newNote.id));
            noteData.pinned = false;
            localStorage.setItem(newNote.id, JSON.stringify(noteData));
        } else {
            // If the note is not pinned, pin it
            pinnedContainer.appendChild(newNote);
            pinButton.textContent = "📍 Unpin";

            // Update the pinned status in localStorage
            const noteData = JSON.parse(localStorage.getItem(newNote.id));
            noteData.pinned = true;
            localStorage.setItem(newNote.id, JSON.stringify(noteData));
        }

        togglePinnedNotesHeading(); // Check and toggle the visibility of the heading
    };

    newNote.appendChild(emotion_tags);
    newNote.appendChild(title_field);
    newNote.appendChild(content_field);
    newNote.appendChild(deleteButton);
    newNote.appendChild(pinButton);

    // Make note clickable to open full view
    newNote.onclick = function () {
        openFullNote(newNote.id, emotion_tags, title, content);
    };
}

function reorderNotes() {
    const noteContainer = document.getElementById("notesContainer");
    const notes = noteContainer.querySelectorAll(".note-card"); // Get all note cards
    let newNoteNo = 0;

    // Clear all notes from localStorage
    for (let i = 1; i <= parseInt(localStorage.getItem("noteNo")); i++) {
        localStorage.removeItem("note" + i);
    }

    // Reassign IDs and update localStorage
    notes.forEach((note, index) => {
        newNoteNo = index + 1; // Start numbering from 1
        const newNoteId = "note" + newNoteNo;

        // Update the note's ID
        note.id = newNoteId;

        // Get the note's title, content, and emotion tags
        const title = note.querySelector("h3").innerText;
        const content = note.querySelector("p").innerText;
        const emotion_tags = note.querySelector(".emotion_tags").innerHTML;

        // Save the updated note to localStorage
        localStorage.setItem(newNoteId, JSON.stringify({ title, content, emotion_tags }));
    });

    // Update the noteNo in localStorage
    localStorage.setItem("noteNo", newNoteNo);
}

// Load Notes from Local Storage on Page Load
function loadNotes() {
    const notesContainer = document.getElementById("notesContainer");
    const pinnedContainer = document.getElementById("pinnedNotesContainer");
    let noteId = "";

    for (let i = 1; i <= parseInt(localStorage.getItem("noteNo")) || 0; i++) {
        noteId = "note" + i; // Generate note ID
        const noteData = JSON.parse(localStorage.getItem(noteId));

        if (noteData) {
            let newNote = document.createElement("div");
            newNote.id = noteId; // Set unique ID for the note
            newNote.classList.add("note-card");

            addNoteContent(newNote, noteData.title, noteData.content, noteData.emotion_tags, noteData.pinned);

            // Append to the correct container based on the pinned status
            if (noteData.pinned) {
                pinnedContainer.appendChild(newNote);
            } else {
                notesContainer.appendChild(newNote);
            }
        }
    }

    togglePinnedNotesHeading(); // Check pinned notes on page load
}

// Call loadNotes on page load
document.addEventListener("DOMContentLoaded", () => {
    loadNotes();
    togglePinnedNotesHeading(); // Check pinned notes on page load
});

// Function to check if API is available
async function checkApiAvailability(url) {
    try {
        const response = await fetch(url);
        return response.ok; // Returns true if response is successful
    } catch (error) {
        console.error('API check failed:', error);
        return false; // Returns false if the request fails
    }
}

async function generateTags(title, content) {
    try {
        const url = await checkApiAvailability(apiUrl) ? fallbackApiUrl : apiUrl;
        console.log(url)

        const response = await fetch(`${url}/generate-tags`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content }),
        });

        const data = await response.json();
        console.log(data.tags); // Log the generated tags
        return data.tags; // Return the generated tags
    } catch (error) {
        console.error("Error generating tags:", error);
    }
}


const menu = document.getElementById("mobile-menu")
function toggleMenu() {
    console.log("clicked")
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}