const quiz = [
  {
    statement: "La moda italiana è un fenomeno culturale e sociale.",
    answer: "vero",
    explanation: "文章明确说明，意大利时尚是一种文化和社会现象。",
    evidence: "La moda italiana è un fenomeno culturale e sociale."
  },
  {
    statement: "La moda italiana attira turisti solo grazie ai vestiti.",
    answer: "falso",
    explanation: "吸引游客的不只是服装；文章还提到艺术、美食和音乐。",
    evidence: "Insieme all’arte, alla gastronomia e alla musica, attira molti turisti da tutto il mondo."
  },
  {
    statement: "I marchi italiani producono anche borse e profumi.",
    answer: "vero",
    explanation: "文章列出的意大利品牌产品包括包和香水。",
    evidence: "I marchi italiani producono abiti, scarpe, borse, accessori e profumi."
  },
  {
    statement: "Nel corso degli anni, le vendite della moda italiana sono diminuite.",
    answer: "falso",
    explanation: "文章说销售额增加了，而不是减少了。",
    evidence: "Nel corso degli anni, le vendite sono aumentate."
  },
  {
    statement: "Fare shopping in Italia può essere piacevole anche per la bellezza delle città.",
    answer: "vero",
    explanation: "城市里的迷人地点、古迹和古老村镇也让购物更加愉快。",
    evidence: "Lo shopping è reso ancora più piacevole dalle città in cui si fanno gli acquisti."
  },
  {
    statement: "Milano è importante per la moda, ma Firenze non lo è.",
    answer: "falso",
    explanation: "米兰和佛罗伦萨都与时尚密切相关；文章明确说佛罗伦萨也是重要的时尚城市。",
    evidence: "Firenze non è da meno: è una città importante per la moda e per l’artigianato."
  },
  {
    statement: "In alcune città italiane ci sono botteghe artigiane tradizionali.",
    answer: "vero",
    explanation: "文章说威尼斯、那不勒斯和热那亚都有传承悠久的手工作坊。",
    evidence: "A Venezia, Napoli e Genova si trovano botteghe artigiane legate a una lunga tradizione."
  },
  {
    statement: "Negli outlet si possono trovare prodotti di marchi famosi a prezzi competitivi.",
    answer: "vero",
    explanation: "文章说明，奥特莱斯可以买到价格有竞争力的知名品牌商品。",
    evidence: "Chi cerca prodotti di marchi famosi a prezzi competitivi può andare negli outlet."
  }
];

const questionsContainer = document.querySelector("#questions");
const form = document.querySelector("#quiz-form");
const formMessage = document.querySelector("#form-message");
const result = document.querySelector("#result");
const scoreHeading = document.querySelector("#score-heading");
const scoreMessage = document.querySelector("#score-message");
const review = document.querySelector("#review");
const confirmation = document.querySelector("#words-confirmed");
const parte2Button = document.querySelector("#to-parte-2");

function renderQuestions() {
  questionsContainer.innerHTML = quiz.map((item, index) => `
    <fieldset class="question" data-question="${index}">
      <legend>${index + 1}. ${item.statement}</legend>
      <div class="choices">
        <label class="choice"><input type="radio" name="question-${index}" value="vero"> <span>Vero</span></label>
        <label class="choice"><input type="radio" name="question-${index}" value="falso"> <span>Falso</span></label>
      </div>
      <p class="status-line" hidden></p>
    </fieldset>
  `).join("");
}

function showParte(number) {
  document.querySelectorAll(".parte").forEach((section) => {
    const isCurrent = Number(section.dataset.parte) === number;
    section.hidden = !isCurrent;
    section.classList.toggle("is-active", isCurrent);
  });

  document.querySelectorAll(".progress-step").forEach((step) => {
    const value = Number(step.dataset.progress);
    step.classList.toggle("is-active", value === number);
    step.classList.toggle("is-complete", value < number);
    if (value === number) step.setAttribute("aria-current", "step");
    else step.removeAttribute("aria-current");
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector(`#parte-${number} h2`).focus?.({ preventScroll: true });
}

confirmation.addEventListener("change", () => {
  parte2Button.disabled = !confirmation.checked;
});

parte2Button.addEventListener("click", () => showParte(2));
document.querySelector("#to-parte-3").addEventListener("click", () => showParte(3));
document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showParte(Number(button.dataset.go)));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const selections = quiz.map((_, index) => form.elements[`question-${index}`].value);
  const firstMissing = selections.findIndex((value) => !value);

  if (firstMissing !== -1) {
    formMessage.textContent = "Completa tutte le domande prima di controllare. 请先完成所有题目。";
    formMessage.hidden = false;
    document.querySelector(`[data-question="${firstMissing}"]`).scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  formMessage.hidden = true;
  let score = 0;
  const wrongItems = [];

  quiz.forEach((item, index) => {
    const fieldset = document.querySelector(`[data-question="${index}"]`);
    const status = fieldset.querySelector(".status-line");
    const isCorrect = selections[index] === item.answer;
    if (isCorrect) score += 1;
    else wrongItems.push({ ...item, number: index + 1 });

    fieldset.classList.toggle("is-correct", isCorrect);
    fieldset.classList.toggle("is-wrong", !isCorrect);
    status.hidden = false;
    status.textContent = isCorrect ? "✓ Corretto" : "✗ Da rivedere";
  });

  scoreHeading.textContent = `${score} / ${quiz.length}`;
  scoreMessage.textContent = score === quiz.length
    ? "Ottimo lavoro! Tutto corretto! 🎉"
    : `Hai risposto correttamente a ${score} domande su ${quiz.length}. Rivediamo insieme le risposte.`;

  review.innerHTML = wrongItems.length === 0 ? "" : `
    <h3>Risposte da rivedere</h3>
    ${wrongItems.map((item) => `
      <article class="review-item">
        <p><strong>${item.number}. ${item.statement}</strong></p>
        <p class="correct-answer">Risposta corretta: ${item.answer === "vero" ? "Vero" : "Falso"}</p>
        <p>${item.explanation}</p>
        <p class="evidence"><strong>Nel testo:</strong> “${item.evidence}”</p>
      </article>
    `).join("")}
  `;

  result.hidden = false;
  result.focus({ preventScroll: true });
  result.scrollIntoView({ behavior: "smooth", block: "start" });
});

form.addEventListener("keydown", (event) => {
  if (event.key === "Enter") event.preventDefault();
});

document.querySelector("#restart").addEventListener("click", () => {
  form.reset();
  confirmation.checked = false;
  parte2Button.disabled = true;
  result.hidden = true;
  formMessage.hidden = true;
  review.innerHTML = "";
  document.querySelectorAll(".question").forEach((question) => {
    question.classList.remove("is-correct", "is-wrong");
    question.querySelector(".status-line").hidden = true;
  });
  showParte(1);
});

renderQuestions();
