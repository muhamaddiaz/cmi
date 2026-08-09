/* digital.js — page behaviour shared by the Solusi Integrasi Digital
   family. Header, mega menu, page loader and .reveal animation all
   come from ../script.js; this file only adds what's specific here. */

document.addEventListener("DOMContentLoaded", () => {
  /* FAQ: accordion — opening one closes the others.
     Same behaviour as the facility pages. */
  const faqItems = document.querySelectorAll(".dg-faq .faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* Hub directory filter. Buttons carry data-filter; cards carry
     data-family (space-separated). "all" clears the filter. */
  const filterBar = document.querySelector("[data-dir-filter]");
  const dirCards = document.querySelectorAll("[data-family]");

  if (filterBar && dirCards.length) {
    filterBar.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;

      const filter = button.dataset.filter;

      filterBar.querySelectorAll("button[data-filter]").forEach((other) => {
        other.setAttribute("aria-pressed", String(other === button));
      });

      dirCards.forEach((card) => {
        const families = (card.dataset.family || "").split(/\s+/);
        card.hidden = filter !== "all" && !families.includes(filter);
      });
    });
  }
});
