document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-item[open]").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const usecaseExplorer = document.querySelector("[data-usecase-explorer]");

if (usecaseExplorer) {
  const stage = usecaseExplorer.querySelector(".usecase-stage");
  const stageImage = usecaseExplorer.querySelector("[data-usecase-stage-image]");
  const items = [...usecaseExplorer.querySelectorAll("[data-usecase-item]")];
  let imageRequest = 0;
  let animationTimer;

  const activateUsecase = (activeItem) => {
    const activeIndex = items.indexOf(activeItem);
    if (activeIndex < 0) return;

    items.forEach((item, index) => {
      const isActive = index === activeIndex;
      item.classList.toggle("is-active", isActive);
      item.querySelector("[data-usecase-trigger]")?.setAttribute("aria-pressed", String(isActive));
    });

    const sourceImage = activeItem.querySelector(".usecase-mobile-visual img");
    const nextSource = sourceImage?.currentSrc || sourceImage?.src;
    if (!stage || !stageImage || !nextSource || stageImage.src === nextSource) return;

    const request = ++imageRequest;
    const preload = new Image();
    preload.src = nextSource;

    const updateStage = () => {
      if (request !== imageRequest) return;
      stageImage.src = nextSource;
      stage.classList.remove("is-changing");
      void stage.offsetWidth;
      stage.classList.add("is-changing");
      window.clearTimeout(animationTimer);
      animationTimer = window.setTimeout(() => stage.classList.remove("is-changing"), 540);
    };

    if (preload.complete) updateStage();
    else preload.addEventListener("load", updateStage, { once: true });
  };

  items.forEach((item) => {
    const trigger = item.querySelector("[data-usecase-trigger]");
    item.addEventListener("mouseenter", () => activateUsecase(item));
    trigger?.addEventListener("focus", () => activateUsecase(item));
    trigger?.addEventListener("click", () => activateUsecase(item));
  });
}
