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
    let title = document.getElementById("noteTitle").value;
    let content = document.getElementById("noteContent").value;

    if (title.trim() === "" || content.trim() === "") {
        alert("Please enter both title and content.");
        return;
    }

    let noteContainer = document.getElementById("notesContainer");
    let newNote = document.createElement("div");
    newNote.classList.add("note-card");

    newNote.innerHTML = `
        <h3>${title}</h3>
        <p>${content}</p>
    `;

    // Set ellipsis for long content
    newNote.querySelector("p").style.whiteSpace = "nowrap";
    newNote.querySelector("p").style.overflow = "hidden";
    newNote.querySelector("p").style.textOverflow = "ellipsis";
    newNote.querySelector("p").style.maxHeight = "50px";

    // Make note clickable to open full view
    newNote.onclick = function () {
        openFullNote(title, content);
    };

    noteContainer.appendChild(newNote);
    closeModal();
}
