const campusChoices = Array.from(document.querySelectorAll(".area-choice"));
const activeAreaLabel = document.querySelector("#active-area-label");

function setActiveArea(choice) {
  campusChoices.forEach((item) => item.classList.toggle("is-active", item === choice));
  if (activeAreaLabel) activeAreaLabel.textContent = choice.dataset.area || choice.textContent.trim();
}

campusChoices.forEach((choice) => {
  choice.addEventListener("click", () => setActiveArea(choice));
  choice.addEventListener("focus", () => setActiveArea(choice));
});

document.querySelectorAll(".faq-list details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-list details[open]").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
