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
const readoutLabel = document.querySelector(".readout-label");
const readout = document.querySelector("[data-readout]");

const layerContent = {
  memory: {
    label: "CURRENT LAYER / MEMORY & IDENTITY",
    text: "Memory gives identity a past. It includes episodic, semantic, social, and relational traces that influence belief, state, decision, and future memory.",
  },
  belief: {
    label: "CURRENT LAYER / WORLD & BELIEF",
    text: "Working models of what may be happening in the world, what other people may intend, and what the system currently takes to be true — provisionally and with uncertainty.",
  },
  state: {
    label: "CURRENT LAYER / INTERNAL STATE",
    text: "A moving configuration of attention, priorities, goals, familiarity, and social stance that changes which actions become likely in a given moment.",
  },
  social: {
    label: "CURRENT LAYER / SOCIAL MODEL",
    text: "A model of people, relationships, group context, and perspective. It helps frame who is speaking to whom, whether intervention matters, and what a response could mean.",
  },
  decision: {
    label: "CURRENT LAYER / DECISION & ACTION",
    text: "The system coordinates memory, belief, state, social context, goals, and persona to decide whether to act, what action to take, and why this moment warrants it.",
  },
};

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

systemNodes.forEach((node) => {
  node.addEventListener("click", () => {
    const layer = node.dataset.layer;
    const content = layerContent[layer];
    if (!content || !readoutLabel || !readout) return;

    systemNodes.forEach((item) => item.classList.remove("is-active"));
    node.classList.add("is-active");
    readoutLabel.textContent = content.label;
    readout.textContent = content.text;
  });
});
