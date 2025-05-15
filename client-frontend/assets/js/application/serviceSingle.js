document.addEventListener('DOMContentLoaded', function() {
    const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads/images/';
    const API_URL = '/SFE-Project/backend/public/api/client/services';
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');

    // Debugging: Vérifier l'ID du service
    console.log('Service ID from URL:', serviceId);

    if (!serviceId) {
        showError('Aucun ID de service fourni');
        return;
    }

    // Fetch des services avec gestion d'erreur améliorée
    fetch(API_URL)
        .then(response => {
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }
            return response.json();
        })
        .then(services => {
            console.log('Services reçus:', services);
            
            if (!Array.isArray(services)) {
                throw new Error('Format de données invalide');
            }

            const currentService = services.find(s => s.service_id == serviceId);
            
            if (!currentService) {
                showError('Service non trouvé');
                return;
            }

            console.log('Service trouvé:', currentService);
            renderServiceDetails(currentService);
            populateServicesSidebar(services, currentService);
        })
        .catch(error => {
            console.error('Erreur complète:', error);
            showError(`Échec du chargement: ${error.message}`);
        });

    function renderServiceDetails(service) {
        try {
            // Mise à jour des éléments de base
            document.title = `${service.nom_service} - Détails du service`;
            
            // Breadcrumb
            const breadcrumbTitle = document.querySelector('.bi-breadcrumbs-content h2');
            const breadcrumbService = document.querySelector('.bi-breadcrumbs-content ul li:last-child');
            if (breadcrumbTitle) breadcrumbTitle.textContent = 'Détails du service';
            if (breadcrumbService) breadcrumbService.textContent = service.nom_service;

            // Image principale
            const serviceImg = document.querySelector('.bi-service-details-img img');
            if (serviceImg) {
                serviceImg.src = service.image 
                    ? `${BASE_IMAGE_URL}${service.image}`
                    : 'assets/img/service/serd1.jpg';
                serviceImg.alt = service.nom_service;
            }

            // Titre et description
            const serviceTitle = document.querySelector('.bi-service-details-text h3');
            const descriptionParagraphs = document.querySelectorAll('.bi-service-details-text > p');
            
            if (serviceTitle) serviceTitle.textContent = service.nom_service;
            
            if (descriptionParagraphs.length > 0) {
                // Description principale
                descriptionParagraphs[0].textContent = service.description || 'Aucune description disponible';

                // Détails supplémentaires
                if (service.details) {
                    const details = service.details.split('\n\n');
                    details.forEach((detail, index) => {
                        if (descriptionParagraphs[index + 1]) {
                            descriptionParagraphs[index + 1].textContent = detail;
                        }
                    });
                }
            }

            // Sous-services
            const subServicesContainer = document.querySelector('.bi-service-details-feature .row');
            const subServicesSection = document.querySelector('.bi-service-details-feature');
            const subServicesHeading = document.querySelector('.bi-service-details-text h3:last-of-type');

            let sousServicesArray = [];
            if (typeof service.sous_services === 'string' && service.sous_services.trim() !== '') {
                sousServicesArray = service.sous_services.split('|').filter(Boolean).map(item => {
                    const [title, description, icon] = item.split(':');
                    return {
                        title: title ? title.trim() : '',
                        description: description ? description.trim() : '',
                        icon: icon ? icon.trim() : 'flaticon-laptop'
                    };
                });
            } else if (Array.isArray(service.sous_services)) {
                sousServicesArray = service.sous_services;
            }

            if (sousServicesArray.length > 0) {
                subServicesContainer.innerHTML = sousServicesArray.map((sub, index) => `
                    <div class="col-md-6">
                        <div class="bi-sd-feature wow fadeInUp" 
                            data-wow-delay="${100 + (index * 100)}ms" 
                            data-wow-duration="1000ms">
                            <div class="bi-sd-icon-title d-flex align-items-center">
                                <div class="inner-icon">
                                    <i class="${sub.icon || 'flaticon-laptop'}"></i>
                                </div>
                                <div class="inner-title">
                                    <h4>${sub.title || 'Sous-service'}</h4>
                                </div>
                            </div>
                            <div class="bi-sd-feature-text">
                                ${sub.description || 'Description non disponible'}
                            </div>
                        </div>
                    </div>
                `).join('');

                // Affichage du titre
                if (subServicesHeading) {
                    subServicesHeading.textContent = 'Sous-services';
                    subServicesHeading.style.display = 'block';
                }
                
                // Affichage de la section
                if (subServicesSection) subServicesSection.style.display = 'block';
            } else {
                // Masquage de la section
                if (subServicesSection) subServicesSection.style.display = 'none';
                if (subServicesHeading) subServicesHeading.style.display = 'none';
            }

            // Réinitialisation des animations
            new WOW().init();

        } catch (error) {
            console.error('Erreur de rendu:', error);
            showError('Erreur de traitement des données');
        }
    }

    function populateServicesSidebar(services, currentService) {
        const sidebarList = document.querySelector('.service-widget ul');
        if (!sidebarList) return;

        // Clear existing static content
        sidebarList.innerHTML = '';

        // Create a list of services to display (including current service)
        // First add the current service
        const servicesToDisplay = [currentService];
        
        // Then add other services (excluding current) up to a total of 6
        const otherServices = services
            .filter(s => s.service_id != currentService.service_id)
            .slice(0, 5); // Only need 5 more since we already have the current service
        
        // Combine the lists
        servicesToDisplay.push(...otherServices);
        
        if (servicesToDisplay.length == 0) {
            sidebarList.innerHTML = '<li>Aucun service disponible</li>';
            return;
        }

        // Create new list items
        servicesToDisplay.forEach(service => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            
            link.href = `service-single.html?id=${service.service_id}`;
            link.textContent = service.nom_service;
            
            // Add active class and styling to the current service
            if (service.service_id == currentService.service_id) {
                link.classList.add('active');
                // Add additional styling to make it stand out
                link.style.fontWeight = 'bold';
                link.style.color = '#ff6b61'; // Use your theme's primary color
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
