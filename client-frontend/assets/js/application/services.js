document.addEventListener('DOMContentLoaded', function() {
    // Base URL for images
    const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads/images/';

    // AJAX function to fetch services
    function fetchServices() {
        fetch('/SFE-Project/backend/public/api/client/services')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if(data.length > 0) {
                renderServicesStyled(data);
            } else {
                console.log('No services found');
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            showError();
        });
    }

    // Function to render services with styled cards
    function renderServicesStyled(services) {
    const container = document.getElementById('services-list');
    if (!container) return;

    container.innerHTML = ''; // Clear existing content

    services.forEach(service => {
        const serviceHTML = `
            <div class="bi-why-choose-us-area-1">
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
                            <div class="why-choose-img4 position-absolute"
                                data-parallax='{"x" : -60, "rotateY":-300}'>
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
                                    <div class="sub-title position-relative pera-content text-uppercase wow fadeInRight"
                                        data-wow-delay="200ms" data-wow-duration="1000ms">
                                        ${service.nom_service}
                                    </div>
                                    <h2 class="tx-split-text split-in-right text-dark" >${service.nom_service.split('.')[0]}</h2>
                                    <p>${service.description}</p>
                                </div>
                                ${service.sous_service_titles?.length ? `
                                <div class="bi-why-choose-feature ul-li wow fadeInRight" 
                                    data-wow-delay="300ms" data-wow-duration="1000ms">
                                    <ul>
                                        ${service.sous_service_titles.map(title => `
                                            <li class="text-dark">${title}</li>
                                        `).join('')}
                                    </ul>
                                </div>` : ''}
                                <div class="bi-btn-4 text-uppercase wow fadeInRight" 
                                    data-wow-delay="400ms" data-wow-duration="1000ms">
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

        container.insertAdjacentHTML('beforeend', serviceHTML);
    });

    // Réinitialiser les animations et effets parallax
    new WOW().init();
    if(typeof $.fn.parallax === 'function') {
        $('[data-parallax]').parallax();
    }
}

    // Function to show error message
    function showError() {
        const container = document.getElementById('services-list');
        if (!container) return;
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-danger">Failed to load services. Please refresh the page or try again later.</p>
            </div>
        `;
    }

    // Fetch clients for sponsor section
    function fetchClients() {
        fetch('/SFE-Project/backend/public/api/client/clients')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if(data.length > 0) {
                renderClients(data);
            } else {
                console.log('No clients found');
            }
        })
        .catch(error => {
            console.error('Fetch Error for clients:', error);
        });
    }

    // Render clients in sponsor section - just showing images
    function renderClients(clients) {
        const sponsorContainer = document.querySelector('.bi-sponsor-slider .swiper-wrapper');
        
        // Clear existing content
        sponsorContainer.innerHTML = '';
        
        // Add clients to the slider
        clients.forEach(client => {
            // Construct image URL using the image field from your data
            const imagePath = client.image 
                ? `${BASE_IMAGE_URL}${client.image}`
                : 'assets/img/sponsor/default.png'; // Fallback image
                
            const clientSlide = `
                <div class="swiper-slide">
                    <div class="bi-sponsor-item">
                        <img src="${imagePath}" alt="${client.nom_entreprise || 'Client'}">
                    </div>
                </div>
            `;
            
            sponsorContainer.insertAdjacentHTML('beforeend', clientSlide);
        });
        
        // Duplicate slides for better looping (if there are fewer than 5 clients)
        if (clients.length < 5) {
            clients.forEach(client => {
                const imagePath = client.image 
                    ? `${BASE_IMAGE_URL}${client.image}`
                    : 'assets/img/sponsor/default.png';
                    
                const clientSlide = `
                    <div class="swiper-slide">
                        <div class="bi-sponsor-item">
                            <img src="${imagePath}" alt="${client.nom_entreprise || 'Client'}">
                        </div>
                    </div>
                `;
                
                sponsorContainer.insertAdjacentHTML('beforeend', clientSlide);
            });
        }
        
        // Try a completely different approach - use a custom marquee instead of Swiper
        // This is more reliable for continuous looping
        setupMarqueeSlider();
    }
    
    // Setup a marquee-style slider that continuously loops
    function setupMarqueeSlider() {
        const sponsorSection = document.getElementById('bi-sponsor');
        const swiperContainer = sponsorSection.querySelector('.bi-sponsor-slider');
        const swiperWrapper = swiperContainer.querySelector('.swiper-wrapper');
        
        // Get all slides
        const slides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide'));
        
        // Remove Swiper-specific classes and structure
        swiperContainer.classList.remove('swiper-container');
        swiperWrapper.classList.remove('swiper-wrapper');
        slides.forEach(slide => slide.classList.remove('swiper-slide'));
        
        // Create a marquee container
        const marqueeContainer = document.createElement('div');
        marqueeContainer.className = 'sponsor-marquee';
        
        // Add CSS for the marquee
        const style = document.createElement('style');
        style.textContent = `
            .sponsor-marquee {
                display: flex;
                overflow: hidden;
                width: 100%;
            }
            .sponsor-track {
                display: flex;
                animation: marquee 20s linear infinite;
            }
            .sponsor-item {
                flex: 0 0 auto;
                margin: 0 15px;
            }
            @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
        `;
        document.head.appendChild(style);
        
        // Create track for animation
        const track = document.createElement('div');
        track.className = 'sponsor-track';
        
        // Add slides to track
        slides.forEach(slide => {
            const item = document.createElement('div');
            item.className = 'sponsor-item';
            item.appendChild(slide.querySelector('.bi-sponsor-item').cloneNode(true));
            track.appendChild(item);
        });
        
        // Duplicate slides for seamless looping
        slides.forEach(slide => {
            const item = document.createElement('div');
            item.className = 'sponsor-item';
            item.appendChild(slide.querySelector('.bi-sponsor-item').cloneNode(true));
            track.appendChild(item);
        });
        
        // Assemble the marquee
        marqueeContainer.appendChild(track);
        
        // Replace the swiper with our marquee
        swiperContainer.parentNode.replaceChild(marqueeContainer, swiperContainer);
    }

    // Initialize the service fetch
    fetchServices();
    
    // Initialize the clients fetch for sponsor section
    fetchClients();
});
