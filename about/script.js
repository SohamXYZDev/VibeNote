
document.querySelector(".signup-btn").addEventListener("click", () => {
    window.location.href = "../sign-up/";
});
document.querySelector(".get-started-btn").addEventListener("click", () => {
    window.location.href = "../sign-up/";
});


const featureList = document.querySelector(".feature-list");
const featureCards = document.querySelectorAll(".feature-item");
// card0 is first child of featureList

const prevBtn = document.getElementById("carousel-prev");
const nextBtn = document.getElementById("carousel-next");
const nav = document.getElementById("carousel-nav");

// ...existing code...
let currentIndex = 2; // Start on the middle card
prevBtn.addEventListener("click", () => {
    console.log("Previous button clicked");
    console.log("Current index before decrement: " + currentIndex);
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = 2; // Wrap around to the last card
    }
    console.log("Current index after decrement: " + currentIndex);
    console.log(featureCards[currentIndex]);
    featureList.appendChild(featureCards[currentIndex]);
});
nextBtn.addEventListener("click", () => {
    console.log("Next button clicked");
    console.log("Current index before increment: " + currentIndex);
    currentIndex++;
    if (currentIndex > 2) {
        currentIndex = 0; // Wrap around to the first card
    }
    // Move the current card to the end of the list
    console.log("Current index after increment: " + currentIndex);
    console.log(featureCards[currentIndex]);
    featureList.appendChild(featureCards[currentIndex]);
});
// ...existing code...