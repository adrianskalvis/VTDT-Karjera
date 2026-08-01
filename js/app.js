import { confidenceText, resultTemplates, uiText } from "../data/content.js";
import {
  ASSESSMENT_VERSION,
  MAX_TIE_BREAKERS,
  findTieBreakerForPair,
  questionById,
  questions,
  tieBreakerQuestionById,
  tieBreakers,
} from "../data/questions.js";
import {
  evaluateAssessment,
  getAnswerContributions,
  getStrongestDimensions,
  replaceAnswer,
  shouldAskTieBreaker,
} from "./scoring.js";

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
  currentQuestionIndex: 0,
  answers: [],
  tieBreakerAnswers: [],
  screen: "start",
  assessmentVersion: ASSESSMENT_VERSION,
});

const isValidAnswer = (answer, lookup) => {
  if (!answer || typeof answer !== "object") return false;
  const question = lookup[answer.questionId];
  return Boolean(
    question && question.options.some((option) => option.id === answer.optionId),
  );
};

const uniqueValidAnswers = (answers, lookup) => {
  if (!Array.isArray(answers)) return [];
  return answers.reduce((valid, answer) => {
    if (!isValidAnswer(answer, lookup)) return valid;
    return replaceAnswer(valid, {
      questionId: answer.questionId,
      optionId: answer.optionId,
    });
  }, []);
};

const hasAllBaseAnswers = (answers) =>
  questions.every((question) =>
    answers.some((answer) => answer.questionId === question.id),
  );

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

    const restored = {
      currentQuestionIndex: Number.isInteger(parsed.currentQuestionIndex)
        ? parsed.currentQuestionIndex
        : 0,
      answers: uniqueValidAnswers(parsed.answers, questionById),
      tieBreakerAnswers: uniqueValidAnswers(
        parsed.tieBreakerAnswers,
        tieBreakerQuestionById,
      ).slice(0, MAX_TIE_BREAKERS),
      screen: parsed.screen,
      assessmentVersion: ASSESSMENT_VERSION,
    };

    if (
      (restored.screen === "results" || restored.screen === "tieBreaker") &&
      !hasAllBaseAnswers(restored.answers)
    ) {
      restored.screen = restored.answers.length ? "question" : "start";
      restored.currentQuestionIndex = Math.min(
        restored.answers.length,
        questions.length - 1,
      );
      restored.tieBreakerAnswers = [];
    }

    const upperBound = restored.screen === "question" ? questions.length - 1 : 1;
    restored.currentQuestionIndex = Math.max(
      0,
      Math.min(restored.currentQuestionIndex, upperBound),
    );
    return restored;
  } catch {
    return createInitialState();
  }
};

let state = loadState();

const persistState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Privātā pārlūkošana vai bloķēta krātuve nedrīkst apturēt testu.
  }
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatIndex = (score) => score.toFixed(1).replace(".", ",");

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
    } else {
      heading.focus();
    }
  });
};

const getAnsweredBaseCount = () =>
  questions.filter((question) =>
    state.answers.some((answer) => answer.questionId === question.id),
  ).length;

const getBaseEvaluation = () =>
  evaluateAssessment({ answers: state.answers, tieBreakerAnswers: [] });

const getActiveTieBreaker = () => {
  const firstTieAnswer = state.tieBreakerAnswers[0];
  if (firstTieAnswer) {
    const exactCollection = tieBreakers.find((collection) =>
      collection.questions.some(
        (question) => question.id === firstTieAnswer.questionId,
      ),
    );
    if (exactCollection) return exactCollection;
  }

  const evaluation = getBaseEvaluation();
  if (!shouldAskTieBreaker(evaluation) || evaluation.ranked.length < 2) return null;
  return findTieBreakerForPair(
    evaluation.ranked[0].profession.id,
    evaluation.ranked[1].profession.id,
  );
};

const updateProgress = () => {
  if (state.screen === "start" || state.screen === "results") {
    progressRegion.hidden = true;
    return;
  }

  progressRegion.hidden = false;
  const answered = getAnsweredBaseCount();
  progressLabel.textContent = uiText.baseProgress(answered, questions.length);
  progressTrack.setAttribute("aria-valuenow", String(answered));
  progressFill.style.width = `${(answered / questions.length) * 100}%`;

  if (state.screen === "tieBreaker") {
    const collection = getActiveTieBreaker();
    const total = Math.min(collection?.questions.length ?? 1, MAX_TIE_BREAKERS);
    questionLabel.textContent = uiText.tieProgress(
      state.currentQuestionIndex + 1,
      total,
    );
  } else {
    questionLabel.textContent = uiText.baseQuestion(
      state.currentQuestionIndex + 1,
      questions.length,
    );
  }
};

const renderStart = () => {
  container.innerHTML = `
    <div class="screen start-screen">
      <span class="start-symbol" aria-hidden="true">✦</span>
      <p class="eyebrow">${escapeHtml(uiText.eyebrow)}</p>
      <h2 tabindex="-1" data-screen-heading>${escapeHtml(uiText.introductionTitle)}</h2>
      <p class="start-copy">${escapeHtml(uiText.introduction)}</p>
      <ul class="principles">
        ${uiText.startPrinciples
          .map(
            ({ title, description }) =>
              `<li><strong>${escapeHtml(title)}</strong>${escapeHtml(description)}</li>`,
          )
          .join("")}
      </ul>
      <div>
        <button class="button button-primary" type="button" data-action="start">
          ${escapeHtml(uiText.start)} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  `;
  announce(uiText.introductionTitle);
};

const renderOptions = (question, selectedOptionId, source) =>
  question.options
    .map(
      (option, index) => `
        <li>
          <button
            class="option-button"
            type="button"
            data-answer-source="${source}"
            data-option-id="${escapeHtml(option.id)}"
            aria-pressed="${selectedOptionId === option.id}"
          >
            <span class="option-number" aria-hidden="true">${index + 1}</span>
            <span class="option-label">${escapeHtml(option.label)}</span>
            <span class="option-check" aria-hidden="true">✓</span>
          </button>
        </li>
      `,
    )
    .join("");

const renderQuestionScreen = ({ question, index, total, source }) => {
  const answers = source === "base" ? state.answers : state.tieBreakerAnswers;
  const selectedOptionId = answers.find(
    (answer) => answer.questionId === question.id,
  )?.optionId;
  const isTieBreaker = source === "tie";
  const descriptionId = question.helperText
    ? `${question.id}-helper`
    : isTieBreaker
      ? "tie-question-helper"
      : undefined;

  container.innerHTML = `
    <div class="screen question-screen">
      ${isTieBreaker ? `<p id="tie-question-helper" class="tie-intro">${escapeHtml(uiText.tieIntro)}</p>` : ""}
      <p class="question-kicker">
        ${escapeHtml(isTieBreaker ? uiText.tieProgress(index + 1, total) : uiText.baseQuestion(index + 1, total))}
      </p>
      <h2
        class="question-title"
        tabindex="-1"
        data-screen-heading
        ${descriptionId ? `aria-describedby="${descriptionId}"` : ""}
      >${escapeHtml(question.prompt)}</h2>
      ${question.helperText ? `<p id="${question.id}-helper" class="question-helper">${escapeHtml(question.helperText)}</p>` : ""}
      <ol class="options-list" aria-label="${escapeHtml(uiText.optionsAriaLabel)}">
        ${renderOptions(question, selectedOptionId, source)}
      </ol>
      <div class="question-footer">
        <button class="button button-quiet button-small" type="button" data-action="back">
          <span aria-hidden="true">←</span> ${escapeHtml(uiText.back)}
        </button>
        <p class="keyboard-hint">${escapeHtml(uiText.keyboardHint)}</p>
      </div>
    </div>
  `;

  announce(
    isTieBreaker
      ? resultTemplates.liveTieQuestion({ current: index + 1, total, prompt: question.prompt })
      : resultTemplates.liveQuestion({ current: index + 1, total, prompt: question.prompt }),
  );
};

const renderBaseQuestion = () => {
  const question = questions[state.currentQuestionIndex];
  renderQuestionScreen({
    question,
    index: state.currentQuestionIndex,
    total: questions.length,
    source: "base",
  });
};

const renderTieBreaker = () => {
  const collection = getActiveTieBreaker();
  if (!collection) {
    state.screen = "results";
    state.currentQuestionIndex = questions.length - 1;
    persistState();
    render();
    return;
  }

  const total = Math.min(collection.questions.length, MAX_TIE_BREAKERS);
  const index = Math.min(state.currentQuestionIndex, total - 1);
  state.currentQuestionIndex = index;
  renderQuestionScreen({
    question: collection.questions[index],
    index,
    total,
    source: "tie",
  });
};

const renderScore = (score) => `${formatIndex(score)} / 100`;

const renderSecondaryCard = (result, rank, evaluation) => {
  const dimensionsForResult = getStrongestDimensions(evaluation, result, 2);
  const reason = resultTemplates.secondaryReason({
    dimensionLabels: dimensionsForResult.map(({ dimension }) =>
      dimension.shortLabel.toLowerCase(),
    ),
  });
  return `
    <article class="secondary-card">
      <div class="secondary-head">
        <span class="secondary-rank">${escapeHtml(
          evaluation.exactTopTie && rank === 2
            ? uiText.sharedPrimaryRank
            : `#${rank}`,
        )}</span>
        <span class="secondary-score" aria-label="${escapeHtml(uiText.indexLabel)} ${escapeHtml(renderScore(result.score))}">
          ${escapeHtml(formatIndex(result.score))}
        </span>
      </div>
      <h3>${escapeHtml(result.profession.title)}</h3>
      <p class="sector-label">${escapeHtml(result.profession.sector)}</p>
      <p>${escapeHtml(reason)}</p>
      <a
        class="button button-secondary button-small"
        href="${escapeHtml(result.profession.officialUrl)}"
        target="_blank"
        rel="noopener noreferrer"
      >${escapeHtml(uiText.secondaryAtVtdt)} <span aria-hidden="true">↗</span></a>
    </article>
  `;
};

const renderWhyPanel = (evaluation, primaryResult) => {
  const strongest = getStrongestDimensions(evaluation, primaryResult, 4);
  if (!strongest.length) return "";

  return `
    <section class="why-panel" aria-labelledby="why-title">
      <h3 id="why-title">${escapeHtml(uiText.whyTitle)}</h3>
      <p>${escapeHtml(uiText.whyIntro)}</p>
      <ul class="dimension-list">
        ${strongest
          .map(({ dimension, evidence }) => {
            const strength = Math.max(8, Math.round(evidence * 100));
            return `
              <li>
                <div class="dimension-head">
                  <span>${escapeHtml(dimension.label)}</span>
                  <span>${strength}% ${escapeHtml(uiText.signalSuffix)}</span>
                </div>
                <div class="dimension-track" aria-hidden="true">
                  <span class="dimension-fill" style="width: ${strength}%"></span>
                </div>
              </li>
            `;
          })
          .join("")}
      </ul>
    </section>
  `;
};

const renderComparison = (topThree) => `
  <section id="comparison-panel" class="comparison-panel" aria-labelledby="comparison-title" hidden>
    <h3 id="comparison-title" tabindex="-1" data-panel-heading>${escapeHtml(uiText.comparisonTitle)}</h3>
    <p>${escapeHtml(uiText.comparisonIntro)}</p>
    <div class="comparison-table-wrap">
      <table class="comparison-table">
        <thead>
          <tr>
            <th scope="col">${escapeHtml(uiText.comparisonColumns.profession)}</th>
            <th scope="col">${escapeHtml(uiText.comparisonColumns.sector)}</th>
            <th scope="col">${escapeHtml(uiText.comparisonColumns.index)}</th>
            <th scope="col">${escapeHtml(uiText.comparisonColumns.environment)}</th>
            <th scope="col">${escapeHtml(uiText.comparisonColumns.vtdt)}</th>
          </tr>
        </thead>
        <tbody>
          ${topThree
            .map(
              (result) => `
                <tr>
                  <th scope="row">${escapeHtml(result.profession.title)}</th>
                  <td>${escapeHtml(result.profession.sector)}</td>
                  <td>${escapeHtml(renderScore(result.score))}</td>
                  <td>${escapeHtml(result.profession.workEnvironment)}</td>
                  <td>
                    <a href="${escapeHtml(result.profession.officialUrl)}" target="_blank" rel="noopener noreferrer">
                      ${escapeHtml(uiText.open)} <span aria-hidden="true">↗</span>
                    </a>
                  </td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </section>
`;

const renderResultActions = (showCompare = true) => `
  <div class="results-actions">
    ${
      showCompare
        ? `<button class="button button-secondary" type="button" data-action="toggle-comparison" aria-controls="comparison-panel" aria-expanded="false">${escapeHtml(uiText.compare)}</button>`
        : ""
    }
    <button class="button button-primary" type="button" data-action="edit-answers">${escapeHtml(uiText.editAnswers)}</button>
    <button class="button button-quiet" type="button" data-action="restart">${escapeHtml(uiText.restart)}</button>
  </div>
`;

const chooseDiverseResults = (ranked) => {
  const chosen = [];
  const sectors = new Set();
  for (const result of ranked) {
    if (!sectors.has(result.profession.sector)) {
      chosen.push(result);
      sectors.add(result.profession.sector);
    }
    if (chosen.length === 3) return chosen;
  }
  for (const result of ranked) {
    if (!chosen.includes(result)) chosen.push(result);
    if (chosen.length === 3) break;
  }
  return chosen;
};

const renderLowInformationResults = (evaluation) => {
  const examples = chooseDiverseResults(evaluation.ranked);
  const confidence = confidenceText[evaluation.confidence.level];

  container.innerHTML = `
    <div class="screen results-screen">
      <header class="results-header">
        <p class="eyebrow">${escapeHtml(uiText.resultEyebrow)}</p>
        <h2 tabindex="-1" data-screen-heading>${escapeHtml(uiText.lowInformationTitle)}</h2>
      </header>
      <p class="result-notice">${escapeHtml(uiText.lowInformation)}</p>
      <p class="confidence-notice">
        <strong>${escapeHtml(uiText.confidenceLabel)}: ${escapeHtml(confidence.label)}</strong>
        — ${escapeHtml(confidence.description)}.
      </p>
      <section aria-labelledby="direction-title">
        <h3 id="direction-title">${escapeHtml(uiText.lowInformationExamples)}</h3>
        <ul class="direction-sectors" aria-label="${escapeHtml(uiText.broadDirectionsAriaLabel)}">
          ${evaluation.broadDirections.map((sector) => `<li>${escapeHtml(sector)}</li>`).join("")}
        </ul>
        <div class="direction-grid">
          ${examples
            .map(
              (result) => `
                <article class="direction-card">
                  <p class="sector-label">${escapeHtml(result.profession.sector)}</p>
                  <h3>${escapeHtml(result.profession.title)}</h3>
                  <p>${escapeHtml(result.profession.description)}</p>
                  <a class="button button-secondary button-small" href="${escapeHtml(result.profession.officialUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(uiText.exploreAtVtdt)} <span aria-hidden="true">↗</span></a>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
      ${renderResultActions(false)}
      <p class="disclaimer">${escapeHtml(uiText.noDefault)} ${escapeHtml(uiText.disclaimer)}</p>
    </div>
  `;

  announce(resultTemplates.liveResult({ title: null, score: null }));
};

const renderStandardResults = (evaluation) => {
  const [primary, second, third] = evaluation.topThree;
  const primaryDimensions = getStrongestDimensions(evaluation, primary, 3);
  const contributions = getAnswerContributions({
    targetProfessionId: primary.profession.id,
    answers: state.answers,
    tieBreakerAnswers: state.tieBreakerAnswers,
    limit: 2,
  });
  const reason = resultTemplates.primaryReason({
    answerStatements: contributions.map(({ answer, questionType }) =>
      resultTemplates.answerStatement({
        answer,
        reverse: questionType === "reverse",
      }),
    ),
    dimensionLabels: primaryDimensions.map(({ dimension }) =>
      dimension.shortLabel.toLowerCase(),
    ),
  });
  const confidence = confidenceText[evaluation.confidence.level];

  container.innerHTML = `
    <div class="screen results-screen">
      <header class="results-header">
        <p class="eyebrow">${escapeHtml(uiText.resultEyebrow)}</p>
        <h2 tabindex="-1" data-screen-heading>${escapeHtml(uiText.resultTitle)}</h2>
      </header>
      ${
        evaluation.exactTopTie
          ? `<p class="result-notice">${escapeHtml(uiText.exactTopTie)}</p>`
          : evaluation.closeResults
            ? `<p class="result-notice">${escapeHtml(uiText.closeResults)}</p>`
            : ""
      }
      <p class="confidence-notice">
        <strong>${escapeHtml(uiText.confidenceLabel)}: ${escapeHtml(confidence.label)}</strong>
        — ${escapeHtml(confidence.description)}.
      </p>
      <article class="primary-result">
        <div class="primary-result-head">
          <div>
            <span class="rank-label">${escapeHtml(
              evaluation.exactTopTie
                ? uiText.sharedPrimaryRank
                : uiText.primaryRank,
            )}</span>
            <h3>${escapeHtml(primary.profession.title)}</h3>
            <p class="sector-label">${escapeHtml(primary.profession.sector)}</p>
          </div>
          <div class="score-orb" style="--score: ${Math.round(primary.score)}" aria-label="${escapeHtml(uiText.indexLabel)} ${escapeHtml(renderScore(primary.score))}">
            <span><strong>${escapeHtml(formatIndex(primary.score))}</strong>${escapeHtml(uiText.indexLabel)}</span>
          </div>
        </div>
        <p class="primary-description">${escapeHtml(primary.profession.description)}</p>
        <p class="personal-reason">${escapeHtml(reason)}</p>
        <div class="result-details-grid">
          <section class="detail-card">
            <h4>${escapeHtml(uiText.aspectsTitle)}</h4>
            <ul>${primary.profession.aspects.map((aspect) => `<li>${escapeHtml(aspect)}</li>`).join("")}</ul>
          </section>
          <section class="detail-card">
            <h4>${escapeHtml(uiText.challengeTitle)}</h4>
            <p>${escapeHtml(primary.profession.challenge)}</p>
          </section>
          <section class="detail-card detail-card-wide">
            <h4>${escapeHtml(uiText.learningTaskTitle)}</h4>
            <p>${escapeHtml(primary.profession.learningTask)}</p>
          </section>
        </div>
        <a class="button button-primary" href="${escapeHtml(primary.profession.officialUrl)}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(uiText.viewAtVtdt)} <span aria-hidden="true">↗</span>
        </a>
      </article>
      <div class="secondary-results">
        ${renderSecondaryCard(second, 2, evaluation)}
        ${renderSecondaryCard(third, 3, evaluation)}
      </div>
      ${renderWhyPanel(evaluation, primary)}
      ${renderComparison(evaluation.topThree)}
      ${renderResultActions(true)}
      <p class="disclaimer">${escapeHtml(uiText.disclaimer)}</p>
    </div>
  `;

  announce(
    evaluation.exactTopTie
      ? resultTemplates.liveTiedResult({
          firstTitle: primary.profession.title,
          secondTitle: second.profession.title,
          score: formatIndex(primary.score),
        })
      : resultTemplates.liveResult({
          title: primary.profession.title,
          score: formatIndex(primary.score),
        }),
  );
};

const renderResults = () => {
  const evaluation = evaluateAssessment({
    answers: state.answers,
    tieBreakerAnswers: state.tieBreakerAnswers,
  });
  if (evaluation.resultMode === "broad") {
    renderLowInformationResults(evaluation);
  } else {
    renderStandardResults(evaluation);
  }
};

function render() {
  updateProgress();
  if (state.screen === "start") renderStart();
  if (state.screen === "question") renderBaseQuestion();
  if (state.screen === "tieBreaker") renderTieBreaker();
  if (state.screen === "results") renderResults();
  focusScreenHeading();
}

const startAssessment = () => {
  state = {
    ...createInitialState(),
    screen: "question",
  };
  persistState();
  render();
};

const finishBaseQuestions = () => {
  const evaluation = getBaseEvaluation();
  const collection =
    shouldAskTieBreaker(evaluation) && evaluation.ranked.length >= 2
      ? findTieBreakerForPair(
          evaluation.ranked[0].profession.id,
          evaluation.ranked[1].profession.id,
        )
      : null;

  if (collection) {
    state.screen = "tieBreaker";
    state.currentQuestionIndex = 0;
  } else {
    state.screen = "results";
    state.currentQuestionIndex = questions.length - 1;
  }
};

const answerBaseQuestion = (optionId) => {
  const question = questions[state.currentQuestionIndex];
  state.answers = replaceAnswer(state.answers, {
    questionId: question.id,
    optionId,
  });
  state.tieBreakerAnswers = [];

  if (state.currentQuestionIndex < questions.length - 1) {
    state.currentQuestionIndex += 1;
  } else {
    finishBaseQuestions();
  }

  persistState();
  render();
};

const answerTieBreaker = (optionId) => {
  const collection = getActiveTieBreaker();
  if (!collection) return;
  const total = Math.min(collection.questions.length, MAX_TIE_BREAKERS);
  const question = collection.questions[state.currentQuestionIndex];
  const questionsThroughCurrent = new Set(
    collection.questions
      .slice(0, state.currentQuestionIndex + 1)
      .map(({ id }) => id),
  );
  state.tieBreakerAnswers = replaceAnswer(
    state.tieBreakerAnswers.filter(({ questionId }) =>
      questionsThroughCurrent.has(questionId),
    ),
    {
      questionId: question.id,
      optionId,
    },
  ).slice(0, MAX_TIE_BREAKERS);

  const evaluation = evaluateAssessment({
    answers: state.answers,
    tieBreakerAnswers: state.tieBreakerAnswers,
  });
  const hasAnother = state.currentQuestionIndex + 1 < total;
  if (hasAnother && shouldAskTieBreaker(evaluation)) {
    state.currentQuestionIndex += 1;
  } else {
    state.screen = "results";
    state.currentQuestionIndex = questions.length - 1;
  }

  persistState();
  render();
};

const goBack = () => {
  if (state.screen === "question") {
    if (state.currentQuestionIndex === 0) {
      state.screen = "start";
    } else {
      state.currentQuestionIndex -= 1;
    }
  } else if (state.screen === "tieBreaker") {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex -= 1;
    } else {
      state.screen = "question";
      state.currentQuestionIndex = questions.length - 1;
    }
  }
  persistState();
  render();
};

const editAnswers = () => {
  if (state.tieBreakerAnswers.length) {
    state.screen = "tieBreaker";
    state.currentQuestionIndex = Math.min(
      state.tieBreakerAnswers.length - 1,
      MAX_TIE_BREAKERS - 1,
    );
  } else {
    state.screen = "question";
    state.currentQuestionIndex = questions.length - 1;
  }
  persistState();
  render();
};

const restartAssessment = () => {
  state = createInitialState();
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Lietotne turpina darboties arī bez krātuves pieejas.
  }
  render();
};

const toggleComparison = (button) => {
  const panel = container.querySelector("#comparison-panel");
  if (!panel) return;
  const willOpen = panel.hidden;
  panel.hidden = !willOpen;
  button.setAttribute("aria-expanded", String(willOpen));
  button.textContent = willOpen ? uiText.hideComparison : uiText.compare;
  if (willOpen) panel.querySelector("[data-panel-heading]")?.focus();
};

container.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !container.contains(button)) return;

  const action = button.dataset.action;
  if (action === "start") startAssessment();
  if (action === "back") goBack();
  if (action === "edit-answers") editAnswers();
  if (action === "restart") restartAssessment();
  if (action === "toggle-comparison") toggleComparison(button);

  if (button.dataset.answerSource === "base") {
    answerBaseQuestion(button.dataset.optionId);
  }
  if (button.dataset.answerSource === "tie") {
    answerTieBreaker(button.dataset.optionId);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
  if (state.screen !== "question" && state.screen !== "tieBreaker") return;
  const index = Number(event.key) - 1;
  if (!Number.isInteger(index) || index < 0 || index > 5) return;
  const buttons = [...container.querySelectorAll("[data-option-id]")];
  if (buttons[index]) {
    event.preventDefault();
    buttons[index].click();
  }
});

render();
