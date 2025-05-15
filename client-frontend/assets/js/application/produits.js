document.addEventListener('DOMContentLoaded', function() {
    const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads/';
    const produitsList = document.getElementById('produits-list');
    const paginationContainer = document.querySelector('.bi-pagination ul');
    
    // Pagination settings
    const itemsPerPage = 9;
    let currentPage = 1;
    let allProduits = [];
    
    fetch('/SFE-Project/backend/public/api/client/produits')
        .then(res => res.json())
        .then(produits => {
            // Filtrer les objets vides éventuels
            allProduits = produits.filter(p => p && p.id_galerie);
            if (!Array.isArray(allProduits) || allProduits.length === 0) {
                produitsList.innerHTML = '<div class="col-12 text-center py-5"><p>Aucun produit trouvé.</p></div>';
                if (paginationContainer) {
                    paginationContainer.parentElement.style.display = 'none';
                }
                return;
            }
            
            // Initialize pagination
            renderPagination(allProduits.length, itemsPerPage);
            
            // Display first page
            displayProducts(currentPage);
        })
        .catch((error) => {
            console.error('Error fetching products:', error);
            produitsList.innerHTML = '<div class="col-12 text-center py-5"><p>Erreur lors du chargement des produits.</p></div>';
            if (paginationContainer) {
                paginationContainer.parentElement.style.display = 'none';
            }
        });
    
    // Function to display products for the current page
    function displayProducts(page) {
        // Calculate start and end indices
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // Get current page products
        const currentProducts = allProduits.slice(startIndex, endIndex);
        
        // Render products
        produitsList.innerHTML = currentProducts.map((prod) => {
            // Utilise la première image si dispo, sinon une image par défaut
            let image = 'assets/img/blog/bfd1.png';
            if (prod.first_image) {
                image = BASE_IMAGE_URL + prod.first_image;
            } else if (prod.images && prod.images.length > 0) {
                image = BASE_IMAGE_URL + prod.images[0];
            }
            
            const hasPromotion = prod.promotion && parseFloat(prod.promotion) > 0;
            const originalPrice = parseFloat(prod.prix);
            const discountPercent = parseFloat(prod.promotion);
            const discountedPrice = originalPrice - (originalPrice * (discountPercent / 100));

            return `
            <div class="col-lg-4 col-md-6">
                <div class="bi-blog-feed-item-2">
                    <div class="blog-img position-relative">
                        <a href="produit-details.html?id_galerie=${
                          prod.id_galerie
                        }">
                            <img src="${image}" alt="${prod.title || ""}">
                        </a>
                        <div class="blog-meta text-uppercase position-absolute" style="color=#000">
                            <i class="fas fa-money-bill-wave" style="color:#F1F507"></i>
                            <div style="font-size:1.5rem; font-weight:bold; color:#E31A37; background:#fff; border-radius:8px; padding:8px 13px; display:inline-block; ">
                                ${
                                  hasPromotion
                                    ? `<span style="text-decoration: line-through; color: #888; font-size:1.0rem; margin-right:10px;">
                                          ${prod.prix} DH
                                       </span>
                                       <span style="color:#F1C507; font-size:1.2rem;">
                                          ${discountedPrice.toFixed(2)} DH
                                       </span>`
                                    : `<span style="color:#E31A37;"><strong>${prod.prix}</strong> DH</span>`
                                }
                            </div>
                        </div>
                    </div>
                    <div class="blog-text headline pera-content">
                        <h3>
                            <a href="produit-details.html?id_galerie=${
                              prod.id_galerie
                            }">
                                ${prod.title || "Sans titre"}
                            </a>
                        </h3>
                        <p>${prod.sub_description || "Sans description"}</p>
                    </div>
                </div>
            </div>
            <br><br><br><br>
            `;
        }).join('');
        
        // Update active page in pagination - re-render the entire pagination
        renderPagination(allProduits.length, itemsPerPage);
    }
    
    // Function to render pagination
    function renderPagination(totalItems, itemsPerPage) {
        if (!paginationContainer) return;
        
        // Calculate total pages
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        if (totalPages <= 1) {
            // Hide pagination if only one page
            paginationContainer.parentElement.style.display = 'none';
            return;
        }
        
        // Make sure pagination is visible
        paginationContainer.parentElement.style.display = 'block';
        
        // Clear existing pagination
        paginationContainer.innerHTML = '';
        
        // Add CSS to highlight active page
        const style = document.createElement('style');
        style.textContent = `
            .bi-pagination ul li.active a {
                background-color: #FF3838;
                color: white;
            }
        `;
        document.head.appendChild(style);
        
        // Previous button
        const prevLi = document.createElement('li');
        const prevLink = document.createElement('a');
        prevLink.href = "#";
        prevLink.innerHTML = '<i class="fal fa-chevron-double-left"></i>';
        prevLink.onclick = function(e) {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                displayProducts(currentPage);
                window.scrollTo(0, 0);
            }
        };
        prevLi.appendChild(prevLink);
        paginationContainer.appendChild(prevLi);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageLi = document.createElement('li');
            const pageLink = document.createElement('a');
            
            pageLink.href = "#";
            pageLink.textContent = i;
            
            // Set active class
            if (i === currentPage) {
                pageLi.className = 'active';
            }
            
            pageLink.onclick = function(e) {
                e.preventDefault();
                currentPage = i;
                displayProducts(currentPage);
                window.scrollTo(0, 0);
            };
            
            pageLi.appendChild(pageLink);
            paginationContainer.appendChild(pageLi);
        }
        
        // Next button
        const nextLi = document.createElement('li');
        const nextLink = document.createElement('a');
        nextLink.href = "#";
        nextLink.innerHTML = '<i class="fal fa-chevron-double-right"></i>';
        nextLink.onclick = function(e) {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                displayProducts(currentPage);
                window.scrollTo(0, 0);
            }
        };
        nextLi.appendChild(nextLink);
        paginationContainer.appendChild(nextLi);
    }
});

