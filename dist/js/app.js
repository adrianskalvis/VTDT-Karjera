import { confidenceText, resultTemplates, uiText } from "../data/content.js?v=2026.6";
import {
  ANSWER_SCALE,
  ASSESSMENT_MODES,
  ASSESSMENT_VERSION,
  getQuestionsForMode,
  isAnswerId,
  questionById,
  tieBreakerQuestionById,
} from "../data/questions.js?v=2026.6";
import {
  evaluateAssessment,
  getAdaptiveTriggerReasons,
  getStrongestDimensions,
  replaceAnswer,
  selectNextTieBreaker,
  shouldAskTieBreaker,
} from "./scoring.js?v=2026.6";
import { getKeyboardSelection, isSharedLeader } from "./ui-logic.js?v=2026.6";

const STORAGE_KEY = "vtdt-career-assessment";
const VALID_SCREENS = new Set(["start", "question", "tieBreaker", "results"]);

const container = document.querySelector("#question-container");
const liveRegion = document.querySelector("#live-region");
const progressRegion = document.querySelector("#progress-region");
const progressLabel = document.querySelector("#progress-label");
const questionLabel = document.querySelector("#question-label");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");

const createInitialState = () => ({
  mode: null,
  currentQuestionIndex: 0,
  answers: [],
  tieBreakerAnswers: [],
  tieBreakerQuestionIds: [],
  screen: "start",
  assessmentVersion: ASSESSMENT_VERSION,
});

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatIndex = (score) => score.toFixed(1).replace(".", ",");

const truncate = (text, maximum = 160) =>
  text.length <= maximum ? text : `${text.slice(0, maximum - 1).trimEnd()}…`;

const validUniqueAnswers = (answers, validQuestionIds) => {
  if (!Array.isArray(answers)) return [];
  return answers.reduce((result, answer) => {
    if (
      !answer ||
      typeof answer !== "object" ||
      !validQuestionIds.has(answer.questionId) ||
      !isAnswerId(answer.optionId)
    ) {
      return result;
    }
    return replaceAnswer(result, {
      questionId: answer.questionId,
      optionId: answer.optionId,
    });
  }, []);
};

const loadState = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      !parsed ||
      parsed.assessmentVersion !== ASSESSMENT_VERSION ||
      !VALID_SCREENS.has(parsed.screen)
    ) {
      return createInitialState();
    }
    if (parsed.screen !== "start" && !ASSESSMENT_MODES[parsed.mode]) {
      return createInitialState();
    }

    const mode = ASSESSMENT_MODES[parsed.mode] ?? null;
    const baseIds = new Set(mode?.baseQuestionIds ?? []);
    const clarifierIds = Array.isArray(parsed.tieBreakerQuestionIds)
      ? parsed.tieBreakerQuestionIds
          .filter((id) => tieBreakerQuestionById[id])
          .filter((id, index, items) => items.indexOf(id) === index)
          .slice(0, mode?.maxClarifiers ?? 0)
      : [];
    const clarifierIdSet = new Set(clarifierIds);
    const answers = validUniqueAnswers(parsed.answers, baseIds);
    const tieBreakerAnswers = validUniqueAnswers(
      parsed.tieBreakerAnswers,
      clarifierIdSet,
    ).slice(0, clarifierIds.length);

    const restored = {
      mode: mode?.id ?? null,
      currentQuestionIndex: Number.isInteger(parsed.currentQuestionIndex)
        ? parsed.currentQuestionIndex
        : 0,
      answers,
      tieBreakerAnswers,
      tieBreakerQuestionIds: clarifierIds,
      screen: parsed.screen,
      assessmentVersion: ASSESSMENT_VERSION,
    };

    if (restored.screen === "start") return createInitialState();

    const allBaseAnswered = mode.baseQuestionIds.every((id) =>
      answers.some(({ questionId }) => questionId === id),
    );
    if (
      (restored.screen === "tieBreaker" || restored.screen === "results") &&
      !allBaseAnswered
    ) {
      restored.screen = "question";
      restored.tieBreakerAnswers = [];
      restored.tieBreakerQuestionIds = [];
      restored.currentQuestionIndex = Math.max(
        0,
        mode.baseQuestionIds.findIndex(
          (id) => !answers.some(({ questionId }) => questionId === id),
        ),
      );
    }

    const maximumIndex =
      restored.screen === "tieBreaker"
        ? Math.max(0, restored.tieBreakerQuestionIds.length - 1)
        : mode.baseQuestionIds.length - 1;
    restored.currentQuestionIndex = Math.max(
      0,
      Math.min(restored.currentQuestionIndex, maximumIndex),
    );
    return restored;
  } catch {
    return createInitialState();
  }
};

let state = loadState();
let comparisonOpen = false;

const persistState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Bloķēta krātuve nedrīkst apturēt testu.
  }
};

const announce = (message) => {
  liveRegion.textContent = "";
  window.setTimeout(() => {
    liveRegion.textContent = message;
  }, 30);
};

const focusScreenHeading = () => {
  window.requestAnimationFrame(() => {
    const heading = container.querySelector("[data-screen-heading]");
    if (!heading) return;
    if (state.screen === "start") {
      window.scrollTo({ top: 0, behavior: "auto" });
      heading.focus({ preventScroll: true });
      return;
    }
    heading.focus();
  });
};

const getBaseQuestions = () => getQuestionsForMode(state.mode);

const getEvaluation = () =>
  evaluateAssessment({
    answers: state.answers,
    tieBreakerAnswers: state.tieBreakerAnswers,
    baseQuestions: getBaseQuestions(),
  });

const selectedOptionId = (answers, questionId) =>
  answers.find((answer) => answer.questionId === questionId)?.optionId ?? null;

const updateProgress = () => {
  if (state.screen === "start" || state.screen === "results") {
    progressRegion.hidden = true;
    return;
  }
  const mode = ASSESSMENT_MODES[state.mode];
  const baseQuestions = getBaseQuestions();
  const answered = baseQuestions.filter((question) =>
    state.answers.some(({ questionId }) => questionId === question.id),
  ).length;
  progressRegion.hidden = false;
  progressLabel.textContent = uiText.baseProgress(answered, baseQuestions.length);
  progressTrack.setAttribute("aria-valuemax", String(baseQuestions.length));
  progressTrack.setAttribute("aria-valuenow", String(answered));
  progressFill.style.width = `${(answered / baseQuestions.length) * 100}%`;
  questionLabel.textContent =
    state.screen === "tieBreaker"
      ? uiText.tieProgress(state.currentQuestionIndex + 1, mode.maxClarifiers)
      : uiText.baseQuestion(state.currentQuestionIndex + 1, baseQuestions.length);
};

const renderModeBadge = () => {
  const mode = ASSESSMENT_MODES[state.mode];
  return mode
    ? `<p class="selected-mode">${escapeHtml(uiText.selectedMode(mode.title))}</p>`
    : "";
};

const renderStart = () => {
  container.innerHTML = `
    <div class="screen start-screen">
      <span class="start-symbol" aria-hidden="true">✦</span>
      <p class="eyebrow">${escapeHtml(uiText.eyebrow)}</p>
      <h2 tabindex="-1" data-screen-heading>${escapeHtml(uiText.introductionTitle)}</h2>
      <p class="start-copy">${escapeHtml(uiText.introduction)}</p>
      <div class="mode-grid" aria-label="Izvēlies testa režīmu">
        <button class="mode-card mode-card--recommended" type="button" data-action="start-mode" data-mode="quick">
          <span class="mode-badge">${escapeHtml(uiText.modes.quick.badge)}</span>
          <strong>${escapeHtml(uiText.modes.quick.title)}</strong>
          <span>${escapeHtml(uiText.modes.quick.description)}</span>
          <span class="mode-action">${escapeHtml(uiText.modes.quick.action)} <span aria-hidden="true">→</span></span>
        </button>
        <button class="mode-card" type="button" data-action="start-mode" data-mode="deep">
          <strong>${escapeHtml(uiText.modes.deep.title)}</strong>
          <span>${escapeHtml(uiText.modes.deep.description)}</span>
          <span class="mode-action">${escapeHtml(uiText.modes.deep.action)} <span aria-hidden="true">→</span></span>
        </button>
      </div>
      <p class="micro-copy">${escapeHtml(uiText.noDefault)}</p>
    </div>
  `;
  announce(uiText.introductionTitle);
};

const renderOptions = (question, selectedId, source) => `
  <ul class="options options--scale" aria-label="${escapeHtml(uiText.optionsAriaLabel)}">
    ${ANSWER_SCALE.map(
      (option, index) => `
        <li>
          <button
            class="option-button option-button--${escapeHtml(option.id)}"
            type="button"
            data-answer-source="${source}"
            data-option-id="${escapeHtml(option.id)}"
            aria-pressed="${selectedId === option.id}"
            aria-keyshortcuts="${index + 1}"
          >
            <span class="option-number" aria-hidden="true">${index + 1}</span>
            <span class="option-label">${escapeHtml(option.label)}</span>
          </button>
        </li>
      `,
    ).join("")}
  </ul>
`;

const renderQuestion = () => {
  const questions = getBaseQuestions();
  const question = questions[state.currentQuestionIndex];
  const selected = selectedOptionId(state.answers, question.id);
  container.innerHTML = `
    <div class="screen question-screen">
      ${renderModeBadge()}
      <p class="question-kicker">${escapeHtml(
        uiText.baseQuestion(state.currentQuestionIndex + 1, questions.length),
      )}</p>
      <h2 tabindex="-1" data-screen-heading>${escapeHtml(question.prompt)}</h2>
      ${renderOptions(question, selected, "base")}
      <div class="question-footer">
        <button class="button button-secondary" type="button" data-action="back">← ${escapeHtml(uiText.back)}</button>
        <span class="keyboard-hint">${escapeHtml(uiText.keyboardHint)}</span>
      </div>
    </div>
  `;
  announce(
    resultTemplates.liveQuestion({
      current: state.currentQuestionIndex + 1,
      total: questions.length,
      prompt: question.prompt,
    }),
  );
};

const getCurrentTieBreaker = () =>
  tieBreakerQuestionById[state.tieBreakerQuestionIds[state.currentQuestionIndex]];

const renderTieBreaker = () => {
  const mode = ASSESSMENT_MODES[state.mode];
  const question = getCurrentTieBreaker();
  if (!question) {
    showResults();
    return;
  }
  const selected = selectedOptionId(state.tieBreakerAnswers, question.id);
  container.innerHTML = `
    <div class="screen question-screen tie-screen">
      ${renderModeBadge()}
      <p class="question-kicker">${escapeHtml(
        uiText.tieProgress(state.currentQuestionIndex + 1, mode.maxClarifiers),
      )}</p>
      <p class="tie-intro">${escapeHtml(uiText.tieIntro)}</p>
      <h2 tabindex="-1" data-screen-heading>${escapeHtml(question.prompt)}</h2>
      ${renderOptions(question, selected, "tie")}
      <div class="question-footer">
        <button class="button button-secondary" type="button" data-action="back">← ${escapeHtml(uiText.back)}</button>
        <span class="keyboard-hint">${escapeHtml(uiText.keyboardHint)}</span>
      </div>
    </div>
  `;
  announce(
    resultTemplates.liveTieQuestion({
      current: state.currentQuestionIndex + 1,
      total: mode.maxClarifiers,
      prompt: question.prompt,
    }),
  );
};

const reasonFor = (evaluation, result) => {
  const labels = getStrongestDimensions(evaluation, result, 2).map(
    ({ dimension }) => dimension.shortLabel.toLowerCase(),
  );
  return truncate(
    resultTemplates.primaryReason({
      dimensionLabels: labels,
      professionTitle: result.profession.title,
    }),
  );
};

const traitsFor = (evaluation, result) => {
  const traits = getStrongestDimensions(evaluation, result, 2).map(
    ({ dimension }) => dimension.shortLabel,
  );
  return traits.length ? traits : ["Daudzpusīgas intereses", "Atvērta izvēle"];
};

const renderComparison = (evaluation) => {
  if (!comparisonOpen) return "";
  return `
    <section class="comparison-panel" aria-labelledby="comparison-title">
      <div class="section-heading-row">
        <h3 id="comparison-title">Top 3 salīdzinājums</h3>
        <button class="text-button" type="button" data-action="toggle-comparison">${escapeHtml(uiText.hideComparison)}</button>
      </div>
      <div class="comparison-grid">
        ${evaluation.topThree
          .map((result, index) => {
            const tied = isSharedLeader(evaluation, result);
            const traits = traitsFor(evaluation, result);
            return `
              <article class="comparison-card">
                <span class="rank-label">${
                  tied ? escapeHtml(uiText.sharedFirst) : `#${index + 1}`
                }</span>
                <h4>${escapeHtml(result.profession.title)}</h4>
                <p class="sector-label">${escapeHtml(result.profession.sector)}</p>
                <p><strong>${formatIndex(result.score)}</strong> / 100</p>
                <p>${escapeHtml(
                  resultTemplates.secondaryReason({
                    dimensionLabels: traits.map((trait) => trait.toLowerCase()),
                  }),
                )}</p>
                <a href="${escapeHtml(result.profession.officialUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(uiText.viewAtVtdt)} <span aria-hidden="true">↗</span></a>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
};

const renderResultActions = ({ allowUpgrade = false } = {}) => `
  <div class="result-actions">
    ${
      allowUpgrade
        ? `<button class="button button-primary" type="button" data-action="upgrade">${escapeHtml(uiText.upgrade)} <span aria-hidden="true">→</span></button>`
        : ""
    }
    <button class="button button-secondary" type="button" data-action="edit">${escapeHtml(uiText.editAnswers)}</button>
    <button class="text-button" type="button" data-action="restart">${escapeHtml(uiText.restart)}</button>
  </div>
`;

const renderLowInformationResults = (evaluation) => {
  container.innerHTML = `
    <div class="screen results-screen low-information">
      ${renderModeBadge()}
      <p class="eyebrow">${escapeHtml(uiText.resultEyebrow)}</p>
      <h2 tabindex="-1" data-screen-heading>${escapeHtml(uiText.lowInformationTitle)}</h2>
      <p class="result-lead">${escapeHtml(uiText.lowInformation)}</p>
      <ul class="broad-directions" aria-label="${escapeHtml(uiText.broadDirectionsAriaLabel)}">
        ${evaluation.broadDirections.map((sector) => `<li>${escapeHtml(sector)}</li>`).join("")}
      </ul>
      <p class="micro-copy">${escapeHtml(uiText.noDefault)}</p>
      ${renderResultActions({ allowUpgrade: state.mode === "quick" })}
      <p class="disclaimer">${escapeHtml(uiText.disclaimer)}</p>
    </div>
  `;
};

const renderSharedResults = (evaluation) => {
  const leaders = evaluation.sharedLeaders.slice(0, 3);
  container.innerHTML = `
    <div class="screen results-screen">
      ${renderModeBadge()}
      <p class="eyebrow">${escapeHtml(uiText.resultEyebrow)}</p>
      <h2 tabindex="-1" data-screen-heading>${escapeHtml(uiText.sharedResultTitle)}</h2>
      <p class="result-lead">Atšķirība ir mazāka par modeļa praktisko robežu, tāpēc nav mākslīgi izvēlēta viena pirmā vieta.</p>
      <div class="shared-leaders">
        ${leaders
          .map(
            (result) => `
              <article class="shared-leader-card">
                <span class="rank-label">${escapeHtml(uiText.sharedFirst)}</span>
                <h3>${escapeHtml(result.profession.title)}</h3>
                <p>${escapeHtml(result.profession.sector)} · <strong>${formatIndex(result.score)}</strong> / 100</p>
                <a class="button button-link" href="${escapeHtml(result.profession.officialUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(uiText.viewAtVtdt)} <span aria-hidden="true">↗</span></a>
              </article>
            `,
          )
          .join("")}
      </div>
      <button class="button button-secondary" type="button" data-action="toggle-comparison">${escapeHtml(uiText.compare)}</button>
      ${renderComparison(evaluation)}
      <details class="result-details">
        <summary>${escapeHtml(uiText.whyTitle)}</summary>
        <p>${escapeHtml(uiText.whyIntro)}</p>
        <p>Atbilžu skaidrība: ${escapeHtml(confidenceText[evaluation.confidence.level].label)}; izmantoti ${evaluation.confidence.substantive} saturiski signāli.</p>
      </details>
      ${renderResultActions()}
      <p class="disclaimer">${escapeHtml(uiText.disclaimer)}</p>
    </div>
  `;
};

const renderStandardResults = (evaluation) => {
  const primary = evaluation.ranked[0];
  const traits = traitsFor(evaluation, primary);
  const adaptiveReasons = getAdaptiveTriggerReasons(evaluation, state.mode);
  container.innerHTML = `
    <div class="screen results-screen">
      ${renderModeBadge()}
      <p class="eyebrow">${escapeHtml(uiText.resultEyebrow)}</p>
      <article class="profession-card">
        <h2 tabindex="-1" data-screen-heading>${escapeHtml(primary.profession.title)}</h2>
        <p class="sector-label">${escapeHtml(primary.profession.sector)}</p>
        <div class="score-pill"><span>${escapeHtml(uiText.indexLabel)}</span><strong>${formatIndex(primary.score)} / 100</strong></div>
        <p class="result-lead">${escapeHtml(reasonFor(evaluation, primary))}</p>
        <section class="result-summary" aria-label="Galvenā rezultāta kopsavilkums">
          <div>
            <h3>${escapeHtml(uiText.traitsTitle)}</h3>
            <ul class="trait-list">${traits.map((trait) => `<li class="trait-chip">${escapeHtml(trait)}</li>`).join("")}</ul>
          </div>
          <div>
            <h3>${escapeHtml(uiText.workTitle)}</h3>
            <p>${escapeHtml(primary.profession.description)}</p>
          </div>
        </section>
      </article>
      <div class="primary-actions">
        <a class="button button-primary button-link" href="${escapeHtml(primary.profession.officialUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(uiText.viewAtVtdt)} <span aria-hidden="true">↗</span></a>
        <button class="button button-secondary" type="button" data-action="toggle-comparison">${escapeHtml(comparisonOpen ? uiText.hideComparison : uiText.compare)}</button>
      </div>
      ${renderComparison(evaluation)}
      <details class="result-details">
        <summary>${escapeHtml(uiText.whyTitle)}</summary>
        <p>${escapeHtml(uiText.whyIntro)}</p>
        <p>Visvairāk izcēlās ${traits.map(escapeHtml).join(" un ")}; atbilžu skaidrība ir ${escapeHtml(confidenceText[evaluation.confidence.level].label)}.</p>
        ${adaptiveReasons.length ? "<p>Vairāki virzieni palika samērā tuvi, tāpēc ir vērts apskatīt visu Top 3.</p>" : ""}
      </details>
      ${renderResultActions()}
      <p class="disclaimer">${escapeHtml(uiText.disclaimer)}</p>
    </div>
  `;
};

const renderResults = () => {
  const evaluation = getEvaluation();
  if (evaluation.lowInformation) {
    renderLowInformationResults(evaluation);
  } else if (evaluation.sharedFirst) {
    renderSharedResults(evaluation);
  } else {
    renderStandardResults(evaluation);
  }
  const first = evaluation.ranked[0];
  announce(
    resultTemplates.liveResult({
      title: evaluation.leader ? first?.profession.title : null,
      score: first ? formatIndex(first.score) : "",
    }),
  );
};

const render = () => {
  updateProgress();
  if (state.screen === "start") renderStart();
  if (state.screen === "question") renderQuestion();
  if (state.screen === "tieBreaker") renderTieBreaker();
  if (state.screen === "results") renderResults();
  focusScreenHeading();
};

const saveAndRender = () => {
  persistState();
  render();
};

const showResults = () => {
  state.screen = "results";
  comparisonOpen = false;
  saveAndRender();
};

const continueAfterEvaluation = () => {
  const mode = ASSESSMENT_MODES[state.mode];
  const baseQuestions = getBaseQuestions();
  const evaluation = getEvaluation();
  if (
    shouldAskTieBreaker(evaluation, {
      modeId: state.mode,
      askedCount: state.tieBreakerAnswers.length,
    })
  ) {
    const next = selectNextTieBreaker({
      evaluation,
      answers: state.answers,
      tieBreakerAnswers: state.tieBreakerAnswers,
      baseQuestions,
      modeId: state.mode,
    });
    if (next && state.tieBreakerQuestionIds.length < mode.maxClarifiers) {
      state.tieBreakerQuestionIds.push(next.id);
      state.currentQuestionIndex = state.tieBreakerQuestionIds.length - 1;
      state.screen = "tieBreaker";
      saveAndRender();
      return;
    }
  }
  showResults();
};

const startMode = (modeId) => {
  if (!ASSESSMENT_MODES[modeId]) return;
  state = {
    ...createInitialState(),
    mode: modeId,
    screen: "question",
  };
  comparisonOpen = false;
  saveAndRender();
};

const answerBaseQuestion = (optionId) => {
  if (!isAnswerId(optionId)) return;
  const baseQuestions = getBaseQuestions();
  const question = baseQuestions[state.currentQuestionIndex];
  if (!question) return;
  state.answers = replaceAnswer(state.answers, {
    questionId: question.id,
    optionId,
  });
  state.tieBreakerAnswers = [];
  state.tieBreakerQuestionIds = [];
  if (state.currentQuestionIndex < baseQuestions.length - 1) {
    state.currentQuestionIndex += 1;
    saveAndRender();
    return;
  }
  continueAfterEvaluation();
};

const answerTieBreaker = (optionId) => {
  if (!isAnswerId(optionId)) return;
  const question = getCurrentTieBreaker();
  if (!question) return;
  const previous = selectedOptionId(state.tieBreakerAnswers, question.id);
  state.tieBreakerAnswers = replaceAnswer(state.tieBreakerAnswers, {
    questionId: question.id,
    optionId,
  });
  if (previous && previous !== optionId) {
    const keepIds = state.tieBreakerQuestionIds.slice(
      0,
      state.currentQuestionIndex + 1,
    );
    const keep = new Set(keepIds);
    state.tieBreakerQuestionIds = keepIds;
    state.tieBreakerAnswers = state.tieBreakerAnswers.filter(({ questionId }) =>
      keep.has(questionId),
    );
  }
  const nextSavedId = state.tieBreakerQuestionIds[state.currentQuestionIndex + 1];
  if (nextSavedId) {
    state.currentQuestionIndex += 1;
    saveAndRender();
    return;
  }
  continueAfterEvaluation();
};

const goBack = () => {
  if (state.screen === "question") {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex -= 1;
    } else {
      state = createInitialState();
    }
    saveAndRender();
    return;
  }
  if (state.screen === "tieBreaker") {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex -= 1;
    } else {
      state.screen = "question";
      state.currentQuestionIndex = getBaseQuestions().length - 1;
    }
    saveAndRender();
    return;
  }
  if (state.screen === "results") editLastAnswer();
};

const editLastAnswer = () => {
  if (state.tieBreakerQuestionIds.length) {
    state.screen = "tieBreaker";
    state.currentQuestionIndex = state.tieBreakerQuestionIds.length - 1;
  } else {
    state.screen = "question";
    state.currentQuestionIndex = getBaseQuestions().length - 1;
  }
  comparisonOpen = false;
  saveAndRender();
};

const upgradeToDeep = () => {
  state.mode = "deep";
  state.tieBreakerAnswers = [];
  state.tieBreakerQuestionIds = [];
  state.screen = "question";
  const deepQuestions = getQuestionsForMode("deep");
  const firstUnanswered = deepQuestions.findIndex(
    (question) =>
      !state.answers.some(({ questionId }) => questionId === question.id),
  );
  state.currentQuestionIndex = firstUnanswered < 0 ? deepQuestions.length - 1 : firstUnanswered;
  comparisonOpen = false;
  saveAndRender();
};

const restart = () => {
  state = createInitialState();
  comparisonOpen = false;
  saveAndRender();
};

container.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "start-mode") startMode(target.dataset.mode);
  if (action === "back") goBack();
  if (action === "edit") editLastAnswer();
  if (action === "restart") restart();
  if (action === "upgrade") upgradeToDeep();
  if (action === "toggle-comparison") {
    comparisonOpen = !comparisonOpen;
    renderResults();
    window.requestAnimationFrame(() =>
      container.querySelector("[data-action='toggle-comparison']")?.focus(),
    );
  }
  if (target.dataset.answerSource === "base") {
    answerBaseQuestion(target.dataset.optionId);
  }
  if (target.dataset.answerSource === "tie") {
    answerTieBreaker(target.dataset.optionId);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const selection = getKeyboardSelection(state.screen, event.key);
  if (!selection) return;
  if (
    document.activeElement instanceof HTMLInputElement ||
    document.activeElement instanceof HTMLTextAreaElement
  ) {
    return;
  }
  event.preventDefault();
  if (selection.screen === "question") answerBaseQuestion(selection.optionId);
  else if (selection.screen === "tieBreaker") {
    answerTieBreaker(selection.optionId);
  }
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    state = loadState();
    comparisonOpen = false;
    render();
  }
});

render();
