document.addEventListener("DOMContentLoaded", function () {
  function getPublicationId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  async function fetchPublication(id) {
    const res = await fetch(`/SFE-Project/backend/public/api/client/publications`);
    const data = await res.json();
    return data.find(pub => String(pub.id_publication) === String(id));
  }

  async function fetchCommentaires(id_publication) {
    const res = await fetch(`/SFE-Project/backend/public/api/client/avis_utilisateurs?id_publication=${id_publication}`);
    return await res.json();
}

  function renderCommentaires(comments) {
    const wrapper = document.querySelector('.bi-testimonial-slider .swiper-wrapper');
    const nextBtn = document.querySelector('.testimoinal-button-next');
    const prevBtn = document.querySelector('.testimoinal-button-prev');
    if (!wrapper) return;

    // If no comments, show only the message and hide arrows
    if (!Array.isArray(comments) || comments.length === 0) {
        wrapper.innerHTML = `<div class="no-comments-message" style="width:100%;text-align:center;padding:2rem 0;">
            <p style="color:white;font-weight:bold;">Aucun commentaire pour cette publication.</p>
        </div>`;
        if (nextBtn) nextBtn.style.display = "none";
        if (prevBtn) prevBtn.style.display = "none";
        if (window.testimonialSwiper) {
            window.testimonialSwiper.destroy();
            window.testimonialSwiper = null;
        }
        return;
    }

    // Render comments as slides
    wrapper.innerHTML = comments.map(comment => `
      <div class="swiper-slide">
        <div class="bi-testimonial-item d-flex">
          <div class="testimonial-img"></div>
          <div class="testimonial-text headline pera-content">
            <h3 style="color:white">${comment.nom_prenom || 'Utilisateur'}</h3>
            <div class="testimonial-desc-author">
              <p>${comment.message || ''}</p>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Show/hide arrows depending on number of comments
    if (nextBtn) nextBtn.style.display = comments.length > 1 ? "flex" : "none";
    if (prevBtn) prevBtn.style.display = comments.length > 1 ? "flex" : "none";

    // (Re)initialize Swiper
    if (window.testimonialSwiper) window.testimonialSwiper.destroy();
    window.testimonialSwiper = new Swiper('.bi-testimonial-slider', {
      loop: comments.length > 1,
      navigation: {
        nextEl: '.testimoinal-button-next',
        prevEl: '.testimoinal-button-prev',
      },
    });
}

  async function getCsrf() {
    fetch("/SFE-Project/backend/api/client/csrf.php", {
      credentials: "include",
      method: "GET",
    })
      .then(res => res.json())
      .then(data => {
        if (data.csrf_token) {
          let form = document.getElementById("contactForm");
          if (form) {
            let input = document.createElement("input");
            input.type = "hidden";
            input.name = "csrf_token";
            input.value = data.csrf_token;
            form.appendChild(input);
            return data.csrf_token;
          }
        }
      });
  }

  function renderPublication(pub) {
    if (!pub) {
      document.querySelector(".bi-portfolio-details-content").innerHTML = "<p class='text-danger'>Publication not found.</p>";
      return;
    }

    // Render all images as Swiper slides
    let imagesHtml = "";
    if (Array.isArray(pub.images) && pub.images.length > 0) {
      imagesHtml = pub.images.map(img =>
        `<div class="swiper-slide">
            <img src="http://localhost/SFE-Project/backend/public/uploads/${img.replace(/^\//, '')}" alt="${pub.title}" style="width:100%;height:auto;object-fit:cover;">
        </div>`
      ).join('');
    } else {
      imagesHtml = `<div class="swiper-slide"><img src="assets/img/user/about.jpg" alt="No image"></div>`;
    }
    const imgSwiper = document.querySelector(".publication-images-swiper .swiper-wrapper");
    if (imgSwiper) imgSwiper.innerHTML = imagesHtml;

    // Initialize Swiper (after images are injected)
    if (window.publicationSwiper) window.publicationSwiper.destroy();
    window.publicationSwiper = new Swiper('.publication-images-swiper', {
      loop: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });

    // Title & Description
    const titleEl = document.querySelector(".bi-portfolio-details-content h3");
    if (titleEl) titleEl.textContent = pub.title || "Détails de Publication";
    const descEls = document.querySelectorAll(".bi-portfolio-details-content p");
    if (descEls.length > 0) descEls[0].textContent = pub.description || "";
    if (descEls.length > 1) descEls[1].textContent = pub.site ? `Site: ${pub.site}` : "";

    // Sidebar Info
    const sidebar = document.querySelector(".bi-portfolio-sidebar ul");
    if (sidebar) {
      sidebar.innerHTML = `
        <li>
          <span class="title">Client:</span>
          <span class="info">${pub.client || ""}</span>
        </li>
        <li>
          <span class="title">Catégorie:</span>
          <span class="info">${pub.nom_service || ""}</span>
        </li>
        <li>
          <span class="title">Site Web:</span>
          <a class="info" href="${pub.site || "#"}" target="_blank">${pub.site || ""}</a>
        </li>
      `;
    }

    // Set the hidden input for id_publication in the comment form
    const idInput = document.querySelector('input[name="id_publication"]');
    if (idInput) idInput.value = pub.id_publication;
  }

  (async function () {
    const id = getPublicationId();
    if (!id) {
      renderPublication(null);
      return;
    }
    const pub = await fetchPublication(id);
    renderPublication(pub);
    // Récupérer et afficher les commentaires
    const commentaires = await fetchCommentaires(pub.id_publication);
    renderCommentaires(commentaires);
  })();

  (async function () {
    await getCsrf();
  })();

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const nom_prenom = form.elements["name"].value.trim();
      const message = form.elements["message"].value.trim();
      const csrfToken = form.elements["csrf_token"].value.trim();
      const id_publication = form.elements["id_publication"].value.trim();

      let errors = [];
      if (!nom_prenom) errors.push("Le nom est requis.");
      if (!message) errors.push("Le message est requis.");
      if (!csrfToken) errors.push("Token CSRF manquant.");

      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      const data = {
        nom_prenom,
        message,
        csrf_token: csrfToken,
        id_publication
      };
      try {
        const response = await fetch("/SFE-Project/backend/public/api/client/avis_utilisateurs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
          alert("Message envoyé avec succès !");
          window.location.reload();
          form.reset();
        } else {
          alert(result.error || "Erreur lors de l'envoi du message.");
        }
      } catch (err) {
        alert("Erreur réseau ou serveur. essayer de reloader la page. avant d'essayer à nouveau.");
      }
    });
  }
});