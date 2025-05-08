


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

    // Initialize the service fetch
    fetchServices();
});