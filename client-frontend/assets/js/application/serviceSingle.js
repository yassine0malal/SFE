// document.addEventListener('DOMContentLoaded', function() {
//     // Base URL for images
//     const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads/images/';
    
//     // Get service ID from URL parameters
//     const urlParams = new URLSearchParams(window.location.search);
//     const serviceId = urlParams.get('id');
    
//     if (!serviceId) {
//         showError('No service ID provided');
//         return;
//     }
    
//     // Fetch specific service details
//     fetchServiceDetails(serviceId);
    
//     // Function to fetch service details by ID
//     function fetchServiceDetails(id) {
//         fetch(`/SFE-Project/backend/public/api/client/services?id=${id}`)
//         .then(response => {
//             if (!response.ok) throw new Error('Network response was not ok');
//             return response.json();
//         })
//         .then(service => {
//             if (service) {
//                 renderServiceDetails(service);
//             } else {
//                 showError('Service not found');
//             }
//         })
//         .catch(error => {
//             console.error('Fetch Error:', error);
//             showError('Failed to load service details');
//         });
//     }
    
//     // Function to render service details
//     function renderServiceDetails(service) {
//         // Update page title
//         document.title = `${service.nom_service} - Services Details`;
        
//         // Update breadcrumb
//         const breadcrumbTitle = document.querySelector('.bi-breadcrumbs-content h2');
//         if (breadcrumbTitle) breadcrumbTitle.textContent = 'Service Details';
        
//         const breadcrumbService = document.querySelector('.bi-breadcrumbs-content ul li:last-child');
//         if (breadcrumbService) breadcrumbService.textContent = service.nom_service;
        
//         // Update service image
//         const serviceImg = document.querySelector('.bi-service-details-img img');
//         if (serviceImg) {
//             serviceImg.src = service.image ? `${BASE_IMAGE_URL}${service.image}` : 'assets/img/service/serd1.jpg';
//             serviceImg.alt = service.nom_service;
//         }
        
//         // Update service title
//         const serviceTitle = document.querySelector('.bi-service-details-text h3');
//         if (serviceTitle) serviceTitle.textContent = service.nom_service;
        
//         // Update service description and details
//         const serviceDescriptionParagraphs = document.querySelectorAll('.bi-service-details-text > p');
//         if (serviceDescriptionParagraphs.length >= 1) {
//             // First paragraph for description
//             serviceDescriptionParagraphs[0].textContent = service.description;
            
//             // If details exist, split them into paragraphs
//             if (service.details) {
//                 const detailsParagraphs = service.details.split('\n\n');
                
//                 // Update remaining paragraphs if they exist
//                 for (let i = 0; i < Math.min(detailsParagraphs.length, serviceDescriptionParagraphs.length - 1); i++) {
//                     serviceDescriptionParagraphs[i + 1].textContent = detailsParagraphs[i];
//                 }
//             }
//         }
        
//         // Update sidebar service links to highlight current service
//         const sidebarServiceLinks = document.querySelectorAll('.service-widget ul li a');
//         sidebarServiceLinks.forEach(link => {
//             if (link.textContent.trim() === service.nom_service) {
//                 link.classList.add('active');
//             }
//         });
//     }
    
//     // Function to show error message
//     function showError(message) {
//         const container = document.querySelector('.bi-service-details-text-area');
//         if (container) {
//             container.innerHTML = `
//                 <div class="alert alert-danger text-center py-5">
//                     <p>${message}. Please go back to <a href="service.html">services page</a>.</p>
//                 </div>
//             `;
//         }
//     }
// });




document.addEventListener('DOMContentLoaded', function() {
    const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads/images/';
    const API_URL = '/SFE-Project/backend/public/api/client/services';
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');

    if (!serviceId) {
        showError('No service ID provided');
        return;
    }

    // Fetch all services
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(services => {
            const currentService = services.find(s => s.service_id == serviceId);
            if (!currentService) {
                showError('Service not found');
                return;
            }
            
            renderServiceDetails(currentService);
            populateServicesSidebar(services, currentService);
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            showError('Failed to load service details');
        });

    function renderServiceDetails(service) {
        // Update main content (existing code)
        document.title = `${service.nom_service} - Services Details`;
        
        const breadcrumbTitle = document.querySelector('.bi-breadcrumbs-content h2');
        if (breadcrumbTitle) breadcrumbTitle.textContent = 'Service Details';
        
        const breadcrumbService = document.querySelector('.bi-breadcrumbs-content ul li:last-child');
        if (breadcrumbService) breadcrumbService.textContent = service.nom_service;
        
        const serviceImg = document.querySelector('.bi-service-details-img img');
        if (serviceImg) {
            serviceImg.src = service.image ? `${BASE_IMAGE_URL}${service.image}` : 'assets/img/service/serd1.jpg';
            serviceImg.alt = service.nom_service;
        }
        
        const serviceTitle = document.querySelector('.bi-service-details-text h3');
        if (serviceTitle) serviceTitle.textContent = service.nom_service;
        
        const serviceDescriptionParagraphs = document.querySelectorAll('.bi-service-details-text > p');
        if (serviceDescriptionParagraphs.length >= 1) {
            serviceDescriptionParagraphs[0].textContent = service.description;
            
            if (service.details) {
                const detailsParagraphs = service.details.split('\n\n');
                for (let i = 0; i < Math.min(detailsParagraphs.length, serviceDescriptionParagraphs.length - 1); i++) {
                    serviceDescriptionParagraphs[i + 1].textContent = detailsParagraphs[i];
                }
            }
        }
    }

    function populateServicesSidebar(services, currentService) {
        const sidebarList = document.querySelector('.service-widget ul');
        if (!sidebarList) return;

        // Clear existing static content
        sidebarList.innerHTML = '';

        // Filter out current service and limit to 6 items
        const otherServices = services
            .filter(s => s.service_id != currentService.service_id)
            .slice(0, 6);

        if (otherServices.length === 0) {
            sidebarList.innerHTML = '<li>Aucun autre service disponible</li>';
            return;
        }

        // Create new list items
        otherServices.forEach(service => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            
            link.href = `service-single.html?id=${service.service_id}`;
            link.textContent = service.nom_service;
            
            if (service.service_id == currentService.service_id) {
                link.classList.add('active');
            }
            
            listItem.appendChild(link);
            sidebarList.appendChild(listItem);
        });
    }

    function showError(message) {
        const container = document.querySelector('.bi-service-details-text-area');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger text-center py-5">
                    <p>${message}. Please go back to <a href="service.html">services page</a>.</p>
                </div>
            `;
        }
    }
});