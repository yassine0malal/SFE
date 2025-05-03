document.addEventListener("DOMContentLoaded", function () {
  // Récupérer le token CSRF depuis le backend
  fetch("/SFE-Project/backend/api/client/csrf.php",{
    credentials: "include",
    method: "GET",
  })
    .then(res => res.json())
    .then(data => {
      if (data.csrf_token) {
        // Ajoute le token dans un champ caché du formulaire
        let form = document.getElementById("contactForm");
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = "csrf_token";
        input.value = data.csrf_token;
        form.appendChild(input);
      }
    });

  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Récupérer les valeurs
    const name = form.elements["name"].value.trim();
    const email = form.elements["Email"].value.trim();
    const phonePrefix = form.elements["phone_prefix"].value.trim();
    const phone = form.elements["phone"].value.trim();
    const subject = form.elements["subject"].value.trim();
    const message = form.elements["message"].value.trim();
    const csrfToken = form.elements["csrf_token"].value.trim();

    // Validation simple
    let errors = [];
    if (!name) errors.push("Le nom est requis.");
    if (!email || !/^[\w\.-]+@[\w\.-]+\.\w+$/.test(email)) errors.push("Email invalide.");
    if (!phone) {
      errors.push("Le téléphone est requis.");
    } else if (!/^\d{6,15}$/.test(phone)) {
      errors.push("Numéro de téléphone invalide (6 à 15 chiffres).");
    }
    if (!subject) errors.push("Le sujet est requis.");
    if (!message) errors.push("Le message est requis.");
    if (!csrfToken) errors.push("Token CSRF manquant.");

    // Affichage des erreurs
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    // Préparer les données en JSON
    const data = {
      name,
      Email: email,
      phone_prefix: phonePrefix,
      phone,
      subject,
      message,
      csrf_token: csrfToken
    };

    try {
      const response = await fetch("/SFE-Project/backend/api/client/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        // Envoi des données au format JSON
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result.success) {
        alert("Message envoyé avec succès !");
        form.reset();
      } else {
        alert(result.error || "Erreur lors de l'envoi du message.");
      }
    } catch (err) {
      alert("Erreur réseau ou serveur. essayer de reloader la page. avant d'essayer à nouveau.");
    }
  });
});