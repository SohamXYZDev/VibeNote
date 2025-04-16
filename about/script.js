
document.querySelector(".signup-btn").addEventListener("click", () => {
    window.location.href = "../sign-up/";
});
document.querySelector(".get-started-btn").addEventListener("click", () => {
    window.location.href = "../sign-up/";
});

document.addEventListener("DOMContentLoaded", () => {
    const featureList = document.querySelector(".feature-list");

    if (featureList) {
        let isDown = false;
        let startX;
        let scrollLeft;

        featureList.addEventListener("mousedown", (e) => {
            isDown = true;
            featureList.classList.add("active");
            startX = e.pageX - featureList.offsetLeft;
            scrollLeft = featureList.scrollLeft;
        });

        featureList.addEventListener("mouseleave", () => {
            isDown = false;
            featureList.classList.remove("active");
        });

        featureList.addEventListener("mouseup", () => {
            isDown = false;
            featureList.classList.remove("active");
        });

        featureList.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - featureList.offsetLeft;
            const walk = (x - startX) * 2; // Adjust scroll speed
            featureList.scrollLeft = scrollLeft - walk;
        });
    }
});