// document.addEventListener('DOMContentLoaded', function() {
//     const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads/';
//     const produitsList = document.getElementById('produits-list');
//     const paginationContainer = document.querySelector('.bi-pagination ul');
    
//     // Pagination settings
//     const itemsPerPage = 9;
//     let currentPage = 1;
//     let allProduits = [];
    
//     fetch('/SFE-Project/backend/public/api/client/produits')
//         .then(res => res.json())
//         .then(produits => {
//             // Filtrer les objets vides éventuels
//             allProduits = produits.filter(p => p && p.id_galerie);

//             if (!Array.isArray(allProduits) || allProduits.length === 0) {
//                 produitsList.innerHTML = '<div class="col-12 text-center py-5"><p>Aucun produit trouvé.</p></div>';
//                 return;
//             }
            
//             // Initialize pagination
//             setupPagination(allProduits.length, itemsPerPage);
            
//             // Display first page
//             displayProducts(currentPage);
//         })
//         .catch((error) => {
//             console.error('Error fetching products:', error);
//             produitsList.innerHTML = '<div class="col-12 text-center py-5"><p>Erreur lors du chargement des produits.</p></div>';
//         });
    
//     // Function to display products for the current page
//     function displayProducts(page) {
//         // Calculate start and end indices
//         const startIndex = (page - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
        
//         // Get current page products
//         const currentProducts = allProduits.slice(startIndex, endIndex);
        
//         // Render products
//         produitsList.innerHTML = currentProducts.map((prod) => {
//             // Utilise la première image si dispo, sinon une image par défaut
//             let image = 'assets/img/blog/bfd1.png';
//             if (prod.first_image) {
//                 image = BASE_IMAGE_URL + prod.first_image;
//             } else if (prod.images && prod.images.length > 0) {
//                 image = BASE_IMAGE_URL + prod.images[0];
//             }
//             return `
//             <div class="col-lg-4 col-md-6">
//                 <div class="bi-blog-feed-item-2">
//                     <div class="blog-img position-relative">
//                         <a href="produit-details.html?id_galerie=${prod.id_galerie}">
//                             <img src="${image}" alt="${prod.title || ''}">
//                         </a>
//                         <div class="blog-meta text-uppercase position-absolute">
//                             <i class="fas fa-money-bill-wave" style="color:#F1F507">&nbsp; &nbsp;<span style="color:#F1F507">${prod.prix} DH</span> </i>
//                         </div>
//                     </div>
//                     <div class="blog-text headline pera-content">
//                         <h3>
//                             <a href="produit-details.html?id_galerie=${prod.id_galerie}">
//                                 ${prod.title || 'Sans titre'}
//                             </a>
//                         </h3>
//                         <p>${prod.description ? prod.description.substring(0, 100) + '...' : ''}</p>
//                     </div>
//                 </div>
//             </div>
//             `;
//         }).join('');
        
//         // Update active page in pagination
//         updateActivePage(page);
//     }
    
//     // Function to setup pagination
//     function setupPagination(totalItems, itemsPerPage) {
//         // Calculate total pages
//         const totalPages = Math.ceil(totalItems / itemsPerPage);
        
//         if (totalPages <= 1) {
//             // Hide pagination if only one page
//             if (paginationContainer) {
//                 paginationContainer.parentElement.style.display = 'none';
//             }
//             return;
//         }
        
//         // Clear existing pagination
//         if (paginationContainer) {
//             paginationContainer.innerHTML = '';
            
//             // Previous button
//             const prevBtn = document.createElement('li');
//             prevBtn.innerHTML = '<a href="#"><i class="fal fa-chevron-double-left"></i></a>';
//             prevBtn.addEventListener('click', function(e) {
//                 e.preventDefault();
//                 if (currentPage > 1) {
//                     currentPage--;
//                     displayProducts(currentPage);
//                     window.scrollTo(0, 0);
//                 }
//             });
//             paginationContainer.appendChild(prevBtn);
            
//             // Page numbers
//             for (let i = 1; i <= totalPages; i++) {
//                 const pageItem = document.createElement('li');
//                 if (i === 1) {
//                     pageItem.classList.add('active');
//                 }
//                 pageItem.innerHTML = `<a href="#">${i}</a>`;
//                 pageItem.addEventListener('click', function(e) {
//                     e.preventDefault();
//                     currentPage = i;
//                     displayProducts(currentPage);
//                     window.scrollTo(0, 0);
//                 });
//                 paginationContainer.appendChild(pageItem);
//             }
            
//             // Next button
//             const nextBtn = document.createElement('li');
//             nextBtn.innerHTML = '<a href="#"><i class="fal fa-chevron-double-right"></i></a>';
//             nextBtn.addEventListener('click', function(e) {
//                 e.preventDefault();
//                 if (currentPage < totalPages) {
//                     currentPage++;
//                     displayProducts(currentPage);
//                     window.scrollTo(0, 0);
//                 }
//             });
//             paginationContainer.appendChild(nextBtn);
//         }
//     }
    
//     // Function to update active page in pagination
//     function updateActivePage(page) {
//         if (paginationContainer) {
//             // Remove active class from all page items
//             const pageItems = paginationContainer.querySelectorAll('li');
            
//             pageItems.forEach((item, index) => {
//                 // Skip first and last items (prev/next buttons)
//                 if (index > 0 && index < pageItems.length - 1) {
//                     // The index in the pagination is offset by 1 because of the prev button
//                     if (index === page) {
//                         item.classList.add('active');
//                     } else {
//                         item.classList.remove('active');
//                     }
//                 }
//             });
//         }
//     }
// });











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
                    const originalPrice = parseFloat(prod.prix);
                    const discountPercent = parseFloat(prod.promotion);
                    const discountedPrice = originalPrice - (originalPrice * (discountPercent / 100));
            return `
            <div class="col-lg-4 col-md-6">
                <div class="bi-blog-feed-item-2">
                    <div class="blog-img position-relative">
                        <a href="produit-details.html?id_galerie=${prod.id_galerie}">
                            <img src="${image}" alt="${prod.title || ''}">
                        </a>
                        <div class="blog-meta text-uppercase position-absolute">
                            <i class="fas fa-money-bill-wave" style="color:#F1F507">&nbsp; &nbsp;<span style="text-decoration: line-through; color: #fff;">${prod.prix} DH</span> <span style="color:#F1F507">${discountedPrice.toFixed(2)} DH</span> </i>
                        </div>
                    </div>
                    <div class="blog-text headline pera-content">
                        <h3>
                            <a href="produit-details.html?id_galerie=${prod.id_galerie}">
                                ${prod.title || 'Sans titre'}
                            </a>
                        </h3>
                        <p>${prod.description ? prod.description.substring(0, 100) + '...' : ''}</p>
                    </div>
                </div>
            </div>
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
