document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("coming-soon-form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const value = form.elements["email"].value.trim();

    // Validation : email OU numéro de téléphone
    const isEmail = /^[\w\.-]+@[\w\.-]+\.\w+$/.test(value);
    const isPhone = /^\d{6,15}$/.test(value);

    if (!isEmail && !isPhone) {
      alert("Veuillez entrer un email valide ou un numéro de téléphone valide (6 à 15 chiffres).");
      return;
    }

    try {
      const response = await fetch("/SFE-Project/backend/public/api/client/abonnees", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: value }),
      });
      
      const result = await response.json();

      if (!response.ok) { // Gérer les erreurs HTTP (400, 409, etc.)
        const errorMsg =  "vous êtes déjà inscrit(e) !";
        alert(errorMsg);
        return;
      }

      if (result.success) {
        alert("Merci pour votre inscription !");
        form.reset();
      }

    } catch (err) {
      alert("Erreur réseau ou serveur.");
    }
  });
});