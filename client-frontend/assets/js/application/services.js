
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
                renderServices(data);
            } else {
                console.log('No services found');
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            showError();
        });
    }

    // Function to render services
    function renderServices(services) {
        const container = document.querySelector('.bi-service-feed-content .row');
        container.innerHTML = ''; // Clear existing content

        services.forEach((service, index) => {
            // Construct image URL
            const imagePath = service.image 
                ? `${BASE_IMAGE_URL}${service.image}`
                : 'default-image.jpg'; // Fallback image

            const serviceItem = `
                <div class="col-lg-4 col-md-6">
                    <div class="bi-service-feed-item position-relative">
                        <span class="hover_img position-absolute" 
                               style="background-image: url('${imagePath}')"></span>
                        <span class="serial-number position-absolute">
                            ${String(index + 1).padStart(2, '0')}
                        </span>
                        <div class="service-icon position-relative">
                            <i class="${service.className}"></i>
                        </div>
                        <div class="service-text headline pera-content">
                            <h3><a href="service-single.html?id=${service.service_id}">
                                ${service.nom_service}
                            </a></h3>
                            <p>${service.description.substring(0, 150)}...</p>
                            <a class="read_more" href="service-single.html?id=${service.service_id}">
                                <i class="fas fa-long-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', serviceItem);
        });

        // Add image load verification
        verifyImageLoad();
    }

    // Function to verify image loading
    function verifyImageLoad() {
        document.querySelectorAll('.hover_img').forEach(imgElement => {
            const img = new Image();
            img.src = imgElement.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
            
            img.onload = () => {
                imgElement.classList.add('loaded');
            };
            
            img.onerror = () => {
                imgElement.style.backgroundImage = 'url(default-service-image.jpg)';
                imgElement.classList.add('loaded');
            };
        });
    }

    // Function to show error message
    function showError() {
        const container = document.querySelector('.bi-service-feed-content .row');
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
