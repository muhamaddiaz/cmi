document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      document.querySelectorAll(".faq-item[open]").forEach((openItem) => {
        if (openItem !== item) openItem.open = false;
      });
    });
  });
});
