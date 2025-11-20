const subjects = {
  science: {
    id: "science",
    name: "Basic Science",
    scope: "JSS 1 - 3 | Weeks 1-10",
    file: "Basic Science Main/Weeks1-8_Basic_Science_Lesson_Plan_JSS1-3.md",
    color: "#22c55e",
    description:
      "Family Health, Living Things, Family Traits and more with structured weekly objectives and class activities."
  },
  technology: {
    id: "technology",
    name: "Basic Technology",
    scope: "JSS 1 - 3 | Weeks 1-10",
    file: "Basic Technology Main/Weeks1-8_Basic_Technology_Lesson_Plan_JSS1-3.md",
    color: "#38bdf8",
    description:
      "Crafted around drawing, energy conversion, technology and society, with clear behavioural objectives."
  },
  ict: {
    id: "ict",
    name: "Information Technology",
    scope: "JSS 1 - 3 | Weeks 1-10",
    file: "Information Technology Main/Weeks1-8_Information_Technology_Lesson_Plan_JSS1-3.md",
    color: "#fbbf24",
    description:
      "Covers digital literacy, computer fundamentals and productivity tools with progressive lesson flows."
  }
};

const weekListEl = document.querySelector("#week-list");
const subjectListEl = document.querySelector("#subject-list");
const viewerEl = document.querySelector("#viewer");
const subjectNameEl = document.querySelector("#subject-name");
const summaryBadgeEl = document.querySelector("#summary-badge");
const alertEl = document.querySelector("#alert");
const downloadButton = document.querySelector("#download-btn");

function renderSubjectCards(activeId) {
  subjectListEl.innerHTML = "";
  Object.values(subjects).forEach((subject) => {
    const card = document.createElement("article");
    card.className = `subject-card ${activeId === subject.id ? "active" : ""}`;
    card.dataset.subject = subject.id;
    card.innerHTML = `
      <div class="badge" style="background: ${hexToAlpha(subject.color, 0.12)}; color: ${subject.color}">
        <span aria-hidden="true">⬤</span> ${subject.name}
      </div>
      <div class="subject-meta">${subject.scope}</div>
      <p class="subject-description">${subject.description}</p>
    `;
    card.addEventListener("click", () => loadSubject(subject.id));
    subjectListEl.appendChild(card);
  });
}

function hexToAlpha(hex, opacity = 0.12) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function extractWeeks(markdown) {
  const sections = [];
  const regex = /(WEEK\s*\d+[^\n]*)([\s\S]*?)(?=\nWEEK\s*\d+|$)/gi;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const title = match[1].trim();
    const text = `${match[1]}\n${match[2].trim()}`.trim();
    sections.push({ title, text });
  }
  return sections.length ? sections : [{ title: "Full plan", text: markdown }];
}

async function loadSubject(id) {
  const subject = subjects[id];
  if (!subject) return;

  document.querySelectorAll(".subject-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.subject === id);
  });

  subjectNameEl.textContent = `${subject.name} lesson plans (Weeks 1-10)`;
  alertEl.textContent = "Loading lesson plan...";

  try {
    const response = await fetch(encodeURI(subject.file));
    if (!response.ok) throw new Error(`Unable to load ${subject.file}`);
    const markdown = await response.text();

    const weeks = extractWeeks(markdown);
    weekListEl.innerHTML = weeks
      .map((section, index) => `<li>Week ${index + 1}</li>`)
      .join("\n");

    summaryBadgeEl.textContent = `${weeks.length} week-by-week blocks ready for inspectors`;
    alertEl.textContent =
      "Tip: Expand a week below or hit Download PDF to hand over a consolidated copy.";

    renderWeeks(weeks, subject.name);
  } catch (error) {
    alertEl.textContent = "We couldn't load that subject. Please verify the file path.";
    viewerEl.innerHTML = `<div class="alert">${error.message}</div>`;
  }
}

function renderWeeks(weeks, subjectName) {
  viewerEl.innerHTML = "";

  weeks.forEach((section, index) => {
    const details = document.createElement("details");
    details.className = "accordion";
    details.open = index === 0;

    const summary = document.createElement("summary");
    summary.innerHTML = `<span>${section.title || `Week ${index + 1}`}</span><span class="badge">Week ${index + 1}</span>`;

    const body = document.createElement("div");
    body.className = "body markdown-content";
    body.innerHTML = marked.parse(section.text);

    details.appendChild(summary);
    details.appendChild(body);
    viewerEl.appendChild(details);
  });

  downloadButton.onclick = () => handleDownload(subjectName);
}

function handleDownload(subjectName) {
  const target = document.querySelector("#printable");
  if (!target) return;

  const opt = {
    margin: 0.4,
    filename: `${subjectName.toLowerCase().replace(/\s+/g, "-")}-weeks-1-10.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  };

  html2pdf().set(opt).from(target).save();
}

function init() {
  renderSubjectCards("science");
  loadSubject("science");
}

document.addEventListener("DOMContentLoaded", init);
