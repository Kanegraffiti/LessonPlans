const subjects = {
  science: {
    id: "science",
    name: "Basic Science",
    scope: "JSS 1 - 3 | Weeks 1-10",
    file: "2nd Sem Basic Science/Weeks1-8_Basic_Science_Lesson_Plan_JSS1-3.md",
    color: "#22c55e",
    description:
      "Family Health, Living Things, Family Traits and more with structured weekly objectives and class activities."
  },
  technology: {
    id: "technology",
    name: "Basic Technology",
    scope: "JSS 1 - 3 | Weeks 1-10",
    file: "2nd Sem Basic Technology/Weeks1-8_Basic_Technology_Lesson_Plan_JSS1-3.md",
    color: "#38bdf8",
    description:
      "Crafted around drawing, energy conversion, technology and society, with clear behavioural objectives."
  },
  ict: {
    id: "ict",
    name: "Information Technology",
    scope: "JSS 1 - 3 | Weeks 1-10",
    file: "1st Sem Information Technology/Weeks1-8_Information_Technology_Lesson_Plan_JSS1-3.md",
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

const exams = {
  jss1: { id: "jss1", name: "JSS1", file: "Exams/Jss1_Exam.md" },
  jss2: { id: "jss2", name: "JSS2", file: "Exams/Jss2_Exam.md" },
  jss3: { id: "jss3", name: "JSS3", file: "Exams/Jss3_Exam.md" }
};

const revisions = {
  jss1: { id: "jss1", name: "JSS1", file: "Revision/Jss1_Revision.md" },
  jss2: { id: "jss2", name: "JSS2", file: "Revision/Jss2_Revision.md" },
  jss3: { id: "jss3", name: "JSS3", file: "Revision/Jss3_Revision.md" }
};

const examClassButtons = document.querySelector("#exam-class-buttons");
const revisionClassButtons = document.querySelector("#revision-class-buttons");
const examViewer = document.querySelector("#exam-viewer");
const revisionViewer = document.querySelector("#revision-viewer");
const examDownloadBtn = document.querySelector("#exam-download");
const revisionDownloadBtn = document.querySelector("#revision-download");
const examMarkdownLink = document.querySelector("#exam-markdown-link");
const revisionMarkdownLink = document.querySelector("#revision-markdown-link");
const studentTableBody = document.querySelector("#student-table-body");
const saveScoresBtn = document.querySelector("#save-scores");
const clearScoresBtn = document.querySelector("#clear-scores");
const floatingMenu = document.querySelector(".floating-menu");
const floatingMenuItems = document.querySelector(".floating-menu__items");
const floatingMenuToggle = document.querySelector(".floating-menu__toggle");

const navTargets = [
  { id: "viewer", label: "Lesson plans" },
  { id: "exam-panel", label: "Exams" },
  { id: "revision-panel", label: "Revision" },
  { id: "dashboard-panel", label: "Scores dashboard" }
];

const students = [
  { id: "jss1-adeola", name: "Adeola Bello", classLevel: "JSS1" },
  { id: "jss1-chioma", name: "Chioma Okafor", classLevel: "JSS1" },
  { id: "jss1-kunle", name: "Kunle Adebayo", classLevel: "JSS1" },
  { id: "jss1-sarah", name: "Sarah Musa", classLevel: "JSS1" },
  { id: "jss2-ibrahim", name: "Ibrahim Adamu", classLevel: "JSS2" },
  { id: "jss2-lola", name: "Lola Adesina", classLevel: "JSS2" },
  { id: "jss2-gabriel", name: "Gabriel Eze", classLevel: "JSS2" },
  { id: "jss2-ruth", name: "Ruth Johnson", classLevel: "JSS2" },
  { id: "jss2-funmi", name: "Funmi Aluko", classLevel: "JSS2" },
  { id: "jss2-segun", name: "Segun Bakare", classLevel: "JSS2" },
  { id: "jss3-tomiwa", name: "Tomiwa Ajayi", classLevel: "JSS3" },
  { id: "jss3-ifeoma", name: "Ifeoma Nnaji", classLevel: "JSS3" },
  { id: "jss3-michael", name: "Michael Peters", classLevel: "JSS3" }
];

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

function renderClassPills(container, items, activeId, onSelect) {
  if (!container) return;
  container.innerHTML = "";

  Object.values(items).forEach((entry) => {
    const pill = document.createElement("button");
    pill.className = `pill ${entry.id === activeId ? "active" : ""}`;
    pill.type = "button";
    pill.textContent = entry.name;
    pill.addEventListener("click", () => onSelect(entry.id));
    container.appendChild(pill);
  });
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

async function loadExam(id) {
  const exam = exams[id];
  if (!exam) return;

  renderClassPills(examClassButtons, exams, id, loadExam);
  examMarkdownLink.href = exam.file;
  examMarkdownLink.download = `${exam.name}_Exam.md`;
  examDownloadBtn.textContent = `Download ${exam.name} Exam PDF`;

  try {
    const response = await fetch(encodeURI(exam.file));
    if (!response.ok) throw new Error(`Unable to load ${exam.file}`);
    const markdown = await response.text();
    examViewer.innerHTML = marked.parse(markdown);
    examDownloadBtn.onclick = () => downloadSectionAsPdf("exam-panel", `${exam.name.toLowerCase()}-exam.pdf`);
  } catch (error) {
    examViewer.innerHTML = `<div class="alert">${error.message}</div>`;
  }
}

async function loadRevision(id) {
  const revision = revisions[id];
  if (!revision) return;

  renderClassPills(revisionClassButtons, revisions, id, loadRevision);
  revisionMarkdownLink.href = revision.file;
  revisionMarkdownLink.download = `${revision.name}_Revision.md`;
  revisionDownloadBtn.textContent = `Download ${revision.name} Revision PDF`;

  try {
    const response = await fetch(encodeURI(revision.file));
    if (!response.ok) throw new Error(`Unable to load ${revision.file}`);
    const markdown = await response.text();
    revisionViewer.innerHTML = marked.parse(markdown);
    revisionDownloadBtn.onclick = () => downloadSectionAsPdf("revision-panel", `${revision.name.toLowerCase()}-revision.pdf`);
  } catch (error) {
    revisionViewer.innerHTML = `<div class="alert">${error.message}</div>`;
  }
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

  withPdfStyles(() => html2pdf().set(opt).from(target).save());
}

function downloadSectionAsPdf(elementId, filename) {
  const target = document.getElementById(elementId);
  if (!target) return;

  const opt = {
    margin: 0.4,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  };

  withPdfStyles(() => html2pdf().set(opt).from(target).save());
}

function withPdfStyles(action) {
  document.body.classList.add("print-mode");

  const finalize = () => document.body.classList.remove("print-mode");
  const result = action();

  if (result && typeof result.then === "function") {
    result.then(finalize).catch(finalize);
  } else {
    finalize();
  }
}

function initFloatingMenu() {
  if (!floatingMenu || !floatingMenuItems || !floatingMenuToggle) return;

  navTargets.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "floating-menu__item";
    button.textContent = entry.label;
    button.addEventListener("click", () => {
      const target = document.getElementById(entry.id);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeFloatingMenu();
    });
    floatingMenuItems.appendChild(button);
  });

  floatingMenuToggle.addEventListener("click", () => {
    const isExpanded = floatingMenuToggle.getAttribute("aria-expanded") === "true";
    floatingMenuToggle.setAttribute("aria-expanded", String(!isExpanded));
    floatingMenuItems.hidden = isExpanded;
  });

  document.addEventListener("click", (event) => {
    if (!floatingMenu.contains(event.target)) {
      closeFloatingMenu();
    }
  });
}

function closeFloatingMenu() {
  floatingMenuToggle.setAttribute("aria-expanded", "false");
  floatingMenuItems.hidden = true;
}

function getStoredScores() {
  const raw = localStorage.getItem("studentScores");
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

function updateTotals() {
  students.forEach((student) => {
    const inputs = document.querySelectorAll(`[data-student="${student.id}"]`);
    let total = 0;
    let hasValue = false;

    inputs.forEach((input) => {
      const value = Number.parseFloat(input.value);
      if (!Number.isNaN(value)) {
        total += value;
        hasValue = true;
      }
    });

    const totalCell = document.getElementById(`${student.id}-total`);
    if (totalCell) totalCell.textContent = hasValue ? total : "—";
  });
}

function renderDashboard() {
  if (!studentTableBody) return;
  const stored = getStoredScores();

  studentTableBody.innerHTML = "";

  students.forEach((student) => {
    const row = document.createElement("tr");
    const saved = stored[student.id] || {};
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.classLevel}</td>
      <td><input class="score-input" type="number" min="0" max="100" data-student="${student.id}" data-field="science" value="${saved.science ?? ""}" /></td>
      <td><input class="score-input" type="number" min="0" max="100" data-student="${student.id}" data-field="tech" value="${saved.tech ?? ""}" /></td>
      <td><input class="score-input" type="number" min="0" max="100" data-student="${student.id}" data-field="ict" value="${saved.ict ?? ""}" /></td>
      <td><input class="score-input" type="number" min="0" max="100" data-student="${student.id}" data-field="phe" value="${saved.phe ?? ""}" /></td>
      <td class="total-cell" id="${student.id}-total">—</td>
    `;
    row.querySelectorAll("input").forEach((input) => input.addEventListener("input", updateTotals));
    studentTableBody.appendChild(row);
  });

  updateTotals();
}

function saveScores() {
  const payload = {};

  students.forEach((student) => {
    const entry = {};
    ["science", "tech", "ict", "phe"].forEach((field) => {
      const input = document.querySelector(`[data-student="${student.id}"][data-field="${field}"]`);
      if (input && input.value !== "") {
        entry[field] = Number.parseFloat(input.value);
      }
    });

    payload[student.id] = entry;
  });

  localStorage.setItem("studentScores", JSON.stringify(payload));
}

function clearScores() {
  localStorage.removeItem("studentScores");
  renderDashboard();
}

function init() {
  renderSubjectCards("science");
  loadSubject("science");
  loadExam("jss1");
  loadRevision("jss1");
  renderDashboard();
  initFloatingMenu();

  if (saveScoresBtn) saveScoresBtn.addEventListener("click", saveScores);
  if (clearScoresBtn) clearScoresBtn.addEventListener("click", clearScores);
}

document.addEventListener("DOMContentLoaded", init);
