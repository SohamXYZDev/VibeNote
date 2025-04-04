const energyScale = ["Thrilled", "Energetic", "Motivated", "Calm", "Indifferent", "Restless", "Anxious", "Stressed", "Exhausted"];
const moodScale = ["Joyful", "Content", "Chill", "Neutral", "Indifferent", "Disappointed", "Sad", "Hopeless", "Suicidal"];
const clarityScale = ["Sharp", "Focused", "Clear-headed", "Balanced", "Distracted", "Foggy", "Confused", "Overwhelmed", "Mentally Numb"];
const senseOfPurposeScale = [
    "Driven",         // clear goals, full force ahead
    "Focused",        // dialed into purpose
    "Aligned",        // values and actions match
    "Curious",        // open to direction, motivated
    "Uncertain",      // unsure of next step, but okay
    "Lost",           // disconnected from direction
    "Conflicted",     // torn between paths
    "Empty",          // emotionally numb to meaning
    "Detached"        // feels like nothing matters
];

const date = new Date();
const options = { year: 'numeric', month: 'short', day: 'numeric' };
const formattedDate = date.toLocaleDateString('en-US', options);

// Open "Add Note" Modal
function openModal() {
    document.getElementById("noteModal").style.display = "block";
}

// Close "Add Note" Modal
function closeModal() {
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
    editNote(noteId, updatedNote.title, updatedNote.content, fullNoteEmotionTags.innerHTML); // Update note in localStorage
    
    document.getElementById("fullNoteModal").style.display = "none";
    document.querySelector(".content-wrapper").classList.remove("blurred"); // Remove blur effect
    document.getElementById("overlay").classList.remove("active"); // Hide overlay
    localStorage.removeItem("openedNote")
}

function editNote(caller, title, content, emotion_tags){
    console.log(title)
    console.log(content)
    console.log(caller)
    const note = document.getElementById(caller);
    console.log(note)
    note.querySelector(".note-card h3").innerText = title;
    note.querySelector(".note-card p").innerText = content;
    note.querySelector(".emotion_tags").innerHTML = emotion_tags;
    localStorage.setItem(caller, JSON.stringify({ title, content, emotion_tags })); // Save updated note to localStorage
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

    closeModal();
}

function saveNote(noteId, title, content, emotion_tags) {
    const noteData = { title, content, emotion_tags };
    localStorage.setItem(noteId, JSON.stringify(noteData)); // Save note to localStorage
}

function addNoteContent(newNote, title, content, tags) {
    
    let emotion_tags = document.createElement("div");
    emotion_tags.classList.add("emotion_tags");
    if  (!tags) {
        console.log("function called without tags, creating tags")
        let energyTag = document.createElement("span");
        energyTag.classList.add("emotion-span");
        energyTag.textContent = energyScale[Math.floor(Math.random() * energyScale.length)];
        emotion_tags.appendChild(energyTag);
        let moodTag = document.createElement("span");
        moodTag.classList.add("emotion-span");
        moodTag.textContent = moodScale[Math.floor(Math.random() * moodScale.length)];
        emotion_tags.appendChild(moodTag);
        let clarityTag = document.createElement("span");
        clarityTag.classList.add("emotion-span");
        clarityTag.textContent = clarityScale[Math.floor(Math.random() * clarityScale.length)];
        emotion_tags.appendChild(clarityTag);
        let purposeTag = document.createElement("span");
        purposeTag.classList.add("emotion-span");
        purposeTag.textContent = senseOfPurposeScale[Math.floor(Math.random() * senseOfPurposeScale.length)];
        emotion_tags.appendChild(purposeTag);
        
    } else {
        console.log("function called WIth TAGS.")
        console.log(tags)
        emotion_tags.innerHTML = tags;
    }

    let title_field = document.createElement("h3");
    title_field.textContent = title;
    title_field.style = "margin-left: 3px; margin-top: 5px; margin-bottom: 5px;";
    let content_field = document.createElement("p");
    content_field.style =
        "margin-left: 2px; margin-top: 5px; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-height: 50px;";
    content_field.textContent = content;

    saveNote(newNote.id, title, content, emotion_tags.innerHTML); // Save note to localStorage

    newNote.appendChild(emotion_tags);
    newNote.appendChild(title_field);
    newNote.appendChild(content_field);

    // Make note clickable to open full view
    newNote.onclick = function () {
        openFullNote(newNote.id,emotion_tags, title, content);
    };
}

// Load Notes from Local Storage on Page Load
function loadNotes(caller) {
    const noteContainer = document.getElementById("notesContainer");
    var noteId = "";

    for (let i = 1; i < parseInt(localStorage.getItem("noteNo")) + 1; i++) {
        console.log("running once")
        noteId = "note" + i; // Generate note ID
        console.log(noteId)
        const noteData = JSON.parse(localStorage.getItem(noteId));
        console.log(noteData)
        let newNote = document.createElement("div");
        newNote.id = noteId; // Set unique ID for the note
        newNote.classList.add("note-card");
        addNoteContent(newNote, noteData.title, noteData.content, noteData.emotion_tags);
        noteContainer.appendChild(newNote);
    }
}

// Call loadNotes on page load
document.addEventListener("DOMContentLoaded", loadNotes);

document.querySelector(".signup-btn").addEventListener("click", () => {
    window.location.href = "../sign-up/";
});