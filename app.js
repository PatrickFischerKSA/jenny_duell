const storageKey = "jenny-duell-lerneinheit-progress-v1";
const lesson = window.JENNY_DUELL_DATA || { passages: [], questions: [], teacherToolkit: {} };
const structureSpec = {
  thesis: ["ich denke", "ich meine", "zentral ist", "entscheidend ist", "das duell erscheint", "es wirkt", "es ist"],
  evidence: ["im text", "die stelle", "der auszug", "zeigt", "deutlich wird", "man sieht", "der alte graf", "eduard"],
  comparison: ["statt", "während", "im gegensatz", "anders als", "hingegen"],
  nuance: ["jedoch", "allerdings", "zugleich", "nicht nur", "einerseits", "andererseits", "dennoch"],
  conclusion: ["insgesamt", "daher", "somit", "deshalb", "abschliessend", "abschließend", "fazit"]
};

const state = {
  activeStudentId: null,
  activePassageId: lesson.passages[0]?.id || null,
  teacherAccessOpen: false,
  teacherAuthorized: false,
  teacherMode: false,
  showTeacherDashboard: false,
  profiles: {}
};

const elements = {
  startButton: document.getElementById("start-button"),
  teacherToggle: document.getElementById("teacher-toggle"),
  teacherAccessPanel: document.getElementById("teacher-access-panel"),
  studentForm: document.getElementById("student-form"),
  studentNameInput: document.getElementById("student-name-input"),
  studentStatus: document.getElementById("student-status"),
  statsGrid: document.getElementById("stats-grid"),
  passageNav: document.getElementById("passage-nav"),
  lessonPanel: document.getElementById("lesson-panel"),
  questionPanel: document.getElementById("question-panel"),
  teacherPanel: document.getElementById("teacher-panel"),
  teacherDashboard: document.getElementById("teacher-dashboard")
};

function loadStore() {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      profiles: parsed.profiles && typeof parsed.profiles === "object" ? parsed.profiles : {},
      activeStudentId: typeof parsed.activeStudentId === "string" ? parsed.activeStudentId : null,
      teacherAuthorized: Boolean(parsed.teacherAuthorized),
      teacherMode: Boolean(parsed.teacherMode)
    };
  } catch {
    return { profiles: {}, activeStudentId: null, teacherAuthorized: false, teacherMode: false };
  }
}

function saveStore() {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      profiles: state.profiles,
      activeStudentId: state.activeStudentId,
      teacherAuthorized: state.teacherAuthorized,
      teacherMode: state.teacherMode
    })
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slugify(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

function normalizeText(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/[„“"']/g, "")
    .replace(/[-/]/g, " ")
    .replace(/[.,;:!?()[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePasswordEntry(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isTeacherPasswordValid(value = "") {
  return [lesson.teacherPassword, ...(lesson.teacherPasswordAliases || [])].some(
    (entry) => normalizePasswordEntry(entry) === normalizePasswordEntry(value)
  );
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function formatPercent(value) {
  return `${Math.round(value)}%`;
}

function formatDate(value) {
  if (!value) return "noch offen";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "noch offen";
  return date.toLocaleString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function wordCount(value = "") {
  return normalizeText(value).split(" ").filter(Boolean).length;
}

function getPassageById(passageId) {
  return lesson.passages.find((entry) => entry.id === passageId) || lesson.passages[0] || null;
}

function getActivePassage() {
  return getPassageById(state.activePassageId);
}

function getQuestionsForPassage(passageId) {
  return lesson.questions.filter((question) => question.passageId === passageId);
}

function createProfile(name) {
  return {
    id: slugify(name),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    answers: {}
  };
}

function getCurrentProfile() {
  return state.activeStudentId ? state.profiles[state.activeStudentId] || null : null;
}

function getDisplayProfile() {
  const profile = getCurrentProfile();
  if (profile) return profile;
  if (!state.teacherMode) return null;
  return {
    id: "teacher-preview",
    name: "Lehrvorschau",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    answers: {}
  };
}

function getAnswer(questionId, profile = getDisplayProfile()) {
  return profile?.answers?.[questionId] || null;
}

function setAnswer(questionId, payload) {
  const profile = getCurrentProfile();
  if (!profile) return;
  profile.answers ||= {};
  profile.answers[questionId] = payload;
  profile.updatedAt = new Date().toISOString();
  saveStore();
}

function setActiveStudent(name) {
  const trimmed = name.trim().replace(/\s+/g, " ");
  if (!trimmed) return;
  const id = slugify(trimmed);
  if (!state.profiles[id]) {
    state.profiles[id] = createProfile(trimmed);
  } else {
    state.profiles[id].name = trimmed;
    state.profiles[id].updatedAt = new Date().toISOString();
  }
  state.activeStudentId = id;
  elements.studentNameInput.value = trimmed;
  saveStore();
  renderApp();
}

function containsVariant(normalizedAnswer, variant) {
  return normalizedAnswer.includes(normalizeText(variant));
}

function countMatchedConceptGroups(answer, question) {
  const normalizedAnswer = normalizeText(answer);
  const hits = [];
  const missing = [];

  (question.conceptGroups || []).forEach((group) => {
    const matched = group.variants.some((variant) => containsVariant(normalizedAnswer, variant));
    if (matched) hits.push(group.label);
    else missing.push(group.label);
  });

  return { hits, missing };
}

function evaluateStructure(normalizedAnswer, question) {
  const hits = [];
  const missing = [];

  Object.entries(structureSpec).forEach(([group, markers]) => {
    const matched = markers.some((marker) => containsVariant(normalizedAnswer, marker));
    if (matched) hits.push(group);
    else missing.push(group);
  });

  const mandatory = question.structureExpectations?.mandatory || ["thesis", "evidence"];
  const mandatoryMissing = mandatory.filter((entry) => !hits.includes(entry));

  return { hits, missing, mandatoryMissing };
}

function evaluateShortText(question, answer) {
  const trimmed = answer.trim();
  if (!trimmed) {
    return {
      status: "error",
      score: 0,
      title: "Noch keine Antwort",
      body: "Schreibe zuerst eine kurze Erklärung.",
      missing: [],
      strengths: []
    };
  }

  const { hits, missing } = countMatchedConceptGroups(trimmed, question);
  const score = clamp(Math.round((hits.length / question.conceptGroups.length) * 100));
  const success = hits.length >= (question.successThreshold || question.conceptGroups.length);

  return {
    status: success ? "success" : score >= 50 ? "warn" : "error",
    score,
    title: success ? "Textnah und tragfähig" : score >= 50 ? "Teilweise tragfähig" : "Noch zu vage",
    body: success
      ? "Die Antwort trifft die zentralen Sinnschichten der Stelle."
      : "Die Antwort hat einen Kern, sollte aber noch genauer an der Passage arbeiten.",
    missing,
    strengths: hits
  };
}

function evaluateMultiSelect(question, selectedIds) {
  if (!selectedIds.length) {
    return {
      status: "error",
      score: 0,
      title: "Noch nichts markiert",
      body: "Wähle mindestens eine passende Aussage aus.",
      missing: [],
      strengths: []
    };
  }

  const correctSet = new Set(question.correctOptionIds || []);
  const selectedSet = new Set(selectedIds);
  let hits = 0;
  let wrong = 0;

  selectedSet.forEach((id) => {
    if (correctSet.has(id)) hits += 1;
    else wrong += 1;
  });

  const score = clamp(Math.round(((hits - wrong * 0.75) / correctSet.size) * 100));
  const fullyCorrect = hits === correctSet.size && wrong === 0;

  return {
    status: fullyCorrect ? "success" : score >= 55 ? "warn" : "error",
    score,
    title: fullyCorrect ? "Stimmige Analyse" : score >= 55 ? "Teilweise stimmig" : "Noch einmal prüfen",
    body: question.explanation,
    missing: fullyCorrect ? [] : ["Prüfe besonders, wie der alte Graf das Duell nicht verhindert, sondern absichert."],
    strengths: hits ? [`${hits} passende Aussage${hits === 1 ? "" : "n"} erkannt.`] : []
  };
}

function evaluateDragOrder(question, orderedIds) {
  if (!orderedIds.length) {
    return {
      status: "error",
      score: 0,
      title: "Noch nicht geordnet",
      body: "Ordne zuerst die Schritte des Geschehens.",
      missing: [],
      strengths: []
    };
  }

  let correctPositions = 0;
  const misplaced = [];
  orderedIds.forEach((id, index) => {
    if (question.correctOrder[index] === id) {
      correctPositions += 1;
    } else {
      const item = (question.items || []).find((entry) => entry.id === id);
      if (item) misplaced.push(item.label);
    }
  });

  const score = clamp(Math.round((correctPositions / question.correctOrder.length) * 100));
  const fullyCorrect = correctPositions === question.correctOrder.length;

  return {
    status: fullyCorrect ? "success" : score >= 60 ? "warn" : "error",
    score,
    title: fullyCorrect ? "Ablauf stimmig geordnet" : score >= 60 ? "Weitgehend stimmig" : "Reihenfolge noch unsicher",
    body: question.explanation,
    missing: fullyCorrect ? [] : misplaced.slice(0, 3).map((item) => `Noch prüfen: ${item}`),
    strengths: fullyCorrect ? ["Die Eskalationslogik des Ehrenhandels ist sauber nachvollzogen."] : [`${correctPositions} von ${question.correctOrder.length} Positionen stimmen bereits.`]
  };
}

function evaluateOpenAnalysis(question, answer) {
  const trimmed = answer.trim();
  if (!trimmed) {
    return {
      status: "error",
      score: 0,
      title: "Noch keine Deutung",
      body: "Schreibe zuerst eine zusammenhängende Analyse.",
      missing: [],
      strengths: []
    };
  }

  const normalizedAnswer = normalizeText(trimmed);
  const wc = wordCount(trimmed);
  const sourceHits = (question.sourceHints || []).filter((hint) => containsVariant(normalizedAnswer, hint));
  const structure = evaluateStructure(normalizedAnswer, question);
  let conceptHits = 0;
  const strengths = [];
  const missing = [];

  (question.rubric || []).forEach((criterion) => {
    const found = criterion.keywords.some((keyword) => containsVariant(normalizedAnswer, keyword));
    if (found) {
      conceptHits += 1;
      strengths.push(criterion.concept);
    } else {
      missing.push(criterion.concept);
    }
  });

  const targetStructureHits = question.structureExpectations?.targetHits || 4;
  const conceptScore = Math.round((conceptHits / question.rubric.length) * 55);
  const structureScore = Math.round((Math.min(structure.hits.length, targetStructureHits) / targetStructureHits) * 20);
  const sourceScore = Math.min(10, sourceHits.length * 3);
  const lengthScore = Math.min(15, Math.round((wc / question.minWords) * 15));
  let total = clamp(conceptScore + structureScore + sourceScore + lengthScore);

  if (wc < Math.round(question.minWords * 0.7)) total = Math.min(total, 54);
  if (conceptHits < Math.ceil(question.rubric.length / 2)) total = Math.min(total, 59);
  if (structure.mandatoryMissing.length) total = Math.min(total, 64);

  let status = "error";
  let title = "Noch ausbaufähig";
  let body =
    "Die Deutung hat eine Richtung, braucht aber noch klarere historische Einordnung und genaueren Textbezug.";

  if (total >= 85) {
    status = "success";
    title = "Sehr differenziert";
    body =
      "Die Deutung verbindet Textbelege, historischen Kontext und eine klare Problematisierung des Ehrbegriffs.";
  } else if (total >= 68) {
    status = "warn";
    title = "Tragfähige Deutung";
    body =
      "Die Analyse ist stimmig, kann aber noch genauer an einzelnen Formulierungen und am historischen Kontext arbeiten.";
  } else if (total >= 50) {
    status = "warn";
    title = "Teilweise tragfähig";
    body =
      "Wichtige Aspekte sind erkennbar, aber die Antwort bleibt noch zu knapp oder zu allgemein.";
  }

  return {
    status,
    score: total,
    title,
    body,
    missing: [...missing, ...structure.mandatoryMissing.map((item) => `Strukturbaustein: ${item}`)],
    strengths,
    breakdown: [
      `Inhalt: ${conceptHits}/${question.rubric.length} Kriterien`,
      `Struktur: ${structure.hits.length}/${targetStructureHits} Signale`,
      `Textbezug: ${sourceHits.length} Signale`,
      `Umfang: ${wc} Wörter`
    ]
  };
}

function evaluateQuestion(question, userInput) {
  if (question.type === "short-text") {
    return evaluateShortText(question, userInput.answerText || "");
  }
  if (question.type === "multi-select") {
    return evaluateMultiSelect(question, userInput.selectedIds || []);
  }
  if (question.type === "drag-order") {
    return evaluateDragOrder(question, userInput.orderedIds || []);
  }
  return evaluateOpenAnalysis(question, userInput.answerText || "");
}

function isMastered(questionId, profile = getDisplayProfile()) {
  const question = lesson.questions.find((entry) => entry.id === questionId);
  const answer = getAnswer(questionId, profile);
  if (!question || !answer?.result) return false;
  if (question.type === "multi-select" || question.type === "drag-order") {
    return answer.result.score >= 80;
  }
  if (question.type === "open-analysis") {
    return answer.result.score >= 68;
  }
  return answer.result.score >= 68;
}

function getProfileMetrics(profile) {
  const answeredQuestions = lesson.questions.filter((question) => Boolean(getAnswer(question.id, profile)?.result));
  const masteredQuestions = lesson.questions.filter((question) => isMastered(question.id, profile));
  const averageScore = answeredQuestions.length
    ? answeredQuestions.reduce((sum, question) => sum + (getAnswer(question.id, profile)?.result?.score || 0), 0) / answeredQuestions.length
    : 0;

  return {
    answered: answeredQuestions.length,
    mastered: masteredQuestions.length,
    averageScore
  };
}

function renderTeacherToggleButton() {
  if (!state.teacherAuthorized) {
    elements.teacherToggle.textContent = state.teacherAccessOpen
      ? "Lehrerprofil schliessen"
      : "Lehrer*innenzugang";
    return;
  }

  elements.teacherToggle.textContent = state.teacherMode
    ? "Lehreransicht ausblenden"
    : "Lehreransicht einblenden";
}

function renderTeacherAccessPanel() {
  elements.teacherAccessPanel.classList.toggle("hidden", !state.teacherAccessOpen);
  if (!state.teacherAccessOpen) {
    elements.teacherAccessPanel.innerHTML = "";
    return;
  }

  elements.teacherAccessPanel.innerHTML = state.teacherAuthorized
    ? `
      <div class="teacher-access-wrap">
        <div>
          <p class="eyebrow">Lehrer*innenzugang</p>
          <h2>Lehreransicht freigeschaltet</h2>
          <p class="section-copy">
            Das Dashboard ist offen, Musterantworten sind sichtbar und die
            didaktischen Hinweise erscheinen direkt unter der Einheit.
          </p>
        </div>
        <div class="teacher-access-card">
          <p class="teacher-access-state">${state.teacherMode ? "Lehreransicht ist aktiv." : "Lehreransicht ist freigeschaltet, aber ausgeblendet."}</p>
          <div class="teacher-access-actions">
            <button class="btn primary" type="button" id="teacher-mode-activate">
              ${state.teacherMode ? "Lehreransicht aktiv" : "Lehreransicht aktivieren"}
            </button>
            <button class="btn ghost" type="button" id="teacher-mode-exit">Lehreransicht beenden</button>
          </div>
        </div>
      </div>
    `
    : `
      <div class="teacher-access-wrap">
        <div>
          <p class="eyebrow">Lehrer*innenzugang</p>
          <h2>Passwort eingeben</h2>
          <p class="section-copy">
            Nach dem Login werden Lehrerhinweise, Musterantworten und das lokale Dashboard freigeschaltet.
          </p>
        </div>
        <form id="teacher-access-form" class="teacher-access-form">
          <label for="teacher-password-input">Passwort</label>
          <input id="teacher-password-input" name="password" type="password" autocomplete="current-password" placeholder="Passwort eingeben" />
          <div class="teacher-access-actions">
            <button class="btn primary" type="submit">Freischalten</button>
            <button class="btn ghost" type="button" id="teacher-access-cancel">Schliessen</button>
          </div>
          <p class="teacher-access-status" id="teacher-access-status"></p>
        </form>
      </div>
    `;
}

function renderStudentStatus() {
  const profile = getCurrentProfile();
  if (!profile) {
    elements.studentStatus.textContent = "Noch kein Profil aktiv.";
    return;
  }

  const metrics = getProfileMetrics(profile);
  elements.studentStatus.textContent = `${profile.name} aktiv · ${metrics.answered} von ${lesson.questions.length} Fragen bearbeitet.`;
}

function renderStats() {
  const profile = getDisplayProfile();
  const metrics = profile ? getProfileMetrics(profile) : { answered: 0, mastered: 0, averageScore: 0 };

  const cards = [
    {
      label: "Aktives Profil",
      value: profile ? profile.name : "Kein Profil aktiv",
      meta: state.teacherMode ? "Lehreransicht aktiv" : profile ? "Lokal gespeichert" : "Bitte Namen laden"
    },
    {
      label: "Bearbeitet",
      value: `${metrics.answered} / ${lesson.questions.length}`,
      meta: "Fragen mit Rückmeldung"
    },
    {
      label: "Gemeistert",
      value: `${metrics.mastered}`,
      meta: "tragfähige Antworten"
    },
    {
      label: "Durchschnitt",
      value: formatPercent(metrics.averageScore),
      meta: "über alle bearbeiteten Fragen"
    }
  ];

  elements.statsGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="stat-card">
          <span>${escapeHtml(card.label)}</span>
          <strong>${escapeHtml(card.value)}</strong>
          <small>${escapeHtml(card.meta)}</small>
        </article>
      `
    )
    .join("");
}

function renderPassageNav() {
  elements.passageNav.innerHTML = lesson.passages
    .map((passage) => {
      const active = passage.id === state.activePassageId;
      const questions = getQuestionsForPassage(passage.id);
      const solved = questions.filter((question) => isMastered(question.id)).length;

      return `
        <button class="passage-button ${active ? "active" : ""}" type="button" data-passage-id="${escapeHtml(passage.id)}">
          <div class="passage-button-top">
            <span class="passage-step">${escapeHtml(passage.shortLabel)}</span>
            <strong>${escapeHtml(passage.title)}</strong>
          </div>
          <p>${escapeHtml(passage.focus)}</p>
          <div class="passage-button-footer">
            <span>${solved}/${questions.length} gemeistert</span>
            <span>${escapeHtml(questions.length === 1 ? "1 Frage" : `${questions.length} Fragen`)}</span>
          </div>
        </button>
      `;
    })
    .join("");

  elements.passageNav.querySelectorAll("[data-passage-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePassageId = button.dataset.passageId;
      renderApp();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function renderLessonPanel() {
  const passage = getActivePassage();
  const passageIndex = lesson.passages.findIndex((entry) => entry.id === passage.id);

  elements.lessonPanel.innerHTML = `
    <div class="section-head">
      <div>
        <p class="eyebrow">Textfenster ${passageIndex + 1}</p>
        <h2>${escapeHtml(passage.title)}</h2>
      </div>
      <span class="panel-badge">${escapeHtml(passage.focus)}</span>
    </div>
    <p class="section-copy">
      Arbeite möglichst textnah. Die Frageauswertung reagiert auf Sinnvarianten,
      aber die beste Antwort bleibt diejenige, die klar am Wortlaut und an der
      Szene bleibt.
    </p>
    <article class="passage-card">
      <p class="passage-source">${escapeHtml(passage.source)}</p>
      <blockquote class="passage-quote">${escapeHtml(passage.quote)}</blockquote>
    </article>
  `;
}

function getTeacherSummary(question) {
  if (question.type === "multi-select") {
    return "Prüft, ob mehrere Funktionen einer Figur gleichzeitig erkannt werden.";
  }
  if (question.type === "drag-order") {
    return "Sichert den Ablauf des Ehrenhandels und die Eskalationslogik.";
  }
  if (question.type === "open-analysis") {
    return `Transferdiagnose: ${question.rubric.map((entry) => entry.concept).join("; ")}.`;
  }
  return `Begriffsdiagnose: ${question.conceptGroups.map((group) => group.label).join("; ")}.`;
}

function renderFeedback(result) {
  if (!result) {
    return `
      <div class="feedback-box neutral">
        <p class="feedback-title">Noch nicht geprüft</p>
        <div class="feedback-body">Sende die Antwort ab, um sofort Rückmeldung zu erhalten.</div>
      </div>
    `;
  }

  return `
    <div class="feedback-box ${escapeHtml(result.status)}">
      <p class="feedback-title">
        <span>${escapeHtml(result.title)}</span>
        <span>${escapeHtml(formatPercent(result.score))}</span>
      </p>
      <div class="feedback-body">${escapeHtml(result.body)}</div>
      ${
        result.strengths?.length
          ? `<ul class="feedback-list">${result.strengths.map((item) => `<li>Stark: ${escapeHtml(item)}</li>`).join("")}</ul>`
          : ""
      }
      ${
        result.missing?.length
          ? `<ul class="feedback-list">${result.missing.map((item) => `<li>Noch ausbauen: ${escapeHtml(item)}</li>`).join("")}</ul>`
          : ""
      }
      ${
        state.teacherMode && result.breakdown?.length
          ? `<ul class="feedback-breakdown">${result.breakdown.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
          : ""
      }
    </div>
  `;
}

function renderShortTextField(question, answer) {
  const disabled = !getCurrentProfile();
  return `
    <textarea
      class="answer-textarea"
      data-answer-text="${escapeHtml(question.id)}"
      rows="4"
      placeholder="${escapeHtml(question.placeholder || "")}"
      ${disabled ? "disabled" : ""}
    >${escapeHtml(answer?.userInput?.answerText || "")}</textarea>
  `;
}

function renderMultiSelectField(question, answer) {
  const selected = new Set(answer?.userInput?.selectedIds || []);
  const disabled = !getCurrentProfile();

  return `
    <div class="option-list">
      ${question.options
        .map(
          (option) => `
            <label class="option-card">
              <input
                type="checkbox"
                data-multi-option="${escapeHtml(question.id)}"
                value="${escapeHtml(option.id)}"
                ${selected.has(option.id) ? "checked" : ""}
                ${disabled ? "disabled" : ""}
              />
              <span>${escapeHtml(option.label)}</span>
            </label>
          `
        )
        .join("")}
    </div>
  `;
}

function renderDragOrderField(question, answer) {
  const savedOrder = answer?.userInput?.orderedIds || [];
  const itemMap = new Map((question.items || []).map((item) => [item.id, item]));
  const orderedItems = savedOrder.length
    ? savedOrder.map((id) => itemMap.get(id)).filter(Boolean)
    : question.items || [];
  const disabled = !getCurrentProfile();

  return `
    <div class="drag-order ${disabled ? "is-disabled" : ""}" data-drag-question="${escapeHtml(question.id)}">
      ${orderedItems
        .map(
          (item, index) => `
            <div class="drag-card" draggable="${disabled ? "false" : "true"}" data-drag-item-id="${escapeHtml(item.id)}">
              <span class="drag-index">${index + 1}</span>
              <div class="drag-copy">
                <strong>${escapeHtml(item.label)}</strong>
              </div>
              <span class="drag-handle" aria-hidden="true">⋮⋮</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderAnswerField(question, answer) {
  if (question.type === "multi-select") {
    return renderMultiSelectField(question, answer);
  }
  if (question.type === "drag-order") {
    return renderDragOrderField(question, answer);
  }
  return renderShortTextField(question, answer);
}

function renderQuestionCard(question, index) {
  const answer = getAnswer(question.id);
  const disabled = !getCurrentProfile();

  return `
    <article class="question-card ${isMastered(question.id) ? "mastered" : ""}" id="${escapeHtml(question.id)}">
      <div class="question-topline">
        <div>
          <span class="question-type">${escapeHtml(question.challenge)}</span>
          <h3>Frage ${index + 1}: ${escapeHtml(question.prompt)}</h3>
        </div>
        <div class="question-score">${escapeHtml(answer?.result ? formatPercent(answer.result.score) : "offen")}</div>
      </div>
      <p class="question-help">${escapeHtml(question.help)}</p>
      ${renderAnswerField(question, answer)}
      <div class="question-actions">
        <button class="btn primary small" type="button" data-evaluate-question="${escapeHtml(question.id)}" ${disabled ? "disabled" : ""}>
          Antwort prüfen
        </button>
        <button class="btn ghost small" type="button" data-reset-question="${escapeHtml(question.id)}" ${disabled ? "disabled" : ""}>
          Antwort leeren
        </button>
      </div>
      ${renderFeedback(answer?.result)}
      ${
        state.teacherMode
          ? `
            <details class="teacher-inline">
              <summary>Lehrerhinweis und Musterantwort</summary>
              <div class="teacher-inline-body">
                <p><strong>Kommentar:</strong> ${escapeHtml(question.teacherPrompt || getTeacherSummary(question))}</p>
                <p><strong>Musterantwort:</strong> ${escapeHtml(question.modelAnswer)}</p>
                ${
                  question.type === "short-text"
                    ? `<p><strong>Synonymerkennung:</strong> ${escapeHtml(question.conceptGroups.map((group) => group.label).join("; "))}</p>`
                    : ""
                }
              </div>
            </details>
          `
          : ""
      }
    </article>
  `;
}

function renderQuestionPanel() {
  const passage = getActivePassage();
  const questions = getQuestionsForPassage(passage.id);
  const locked = !getCurrentProfile();

  elements.questionPanel.innerHTML = `
    <div class="section-head">
      <div>
        <p class="eyebrow">Analysefragen</p>
        <h2>Textnah arbeiten</h2>
      </div>
      <span class="panel-badge">${escapeHtml(questions.length === 1 ? "1 Aufgabe" : `${questions.length} Aufgaben`)}</span>
    </div>
    ${
      locked
        ? '<p class="section-copy">Bitte zuerst oben ein Profil laden. Im Lehrmodus erscheint hier automatisch eine Vorschau.</p>'
        : '<p class="section-copy">Jede Antwort wird sofort ausgewertet. Bei kurzen Freitexten reagiert die Einheit auf passende Sinnvarianten und Schlüsselbegriffe.</p>'
    }
    <div class="question-list">
      ${questions.map((question, index) => renderQuestionCard(question, index)).join("")}
    </div>
  `;

  bindQuestionEvents();
}

function renderTeacherPanel() {
  if (!state.teacherMode) {
    elements.teacherPanel.classList.add("hidden");
    elements.teacherPanel.innerHTML = "";
    return;
  }

  const toolkit = lesson.teacherToolkit || {};
  elements.teacherPanel.classList.remove("hidden");
  elements.teacherPanel.innerHTML = `
    <details class="teacher-details" open>
      <summary>Lehreransicht dieser Einheit</summary>
      <div class="teacher-details-body">
        <div class="section-head">
          <div>
            <p class="eyebrow">Didaktischer Zugriff</p>
            <h2>Kurzkommentar zur Einheit</h2>
          </div>
          <p class="section-copy">
            Diese kompakte Einheit ist kein allgemeines Lesetool, sondern ein fokussiertes Motivmodul zum Duell.
          </p>
        </div>
        <div class="teacher-grid">
          <article class="teacher-card">
            <h3>Zeitbedarf</h3>
            <p>${escapeHtml(toolkit.duration || "")}</p>
          </article>
          <article class="teacher-card">
            <h3>Sozialformen</h3>
            <ul class="module-list">${(toolkit.socialForms || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </article>
          <article class="teacher-card">
            <h3>Diagnosefokus</h3>
            <ul class="module-list">${(toolkit.assessmentFocus || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </article>
          <article class="teacher-card">
            <h3>Typische Fehlvorstellungen</h3>
            <ul class="module-list">${(toolkit.misconceptions || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </article>
          <article class="teacher-card">
            <h3>Produkt</h3>
            <p>${escapeHtml(toolkit.product || "")}</p>
          </article>
          <article class="teacher-card">
            <h3>Erweiterung</h3>
            <p>${escapeHtml(toolkit.extension || "")}</p>
          </article>
        </div>
      </div>
    </details>
  `;
}

function renderTeacherDashboard() {
  elements.teacherDashboard.classList.toggle("hidden", !state.showTeacherDashboard);
  if (!state.showTeacherDashboard) {
    elements.teacherDashboard.innerHTML = "";
    return;
  }

  const profiles = Object.values(state.profiles).sort((a, b) => a.name.localeCompare(b.name, "de"));
  const averageAcrossProfiles = profiles.length
    ? profiles.reduce((sum, profile) => sum + getProfileMetrics(profile).averageScore, 0) / profiles.length
    : 0;
  const rows = profiles.length
    ? profiles
        .map((profile) => {
          const metrics = getProfileMetrics(profile);
          return `
            <tr>
              <th scope="row">${escapeHtml(profile.name)}</th>
              <td>${metrics.answered}/${lesson.questions.length}</td>
              <td>${metrics.mastered}</td>
              <td>${formatPercent(metrics.averageScore)}</td>
              ${lesson.questions
                .map((question) => `<td>${escapeHtml(getAnswer(question.id, profile)?.result ? formatPercent(getAnswer(question.id, profile).result.score) : "-")}</td>`)
                .join("")}
              <td>${escapeHtml(formatDate(profile.updatedAt))}</td>
            </tr>
          `;
        })
        .join("")
    : `<tr><td colspan="${lesson.questions.length + 5}">Noch keine Schülerprofile auf diesem Gerät gespeichert.</td></tr>`;

  elements.teacherDashboard.innerHTML = `
    <div class="section-head">
      <div>
        <p class="eyebrow">Lehrerdashboard</p>
        <h2>Lokaler Überblick</h2>
      </div>
      <span class="panel-badge">Nur auf diesem Gerät</span>
    </div>
    <div class="teacher-summary-grid">
      <article class="summary-card teacher-summary-card">
        <strong>${profiles.length}</strong>
        <span>Schülerprofile</span>
        <small>lokal gespeichert</small>
      </article>
      <article class="summary-card teacher-summary-card">
        <strong>${formatPercent(averageAcrossProfiles)}</strong>
        <span>Durchschnitt</span>
        <small>über alle Profile</small>
      </article>
      <article class="summary-card teacher-summary-card">
        <strong>${state.teacherMode ? "aktiv" : "passiv"}</strong>
        <span>Lehreransicht</span>
        <small>Musterantworten sichtbar</small>
      </article>
    </div>
    <div class="teacher-table-wrap">
      <table class="teacher-table">
        <thead>
          <tr>
            <th>Schüler*in</th>
            <th>Bearbeitet</th>
            <th>Gemeistert</th>
            <th>Durchschnitt</th>
            ${lesson.questions.map((question, index) => `<th>F${index + 1}</th>`).join("")}
            <th>Zuletzt aktiv</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <section class="teacher-section">
      <div class="section-head compact">
        <div>
          <p class="eyebrow">Musterantworten</p>
          <h3>Fragenübersicht</h3>
        </div>
      </div>
      <div class="solution-grid">
        ${lesson.questions
          .map(
            (question, index) => `
              <article class="solution-card">
                <p class="solution-title">Frage ${index + 1}</p>
                <p class="solution-label">${escapeHtml(question.prompt)}</p>
                <p class="solution-sentence solution-correct">${escapeHtml(question.modelAnswer)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function getUserInput(question, root = document) {
  if (question.type === "multi-select") {
    return {
      selectedIds: Array.from(root.querySelectorAll(`[data-multi-option="${question.id}"]:checked`)).map((input) => input.value)
    };
  }

  if (question.type === "drag-order") {
    return {
      orderedIds: Array.from(root.querySelectorAll(`[data-drag-question="${question.id}"] [data-drag-item-id]`)).map((item) => item.dataset.dragItemId)
    };
  }

  return {
    answerText: root.querySelector(`[data-answer-text="${question.id}"]`)?.value || ""
  };
}

function evaluateAndStore(questionId, root = document) {
  const question = lesson.questions.find((entry) => entry.id === questionId);
  if (!question) return;
  const userInput = getUserInput(question, root);
  const result = evaluateQuestion(question, userInput);
  setAnswer(questionId, { userInput, result });
  renderApp();
  document.getElementById(questionId)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetQuestion(questionId) {
  const profile = getCurrentProfile();
  if (!profile?.answers?.[questionId]) return;
  delete profile.answers[questionId];
  profile.updatedAt = new Date().toISOString();
  saveStore();
  renderApp();
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".drag-card:not(.dragging)")];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
}

function bindDragEvents() {
  elements.questionPanel.querySelectorAll("[data-drag-question]").forEach((container) => {
    let dragged = null;

    container.querySelectorAll(".drag-card").forEach((card) => {
      card.addEventListener("dragstart", () => {
        if (container.classList.contains("is-disabled")) return;
        dragged = card;
        card.classList.add("dragging");
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
        dragged = null;
      });
    });

    container.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (!dragged || container.classList.contains("is-disabled")) return;
      const afterElement = getDragAfterElement(container, event.clientY);
      if (!afterElement) {
        container.appendChild(dragged);
      } else if (afterElement !== dragged) {
        container.insertBefore(dragged, afterElement);
      }
      container.querySelectorAll(".drag-card").forEach((card, index) => {
        const indexEl = card.querySelector(".drag-index");
        if (indexEl) indexEl.textContent = String(index + 1);
      });
    });
  });
}

function bindQuestionEvents() {
  elements.questionPanel.querySelectorAll("[data-evaluate-question]").forEach((button) => {
    button.addEventListener("click", () => {
      evaluateAndStore(button.dataset.evaluateQuestion, elements.questionPanel);
    });
  });

  elements.questionPanel.querySelectorAll("[data-reset-question]").forEach((button) => {
    button.addEventListener("click", () => {
      resetQuestion(button.dataset.resetQuestion);
    });
  });

  bindDragEvents();
}

function renderApp() {
  renderTeacherToggleButton();
  renderTeacherAccessPanel();
  renderStudentStatus();
  renderStats();
  renderPassageNav();
  renderLessonPanel();
  renderQuestionPanel();
  renderTeacherPanel();
  renderTeacherDashboard();
}

function handleStudentSubmit(event) {
  event.preventDefault();
  setActiveStudent(elements.studentNameInput.value);
}

function handleTeacherAccessSubmit(event) {
  event.preventDefault();
  const form = event.target.closest("#teacher-access-form");
  if (!form) return;
  const password = new FormData(form).get("password");
  const status = document.getElementById("teacher-access-status");

  if (!isTeacherPasswordValid(String(password || ""))) {
    if (status) status.textContent = "Das Passwort stimmt noch nicht.";
    return;
  }

  state.teacherAuthorized = true;
  state.teacherMode = true;
  state.showTeacherDashboard = true;
  state.teacherAccessOpen = true;
  saveStore();
  renderApp();
}

function handleTeacherAccessClick(event) {
  if (event.target.closest("#teacher-access-cancel")) {
    state.teacherAccessOpen = false;
    renderApp();
    return;
  }

  if (event.target.closest("#teacher-mode-activate")) {
    state.teacherMode = true;
    state.showTeacherDashboard = true;
    saveStore();
    renderApp();
    return;
  }

  if (event.target.closest("#teacher-mode-exit")) {
    state.teacherMode = false;
    state.showTeacherDashboard = false;
    state.teacherAccessOpen = false;
    saveStore();
    renderApp();
  }
}

elements.studentForm?.addEventListener("submit", handleStudentSubmit);
elements.teacherAccessPanel?.addEventListener("submit", handleTeacherAccessSubmit);
elements.teacherAccessPanel?.addEventListener("click", handleTeacherAccessClick);

elements.teacherToggle?.addEventListener("click", () => {
  if (!state.teacherAuthorized) {
    state.teacherAccessOpen = !state.teacherAccessOpen;
    renderApp();
    return;
  }

  state.teacherMode = !state.teacherMode;
  state.showTeacherDashboard = state.teacherMode;
  saveStore();
  renderApp();
});

elements.startButton?.addEventListener("click", () => {
  document.querySelector(".lesson-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

const persisted = loadStore();
state.profiles = persisted.profiles;
state.activeStudentId = persisted.activeStudentId;
state.teacherAuthorized = persisted.teacherAuthorized;
state.teacherMode = persisted.teacherMode;
state.showTeacherDashboard = persisted.teacherMode;

if (state.activeStudentId && state.profiles[state.activeStudentId]) {
  elements.studentNameInput.value = state.profiles[state.activeStudentId].name;
}

renderApp();
