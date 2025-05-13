document.addEventListener('DOMContentLoaded', function () {
    const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads/images/';

    // Fetch clients for sponsor section
    function fetchClients() {
        fetch('/SFE-Project/backend/public/api/client/clients')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
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
        if (!sponsorContainer) return;

        // Clear existing content
        sponsorContainer.innerHTML = '';

        // Add clients to the slider
        clients.forEach(client => {
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

        // Use a custom marquee instead of Swiper for continuous looping
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
                animation: marquee 10s linear infinite;
            }
            .sponsor-item {
                flex: 0 0 auto;
                margin: 0 30px;
            }
            .sponsor-item img {
                max-height: 90px;
                width: auto;
                height: auto;
                display: block;
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

    // Initialize the clients fetch for sponsor section
    fetchClients();
});