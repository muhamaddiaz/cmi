const header = document.querySelector("[data-header]");
const mega = document.querySelector("[data-mega]");
const megaButton = mega?.querySelector("button");
let megaCloseTimer;
const mobileToggle = document.querySelector("[data-mobile-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileSolutionsButton = document.querySelector("[data-mobile-solutions]");
const mobileSolutions = document.querySelector(".mobile-solutions");
const pageLoader = document.querySelector("[data-page-loader]");
const pageLoaderStartedAt = window.performance?.now?.() ?? Date.now();
const gsapInstance = window.gsap;
const scrollTrigger = window.ScrollTrigger;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

window.lucide?.createIcons();

function hidePageLoader() {
  if (!document.body.classList.contains("is-loading")) {
    return;
  }

  const now = window.performance?.now?.() ?? Date.now();
  const elapsed = now - pageLoaderStartedAt;
  const remainingDelay = prefersReducedMotion ? 0 : Math.max(0, 700 - elapsed);

  window.setTimeout(() => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-loaded");
    pageLoader?.setAttribute("aria-hidden", "true");

    pageLoader?.addEventListener("transitionend", () => pageLoader.remove(), {
      once: true,
    });
    window.setTimeout(() => pageLoader?.remove(), 900);
  }, remainingDelay);
}

if (document.readyState === "complete") {
  hidePageLoader();
} else {
  window.addEventListener("load", hidePageLoader, { once: true });
}

window.setTimeout(hidePageLoader, 3500);

function setHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeMega() {
  mega?.classList.remove("is-open");
  megaButton?.setAttribute("aria-expanded", "false");
}

function openMega() {
  window.clearTimeout(megaCloseTimer);
  mega?.classList.add("is-open");
  megaButton?.setAttribute("aria-expanded", "true");
}

function scheduleMegaClose() {
  window.clearTimeout(megaCloseTimer);
  megaCloseTimer = window.setTimeout(closeMega, 180);
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

megaButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  if (mega?.classList.contains("is-open")) {
    closeMega();
  } else {
    openMega();
  }
});

mega?.addEventListener("mouseenter", openMega);
mega?.addEventListener("mouseleave", scheduleMegaClose);

document.addEventListener("click", (event) => {
  if (mega && !mega.contains(event.target)) {
    closeMega();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMega();
    closeMobileMenu();
  }
});

function closeMobileMenu() {
  mobileMenu?.setAttribute("hidden", "");
  mobileToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

mobileToggle?.addEventListener("click", () => {
  const isOpen = mobileToggle.getAttribute("aria-expanded") === "true";
  mobileToggle.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu?.toggleAttribute("hidden", isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

mobileSolutionsButton?.addEventListener("click", () => {
  const isOpen = mobileSolutionsButton.getAttribute("aria-expanded") === "true";
  mobileSolutionsButton.setAttribute("aria-expanded", String(!isOpen));
  mobileSolutions?.toggleAttribute("hidden", isOpen);
});

if (gsapInstance && scrollTrigger && !prefersReducedMotion) {
  gsapInstance.registerPlugin(scrollTrigger);

  const sections = gsapInstance.utils.toArray("main > section, .site-footer");
  sections.forEach((section) => section.classList.add("section-reveal"));

  gsapInstance.set(sections, {
    autoAlpha: 0,
    filter: "blur(18px)",
    y: 56,
  });
  gsapInstance.set(".reveal", {
    filter: "blur(10px)",
    opacity: 0,
    y: 28,
  });

  sections.forEach((section, index) => {
    const revealItems = gsapInstance.utils.toArray(
      section.querySelectorAll(".reveal")
    );
    const sectionTimeline = gsapInstance.timeline({
      scrollTrigger: {
        trigger: section,
        start: index === 0 ? "top 96%" : "top 82%",
        once: true,
      },
    });

    sectionTimeline
      .to(section, {
        autoAlpha: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        onComplete: () => {
          section.classList.add("is-visible");
          gsapInstance.set(section, {
            clearProps: "opacity,visibility,filter,y",
          });
        },
      })
      .to(
        revealItems,
        {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          onComplete: () => {
            revealItems.forEach((item) => item.classList.add("is-visible"));
            gsapInstance.set(revealItems, {
              clearProps: "filter,y",
            });
          },
        },
        "-=0.48"
      );
  });

  gsapInstance.utils.toArray(".reveal").forEach((element) => {
    if (!element.closest("main > section, .site-footer")) {
      gsapInstance.to(element, {
        filter: "blur(0px)",
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true,
        },
        onComplete: () => {
          element.classList.add("is-visible");
          gsapInstance.set(element, {
            clearProps: "filter,y",
          });
        },
      });
    }
  });

  gsapInstance.to(".showcase-photo img", {
    scale: 1,
    duration: 1.8,
    ease: "power2.out",
    startAt: {
      scale: 1.08,
    },
  });
} else {
  document
    .querySelectorAll(".reveal, main > section, .site-footer")
    .forEach((element) => {
      element.style.filter = "none";
      element.style.opacity = "1";
      element.style.transform = "none";
      element.style.visibility = "visible";
    });
}

if (prefersReducedMotion) {
  document.querySelectorAll(".alur-item").forEach((item) => {
    item.classList.add("is-visible");
  });
}

// Alur timeline: staggered item reveal on scroll
const alurItems = document.querySelectorAll(".alur-item");
if (alurItems.length && !prefersReducedMotion) {
  const itemObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          itemObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  alurItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 120}ms`;
    itemObserver.observe(item);
  });
}
