document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("coming-soon-form");
  if (!form) return;

  // Fetch and inject CSRF token
  async function fetchCsrfToken() {
    try {
      const response = await fetch("/SFE-Project/backend/api/client/csrf.php", {
        credentials: "include",
        method: "GET",
      });
      const data = await response.json();
      if (data.csrf_token) {
        let input = form.querySelector('input[name="csrf_token"]');
        if (!input) {
          input = document.createElement("input");
          input.type = "hidden";
          input.name = "csrf_token";
          input.id = "csrf_token_coming_soon";
          form.appendChild(input);
        }
        input.value = data.csrf_token;
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du token CSRF:", err);
    }
  }

  fetchCsrfToken();

  // Add services fetch function
  async function fetchServices() {
    try {
      const response = await fetch("/SFE-Project/backend/public/api/client/services", {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const services = await response.json();
      injectCardServices(services);
      
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }

  // Call fetchServices when page loads
  fetchServices();

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const value = form.elements["email"].value.trim();
    const recaptchar = form.elements["g-recaptcha-response"]?.value || "";
    const csrfToken = form.elements["csrf_token"]?.value || "";

    // Validation : email OU numéro de téléphone
    const isEmail = /^[\w\.-]+@[\w\.-]+\.\w+$/.test(value);
    const isPhone = /^\d{6,15}$/.test(value);

    if (!isEmail && !isPhone) {
      alert("Veuillez entrer un email valide ou un numéro de téléphone valide (6 à 15 chiffres).");
      return;
    }
    if(!recaptchar) {
      alert("Veuillez valider le reCAPTCHA avant de soumettre le formulaire.");
      return;
    }
    if(!csrfToken) {
      alert("Erreur de sécurité : token CSRF manquant.");
      return;
    }

    try {
      const response = await fetch("/SFE-Project/backend/public/api/client/abonnees", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: value,
          g_recaptcha_response: recaptchar,
          csrf_token: csrfToken
        }),
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

  function injectCardServices(servicesComplet) {
    const servicesCard = document.getElementById('servicesCard');
    if (!servicesCard) return;

    servicesCard.innerHTML = ''; // Clear existing content
    
    servicesComplet.forEach((service) => {
      let a = document.createElement('a');
      a.href = `service-single.html?id=${service.service_id}`;
      
      let li = document.createElement('li');
      li.textContent = service.nom_service;
      
      a.appendChild(li);
      servicesCard.appendChild(a);
    });
  }
});