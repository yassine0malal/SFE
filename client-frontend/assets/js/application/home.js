document.addEventListener('DOMContentLoaded', function () {
    const API_URL = '/SFE-Project/backend/public/api/client/home';
    const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads/images/'; // for services
    const BASE_GALERIE_URL = 'http://localhost/SFE-Project/backend/public/uploads/images/'; // for galeries/products

    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            injectPublications(data.publications);
            injectservices(data.services);
            renderGaleries(data.galeries);     
            renderCommentaires(data.avis);
            injectCardServices(data.services);
            injectClients(data.clients);
            if (data.services && Array.isArray(data.services)) {
                injectservices(data.services);
            }
        })
        .catch(err => {
            console.error('Erreur lors du chargement des données:', err);
        });


    function injectPublications(publications) {
        const cards = document.querySelectorAll('.bi-service-scroll-area .bi-service-scroll-item');
        cards.forEach((card, idx) => {
            if (publications[idx]) {
                const publication = publications[idx];
                // Update image
                const img = card.querySelector('.service-img img');
                if (img) img.src = BASE_IMAGE_URL + publication.image_principale;
                if (img) img.alt = publication.title;
                // Update title and link
                const title = card.querySelector('.service-text h3 a');
                if (title) {
                    title.textContent = publication.title;
                    title.href = `portfolio-single.html?id=${publication.id_publication}`;
                }
                // Update arrow link
                const more = card.querySelector('.service_more');
                if (more) more.href = `portfolio-single.html?id=${publication.id_publication}`;
            } else {
                // Optionally hide extra cards if not enough services
                card.style.display = 'none';
            }
        });
    }

    // In your fetch success callback, call:
    injectPublications(data.publications);

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
                        <p>${gal.description ? gal.description.substring(0, 80) + '...' : ''}</p>
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

    function injectservices(services) {
        const container = document.querySelector('.bi-why-choose-us-area-1');
        if (!container || !services.length) return;

        // Update the styles to include navigation buttons
        const styleSheet = `
            <style>
                .services-conveyor {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                }
                .services-track {
                    display: flex;
                    transition: transform 0.5s ease-out;
                    width: ${services.length * 100}%;
                }
                .service-item {
                    width: ${100 / services.length}%;
                    flex-shrink: 0;
                    padding: 0 15px;
                }
                .services-navigation {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 10px;
                    z-index: 10;
                }
                .nav-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #ddd;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }
                .nav-dot.active {
                    background: #FF3838;
                }
                .service-nav-buttons {
                    display: none; /* Hidden by default */
                }
                
                @media (min-width: 992px) {
                    .service-nav-buttons {
                        display: block;
                        position: absolute;
                        top: 50%;
                        width: 100%;
                        transform: translateY(-50%);
                        z-index: 10;
                    }
                    
                    .service-nav-btn {
                        position: absolute;
                        width: 50px;
                        height: 50px;
                        border: none;
                        border-radius: 50%;
                        background: #FF3838;
                        color: white;
                        font-size: 20px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .service-nav-btn:hover {
                        background: #cc2e2e;
                        transform: scale(1.1);
                    }
                    
                    .service-prev-btn {
                        left: 20px;
                    }
                    
                    .service-next-btn {
                        right: 20px;
                    }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styleSheet);

        // Helper function to parse sous-services
        function getSousServicesTitles(sousServicesStr) {
            if (!sousServicesStr) return [];
            return sousServicesStr.split('|').map(item => item.split(':')[0]);
        }

        container.innerHTML = `
            <div class="services-conveyor">
                <div class="service-nav-buttons">
                    <button class="service-nav-btn service-prev-btn">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="service-nav-btn service-next-btn">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="services-track">
                    ${services.map(service => {
                        const sousTitles = getSousServicesTitles(service.sous_services);
                        return `
                            <div class="service-item">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="bi-why-choose-img1-area position-relative">
                                            <div class="why-choose-img1">
                                                <img src="${BASE_IMAGE_URL}${service.image}" alt="${service.nom_service}">
                                            </div>
                                            <div class="why-choose-img2 position-absolute" data-parallax='{"x" : -60}'>
                                                <img src="assets/img/about/whc1.2.png" alt="">
                                            </div>
                                            <div class="why-choose-img3 position-absolute">
                                                <img src="assets/img/about/wh1.5.png" alt="">
                                            </div>
                                            <div class="why-choose-img4 position-absolute" data-parallax='{"x" : -60, "rotateY":-300}'>
                                                <img src="assets/img/about/wh1.3.png" alt="">
                                            </div>
                                            <div class="why-choose-img5 position-absolute" data-parallax='{"y" : -60}'>
                                                <img src="assets/img/about/wh1.4.png" alt="">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="bi-why-choose-textarea">
                                            <div class="bi-why-choose-text_1">
                                                <div class="bi-section-title-4 bins-text headline">
                                                    <div class="sub-title position-relative pera-content text-uppercase">
                                                        ${service.nom_service}
                                                    </div>
                                                    <h2 class="tx-split-text text-white">
                                                        ${service.nom_service.split('.')[0]}
                                                    </h2>
                                                    <p>${service.description}</p>
                                                </div>
                                                ${sousTitles.length ? `
                                                    <div class="bi-why-choose-feature ul-li wow fadeInRight" 
                                                        data-wow-delay="300ms" data-wow-duration="1000ms">
                                                        <ul>
                                                            ${sousTitles.map(title => `
                                                                <li class="text-white">${title}</li>
                                                            `).join('')}
                                                        </ul>
                                                    </div>
                                                ` : ''}
                                                <div class="bi-btn-4 text-uppercase">
                                                    <a href="service-single.html?id=${service.service_id}">
                                                        Voir le service
                                                        <span class="d-flex justify-content-center align-items-center">
                                                            <img src="assets/img/icon/arrow.svg" alt="">
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="services-navigation">
                    ${services.map((_, i) => `
                        <div class="nav-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
                    `).join('')}
                </div>
            </div>
        `;

        const track = container.querySelector('.services-track');
        const dots = container.querySelectorAll('.nav-dot');
        const prevBtn = container.querySelector('.service-prev-btn');
        const nextBtn = container.querySelector('.service-next-btn');
        let currentIndex = 0;
        let isAnimating = false;

        // Handle wheel event
        container.addEventListener('wheel', (e) => {
            // Only prevent default if Shift key is pressed (horizontal scroll)
            if (e.shiftKey) {
                e.preventDefault();
                if (isAnimating) return;

                const direction = e.deltaX > 0 ? 1 : -1;
                const nextIndex = Math.min(Math.max(currentIndex + direction, 0), services.length - 1);
                
                if (nextIndex !== currentIndex) {
                    moveToIndex(nextIndex);
                }
            }
        });

        // Add touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        container.addEventListener('touchend', (e) => {
            if (isAnimating) return;
            
            touchEndX = e.changedTouches[0].screenX;
            const direction = touchStartX - touchEndX > 0 ? 1 : -1;
            
            // Only move if swipe is significant enough (more than 50px)
            if (Math.abs(touchStartX - touchEndX) > 50) {
                const nextIndex = Math.min(Math.max(currentIndex + direction, 0), services.length - 1);
                if (nextIndex !== currentIndex) {
                    moveToIndex(nextIndex);
                }
            }
        });

        // Add keyboard arrow support
        document.addEventListener('keydown', (e) => {
            if (isAnimating) return;

            if (e.key === 'ArrowLeft') {
                const nextIndex = Math.max(currentIndex - 1, 0);
                if (nextIndex !== currentIndex) {
                    moveToIndex(nextIndex);
                }
            } else if (e.key === 'ArrowRight') {
                const nextIndex = Math.min(currentIndex + 1, services.length - 1);
                if (nextIndex !== currentIndex) {
                    moveToIndex(nextIndex);
                }
            }
        });

        // Add button click handlers
        prevBtn?.addEventListener('click', () => {
            if (isAnimating) return;
            const nextIndex = (currentIndex - 1 + services.length) % services.length;
            moveToIndex(nextIndex);
        });

        nextBtn?.addEventListener('click', () => {
            if (isAnimating) return;
            const nextIndex = (currentIndex + 1) % services.length;
            moveToIndex(nextIndex);
        });

        function moveToIndex(index) {
            if (isAnimating) return;
            isAnimating = true;

            // Update dots
            dots[currentIndex].classList.remove('active');
            dots[index].classList.add('active');

            // Move track
            track.style.transform = `translateX(-${index * (100 / services.length)}%)`;
            
            currentIndex = index;

            // Reset animation lock
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }

        // Auto advance every 5 seconds if no user interaction
        let autoplayInterval = setInterval(() => {
            if (!isAnimating) {
                const nextIndex = (currentIndex + 1) % services.length;
                moveToIndex(nextIndex);
            }
        }, 5000);

        // Pause autoplay on hover
        container.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        // Resume autoplay on mouse leave
        container.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(() => {
                if (!isAnimating) {
                    const nextIndex = (currentIndex + 1) % services.length;
                    moveToIndex(nextIndex);
                }
            }, 5000);
        });
    }

    function renderCommentaires(avis) {
    const wrapper = document.querySelector('.hap-testimonial-slider .swiper-wrapper');
    if (!wrapper) return;

    const filteredAvis = avis.filter(a => a.approuve === "1");
    
    // Supprimer le contenu existant
    wrapper.innerHTML = '';

    if (filteredAvis.length === 0) {
        // Cas aucun commentaire
        wrapper.innerHTML = `
            <div class="swiper-slide">
                <div class="hap-testimonial-item d-flex align-items-center justify-content-center">
                    <div class="testimoial-img position-relative">
                        <img src="assets/img/home_5/about/tst1.png" alt="Aucun commentaire">
                    </div>
                    <div class="testimoial-text-author position-relative">
                        <div class="testimonial-desc">
                            Aucun commentaire approuvé pour le moment
                        </div>
                        <div class="testimonial-author hap-headline">
                            <h3>Soyez le premier à commenter !</h3>
                        </div>
                    </div>
                </div>
            </div>`;
    } else {
        // Ajouter tous les commentaires comme slides Swiper
        filteredAvis.forEach(avis => {
            let imgSrc = "assets/img/home_5/about/tst1.png";
            if (avis.sex && avis.sex.toLowerCase() === "female") {
                imgSrc = "assets/img/home_5/about/tst2.png";
            }
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="hap-testimonial-item d-flex align-items-center justify-content-center">
                    <div class="testimoial-img position-relative">
                        <img src="${imgSrc}" alt="${avis.nom_prenom}">
                    </div>
                    <div class="testimoial-text-author position-relative">
                        <div class="testimonial-desc">
                            ${avis.message}
                        </div>
                        <div class="testimonial-author hap-headline">
                            <h3>${avis.nom_prenom}</h3>
                        </div>
                    </div>
                </div>`;
            wrapper.appendChild(slide);
        });
    }

    // Réinitialiser Swiper après l'ajout dynamique
    const swiper = new Swiper('.hap-testimonial-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        navigation: {
            nextEl: '.hap-testimonial-button-next',
            prevEl: '.hap-testimonial-button-prev',
        },
    });
    }

    //cards in the footer
    // function injectCardServices(servicesComplet){
    //     const servicesCard = document.getElementById('servicesCard');
    //     servicesComplet.forEach((service,idx)=>{
    //         let a = document.createElement('a');
    //         a.href=`service-single.html?id=${service.service_id}`
    //         let li = document.createElement('li');
    //         li.textContent=`${service.nom_service}`
    //         a.appendChild(li);
    //         servicesCard.appendChild(a)
    //     })

    // }

    function injectClients(clients) {
        const clientsContainer = document.getElementById('clients-displaying');
        
        if (!clientsContainer) {
            console.error('Clients container not found');
            return;
        }

        clients.forEach((client) => {
            // Create a temporary container to convert HTML string to DOM element
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = `
                <div class="hpt-client-logo-1-slider-single">
                    <img src="${BASE_GALERIE_URL + client.image}" alt="${client.nom_entreprise}">
                </div>
            `;
            
            // Get the first element child (the actual slider item)
            const sliderItem = tempDiv.firstElementChild;
            
            // Append the DOM element
            clientsContainer.appendChild(sliderItem);
        });

        // Initialize the slider after adding all items
        initializeClientSlider();
    }

    function initializeClientSlider() {
        // If you're using a slider library like Swiper
        new Swiper('.hpt-client-logo-1-slider', {
            slidesPerView: 5,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            breakpoints: {
                320: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 5,
                    spaceBetween: 30,
                },
            }
        });
    }

})

