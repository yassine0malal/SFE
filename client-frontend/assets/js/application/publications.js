// Configuration
const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads/';
let allPublications = [];
let allServices = [];
let currentFilter = 'all';
const DEBUG = true;

// Initialisation principale
async function initializePage() {
    try {
        if(DEBUG) console.log('[Initialisation] Démarrage...');

        // Read filter from hash if present
        const hash = window.location.hash;
        if (hash.startsWith('#service=')) {
            currentFilter = decodeURIComponent(hash.replace('#service=', ''));
        }

        const [services, publications] = await Promise.all([
            fetchData('/api/client/services'),
            fetchData('/api/client/publications')
        ]);

        if (!Array.isArray(services)) throw new Error('Format de services invalide');
        if (!Array.isArray(publications)) throw new Error('Format de publications invalide');

        allServices = services;
        allPublications = publications;

        generateServiceFilters();
        renderPublications();

    } catch (error) {
        handleError(error);
    }
}

// Fonction générique pour les requêtes fetch
async function fetchData(endpoint) {
    try {
        const response = await fetch(`/SFE-Project/backend/public${endpoint}`);
        if(!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        throw new Error(`Échec de récupération ${endpoint}: ${error.message}`);
    }
}

// Génération des filtres
function generateServiceFilters() {
    const filtersContainer = document.getElementById('filters');
    if(!filtersContainer) return;

    filtersContainer.innerHTML = '';
    filtersContainer.appendChild(createFilterButton('all', 'Tous', currentFilter === 'all'));

    allServices.forEach(service => {
        if(service.nom_service) {
            filtersContainer.appendChild(
                createFilterButton(
                    service.nom_service,
                    service.nom_service,
                    currentFilter === service.nom_service
                )
            );
        }
    });

    filtersContainer.addEventListener('click', handleFilterClick);
}

function createFilterButton(value, text, isActive = false) {
    const button = document.createElement('li');
    button.className = `filtr-button ${isActive ? 'filtr-active' : ''}`;
    button.dataset.filter = value;
    button.textContent = text;
    return button;
}

function handleFilterClick(event) {
    const target = event.target.closest('.filtr-button');
    if (!target) return;

    event.preventDefault();
    currentFilter = target.dataset.filter;
    if(DEBUG) console.log('[Filtre] Sélection:', currentFilter);

    // Change the URL hash and reload the page
    window.location.hash = `service=${encodeURIComponent(currentFilter)}`;
    window.location.reload();
}

// Rendu des publications
function renderPublications() {
    const container = document.querySelector('.bi-blog-content');
    if (!container) return;

    // Filtrer les publications visibles selon le filtre actif
    const visibles = allPublications.filter(pub =>
        currentFilter === 'all' ||
        (pub.nom_service && pub.nom_service.toLowerCase().trim() === currentFilter.toLowerCase().trim())
    );

    if (visibles.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5"><p>Aucune publication trouvée.</p></div>';
        return;
    }

    // Appliquer l'alternance sur les éléments visibles uniquement
    container.innerHTML = visibles.map((pub, idx) => `
        <div class="bi-blog-item bi-img-animation ${idx % 2 ? 'right_align_content' : ''}">
            <div class="row">
                ${idx % 2
                    ? textColumn(pub) + imageColumn(getImagePath(pub), pub)
                    : imageColumn(getImagePath(pub), pub) + textColumn(pub)
                }
            </div>
        </div>
    `).join('');
}

// Helper pour l'image
function getImagePath(publication) {
    let imagePath = 'assets/img/user/about.jpg';
    try {
        const images = parseImages(publication.images);
        if(images.length > 0) {
            const firstImage = images[0].trim().replace(/^\//, '');
            imagePath = `${BASE_IMAGE_URL}${firstImage}`;
        }
    } catch (error) {}
    return imagePath;
}

function renderPublicationItem(publication, index) {
    if(!publication?.id_publication) {
        console.warn('Publication invalide:', publication);
        return '';
    }

    // Gestion des images
    let imagePath = 'assets/img/user/about.jpg';
    try {
        const images = parseImages(publication.images);
        if(images.length > 0) {
            const firstImage = images[0].trim().replace(/^\//, '');
            imagePath = `${BASE_IMAGE_URL}${firstImage}`;
            
            // Préchargement et gestion d'erreur
            const img = new Image();
            img.src = imagePath;
            img.onerror = () => {
                console.error(`Image manquante: ${imagePath}`);
                imagePath = 'assets/img/user/about.jpg';
            };
        }
    } catch (error) {
        console.warn('Erreur traitement images:', error);
    }
    
    setTimeout(() => {
        document.querySelectorAll('.bi-blog-item').forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.transform = 'none';
        });
    }, 1);
    return `
        <div class="bi-blog-item bi-img-animation ${index % 2 ? 'right_align_content' : ''}">
            <div class="row">
                ${index % 2 ? textColumn(publication) + imageColumn(imagePath, publication) 
                           : imageColumn(imagePath, publication) + textColumn(publication)}
            </div>
        </div>
    `;
    
}

// Helpers
function parseImages(images) {
    if(!images) return [];
    if(Array.isArray(images)) return images;
    if(typeof images === 'string') {
        try { return JSON.parse(images); } 
        catch { return images.split(','); }
    }
    return [];
}

function imageColumn(imagePath, publication) {
    return `
        <div class="col-lg-6 d-flex align-items-center justify-content-center">
            <div class="bi-blog-img blog-img-large">
                <img src="${imagePath}" 
                     alt="${publication.title || 'Image de publication'}" 
                     onerror="this.src='assets/img/user/about.jpg'">
            </div>
        </div>
    `;
}

function textColumn(publication) {
    const description = publication.description 
        ? `${publication.description.substring(0, 200)}${publication.description.length > 200 ? '...' : ''}`
        : '';

    return `
        <div class="col-lg-6 d-flex align-items-center">
            <div class="bi-blog-text-area headline pera-content w-100">
                <div class="bi-blog-meta text-uppercase position-relative">
                    <a href="#"><i class="fal fa-calendar-alt"></i> ${publication.nom_service || ''}</a>
                </div>
                <div class="bi-blog-text">
                    <h3 class="tx-split-text split-in-right">${publication.title || 'Sans titre'}</h3>
                    <div class="bins-text">
                        <p>${description}</p>
                    </div>
                    <div class="bi-btn-1 bi-btn-area text-uppercase">
                        <a class="bi-btn-main bi-btn-hover bi-btn-item" 
                           href="portfolio-single.html?id=${publication.id_publication}">
                            <span></span> Voir plus
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Gestion des erreurs
function handleError(error) {
    console.error('[Erreur]', error);
    const container = document.querySelector('.bi-blog-content');
    if(container) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-danger">
                    ${error.message}<br>
                    Veuillez rafraîchir la page
                </p>
            </div>
        `;
    }
}

// Démarrage
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});