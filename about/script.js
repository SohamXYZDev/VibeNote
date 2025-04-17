document.querySelector(".signup-btn").addEventListener("click", () => {
    window.location.href = "../sign-up/";
});
document.querySelector(".get-started-btn").addEventListener("click", () => {
    window.location.href = "../sign-up/";
});
let startX = 0;
let endX = 0;
let currentCardIndex = 0;

const current_card = document.getElementById(".current_card");
const cardCont = document.querySelector(".card_cont");
const cards = cardCont.querySelectorAll(".feature-item");
const dots = document.querySelectorAll(".dot");


function updateActiveCard(index) {
    // Hide all cards and remove the active class
    Array.from(cards).forEach((card, i) => {
        card.style.display = i === index ? "block" : "none";
        card.classList.toggle("active", i === index); // Add 'active' class to the current card
    });

    // Update pagination dots
    Array.from(dots).forEach((dot, i) => {
        dot.style.backgroundColor = i === index ? "#44a86c" : "#75ce98";
    });
}

// Initialize the first card as active
updateActiveCard(currentCardIndex);

// add EventListener to each card
cards.forEach((card, index) => {
    card.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX; // Record the starting X position
    });
    card.addEventListener("touchmove", (e) => {
        endX = e.touches[0].clientX; // Update the current X position
    });
});

document.addEventListener("touchend", () => {
    if (startX > endX && startX - endX > 50) {
        // Left swipe detected
        if (currentCardIndex < cards.length - 1) {
            currentCardIndex++;
            updateActiveCard(currentCardIndex);
        }
    } else if (startX < endX && endX - startX > 50) {
        // Right swipe detected
        if (currentCardIndex > 0) {
            currentCardIndex--;
            updateActiveCard(currentCardIndex);
        }
    }
});

const menu = document.getElementById("mobile-menu")
function toggleMenu() {
    console.log("clicked")
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}