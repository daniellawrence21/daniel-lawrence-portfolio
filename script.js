let content;
let downloads = {};
let focusAreas = [];
let software = [];
let projects = [];
let projectMap = {};

const main = document.querySelector("#main");
const navLinks = document.querySelectorAll("[data-nav]");
const navToggle = document.querySelector(".nav-toggle");
let hasRendered = false;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function tags(tagsList = []) {
  return `<div class="tags">${tagsList.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>`;
}

function list(items = [], className = "split-list") {
  return `<ul class="${className}">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function paragraphs(items = []) {
  return items.map((item) => `<p>${item}</p>`).join("");
}

function heroCarousel(images = []) {
  if (!images.length) return "";

  return `
    <div class="hero-carousel reveal" data-hero-carousel>
      <div class="hero-carousel-track">
        ${images
          .map(
            (image, index) => `
              <figure class="hero-carousel-slide${index === 0 ? " is-active" : ""}" data-hero-slide="${index}" aria-hidden="${index === 0 ? "false" : "true"}">
                <img src="${image.src}" alt="${image.alt}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async">
              </figure>
            `
          )
          .join("")}
      </div>
      ${images.length > 1
        ? `
          <div class="hero-carousel-dots" aria-label="Home hero image carousel">
            ${images
              .map(
                (_, index) => `
                  <button
                    type="button"
                    class="hero-carousel-dot${index === 0 ? " is-active" : ""}"
                    data-hero-dot="${index}"
                    aria-label="Show hero image ${index + 1} of ${images.length}"
                    aria-pressed="${index === 0 ? "true" : "false"}"
                  ></button>
                `
              )
              .join("")}
          </div>
        `
        : ""}
    </div>
  `;
}

function projectCard(project) {
  return `
    <a class="project-card reveal" href="#project/${project.slug}" data-tags="${(project.tags || []).join(",")}">
      <div class="project-thumb"><img src="${project.hero}" alt="${project.title}" loading="lazy"></div>
      <div class="project-info">
        <p class="project-kicker">${project.type} / ${project.module}</p>
        <h3>${project.title}</h3>
        <div class="meta-row">
          <span>${project.year}</span>
          <span>${project.context}</span>
        </div>
      </div>
    </a>
  `;
}

function cvUnavailableButton(label = "Download CV", className = "btn secondary") {
  return `<a class="${className} cv-unavailable" href="#cv-unavailable">${label}</a>`;
}

function approachItems(items = []) {
  return items.map((item) => `
    <article class="approach-item">
      ${item.eyebrow ? `<p class="eyebrow">${item.eyebrow}</p>` : ""}
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderHome() {
  const home = content.home;
  const featured = projects.map(projectCard).join("");

  main.innerHTML = `
    <section class="hero">
      <div class="inner">
        <div class="hero-copy reveal">
          <p class="eyebrow">${home.eyebrow}</p>
          <h1>${home.name}</h1>
          <div class="title-stack">
            ${(home.titleLines || []).map((line) => `<span>${line}</span>`).join("")}
          </div>
          <div class="hero-text">${paragraphs(home.heroText)}</div>
          <div class="button-row">
            <a class="btn" href="#work">View Selected Work</a>
            ${cvUnavailableButton()}
          </div>
        </div>
      </div>
      <div class="inner">
        <div class="hero-visual-moment reveal">
          ${heroCarousel(home.heroImages || [])}
          <p class="caption">${home.heroCaption}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="inner editorial-grid">
        <div class="section-heading reveal">
          <h2>${home.introTitle}</h2>
        </div>
        <div class="section-body reveal">
          <p class="lead">${home.introLead}</p>
          <p>${home.introText}</p>
        </div>
      </div>
    </section>

    <section class="section band">
      <div class="inner">
        <div class="editorial-grid">
          <div class="section-heading reveal">
            <p class="eyebrow">${home.selectedEyebrow}</p>
            <h2>${home.selectedTitle}</h2>
          </div>
          <div class="section-body reveal">
            <p>${home.selectedText}</p>
          </div>
        </div>
        <div class="project-grid">${featured}</div>
      </div>
    </section>

    <section class="section">
      <div class="inner">
        <div class="editorial-grid">
          <div class="section-heading reveal">
            <p class="eyebrow">${home.approachEyebrow}</p>
            <h2>${home.approachTitle}</h2>
          </div>
          <div class="section-body reveal">
            <p class="lead">${home.approachLead}</p>
          </div>
        </div>
        <div class="approach-grid reveal">${approachItems(home.approachItems)}</div>
      </div>
    </section>

    <section class="section band">
      <div class="inner editorial-grid">
        <div class="section-heading reveal">
          <h2>Areas of Focus</h2>
        </div>
        <div class="section-body reveal">
          ${list(focusAreas)}
          <h3 class="small-title">Software</h3>
          ${list(software)}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="inner identity-preview">
        <div class="identity-graphic reveal">
          <img src="${home.thirdTonePreviewImage.src}" alt="${home.thirdTonePreviewImage.alt}">
        </div>
        <div class="copy-block reveal">
          <p class="eyebrow">${home.thirdTonePreviewEyebrow}</p>
          <h2 class="split-title">${home.thirdTonePreviewTitle}</h2>
          <p class="lead">${home.thirdTonePreviewText}</p>
          <div class="button-row">
            <a class="btn secondary" href="#third-tone">Read About Third Tone</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section band">
      <div class="inner editorial-grid">
        <div class="section-heading reveal">
          <p class="eyebrow">${home.opportunitiesEyebrow}</p>
          <h2>${home.opportunitiesTitle}</h2>
        </div>
        <div class="section-body reveal">
          <p class="lead">${home.opportunitiesText}</p>
          <div class="button-row">
            <a class="btn" href="#contact">Contact Daniel</a>
            <a class="btn secondary" href="${downloads.portfolio}" download>Download Portfolio PDF</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderWork() {
  const work = content.work;
  main.innerHTML = `
    <section class="page-hero">
      <div class="inner">
        <div class="reveal">
          <p class="eyebrow">${work.eyebrow}</p>
          <h1 class="page-title">${work.title}</h1>
        </div>
        <div class="reveal">
          <p class="lead">${work.lead}</p>
          <div class="archive-controls" aria-label="Project filters">
            ${(work.filters || ["All"]).map((filter) => `<button class="filter-button${filter === "All" ? " active" : ""}" type="button" data-filter="${filter}">${filter}</button>`).join("")}
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="inner">
        <div class="project-grid" id="archiveGrid">${projects.map(projectCard).join("")}</div>
      </div>
    </section>
  `;

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      document.querySelectorAll(".project-card").forEach((card) => {
        const show = filter === "All" || card.dataset.tags.includes(filter);
        card.style.display = show ? "grid" : "none";
      });
    });
  });
}

function galleryItemMarkup(item, index) {
  return `
    <figure class="gallery-item reveal">
      <img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async">
    </figure>
  `;
}

function renderGallery() {
  const page = content.gallery;
  const galleryItems = page.items || [];
  const items = (page.items || []).map(galleryItemMarkup).join("");
  const hero = galleryItems[0];

  main.innerHTML = `
    <section class="gallery-viewer" data-gallery-viewer data-gallery-index="0">
      <div class="gallery-stage">
        <figure class="gallery-slide is-active">
          <img data-gallery-image src="${hero?.src || ""}" alt="${hero?.alt || page.title}" loading="eager" decoding="async">
        </figure>
        <button class="gallery-nav-zone is-prev" type="button" data-gallery-prev aria-label="Previous image">
          <span>Previous</span>
        </button>
        <button class="gallery-nav-zone is-next" type="button" data-gallery-next aria-label="Next image">
          <span>Next</span>
        </button>
        <div class="gallery-viewer-meta">
          <p class="eyebrow">${page.eyebrow}</p>
          <p data-gallery-counter>01 / ${String(galleryItems.length).padStart(2, "0")}</p>
        </div>
        <button class="gallery-view-all" type="button" data-gallery-view-all>View all</button>
      </div>
    </section>
    <section class="section gallery-section" data-gallery-grid hidden>
      <div class="inner">
        <div class="gallery-grid">
          ${items}
        </div>
      </div>
    </section>
  `;
}

function renderThirdTone() {
  const page = content.thirdTone;
  main.innerHTML = `
    <section class="page-hero">
      <div class="inner">
        <div class="reveal">
          <p class="eyebrow">${page.eyebrow}</p>
          <h1 class="page-title">${page.title}</h1>
        </div>
        <div class="reveal">
          <p class="lead">${page.lead}</p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="inner tone-feature-image reveal">
        <img src="${page.image.src}" alt="${page.image.alt}">
      </div>
    </section>
    <section class="section">
      <div class="inner philosophy-grid">
        <div class="tone-graphic reveal">
          <img src="${page.graphic.src}" alt="${page.graphic.alt}">
        </div>
        <div class="copy-block reveal">
          ${paragraphs(page.paragraphs)}
          <ul class="principles">
            ${(page.principles || []).map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      </div>
    </section>
    <section class="section band">
      <div class="inner">
        <div class="approach-grid reveal">${approachItems(page.approachItems)}</div>
      </div>
    </section>
  `;
}

function renderInfoStrip(strip) {
  const body = strip.items ? list(strip.items, "") : `<p>${strip.text}</p>`;
  return `
    <article class="info-strip">
      <h3 class="small-title">${strip.title}</h3>
      ${body}
    </article>
  `;
}

function renderAbout() {
  const page = content.about;
  main.innerHTML = `
    <section class="page-hero">
      <div class="inner">
        <div class="reveal">
          <p class="eyebrow">${page.eyebrow}</p>
          <h1 class="page-title">${page.title}</h1>
        </div>
        <div class="reveal">
          <p class="lead">${page.lead}</p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="inner about-layout">
        <figure class="about-portrait reveal">
          <img src="assets/img/daniel-lawrence-portrait.jpg" alt="Black-and-white portrait of Daniel Lawrence" loading="lazy" decoding="async">
        </figure>
        <div class="copy-block reveal">
          <h2 class="split-title">${page.heading}</h2>
          ${paragraphs(page.paragraphs)}
          <div class="button-row">
            ${cvUnavailableButton("Download CV", "btn")}
            <a class="btn secondary" href="#contact">Contact Daniel</a>
          </div>
          <div class="info-strips">
            ${(page.infoStrips || []).map(renderInfoStrip).join("")}
            <article class="info-strip">
              <h3 class="small-title">Software</h3>
              <p>${software.join(", ")}.</p>
            </article>
            <article class="info-strip">
              <h3 class="small-title">Downloads</h3>
              <p><a class="cv-unavailable" href="#cv-unavailable">Download CV</a><br><a href="${downloads.portfolio}" download>Download Portfolio PDF</a></p>
            </article>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderContact() {
  const page = content.contactPage;
  const contact = content.contact;

  main.innerHTML = `
    <section class="page-hero contact-hero">
      <div class="inner">
        <div class="reveal">
          <p class="eyebrow">${page.eyebrow}</p>
          <h1 class="page-title">${page.title}</h1>
        </div>
        <div class="reveal">
          <p class="lead">${page.lead}</p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="inner contact-layout">
        <div class="copy-block reveal">
          <h2 class="split-title">${page.heading}</h2>
          <p>${page.note}</p>
          <div class="contact-list">
            <p><span>Location</span><span>${contact.location}</span></p>
            <a href="mailto:${contact.email}"><span>Email</span><span>${contact.email}</span></a>
            <a href="${contact.instagram}" target="_blank" rel="noreferrer"><span>Instagram</span><span>Open link</span></a>
            <a href="${contact.linkedin}" target="_blank" rel="noreferrer"><span>LinkedIn</span><span>Open link</span></a>
            <a href="${contact.behance}" target="_blank" rel="noreferrer"><span>Behance</span><span>Open link</span></a>
            <a href="${contact.thirdToneInstagram}" target="_blank" rel="noreferrer"><span>Third Tone Instagram</span><span>Open link</span></a>
            <a class="cv-unavailable" href="#cv-unavailable"><span>Download CV</span><span>Unavailable</span></a>
            <a href="${downloads.portfolio}" download><span>Download Portfolio PDF</span><span>PDF</span></a>
          </div>
        </div>
        <form class="contact-form reveal" id="contactForm">
          <div class="field">
            <label for="name">Name</label>
            <input id="name" name="name" autocomplete="name" required>
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" autocomplete="email" required>
          </div>
          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" name="message" required></textarea>
          </div>
          <button class="btn" type="submit">Send Enquiry</button>
          <p class="form-note">${page.formNote}</p>
        </form>
      </div>
    </section>
  `;

  document.querySelector("#contactForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name");
    const email = form.get("email");
    const message = form.get("message");
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:${contact.email}?subject=Portfolio enquiry&body=${body}`;
  });
}

function figureMarkup(image) {
  const figureClass = drawingImageClass(image);
  const loading = figureClass === "is-drawing" ? "eager" : "lazy";
  return `
    <figure class="${figureClass}">
      <div class="image-frame"><img src="${image.src}" alt="${image.caption}" loading="${loading}" decoding="async"></div>
      <figcaption>${image.caption}</figcaption>
    </figure>
  `;
}

function drawingImageClass(image) {
  const text = `${image.src || ""} ${image.caption || ""}`;
  return /(technical|drawing|floorplan|\bplan\b|section|sectional|axonometric|\bcad\b)/i.test(text)
    ? "is-drawing"
    : "is-render";
}

function imageGrid(images = []) {
  return images.length ? `<div class="image-grid">${images.map(figureMarkup).join("")}</div>` : "";
}

function renderProject(slug) {
  const project = projectMap[slug] || projects[0];
  const immersiveProjects = new Set(["third-tone-office", "ritual-bathhouse"]);
  const index = projects.findIndex((item) => item.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const conceptImages = project.conceptImages || [];
  const technicalImages = project.technicalImages || project.images.slice(-1);
  const visualImages = project.visualImages || project.images;
  const processImages = project.processImages || [];

  main.innerHTML = `
    <article>
      <section class="case-hero${immersiveProjects.has(project.slug) ? " is-immersive" : ""}">
        <div class="inner">
          <div class="case-hero-media reveal">
            <img src="${project.hero}" alt="${project.title}">
          </div>
          <div class="case-hero-text reveal">
            <div>
              <p class="eyebrow">${project.type} / ${project.module}</p>
              <h1 class="case-title">${project.title}</h1>
              <p class="lead case-summary">${project.summary}</p>
            </div>
            <aside class="case-meta-panel">
              <p><strong>Project type:</strong> ${project.type}</p>
              <p><strong>Year:</strong> ${project.year}</p>
              <p><strong>Module:</strong> ${project.module}</p>
              <p><strong>Role:</strong> ${project.role}</p>
              <p><strong>Tools:</strong> ${project.tools}</p>
              ${tags(project.tags)}
            </aside>
          </div>
        </div>
      </section>

      <section class="section tight">
        <div class="inner">
          ${caseSection("Project Summary", `<p>${project.summary}</p>`)}
          ${caseSection("Brief", `<p>${project.brief}</p>`)}
          ${caseSection("Concept", `<p>${project.concept}</p>${imageGrid(conceptImages)}`)}
          ${caseSection("Design Response", `<p>${project.response}</p>`)}
          ${caseSection("Key Spatial Moves", `<ul class="case-list">${(project.moves || []).map(([title, copy]) => `<li><h3>${title.toUpperCase()}</h3><p>${copy}</p></li>`).join("")}</ul>`)}
          ${caseSection("Material Direction", `<p>${project.material}</p>`)}
          ${caseSection("Technical Development", `<p>${project.technical}</p>${imageGrid(technicalImages)}`)}
          ${caseSection("Visualisation", `<p>${project.visualisation}</p>${imageGrid(visualImages)}`)}
          ${caseSection("Process", `<p>${project.process}</p>${imageGrid(processImages)}`)}
          ${caseSection("Reflection", `<p>${project.reflection}</p>`)}
          <nav class="case-nav reveal" aria-label="Project navigation">
            <a href="#project/${prev.slug}"><span class="eyebrow">Previous Project</span><br>${prev.title}</a>
            <a href="#work"><span class="eyebrow">Return</span><br>Selected Work</a>
            <a href="#project/${next.slug}"><span class="eyebrow">Next Project</span><br>${next.title}</a>
          </nav>
        </div>
      </section>
    </article>
  `;
}

function caseSection(title, body) {
  const copyClass = body.replace(/<[^>]*>/g, "").length > 360 ? "case-copy is-long-form" : "case-copy";
  return `
    <section class="case-section reveal">
      <div class="editorial-grid">
        <h2>${title.toUpperCase()}</h2>
        <div class="${copyClass}">${body}</div>
      </div>
    </section>
  `;
}

function setActiveNav(routeName) {
  const active = routeName.startsWith("project/") ? "work" : routeName || "home";
  navLinks.forEach((link) => link.classList.toggle("active", link.dataset.nav === active));
}

function closeNav() {
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function revealOnScroll() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((item) => observer.observe(item));
}

function route() {
  if (!content) return;

  const routeName = window.location.hash.replace(/^#\/?/, "") || "home";
  const delay = hasRendered ? 120 : 0;
  if (hasRendered) main.classList.add("is-leaving");

  window.setTimeout(() => {
    if (routeName === "home") renderHome();
    else if (routeName === "work") renderWork();
    else if (routeName === "gallery") renderGallery();
    else if (routeName === "third-tone") renderThirdTone();
    else if (routeName === "about") renderAbout();
    else if (routeName === "contact") renderContact();
    else if (routeName.startsWith("project/")) renderProject(routeName.split("/")[1]);
    else renderHome();

    setActiveNav(routeName);
    closeNav();
    window.scrollTo({ top: 0, behavior: "smooth" });
    main.classList.remove("is-leaving");
    revealOnScroll();
    initHeroCarousel();
    initGalleryViewer();
    hasRendered = true;
  }, delay);
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 4200);
}

function initHeroCarousel() {
  const carousel = document.querySelector("[data-hero-carousel]");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll("[data-hero-slide]")];
  const dots = [...carousel.querySelectorAll("[data-hero-dot]")];
  if (slides.length < 2 || !dots.length) return;

  const setActive = (index) => {
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-pressed", String(active));
    });
  };

  setActive(0);

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.heroDot || 0);
      setActive(index);
    });
  });
}

function initGalleryViewer() {
  const viewer = document.querySelector("[data-gallery-viewer]");
  if (!viewer) return;

  const items = content.gallery?.items || [];
  if (!items.length) return;

  const image = viewer.querySelector("[data-gallery-image]");
  const counter = viewer.querySelector("[data-gallery-counter]");
  const grid = document.querySelector("[data-gallery-grid]");
  const viewAll = viewer.querySelector("[data-gallery-view-all]");
  const previous = viewer.querySelector("[data-gallery-prev]");
  const next = viewer.querySelector("[data-gallery-next]");
  let index = 0;

  const setImage = (nextIndex) => {
    index = (nextIndex + items.length) % items.length;
    viewer.dataset.galleryIndex = String(index);
    viewer.classList.add("is-transitioning");
    window.setTimeout(() => {
      image.src = items[index].src;
      image.alt = items[index].alt;
      counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
      viewer.classList.remove("is-transitioning");
    }, 140);
  };

  previous.addEventListener("click", () => setImage(index - 1));
  next.addEventListener("click", () => setImage(index + 1));
  viewAll.addEventListener("click", () => {
    const showingGrid = viewer.classList.toggle("is-grid-open");
    grid.hidden = !showingGrid;
    viewAll.textContent = showingGrid ? "View image" : "View all";
    if (showingGrid) grid.scrollIntoView({ block: "start", behavior: "smooth" });
    else viewer.scrollIntoView({ block: "start", behavior: "smooth" });
  });

  if (window.galleryKeyHandler) document.removeEventListener("keydown", window.galleryKeyHandler);
  window.galleryKeyHandler = (event) => {
    if (!document.querySelector("[data-gallery-viewer]")) return;
    if (event.key === "ArrowLeft") setImage(index - 1);
    if (event.key === "ArrowRight") setImage(index + 1);
  };
  document.addEventListener("keydown", window.galleryKeyHandler);
}

async function loadContent() {
  try {
    const response = await fetch("content.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
    content = await response.json();
    downloads = content.downloads || {};
    focusAreas = content.focusAreas || [];
    software = content.software || [];
    projects = content.projects || [];
    projectMap = Object.fromEntries(projects.map((project) => [project.slug, project]));
    route();
  } catch (error) {
    console.error(error);
    main.innerHTML = `
      <section class="page-hero">
        <div class="inner">
          <div>
            <p class="eyebrow">Content could not load</p>
            <h1 class="page-title">Open the site through the local server.</h1>
          </div>
          <div>
            <p class="lead">The portfolio now reads from content.json. If you opened index.html directly, use http://localhost:4173/ so the browser can load the content file.</p>
          </div>
        </div>
      </section>
    `;
  }
}

navToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".site-nav a")) closeNav();
  if (event.target.closest(".cv-unavailable")) {
    event.preventDefault();
    showToast(content?.cvUnavailableMessage || "CV currently unavailable. For enquiries, please use an alternative contact method.");
  }
});

window.addEventListener("hashchange", route);
loadContent();
