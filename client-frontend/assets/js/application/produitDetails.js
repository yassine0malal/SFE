document.addEventListener('DOMContentLoaded', async function() {
    // Configuration
    const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads';
    
    // Get the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id_galerie');
    if (!productId || isNaN(productId)) {
        window.location.href ="/SFE-Project/client-frontend/404.html";;
        return;
    }
    
    // Function to fetch product data
    async function fetchProductData() {
        if (!productId) {
            document.querySelector(".bi-service-details-content").innerHTML = 
                "<p class='text-danger'>Produit non trouvé. ID manquant.</p>";
            return;
        }

        try {
            const response = await fetch(`/SFE-Project/backend/public/api/client/produits?id_galerie=${productId}`);
            if (!response.ok) throw window.location.href ="/SFE-Project/client-frontend/404.html";;
            const data = await response.json();
            const product = Array.isArray(data) ? data[0] : data;
            
            if (product) {
                displayProductDetails(product);
                fetchServices(product.id_service);
                fetchAndDisplayComments(productId);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

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
    function populateServicesSidebar(services, currentService) {
        const sidebarList = document.querySelector('.service-widget ul');
        if (!sidebarList) return;
        
        // Clear existing static content
        sidebarList.innerHTML = '';
        
        // No need to filter out current service anymore
        const otherServices = services;
        
        if (otherServices.length === 0) {
            // window.location.href ="/SFE-Project/client-frontend/404.html";
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

    async function fetchAndDisplayComments(productId) {
        try {
            const response = await fetch(`/SFE-Project/backend/public/api/client/avis_utilisateurs?id_produit=${productId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const comments = await response.json();
            renderComments(comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    function renderComments(comments) {
        const commentWrapper = document.querySelector('.bi-testimonial-slider .swiper-wrapper');
        if (!commentWrapper) return;

        if (!comments || comments.length === 0) {
            commentWrapper.innerHTML = `
                <div class="swiper-slide">
                    <div class="bi-testimonial-item d-flex">
                        <div class="testimonial-img">
                            <img src="assets/img/home_5/about/tst1.png" alt="No comments">
                        </div>
                        <div class="testimonial-text headline pera-content">
                            <h3 style="color: black;">" Aucun commentaire "</h3>
                            <div class="testimonial-desc-author">
                                <p>Soyez le premier à commenter ce produit!</p>
                            </div>
                        </div>
                    </div>
                </div>`;
        } else {
            commentWrapper.innerHTML = comments.map(comment => `
                <div class="swiper-slide">
                <div class="bi-portfolio-details-content headline pera-content">
				<h1 style="color: #FF3838;"><b>Voir les Commentaires</b></h1>
			</div> <br> <br><br>
                    <div class="bi-testimonial-item d-flex">
                        <div class="testimonial-img">
                            <img src="assets/img/user/${comment.sex === 'female' ? 'women-comment.jpg' : 'comment-man.jpg'}" 
                                 alt="${comment.nom_prenom}" >
                        </div>
                        <div class="testimonial-text headline pera-content">
                            <h3 style="color: white;">" ${comment.nom_prenom} "</h3>
                            <div class="testimonial-desc-author">
                                <p>${comment.message}</p>
                                <span style="font-size: 0.8em; color: #666;">
                                    ${new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>`
            ).join('');
        }

        // Initialize/reinitialize Swiper
        if (window.testimonialSwiper) {
            window.testimonialSwiper.destroy();
        }

        window.testimonialSwiper = new Swiper('.bi-testimonial-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: comments.length > 1,
            navigation: {
                nextEl: '.testimoinal-button-next',
                prevEl: '.testimoinal-button-prev',
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            }
        });

        // Show/hide navigation buttons
        const navButtons = document.querySelectorAll('.testimoinal-button-next, .testimoinal-button-prev');
        navButtons.forEach(btn => {
            btn.style.display = comments.length > 1 ? 'flex' : 'none';
        });
    }

    // Add the getCsrf function
    async function getCsrf() {
        try {
            const response = await fetch("/SFE-Project/backend/api/client/csrf.php", {
                credentials: "include",
                method: "GET",
            });
            const data = await response.json();
            if (data.csrf_token) {
                const form = document.getElementById("contactForm");
                if (form) {
                    let input = document.createElement("input");
                    input.type = "hidden";
                    input.name = "csrf_token";
                    input.value = data.csrf_token;
                    form.appendChild(input);
                }
            }
        } catch (err) {
            console.error("Error fetching CSRF token:", err);
        }
    }

    // Handle comment form submission
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();

            const nom_prenom = form.elements["name"].value.trim();
            const message = form.elements["message"].value.trim();
            const csrfToken = form.elements["csrf_token"]?.value;
            const recaptcha = form.elements["g-recaptcha-response"]?.value || "";

            // Validation
            let errors = [];
            if (!nom_prenom) errors.push("Le nom est requis.");
            if (!message) errors.push("Le message est requis.");
            if (!csrfToken) errors.push("Token CSRF manquant.");
            if (!recaptcha) errors.push("Veuillez valider le reCAPTCHA.");

            if (errors.length > 0) {
                alert(errors.join("\n"));
                return;
            }

            const data = {
                nom_prenom,
                message,
                csrf_token: csrfToken,
                g_recaptcha_response: recaptcha
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
                alert("Erreur réseau ou serveur. essayer de reloader la page avant d'essayer à nouveau.");
            }
        });
    }

    // Initialize page
    await getCsrf();
    fetchProductData();
});
