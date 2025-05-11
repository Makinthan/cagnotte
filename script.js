/*** JAVA ***/

// Ton code de configuration Firebase ici (remplace les valeurs !)
const firebaseConfig = {
  apiKey: "AIzaSyC1ZycY0cYZiaz2O9MK7cvEwzFKbEqacIM",
  authDomain: "cagnotte-anniversaire.firebaseapp.com",
  databaseURL: "https://cagnotte-anniversaire-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cagnotte-anniversaire",
  storageBucket: "cagnotte-anniversaire.firebasestorage.app",
  messagingSenderId: "184571650038",
  appId: "1:184571650038:web:58817849bd1986bdfd71d7"
};

// Initialisation Firebase
const app = firebase.initializeApp(firebaseConfig);
// Référence vers la base
const db = firebase.database();

const OBJECTIF = 350;
// function mettreAJourProgressBar(montant) {
//     // const OBJECTIF = 500; // ou la valeur que tu veux
//     const pourcentage = Math.min((parseFloat(montant) / OBJECTIF) * 100, 100);
//     document.getElementById("progress-bar").style.width = pourcentage + "%";
// }

function mettreAJourProgressBar(montant) {
  const montantNum = parseFloat(montant);
  const objectif = 350;

  const progressPercent = Math.min((montantNum / objectif) * 100, 100);
  document.getElementById("progress-bar").style.width = progressPercent + "%";

  // Gestion de la barre bonus
  if (montantNum > objectif) {
        const surplus = montantNum - objectif;
    const bonusPercent = Math.min((surplus / objectif) * 100, 100);

    const bonusBar = document.getElementById("bonus-bar");
    const bonusTextElem = document.getElementById("bonus-text");

    document.getElementById("bonus-container").style.display = "block";
    bonusBar.style.width = bonusPercent + "%";
    bonusTextElem.style.display = "block";

    // Dynamiser couleur et texte selon le montant
    let color = "#ff9800"; // par défaut
    let texte = `🎉 Dépassement de l'objectif : +${surplus} €`;

    if (surplus > 100) {
      color = "#9c27b0"; // violet
      texte = `🚀 Incroyable : +${surplus} € collectés !`;
    } else if (surplus > 50) {
      color = "#4caf50"; // vert clair
      texte = `🥳 +${surplus} € de générosité !`;
    }

    bonusBar.style.backgroundColor = color;
    bonusTextElem.style.color = color;
    bonusTextElem.textContent = texte;
  }
  else {
    document.getElementById("bonus-container").style.display = "none";
    document.getElementById("bonus-text").style.display = "none";
    document.getElementById("bonus-bar").style.width = "0%";
  }
}


// Afficher le montant sauvegardé au chargement
window.onload = function () {
    db.ref("/").on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.montant) {
          document.getElementById("montant").value = data.montant;
          mettreAJourProgressBar(data.montant);
        }
        if (data.participants) {
          document.getElementById("participants").value = data.participants;
        }
      }
      const adminActif = sessionStorage.getItem("adminConnecte");
      if (adminActif === "true") {
        document.getElementById("editBtn").style.display = "inline-block";
        document.getElementById("logoutBtn").style.display = "inline-block";
        document.getElementById("participants").removeAttribute("readonly");
      } else {
        document.getElementById("participants").setAttribute("readonly", true);
      }
    });
  };


    db.ref("participants").on("value", (snapshot) => {
        const data = snapshot.val();
        const participantsElem = document.getElementById("participants");
        participantsElem.innerHTML = "";
        if (Array.isArray(data)) {
            data.forEach((nom) => {
                const li = document.createElement("li");
                li.textContent = nom;
                participantsElem.appendChild(li);
            });
        }
    });


//     const adminActif = sessionStorage.getItem("adminConnecte");
//     if (adminActif === "true") {
//         document.getElementById("editBtn").style.display = "inline-block";
//         document.getElementById("logoutBtn").style.display = "inline-block";
//         document.getElementById("participants").removeAttribute("readonly");
//     }
//     else {
//         document.getElementById("participants").setAttribute("readonly", true);
//     }
// };

function afficherPopup() {
    document.getElementById("popup").style.display = "flex";
}

function fermerPopup() {
    document.getElementById("popup").style.display = "none";
}

function modifierMontant() {
    const montantInput = document.getElementById("montant");
    const nouveau = prompt("Nouveau montant de la cagnotte :", montantInput.value);
    if (nouveau !== null && nouveau.trim() !== "") {
        montantInput.value = nouveau;
        //localStorage.setItem("montantCagnotte", nouveau); // 💾 Sauvegarde
        db.ref("montant").set(nouveau);// 💾 Sauvegarde dans Firebase
        mettreAJourProgressBar(nouveau);
    }
}
  
function afficherAdmin() {
    const motDePasse = prompt("Mot de passe admin :");
    if (motDePasse === "anniv2025") {
      sessionStorage.setItem("adminConnecte", "true");
      document.getElementById("editBtn").style.display = "inline-block";
      document.getElementById("logoutBtn").style.display = "inline-block";
      document.getElementById("participants").removeAttribute("readonly");
    } else {
      alert("Mot de passe incorrect.");
    }
  }
  


function deconnexionAdmin() {
    sessionStorage.removeItem("adminConnecte");
    document.getElementById("editBtn").style.display = "none";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("participants").setAttribute("readonly", true);
    alert("Déconnecté de l'admin.");
}

document.getElementById("participants")?.addEventListener("input", function () {
    if (!this.hasAttribute("readonly")) {
      db.ref("/participants").set(this.value);
    }
  });
  

function copierNumero() {
    const numero = document.getElementById("numero").innerText;
    const textarea = document.createElement("textarea");
    textarea.value = numero;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand("copy");
        alert("Numéro copié !");
    } catch (err) {
        alert("La copie a échoué.");
    }
    document.body.removeChild(textarea);
}
const montantElem = document.getElementById("montant");
const descriptionElem = document.getElementById("description").textContent;
const participantsElem = document.getElementById("participants");

// Fonction de mise à jour depuis Firebase
function lireDonnees() {
    const ref = db.ref("/");

    ref.on("value", (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        // Montant
        montantElem.textContent = data.montant + " €";

        // Description
        descriptionElem.textContent = data.description;

        // Participants
        participantsElem.innerHTML = "";
        if (Array.isArray(data.participants)) {
            data.participants.forEach((nom) => {
                const li = document.createElement("li");
                li.textContent = nom;
                participantsElem.appendChild(li);
            });
        }
    });
}

// Appeler la fonction au chargement
lireDonnees();
