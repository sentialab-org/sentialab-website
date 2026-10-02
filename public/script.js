document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const progressBar = document.querySelector(".scroll-progress span");
const yearTarget = document.querySelector("[data-year]");
const revealTargets = document.querySelectorAll(
  [
    ".manifesto",
    ".system-section",
    ".directions",
    ".field-note",
    ".aelia-teaser",
    ".community",
    ".site-footer",
    ".aelia-statement",
    ".life-loop-section",
    ".aelia-architecture",
    ".social-problem",
    ".aelia-life",
    ".experimental-status",
  ].join(", ")
);
const systemNodes = document.querySelectorAll(".system-node");
const systemMap = document.querySelector(".system-map");
const systemReadout = document.querySelector(".system-readout");
const readoutLabel = document.querySelector(".readout-label");
const readout = document.querySelector("[data-readout]");
const runtimeIndex = document.querySelector("[data-runtime-index]");
const runtimeLayer = document.querySelector("[data-runtime-layer]");
const fieldNodes = Array.from(document.querySelectorAll("[data-field-layer]"));
const artworkFigures = Array.from(document.querySelectorAll("[data-artwork]"));
const motionToggles = Array.from(document.querySelectorAll("[data-motion-toggle]"));

const layerContent = {
  memory: {
    label: "CURRENT LAYER / MEMORY & IDENTITY",
    text: "Memory gives identity a past. It includes episodic, semantic, social, and relational traces that influence belief, state, decision, and future memory.",
    index: "01",
    runtimeLayer: "memory / identity",
  },
  belief: {
    label: "CURRENT LAYER / WORLD & BELIEF",
    text: "Working models of what may be happening in the world, what other people may intend, and what the system currently takes to be true — provisionally and with uncertainty.",
    index: "02",
    runtimeLayer: "world / belief",
  },
  state: {
    label: "CURRENT LAYER / INTERNAL STATE",
    text: "A moving configuration of attention, priorities, goals, familiarity, and social stance that changes which actions become likely in a given moment.",
    index: "03",
    runtimeLayer: "internal state",
  },
  social: {
    label: "CURRENT LAYER / SOCIAL MODEL",
    text: "A model of people, relationships, group context, and perspective. It helps frame who is speaking to whom, whether intervention matters, and what a response could mean.",
    index: "04",
    runtimeLayer: "social model",
  },
  decision: {
    label: "CURRENT LAYER / DECISION & ACTION",
    text: "The system coordinates memory, belief, state, social context, goals, and persona to decide whether to act, what action to take, and why this moment warrants it.",
    index: "05",
    runtimeLayer: "decision / action",
  },
};

let systemReadoutTimer;
let systemReadoutFrame;

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!siteNav.classList.contains("is-open")) return;
    if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });
}

function updateProgress() {
  if (!progressBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((target) => {
    target.setAttribute("data-reveal", "");
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

function activateSystemLayer(node, animate = true) {
  const layer = node.dataset.layer;
  const content = layerContent[layer];
  if (!content) return;

  systemNodes.forEach((item) => {
    const isActive = item === node;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  if (systemMap) systemMap.dataset.activeLayer = layer;
  if (readoutLabel) readoutLabel.textContent = content.label;
  if (readout) readout.textContent = content.text;
  if (runtimeIndex) runtimeIndex.textContent = content.index;
  if (runtimeLayer) runtimeLayer.textContent = content.runtimeLayer;
  fieldNodes.forEach((fieldNode) => {
    fieldNode.classList.toggle("is-active", fieldNode.dataset.fieldLayer === layer);
  });

  if (!animate || !systemReadout) return;
  window.clearTimeout(systemReadoutTimer);
  window.cancelAnimationFrame(systemReadoutFrame);
  systemReadout.classList.remove("is-refreshing");
  systemReadoutFrame = window.requestAnimationFrame(() => {
    systemReadout.classList.add("is-refreshing");
    systemReadoutTimer = window.setTimeout(() => {
      systemReadout.classList.remove("is-refreshing");
    }, 540);
  });
}

const initiallyActiveSystemNode = Array.from(systemNodes).find((node) =>
  node.classList.contains("is-active")
);

if (initiallyActiveSystemNode) {
  activateSystemLayer(initiallyActiveSystemNode, false);
}

systemNodes.forEach((node) => {
  node.addEventListener("click", () => activateSystemLayer(node));
});

if (artworkFigures.length) {
  if ("IntersectionObserver" in window) {
    const artworkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("art-in-view", entry.isIntersecting);
        });
      },
      { rootMargin: "10% 0px", threshold: 0.05 }
    );

    artworkFigures.forEach((figure) => artworkObserver.observe(figure));
  } else {
    artworkFigures.forEach((figure) => figure.classList.add("art-in-view"));
  }
}

if (motionToggles.length) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let userPaused = false;

  function syncMotionControls() {
    const motionIsPaused = userPaused || reducedMotion.matches || document.hidden;
    document.documentElement.classList.toggle("motion-paused", motionIsPaused);

    motionToggles.forEach((toggle) => {
      toggle.hidden = false;
      toggle.disabled = reducedMotion.matches;
      toggle.setAttribute("aria-pressed", String(userPaused));
      toggle.textContent = reducedMotion.matches
        ? "Motion reduced"
        : userPaused
          ? "Resume motion"
          : "Pause motion";
    });
  }

  motionToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      userPaused = !userPaused;
      syncMotionControls();
    });
  });

  reducedMotion.addEventListener("change", syncMotionControls);
  document.addEventListener("visibilitychange", syncMotionControls);
  syncMotionControls();
}
