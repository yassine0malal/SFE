document.addEventListener('DOMContentLoaded', function() {
    const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads/';
    const produitsList = document.getElementById('produits-list');

    fetch('/SFE-Project/backend/public/api/client/produits')
        .then(res => res.json())
        .then(produits => {
            alert(JSON.stringify(produits));
            // Filtrer les objets vides éventuels
            produits = produits.filter(p => p && p.id_galerie);

            if (!Array.isArray(produits) || produits.length === 0) {
                produitsList.innerHTML = '<div class="col-12 text-center py-5"><p>Aucun produit trouvé.</p></div>';
                return;
            }
            produitsList.innerHTML = produits.map((prod, idx) => {
                // Utilise la première image si dispo, sinon une image par défaut
                let image = 'assets/img/blog/bfd1.png';
                if (prod.first_image) {
                    image = BASE_IMAGE_URL + prod.first_image;
                } else if (prod.images && prod.images.length > 0) {
                    image = BASE_IMAGE_URL + prod.images[0];
                }
                return `
                <div class="col-lg-4 col-md-6">
                    <div class="bi-blog-feed-item-2">
                        <div class="blog-img position-relative">
                            <a href="portfolio-single.html?id=${prod.id_galerie}">
                                <img src="${image}" alt="${prod.title || ''}">
                            </a>
                            <div class="blog-meta text-uppercase position-absolute">
                                <i class="fas fa-calendar-alt">${prod.nom_service}</i>
                            </div>
                        </div>
                        <div class="blog-text headline pera-content">
                            <h3>
                                <a href="portfolio-single.html?id=${prod.id_galerie}">
                                    ${prod.title || 'Sans titre'}
                                </a>
                            </h3>
                            <p>${prod.description ? prod.description.substring(0, 100) + '...' : ''}</p>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
        })
        .catch(() => {
            produitsList.innerHTML = '<div class="col-12 text-center py-5"><p>Erreur lors du chargement des produits.</p></div>';
        });
});