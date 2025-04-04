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
function openFullNote(title, content) {
    document.getElementById("fullNoteTitle").innerText = title;
    document.getElementById("fullNoteContent").innerText = content;
    document.getElementById("fullNoteModal").style.display = "block";
}

// Close Full Note Modal
function closeFullNote() {
    document.getElementById("fullNoteModal").style.display = "none";
}

// Add Note to Page
function addNote() {
    let title = document.getElementById("noteTitle").value + "    " + "(" + formattedDate + ")";
    let content = document.getElementById("noteContent").value;

    if (title.trim() === "" || content.trim() === "") {
        alert("Please enter both title and content.");
        return;
    }

    let noteContainer = document.getElementById("notesContainer");
    let newNote = document.createElement("div");

    newNote.classList.add("note-card");

    // Make note clickable to open full view
    newNote.onclick = function () {
        openFullNote(title, content);
    };

    noteContainer.appendChild(newNote);

    addNoteContent(newNote, title, content)
    closeModal();
}

function addNoteContent(newNote, title, content) {
    let emotion_tags = document.createElement("div");


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


    let title_field = document.createElement('h3');
    title_field.textContent = title
    title_field.style = "margin-left: 3px; margin-top: 5px; margin-bottom: 5px;";
    let content_field = document.createElement('p');
    content_field.style = "margin-left: 2px; margin-top: 5px; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-height: 50px;";
    content_field.textContent = content;


    newNote.appendChild(emotion_tags);
    newNote.appendChild(title_field);
    newNote.appendChild(content_field);
}


document.querySelector(".signup-btn").addEventListener("click", () => {
    window.location.href = "../sign-up/";
});