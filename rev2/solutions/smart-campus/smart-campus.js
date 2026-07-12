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

const $ = window.jQuery;

// Product carousels (slick). Sliders inside hidden tab panels init at width 0,
// so we re-run setPosition whenever their panel becomes visible.
function initProductSliders() {
  if (!$?.fn?.slick) return;
  $("[data-product-slider]").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    infinite: true,
    autoplay: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    autoplaySpeed: 3800,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 560, settings: { slidesToShow: 1 } },
    ],
  });
}
initProductSliders();

function refreshSlidersIn(panel) {
  if (!$?.fn?.slick || !panel) return;
  $(panel)
    .find("[data-product-slider].slick-initialized")
    .slick("setPosition");
}

// Each [data-op-tabs] group is an independent tab set.
const opTabGroups = Array.from(document.querySelectorAll("[data-op-tabs]")).map((group) => {
  const tabs = Array.from(group.querySelectorAll(".op-tab"));
  const panels = Array.from(group.querySelectorAll(".op-panel"));

  function activate(tab, { focus = false } = {}) {
    if (!tab) return;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", selected ? "true" : "false");
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      const active = panel.id === tab.getAttribute("aria-controls");
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
      if (active) refreshSlidersIn(panel);
    });
    if (focus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      activate(tabs[(index + step + tabs.length) % tabs.length], { focus: true });
    });
  });

  return { tabs, activate };
});

// Deep links (e.g. area selector -> #lobi) should open the matching tab in its group.
function syncOpTabsToHash() {
  opTabGroups.forEach(({ tabs, activate }) => {
    const target = tabs.find((tab) => `#${tab.getAttribute("aria-controls")}` === location.hash);
    if (target) activate(target);
  });
}
window.addEventListener("hashchange", syncOpTabsToHash);
syncOpTabsToHash();

document.querySelectorAll(".faq-list details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-list details[open]").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
