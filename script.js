// =====================
// VARIABLES
// =====================
let lettres = [];
let currentManche = 0;
let temps = 30;
let score = 0;
let timer = null;
let jeuActif = false;

// =====================
// SONS
// =====================
const sonClick = new Audio("assets/sounds/click.mp3");
const sonCorrect = new Audio("assets/sounds/correct.mp3");
const sonFaux = new Audio("assets/sounds/wrong.mp3");
const sonTemps = new Audio("assets/sounds/timeout.mp3");

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

// =====================
// GENERER LETTRES (10 lettres)
// =====================
function genererLettres() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  lettres = [];
  for (let i = 0; i < 10; i++) {
    lettres.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }
  currentManche = 0;
}

// =====================
// COMMENCER LA MANCHÉE
// =====================
function demarrerManche() {
  if (currentManche >= lettres.length) {
    finPartie();
    return;
    document.getElementById("currentManche").textContent = currentManche + 1;
  }

  temps = 30;
  jeuActif = true;
  document.getElementById("lettre").textContent = lettres[currentManche];
  document.getElementById("currentManche").textContent = currentManche + 1;
  document.getElementById("temps").textContent = temps;

  // reset inputs
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    input.value = "";
    input.classList.remove("correct", "incorrect");
  });

  if (timer !== null) clearInterval(timer);
  timer = setInterval(() => {
    temps--;
    document.getElementById("temps").textContent = temps;
    if (temps <= 0) {
      clearInterval(timer);
      timer = null;
      playSound(sonTemps);
      alert("⏰ Temps écoulé pour cette manche !");
      currentManche++;
      demarrerManche();
    }
  }, 1000);
}

// =====================
// VERIFICATION DES CHAMPS
// =====================
function verifierChamp(input, lettre) {
  let valeur = input.value.trim();
  input.classList.remove("correct", "incorrect");
  if (valeur === "") {
    input.classList.add("incorrect");
    playSound(sonFaux);
    return 0;
  }
  if (valeur.toUpperCase().startsWith(lettre)) {
    input.classList.add("correct");
    playSound(sonCorrect);
    return 10; // chaque réponse correcte = 10 points
  } else {
    input.classList.add("incorrect");
    playSound(sonFaux);
    return 0;
  }
}

// =====================
// VALIDER MANCHÉE
// =====================
function valider() {
  if (!jeuActif) return alert("⛔ Le jeu n'est pas actif !");

  playSound(sonClick);
  const lettreCourante = lettres[currentManche];
  let points = 0;

  points += verifierChamp(document.getElementById("pays"), lettreCourante);
  points += verifierChamp(document.getElementById("metier"), lettreCourante);
  points += verifierChamp(document.getElementById("animal"), lettreCourante);
  points += verifierChamp(document.getElementById("voiture"), lettreCourante);

  score += points;

  alert(`🎯 +${points} points pour cette manche !`);
  currentManche++;
  clearInterval(timer);
  demarrerManche();
}

// =====================
// FIN DE LA PARTIE
// =====================
function finPartie() {
  jeuActif = false;
  let scoreFinal = Math.min(Math.round((score / (10 * 40)) * 100), 100);

  // Création d'un overlay de fin
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.9)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.color = "#22c55e";
  overlay.style.fontSize = "32px";
  overlay.style.zIndex = 1000;
  overlay.innerHTML = `
    <div>🏆 Partie terminée !</div>
    <div>Score final: ${scoreFinal}/100</div>
    <button id="rejouerBtn">🔄 Rejouer</button>
  `;
  document.body.appendChild(overlay);

  document.getElementById("rejouerBtn").onclick = () => {
    document.body.removeChild(overlay);
    nouvellePartie(); // relance le jeu
  };
}
// =====================
// NOUVELLE PARTIE
// =====================
function nouvellePartie() {
  score = 0;
  genererLettres();
  demarrerManche();
}

// =====================
// DEMARRAGE
// =====================
window.onload = () => {
  nouvellePartie();
};