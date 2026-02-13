// =====================
// 1) Your deck
// =====================
const cards = [
  { front: "San Andreas v. Cooper", back: "Absent lawful justification, possession of a firearm registered to another individual shall constitute improper registration and rise to the level of unlawful possession." },
  { front: "Miranda v. Arizona", back: "Any statement made in custody is admissible in court if the Miranda rights have been stated and dismissed or exercised." },
  { front: "Tennessee v. Garner", back: "A police officer may use deadly force to prevent the escape of a fleeing suspect only if the officer has a good-faith belief that the suspect poses a significant threat of death or serious physical injury to the officer or others." },
  { front: "Terry v. Ohio", back: "An officer with reasonable suspicion and the good faith believe that the suspect is armed and dangerous, may conduct a ‘stop and frisk’ on a suspect without probable cause to arrest.\n\nThe 'Terry Frisk' is a frisk of a person for any weapons that they have on their person." },
  { front: "Pennsylvania v. Mimms", back: "An officer may order a driver out of an automobile after a lawfully detained traffic stop under the justification of officers safety.\n\nOfficers are not required to give any other justification for a detained individual to step out of a vehicle other than for officers safety. So long as the reason for the stop is lawful, this request is a lawful order." },
  { front: "Carroll v. United States", back: "The \"automobile exception\" to the Fourth Amendment's warrant requirement allows warrantless searches of vehicles based on probable cause, due to their mobility.\n\nIf an officer has made the determination that a crime has been, will be, or is being committed based on evidence, facts or circumstances, they can search a vehicle without the need of a search & seizure warrant solely for the piece of evidence related to the crime.\n\nMotorhomes can be searched without the need of a warrant if the officers have PC that there is evidence of a crime in said motorhome. (The exception to this are motorhomes with the lack of wheels that are supported by bricks and/or pillars.)" },
  { front: "Wyoming v. Houghton", back: "Ruled that police officers with probable cause to search a car may also search any container within the vehicle, including those belonging to passengers, that could conceal the object of the search." },
  { front: "United States v. Ross", back: "The court ruled that police officers with probable cause to believe a vehicle contains contraband may conduct a warrantless search of the vehicle, including closed containers, as thorough as a magistrate could authorize with a warrant." },
  { front: "California v. Carney", back: "A motorhome meets the criteria for the automobile exception and may be searched without a warrant if there is probable cause to believe evidence is present within." },
  { front: "United States v. Ludwig", back: "A narcotics dog alert to a defendant's car provided probable cause for a warrantless search of the car's trunk, emphasizing the reliability of dog alerts in establishing probable cause." },
  { front: "Scott v. Harris", back: "A police officer's attempt to terminate a dangerous high-speed car chase, even if it places the fleeing motorist at risk of serious injury or death, does not violate the Fourth Amendment if the officer's actions are objectively reasonable." },
  { front: "Garrity v. New Jersey (Garrity Warning)", back: "Public employees retain their Fifth Amendment right to remain silent and cannot be compelled to give statements that could incriminate them.\n\nStatements compelled under a threat of job loss are inadmissible in a criminal trial.\n\nPublic employees can still be compelled to make statements for internal, administrative purposes, and these compelled statements can be used for disciplinary actions, including termination." },
  { front: "Graham v. Connor", back: "Claims of excessive force by law enforcement during arrests, investigatory stops, or other seizures should be analyzed under the Fourth Amendment's \"objective reasonableness\" standard, not a due process standard." },
  { front: "Mapp v. Ohio", back: "Evidence seized unlawfully, without a search warrant, could not be used in criminal prosecutions in state courts." },
  { front: "Davis v. United States", back: "Searches conducted in objectively reasonable reliance on binding appellate precedent are not subject to the exclusionary rule." },
  { front: "Maryland v. King", back: "The United States Supreme Court decided that a cheek swab of an arrestee's DNA is comparable to fingerprinting and therefore, a legal police booking procedure that is reasonable under the Fourth Amendment only when charging the arrestee with a violent crime. The individual must have committed a felony." },
  { front: "1st Amendment", back: "Freedom of Speech does not include criminal threats." },
  { front: "2nd Amendment", back: "Right to bear arms (Guns)" },
  { front: "4th Amendment", back: "Prevent unreasonable searches and seizures, without warrant or probable cause." },
  { front: "5th Amendment", back: "No person is held to answer for crimes unless presented to a grand jury. Prevents double jeopardy. Right to remain silent." },
  { front: "6th Amendment", back: "Right to speedy trial by Jury, witnesses and council." },
  { front: "7th Amendment", back: "Civil cases, or lawsuits based on disagreements between people or businesses, have a right to be decided by a jury in federal court. The amount of the lawsuit must be more than $20, and after a jury settles the case, it shouldn't go back to trial again." },
  { front: "8th Amendment", back: "Prevention of excessive fines and cruel unusual punishment." },
  { front: "9th Amendment", back: "Non-Enumerated Rights Retained by People - rights to their own body, privacy, vote." },
  { front: "11th Amendment", back: "The states are shielded from suits brought by citizens of other states or foreign countries." },
  { front: "14th Amendment", back: "Granted citizenship to everyone born or naturalized in the U.S. (including formerly enslaved people) and guarantees all citizens equal protection of the laws and due process" },
  { front: "19th Amendment", back: "Granted women the right to vote by prohibiting states from denying suffrage." }
];

// =====================
// 2) State + persistence
// =====================
const STORAGE_KEY = "case_law_flashcards_progress_v1";

// progressMap: { [frontString]: "known" | "missed" }
let progressMap = {};
try {
  progressMap = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
} catch {
  progressMap = {};
}

let view = cards.map((_, i) => i); // indices into cards
let viewPos = 0;

// =====================
// 3) DOM
// =====================
const cardEl = document.getElementById("card");
const frontTextEl = document.getElementById("frontText");
const backTextEl = document.getElementById("backText");
const counterEl = document.getElementById("counter");
const statsEl = document.getElementById("stats");
const statusPill = document.getElementById("statusPill");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");

const searchInput = document.getElementById("searchInput");
const datalist = document.getElementById("cardTitles");

const knownBtn = document.getElementById("knownBtn");
const missedBtn = document.getElementById("missedBtn");
const clearMarkBtn = document.getElementById("clearMarkBtn");
const resetProgressBtn = document.getElementById("resetProgressBtn");

// Fill datalist
datalist.innerHTML = cards.map(c => `<option value="${escapeHtml(c.front)}"></option>`).join("");

// =====================
// 4) Helpers
// =====================
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function currentCard() {
  return cards[view[viewPos]];
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
}

function setPill(state) {
  statusPill.classList.remove("good", "bad");
  if (state === "known") {
    statusPill.textContent = "Known";
    statusPill.classList.add("good");
  } else if (state === "missed") {
    statusPill.textContent = "Missed";
    statusPill.classList.add("bad");
  } else {
    statusPill.textContent = "Unmarked";
  }
}

function updateStats() {
  const total = cards.length;
  const markedKnown = Object.values(progressMap).filter(v => v === "known").length;
  const markedMissed = Object.values(progressMap).filter(v => v === "missed").length;
  const markedTotal = markedKnown + markedMissed;

  statsEl.textContent =
    `Progress: Known ${markedKnown} • Missed ${markedMissed} • Unmarked ${total - markedTotal} • Total ${total}`;
}

// =====================
// 5) Rendering + nav
// =====================
function render() {
  if (view.length === 0) {
    frontTextEl.textContent = "No results";
    backTextEl.textContent = "Try a different search.";
    counterEl.textContent = "0 / 0";
    cardEl.classList.remove("flipped");
    setPill(null);
    return;
  }

  const c = currentCard();
  frontTextEl.textContent = c.front;
  backTextEl.textContent = c.back;

  counterEl.textContent = `${viewPos + 1} / ${view.length} (filtered) • ${cards.length} total`;
  cardEl.classList.remove("flipped");

  setPill(progressMap[c.front] || null);
  updateStats();
}

function next() {
  if (view.length === 0) return;
  viewPos = (viewPos + 1) % view.length;
  render();
}

function prev() {
  if (view.length === 0) return;
  viewPos = (viewPos - 1 + view.length) % view.length;
  render();
}

function shuffleView() {
  for (let i = view.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [view[i], view[j]] = [view[j], view[i]];
  }
  viewPos = 0;
  render();
}

function flip() {
  cardEl.classList.toggle("flipped");
}

// =====================
// 6) Search (filters view)
// =====================
function applySearch(q) {
  const query = (q || "").trim().toLowerCase();

  if (!query) {
    view = cards.map((_, i) => i);
    viewPos = 0;
    render();
    return;
  }

  const results = [];
  for (let i = 0; i < cards.length; i++) {
    const f = cards[i].front.toLowerCase();
    const b = cards[i].back.toLowerCase();
    if (f.includes(query) || b.includes(query)) results.push(i);
  }

  view = results;
  viewPos = 0;
  render();
}

// If they type an exact front title, jump to it immediately
function jumpIfExactTitle(value) {
  const exactIndex = cards.findIndex(c => c.front.toLowerCase() === value.trim().toLowerCase());
  if (exactIndex !== -1) {
    view = [exactIndex];
    viewPos = 0;
    render();
  }
}

// =====================
// 7) Known / Missed
// =====================
function mark(state) {
  const c = currentCard();
  if (!c) return;
  progressMap[c.front] = state; // "known" or "missed"
  saveProgress();
  render();
}

function clearMark() {
  const c = currentCard();
  if (!c) return;
  delete progressMap[c.front];
  saveProgress();
  render();
}

function resetProgress() {
  progressMap = {};
  saveProgress();
  render();
}

// =====================
// 8) Events
// =====================
cardEl.addEventListener("click", flip);
cardEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    flip();
  }
});

nextBtn.addEventListener("click", next);
prevBtn.addEventListener("click", prev);
shuffleBtn.addEventListener("click", shuffleView);

knownBtn.addEventListener("click", () => mark("known"));
missedBtn.addEventListener("click", () => mark("missed"));
clearMarkBtn.addEventListener("click", clearMark);
resetProgressBtn.addEventListener("click", resetProgress);

// Search interactions
searchInput.addEventListener("input", (e) => applySearch(e.target.value));
searchInput.addEventListener("change", (e) => jumpIfExactTitle(e.target.value));
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    searchInput.value = "";
    applySearch("");
    searchInput.blur();
  }
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.target === searchInput) return;

  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();

  // Quick mark
  if (e.key.toLowerCase() === "k") mark("known");
  if (e.key.toLowerCase() === "m") mark("missed");
  if (e.key.toLowerCase() === "u") clearMark();
});

render();
