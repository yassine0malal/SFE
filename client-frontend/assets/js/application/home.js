document.addEventListener('DOMContentLoaded', function () {
    const API_URL = '/SFE-Project/backend/public/api/client/home';
    const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads/images/'; // for services
    const BASE_GALERIE_URL = 'http://localhost/SFE-Project/backend/public/uploads/images/'; // for galeries/products

    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            injectServices(data.services);
            injectPublications(data.publications);
            renderGaleries(data.galeries);     // galeries in blog section
            renderCommentaires(data.avis);
            // alert(JSON.stringify(data.publications));
        })
        .catch(err => {
            console.error('Erreur lors du chargement des données:', err);
        });

    // SERVICES SECTION
function injectServices(services) {
    // Select all service card containers in order
    const cards = document.querySelectorAll('.bi-service-scroll-area .bi-service-scroll-item');
    // Loop through the cards and services (show as many as possible)
    cards.forEach((card, idx) => {
        if (services[idx]) {
            const service = services[idx];
            // Update image
            const img = card.querySelector('.service-img img');
            if (img) img.src = BASE_IMAGE_URL + service.image;
            if (img) img.alt = service.nom_service;
            // Update title and link
            const title = card.querySelector('.service-text h3 a');
            if (title) {
                title.textContent = service.nom_service;
                title.href = `service-single.html?id=${service.service_id}`;
            }
            // Update arrow link
            const more = card.querySelector('.service_more');
            if (more) more.href = `service-single.html?id=${service.service_id}`;
        } else {
            // Optionally hide extra cards if not enough services
            card.style.display = 'none';
        }
    });
}

// In your fetch success callback, call:
injectServices(data.services);

    function renderGaleries(galeries) {
        const container = document.querySelector('.bi-blog-top-content .row');
        if (!container) return;
        container.innerHTML = '';
        galeries.slice(0, 3).forEach((gal, idx) => {
            let image = gal.first_image
                ? `${BASE_GALERIE_URL}${gal.first_image}`
                : (gal.images && gal.images[0] ? `${BASE_GALERIE_URL}${gal.images[0]}` : 'assets/img/blog/bfd1.png');
            let prix = gal.prix ? gal.prix : '';
            let promotion = gal.promotion && gal.promotion !== "0" ? gal.promotion : '';
            let priceHtml = '';
            if (promotion) {
                // priceHtml = `<span class="old-price">${prix} DH</span><span class="new-price">${promotion} DH</span>`;
                priceHtml = `<span class="new-price">${parseFloat(
                  prix - (promotion * prix) / 100
                ).toFixed(2)} DH</span>`;
            } else if (prix) {
                priceHtml = `<span class="new-price">${prix} DH</span>`;
            } else {
                priceHtml = '';
            }
            const col = document.createElement('div');
            col.className = `col-lg-4 col-md-6 wow fadeInUp h-100`;
            col.setAttribute('data-wow-delay', `${100 + idx * 100}ms`);
            col.setAttribute('data-wow-duration', '1000ms');
            col.innerHTML = `
                <div class="bi-blog-item-4 position-relative equal-card">
                    <div class="blog-img position-relative">
                        <img src="${image}" alt="${gal.title}">
                        <span class="blog-meta position-absolute ">
                            <a href="#">${priceHtml}</a>
                        </span>
                    </div>
                    <div class="blog-text headline pera-content">
                        <h3><a href="produit-details.html?id_galerie=${gal.id_galerie}">${gal.title}</a></h3>
                        ${gal.sub_description ? gal.sub_description : (gal.description ? `<p>${gal.description.substring(0, 80)}...</p>` : '')}
                    </div>
                    <div class="blog-author-more d-flex justify-content-between align-items-center">
                        <div class="blog-author-more d-flex justify-content-center align-items-center w-100 p-1">
                            <div class="blog-more text-uppercase">
                                <a href="produit-details.html?id_galerie=${gal.id_galerie}">Voir Plus <i class="fas fa-long-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
    }

    function injectPublications(publications) {
    const BASE_GALERIE_URL = 'http://localhost/SFE-Project/backend/public/uploads/images/';
    const cards = document.querySelectorAll('.bi-portfolio-item-4');
    cards.forEach((card, idx) => {
        if (publications[idx]) {
            const pub = publications[idx];
            // Update image
            const img = card.querySelector('.portfolio-img-4 img');
            if (img && pub.images && pub.images[0]) {
                img.src = BASE_GALERIE_URL + pub.images[0];
                img.alt = pub.title || '';
            }
            // Update title and link
            const title = card.querySelector('.portfolio-text h3 a');
            if (title) {
                title.textContent = pub.title || '';
                title.href = `portfolio-single.html?id=${pub.id_publication}`;
            }
            // Remove all children from .portfolio-category and add a short description
            const cat = card.querySelector('.portfolio-category');
            if (cat) {
                cat.innerHTML = `<p>${pub.description ? pub.description.substring(0, 80) + '...' : ''}</p>`;
            }
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
    }

    function renderCommentaires(avis) {
    // Make sure the wrapper exists
    const wrapper = document.querySelector('.bi-testimonial-slider-for-4 .swiper-wrapper, #testimonial-swiper-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    if (!avis || avis.length === 0) {
        wrapper.innerHTML = `
            <div class="swiper-slide">
                <div class="bi-testimonial-item-4 text-center headline pera-content">
                    <div class="testimonial-author">
                        <h3 class="text-uppercase">Aucun commentaire</h3>
                        <span>Pas encore d'avis client</span>
                    </div>
                    <div class="testimonial-desc-rate">
                        <p>“Soyez le premier à laisser un avis !”</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    avis.forEach(comment => {
        wrapper.innerHTML += `
            <div class="swiper-slide">
                <div class="bi-testimonial-item-4 text-center headline pera-content">
                    <div class="testimonial-author">
                        <h3 class="text-uppercase">${comment.nom_prenom}</h3>
                        <span>${comment.nom_service || ""}</span>
                    </div>
                    <div class="testimonial-desc-rate">
                        <p>“${comment.message}”</p>
                    </div>
                </div>
            </div>
        `;
    });

    // Re-init or update Swiper if needed
    if (!window.testimonialSwiper) {
        window.testimonialSwiper = new Swiper('.bi-testimonial-slider-for-4', {
            navigation: {
                nextEl: '.testimonial-next_4',
                prevEl: '.testimonial-prev_4',
            },
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
        });
    } else {
        window.testimonialSwiper.update();
    }
}
})

