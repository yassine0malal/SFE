document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads';
    
    // Get the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id_galerie');
    
    if (!productId) {
        alert('Produit non trouvé. ID manquant.');
        return;
    }
    
    // Fetch product details
    fetch(`/SFE-Project/backend/public/api/client/produits?id_galerie=${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des détails du produit');
            }
            return response.json();
        })
        .then(data => {
            // Handle the product data
            const produit = Array.isArray(data) ? data[0] : data;
            displayProductDetails(produit);
            
            // Fetch services for sidebar
            fetchServices(produit.id_service);
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Erreur: ${error.message}`);
        });
    
    // Function to fetch services and populate sidebar
    function fetchServices(currentServiceId) {
        fetch('/SFE-Project/backend/public/api/client/services')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des services');
                }
                return response.json();
            })
            .then(services => {
                // Create a current service object if we have an ID
                const currentService = { service_id: currentServiceId || 0 };
                
                // Populate the services sidebar
                populateServicesSidebar(services, currentService);
            })
            .catch(error => {
                console.error('Error fetching services:', error);
            });
    }
    
    // Function to populate services sidebar
    // function populateServicesSidebar(services, currentService) {
    //     const sidebarList = document.querySelector('.service-widget ul');
    //     if (!sidebarList) return;
        
    //     // Clear existing static content
    //     sidebarList.innerHTML = '';
        
    //     // Filter out current service and limit to 6 items
    //     const otherServices = services
    //         // .filter(s => s.service_id != currentService.service_id || s.id_service != currentService.service_id)
    //         // .slice(0, 6);
        
    //     if (otherServices.length === 0) {
    //         sidebarList.innerHTML = '<li>Aucun autre service disponible</li>';
    //         return;
    //     }
        
    //     // Create new list items
    //     otherServices.forEach(service => {
    //         const listItem = document.createElement('li');
    //         const link = document.createElement('a');
            
    //         // Handle different service ID field names
    //         const serviceId = service.service_id || service.id_service;
            
    //         link.href = `service-single.html?id=${serviceId}`;
    //         link.textContent = service.nom_service || service.title || service.name;
            
    //         // Check if this is the current service
    //         if ((service.service_id == currentService.service_id) || 
    //             (service.id_service == currentService.service_id)) {
    //             link.classList.add('active');
    //         }
            
    //         listItem.appendChild(link);
    //         sidebarList.appendChild(listItem);
    //     });
    // }
    


    // Function to populate services sidebar
function populateServicesSidebar(services, currentService) {
    const sidebarList = document.querySelector('.service-widget ul');
    if (!sidebarList) return;
    
    // Clear existing static content
    sidebarList.innerHTML = '';
    
    // No need to filter out current service anymore
    const otherServices = services;
    
    if (otherServices.length === 0) {
        sidebarList.innerHTML = '<li>Aucun autre service disponible</li>';
        return;
    }
    
    // Create new list items
    otherServices.forEach(service => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        
        // Handle different service ID field names
        const serviceId = service.service_id || service.id_service;
        
        link.href = `service-single.html?id=${serviceId}`;
        link.textContent = service.nom_service || service.title || service.name;
        
        // Remove this block to eliminate the active class
        // if ((service.service_id == currentService.service_id) ||
        //     (service.id_service == currentService.service_id)) {
        //     link.classList.add('active');
        // }
        
        listItem.appendChild(link);
        sidebarList.appendChild(listItem);
    });
}

    function displayProductDetails(produit) {
        // Update the page title
        document.title = produit.title || 'Détails du produit';
        
        // Find the image container
        const imageContainer = document.querySelector('.bi-service-details-img');
        if (imageContainer) {
            // Create image gallery HTML
            let imagesHTML = '';
            
            // Prepare all images (first_image + images array)
            let allImages = [];
            
            // Add first_image if it exists
            if (produit.first_image) {
                allImages.push(produit.first_image);
            }
            
            // Add other images if they exist
            if (produit.images && Array.isArray(produit.images)) {
                // Add all images from the array
                allImages = [...allImages, ...produit.images];
            } else if (typeof produit.images === 'string') {
                try {
                    const parsedImages = JSON.parse(produit.images);
                    if (Array.isArray(parsedImages)) {
                        allImages = [...allImages, ...parsedImages];
                    }
                } catch (e) {
                    // If parsing fails, just add it as a string
                    allImages.push(produit.images);
                }
            }
            
            // Make sure we have unique images
            allImages = [...new Set(allImages)];
            
            // If we have images, create a gallery
            if (allImages.length > 0) {
                // Create main image container
                imagesHTML = `
                    <div class="main-image-container mb-4">
                        <img id="main-product-image" src="${BASE_IMAGE_URL}${allImages[0]}" alt="${produit.title}" class="img-fluid" width="100%" height="auto">
                    </div>
                `;
                
                // Create thumbnails if we have multiple images
                if (allImages.length > 1) {
                    imagesHTML += '<div class="product-thumbnails d-flex flex-wrap justify-content-center mt-3">';
                    allImages.forEach((image, index) => {
                        imagesHTML += `
                            <div class="thumbnail-item m-2" style="cursor: pointer;">
                                <img src="${BASE_IMAGE_URL}${image}" alt="Thumbnail ${index + 1}" 
                                     class="img-thumbnail" style="width: 80px; height: 80px; object-fit: cover;"
                                     onclick="document.getElementById('main-product-image').src='${BASE_IMAGE_URL}${image}'">
                            </div>
                        `;
                    });
                    imagesHTML += '</div>';
                }
            } else {
                // Default image if no images are available
                imagesHTML = `<img src="assets/img/service/serd1.jpg" alt="" width="100%" height="100%">`;
            }
            
            // Update the image container
            imageContainer.innerHTML = imagesHTML;
        }
        
        // Find the text container
        const textContainer = document.querySelector('.bi-service-details-text');
        if (textContainer) {
            // Get all paragraph elements
            const paragraphs = textContainer.querySelectorAll('p');
            
            // Update the title
            const titleElement = textContainer.querySelector('h3');
            if (titleElement) {
                titleElement.textContent = produit.title || '';
            }
            
            // Update paragraphs with product information
            if (paragraphs.length > 0) {
                // First paragraph - Price information with preserved formatting
                let priceHTML = '';
                if (produit.promotion && produit.promotion > 0) {
                    const originalPrice = parseFloat(produit.prix);
                    const discountPercent = parseFloat(produit.promotion);
                    const discountedPrice = originalPrice - (originalPrice * (discountPercent / 100));
                    
                    priceHTML = `
                        <strong>Prix:</strong>
                        <span style="text-decoration: line-through; color: #999;">${produit.prix} DH</span><br>
                        <span style="color: #e74c3c; font-weight: bold; margin-left: 10px; font-size: 1.8em;">${discountedPrice.toFixed(2)} DH</span>
                        <span style="background-color: #e74c3c; color: white; padding: 2px 5px; border-radius: 3px; font-size: 0.8em; margin-left: 5px; font-size: 1.5em;">-${produit.promotion}%</span>
                    `;
                } else {
                    priceHTML = `<strong style="font-size: 1.5em;">Prix:</strong> <span style="color: #e74c3c; font-weight: bold; margin-left: 10px; font-size: 1.8em;">${produit.prix} DH</span>`;
                }
                
                // Add Category section after price
                let serviceName = 'Non catégorisé';
                
                // Check if we have a service ID to display
                if (produit.id_service) {
                    if (produit.nom_service) {
                        serviceName = produit.nom_service;
                    } else {
                        serviceName = `Service #${produit.id_service}`;
                    }
                }
                
                priceHTML += `
                    <div style="margin-top: 15px;">
                        <strong style="font-size: 1.2em;">Category:</strong> 
                        <span style="margin-left: 10px; font-size: 1.2em;">${serviceName}</span>
                    </div>
                `;
                
                paragraphs[0].innerHTML = priceHTML;
                
                // Second paragraph - Empty or can be used for other info
                paragraphs[1].innerHTML = '';
                
                // Third paragraph - Description
                paragraphs[2].innerHTML = produit.description || '';
                
                // Fourth paragraph - Additional info (ID)
                paragraphs[3].innerHTML = `<strong>Categorie :</strong> ${produit.nom_service}`;
            }
        }
    }
});
