document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  const siteHeader = document.getElementById("siteHeader");
  const navProgress = document.getElementById("navProgress");
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  setupNavigation(siteHeader, navProgress);
  setupAccordion();
  setupNotesCarousel(reducedMotion);
  setupFanCarousel(reducedMotion);

  if (!reducedMotion && window.gsap && window.ScrollTrigger) {
    setupMotion(finePointer);
  } else if (navProgress) {
    setupProgressFallback(navProgress);
  }
});

function setupNavigation(siteHeader, navProgress) {
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    const currentScrollY = window.scrollY;
    const scrollingDown =
      currentScrollY > lastScrollY &&
      currentScrollY > 180 &&
      !siteHeader?.matches(":focus-within");

    siteHeader?.classList.toggle("is-scrolled", currentScrollY > 24);
    siteHeader?.classList.toggle("is-hidden", scrollingDown);
    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true },
  );

  siteHeader?.addEventListener("focusin", () =>
    siteHeader.classList.remove("is-hidden"),
  );

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) return;

        navLinks.forEach((link) => {
          const isCurrent =
            link.getAttribute("href") === `#${visibleEntry.target.id}`;
          if (isCurrent) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        rootMargin: "-28% 0px -56% 0px",
        threshold: [0, 0.1, 0.35],
      },
    );

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  if (window.gsap && window.ScrollTrigger && navProgress) {
    window.gsap.set(navProgress, { scaleX: 0 });
  }
}

function setupProgressFallback(navProgress) {
  const updateProgress = () => {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    navProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
}

function setupFanCarousel(reducedMotion) {
  const carousel = document.getElementById("fanCarousel");
  if (!carousel) return;

  const stage = document.getElementById("fanStage");
  const detailPanel = document.getElementById("fanDetail");
  const dotsContainer = document.getElementById("fanDots");
  const prevBtn = carousel.querySelector('[data-fan="prev"]');
  const nextBtn = carousel.querySelector('[data-fan="next"]');
  if (!stage || !detailPanel || !dotsContainer) return;

  const cards = Array.from(stage.querySelectorAll(".fan-card"));
  if (!cards.length) return;

  const projects = [
    {
      status: "Built in the open",
      title: "Ruhul OS",
      desc: "This portfolio reimagines a personal site as a tactile student workspace, built with semantic HTML, custom CSS, and purposeful motion.",
      tools: ["HTML", "CSS", "JavaScript", "GSAP"],
      link: {
        label: "View source",
        href: "https://github.com/ruhulikram/porto-ruhul",
        external: true,
      },
      accentColor: "#084ac0",
      accentBg: "rgba(18,103,244,0.1)",
    },
    {
      status: "Ongoing role",
      title: "Prestasi Social System",
      desc: "A practical content and visual direction system for a school brand, designed to make planning, publishing, and audience communication more consistent.",
      tools: ["Strategy", "Design", "Social"],
      link: {
        label: "Request walkthrough",
        href: "mailto:ikramruhul@gmail.com?subject=Prestasi%20Social%20System%20walkthrough",
        external: false,
      },
      accentColor: "#6b5000",
      accentBg: "rgba(255,216,61,0.15)",
    },
    {
      status: "Role archive",
      title: "Milenia Editorial Desk",
      desc: "Editorial content shaped across news, social graphics, content planning, and a short podcast-hosting chapter from 2023 to 2026.",
      tools: ["Editing", "Graphics", "Podcast"],
      link: {
        label: "Ask for samples",
        href: "mailto:ikramruhul@gmail.com?subject=Milenia%20Editorial%20Desk%20samples",
        external: false,
      },
      accentColor: "#a63728",
      accentBg: "rgba(255,116,95,0.12)",
    },
    {
      status: "Personal practice",
      title: "Illustration Playground",
      desc: "A place to test character, color, and visual energy without a client brief. These experiments keep the commercial work playful.",
      tools: ["Character", "Color", "Drawing"],
      link: {
        label: "Discuss visual work",
        href: "mailto:ikramruhul@gmail.com?subject=Illustration%20work%20inquiry",
        external: false,
      },
      accentColor: "#246b4d",
      accentBg: "rgba(120,216,167,0.15)",
    },
  ];

  let activeIndex = 0;
  let detailTimer = 0;
  const total = projects.length;

  projects.forEach((project, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "fan-dot";
    dot.setAttribute("aria-label", `Show ${project.title}`);
    dot.addEventListener("click", () => {
      goTo(index);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll(".fan-dot"));

  function getCardState(index) {
    const offset = (index - activeIndex + total) % total;
    if (offset === 0) return "active";
    if (offset === total - 1) return "left";
    if (offset === 1) return "right";
    return "hidden";
  }

  function applyTransforms() {
    cards.forEach((card, i) => {
      const state = getCardState(i);
      const isActive = i === activeIndex;
      const isHidden = state === "hidden";

      card.dataset.state = state;
      card.setAttribute("aria-pressed", String(isActive));
      card.tabIndex = isHidden ? -1 : 0;

      if (isHidden) {
        card.setAttribute("aria-hidden", "true");
      } else {
        card.removeAttribute("aria-hidden");
      }
    });

    dots.forEach((dot, i) => {
      const isActive = i === activeIndex;
      dot.classList.toggle("is-active", isActive);

      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  function buildDetail(project) {
    const toolsHTML = project.tools.map((t) => `<li>${t}</li>`).join("");

    const wordsHTML = project.desc
      .split(" ")
      .map(
        (word, i) =>
          `<span class="fan-detail__word" style="animation-delay:${(i * 0.025).toFixed(3)}s">${word}&nbsp;</span>`,
      )
      .join("");

    const linkAttr = project.link.external
      ? 'target="_blank" rel="noopener noreferrer"'
      : "";

    return `
      <span class="fan-detail__status" style="color:${project.accentColor}; background:${project.accentBg}">${project.status}</span>
      <h3 class="fan-detail__title">${project.title}</h3>
      <p class="fan-detail__desc">${wordsHTML}</p>
      <div class="fan-detail__footer">
        <ul class="project-tools" aria-label="Tools used">${toolsHTML}</ul>
        <a class="project-link" href="${project.link.href}" ${linkAttr}>
          ${project.link.label}
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg>
        </a>
      </div>
    `;
  }

  function updateDetail(immediate = false) {
    window.clearTimeout(detailTimer);

    const render = () => {
      detailPanel.innerHTML = buildDetail(projects[activeIndex]);
      detailPanel.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      detailPanel.style.opacity = "1";
      detailPanel.style.transform = "translateY(0)";
    };

    if (immediate || reducedMotion) {
      render();
      return;
    }

    detailPanel.style.opacity = "0";
    detailPanel.style.transform = "translateY(10px)";
    detailTimer = window.setTimeout(render, 180);
  }

  function goTo(index) {
    const nextIndex = ((index % total) + total) % total;
    if (nextIndex === activeIndex) return;

    activeIndex = nextIndex;
    applyTransforms();
    updateDetail();
  }

  cards.forEach((card, i) => {
    const activateCard = () => {
      if (card.dataset.state !== "active") {
        goTo(i);
      }
    };

    card.addEventListener("click", activateCard);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateCard();
      }
    });
  });

  prevBtn?.addEventListener("click", () => goTo(activeIndex - 1));
  nextBtn?.addEventListener("click", () => goTo(activeIndex + 1));

  carousel.setAttribute("tabindex", "0");
  carousel.addEventListener("keydown", (event) => {
    if (event.target !== carousel) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  });

  applyTransforms();
  updateDetail(true);
}

function setupAccordion() {
  const accordion = document.querySelector("[data-accordion]");
  if (!accordion) return;

  const panels = Array.from(accordion.querySelectorAll(".capability-panel"));
  const buttons = panels.map((panel) =>
    panel.querySelector(".capability-toggle"),
  );

  const activatePanel = (selectedButton) => {
    panels.forEach((panel, index) => {
      const button = buttons[index];
      const content = panel.querySelector(".capability-content");
      const isActive = button === selectedButton;

      panel.classList.toggle("is-active", isActive);
      button.setAttribute("aria-expanded", String(isActive));
      content?.setAttribute("aria-hidden", String(!isActive));
    });
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activatePanel(button));

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      panels[index].addEventListener("pointerenter", () =>
        activatePanel(button),
      );
    }
  });

  activatePanel(
    buttons.find((button) => button.getAttribute("aria-expanded") === "true") ||
      buttons[0],
  );
}

function setupNotesCarousel(reducedMotion) {
  const carousel = document.querySelector(".notes-carousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll("[data-note]"));
  const count = document.getElementById("notesCount");
  const previousButton = carousel.querySelector('[data-carousel="previous"]');
  const nextButton = carousel.querySelector('[data-carousel="next"]');
  let activeIndex = 0;

  const showSlide = (nextIndex, direction) => {
    activeIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    if (count) {
      count.textContent = `${activeIndex + 1} / ${slides.length}`;
    }

    const activeSlide = slides[activeIndex];
    if (!reducedMotion && window.gsap) {
      window.gsap.fromTo(
        activeSlide,
        { autoAlpha: 0, x: direction * 28 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.55,
          ease: "power3.out",
          clearProps: "all",
        },
      );
    }
  };

  previousButton?.addEventListener("click", () =>
    showSlide(activeIndex - 1, -1),
  );
  nextButton?.addEventListener("click", () => showSlide(activeIndex + 1, 1));

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(activeIndex - 1, -1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(activeIndex + 1, 1);
    }
  });
}

function setupMotion(finePointer) {
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".folder-stage", {
    y: 70,
    scale: 0.94,
    duration: 1.05,
    ease: "power3.out",
  });

  gsap.from(".hero-profile > *", {
    y: 18,
    autoAlpha: 0,
    stagger: 0.08,
    delay: 0.28,
    duration: 0.72,
    ease: "power3.out",
    clearProps: "transform,opacity,visibility",
  });

  setupButterflyMotion(gsap);

  gsap.from(".fan-stage-wrapper", {
    y: 80,
    scale: 0.96,
    autoAlpha: 0,
    duration: 1.1,
    ease: "power3.out",
    clearProps: "transform,opacity,visibility",
    scrollTrigger: {
      trigger: ".fan-carousel",
      start: "top 82%",
      once: true,
    },
  });

  gsap.from(".capability-panel", {
    y: 90,
    stagger: 0.12,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".capability-accordion",
      start: "top 82%",
      once: true,
    },
  });

  setupJourneyMotion(gsap, ScrollTrigger);

  gsap.from(".notes-portrait", {
    scale: 0.84,
    rotate: -5,
    ease: "none",
    scrollTrigger: {
      trigger: ".notes-shell",
      start: "top 90%",
      end: "top 38%",
      scrub: 0.7,
    },
  });

  gsap.from(".message-card", {
    y: 90,
    rotate: 9,
    autoAlpha: 0,
    duration: 1.1,
    ease: "back.out(1.3)",
    clearProps: "transform,opacity,visibility",
    scrollTrigger: {
      trigger: ".contact-layout",
      start: "top 72%",
      once: true,
    },
  });

  const navProgress = document.getElementById("navProgress");
  if (navProgress) {
    gsap.to(navProgress, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: "max",
        scrub: 0.2,
      },
    });
  }

  if (finePointer) {
    setupFolderParallax(gsap);
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
      restoreInitialHash();
    });
  } else {
    restoreInitialHash();
  }
}

function setupButterflyMotion(gsap) {
  const hero = document.querySelector(".hero");
  const butterflies = gsap.utils.toArray("[data-butterfly]");

  if (!hero || !butterflies.length) return;

  const configs = {
    primary: {
      scale: 0.82,
      rotation: 18,
      exitX: 1.45,
      exitY: -0.4,
      exitRotation: 45,
      liftOffset: [0.08, -0.1],
    },
    drift: {
      scale: 0.95,
      rotation: -24,
      exitX: -0.45,
      exitY: 1.3,
      exitRotation: -65,
      liftOffset: [-0.12, 0.1],
    },
    dart: {
      scale: 0.72,
      rotation: -12,
      exitX: 1.35,
      exitY: 1.25,
      exitRotation: 30,
      liftOffset: [0.1, 0.08],
    },
    table: {
      scale: 0.85,
      rotation: 15,
      exitX: -0.35,
      exitY: -0.3,
      exitRotation: -55,
      liftOffset: [-0.1, -0.12],
    },
  };

  butterflies.forEach((butterfly) => {
    const name = butterfly.dataset.flight;
    const config = configs[name] || configs.primary;
    const leftWing = butterfly.querySelector(".paper-butterfly__wing--left");
    const rightWing = butterfly.querySelector(".paper-butterfly__wing--right");
    const shadow = butterfly.querySelector(".paper-butterfly__shadow");

    if (!leftWing || !rightWing || !shadow) return;

    const anchorX = () => butterfly.offsetLeft;
    const anchorY = () => butterfly.offsetTop;

    gsap.set(butterfly, {
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
      rotation: config.rotation,
      scale: config.scale,
      autoAlpha: 1,
    });
    gsap.set(leftWing, {
      rotationY: 15,
      rotationZ: -15,
      transformOrigin: "100% 50%",
    });
    gsap.set(rightWing, {
      rotationY: -15,
      rotationZ: 15,
      transformOrigin: "0% 50%",
    });

    // --- IDLE GENTLE AMBIENT FLAP (RESTING FLUTTER ONLY - NO HOVER FLOAT) ---
    const idleFlap = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.4 + Math.random() * 1.2,
    });
    idleFlap
      .to(leftWing, { rotationY: -55, duration: 0.13, ease: "sine.inOut" }, 0)
      .to(rightWing, { rotationY: 55, duration: 0.13, ease: "sine.inOut" }, 0)
      .to(leftWing, { rotationY: -15, duration: 0.18, ease: "sine.out" }, 0.13)
      .to(rightWing, { rotationY: 15, duration: 0.18, ease: "sine.out" }, 0.13)
      .to(
        leftWing,
        { rotationY: -48, duration: 0.11, ease: "sine.inOut" },
        0.48,
      )
      .to(
        rightWing,
        { rotationY: 48, duration: 0.11, ease: "sine.inOut" },
        0.48,
      )
      .to(leftWing, { rotationY: -15, duration: 0.16, ease: "sine.out" }, 0.59)
      .to(rightWing, { rotationY: 15, duration: 0.16, ease: "sine.out" }, 0.59);

    // --- SCROLL TAKEOFF (RANDOMIZED OFF-SCREEN FLIGHT) ---
    const flight = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "top -350px",
        scrub: 0.3,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress > 0.05) {
            idleFlap.pause();
          } else {
            idleFlap.resume();
          }
        },
      },
    });

    // Rapid wing flapping during takeoff
    const flapTimes = [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84];
    flapTimes.forEach((pos) => {
      flight
        .to(
          leftWing,
          { rotationY: -74, duration: 0.05, ease: "power1.in" },
          pos,
        )
        .to(
          rightWing,
          { rotationY: 74, duration: 0.05, ease: "power1.in" },
          pos,
        )
        .to(
          leftWing,
          { rotationY: -10, duration: 0.07, ease: "power1.out" },
          pos + 0.05,
        )
        .to(
          rightWing,
          { rotationY: 10, duration: 0.07, ease: "power1.out" },
          pos + 0.05,
        );
    });

    const liftX = () => hero.clientWidth * config.liftOffset[0];
    const liftY = () => hero.clientHeight * config.liftOffset[1];
    const targetX = () => hero.clientWidth * config.exitX - anchorX();
    const targetY = () => hero.clientHeight * config.exitY - anchorY();

    flight
      .set(butterfly, { autoAlpha: 1 }, 0)
      .to(
        butterfly,
        {
          x: liftX,
          y: liftY,
          rotation: config.rotation + (config.exitX < 0 ? -25 : 25),
          duration: 0.22,
          ease: "power1.out",
        },
        0,
      )
      .to(shadow, { autoAlpha: 0, scale: 0.1, duration: 0.18 }, 0)
      .to(
        butterfly,
        {
          x: targetX,
          y: targetY,
          rotation: config.exitRotation,
          scale: config.scale * 0.35,
          autoAlpha: 0,
          duration: 0.78,
          ease: "power2.in",
        },
        0.22,
      );
  });
}

function restoreInitialHash() {
  if (!window.location.hash) return;

  let targetId;

  try {
    targetId = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return;
  }
  const target = document.getElementById(targetId);
  if (!target) return;

  window.requestAnimationFrame(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    target.scrollIntoView({ block: "start" });
    document.getElementById("siteHeader")?.classList.remove("is-hidden");
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

function setupJourneyMotion(gsap, ScrollTrigger) {
  const journeyCards = gsap.utils.toArray(".timeline-card");
  const media = gsap.matchMedia();

  media.add("(min-width: 981px)", () => {
    ScrollTrigger.create({
      trigger: ".journey-grid",
      start: "top 112px",
      endTrigger: ".journey-stack",
      end: "bottom bottom",
      pin: ".journey-intro",
      pinSpacing: false,
      anticipatePin: 1,
    });
  });

  journeyCards.forEach((card, index) => {
    gsap.fromTo(
      card,
      { y: 80, scale: 0.92 },
      {
        y: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 92%",
          end: "top 58%",
          scrub: 0.65,
        },
      },
    );

    const nextCard = journeyCards[index + 1];
    if (nextCard) {
      gsap.to(card, {
        scale: 0.91,
        y: -22,
        filter: "brightness(0.72)",
        ease: "none",
        scrollTrigger: {
          trigger: nextCard,
          start: "top 80%",
          end: "top 28%",
          scrub: 0.7,
        },
      });
    }
  });
}

function setupFolderParallax(gsap) {
  const stage = document.getElementById("folderStage");
  const folder = document.getElementById("mainFolder");
  if (!stage || !folder) return;

  const rotateX = gsap.quickTo(folder, "rotationX", {
    duration: 0.5,
    ease: "power3.out",
  });
  const rotateY = gsap.quickTo(folder, "rotationY", {
    duration: 0.5,
    ease: "power3.out",
  });
  const moveX = gsap.quickTo(folder, "x", {
    duration: 0.55,
    ease: "power3.out",
  });
  const moveY = gsap.quickTo(folder, "y", {
    duration: 0.55,
    ease: "power3.out",
  });

  stage.addEventListener("pointermove", (event) => {
    const bounds = stage.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateY(horizontal * 7);
    rotateX(vertical * -5);
    moveX(horizontal * 8);
    moveY(vertical * 5);
  });

  stage.addEventListener("pointerleave", () => {
    rotateX(0);
    rotateY(0);
    moveX(0);
    moveY(0);
  });
}
