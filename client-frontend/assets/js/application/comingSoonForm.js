document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("coming-soon-form");
  if (!form) return;

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