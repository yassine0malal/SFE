// Configuration
const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads/images/';
const API_BASE_URL = '/SFE-Project/backend/public/api/client';
let allPublications = [];
let allServices = [];
let currentFilter = 'all';

// Debug amélioré
function debugLog(...messages) {
    if (console && console.log) {
        console.log('[DEBUG]', new Date().toISOString(), ...messages);
    }
}

// Initialisation
async function initializePage() {
    try {
        debugLog('Début de l\'initialisation');
        
        const [services, publications] = await Promise.all([
            fetchData('/services'),
            fetchData('/publications')
        ]);

        debugLog('Services reçus:', services);
        debugLog('Publications reçues:', publications);

        if (!Array.isArray(services) || !Array.isArray(publications)) {
            throw new Error(`Format de données invalide - 
                Services: ${typeof services}, 
                Publications: ${typeof publications}`);
        }

        allServices = services;
        allPublications = publications;

        generateServiceFilters();
        handleHashFilter();

    } catch (error) {
        debugLog('Erreur critique:', error);
        handleError(error);
    }
}

// Fonction fetch améliorée
async function fetchData(endpoint) {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    debugLog(`Tentative de fetch: ${fullUrl}`);

    try {
        const response = await fetch(fullUrl);
        
        debugLog(`Réponse reçue - Status: ${response.status}`, response);
        
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP ${response.status} - ${errorBody}`);
        }

        const data = await response.json();
        debugLog(`Données reçues pour ${endpoint}:`, data);
        
        return data;

    } catch (error) {
        debugLog('Erreur fetch:', error);
        throw new Error(`Échec de ${endpoint}: ${error.message}`);
    }
}

function generateServiceFilters() {
    const filtersContainer = document.getElementById('filters');
    if(!filtersContainer) return;

    filtersContainer.innerHTML = `
        <li class="filtr-button filtr-active" data-filter="all">Tous</li>
        ${allServices.map(service => `
            <li class="filtr-button" 
                data-filter="${service.service_id}"
                data-id="${service.service_id}">
                ${service.nom_service}
            </li>
        `).join('')}
    `;

    filtersContainer.querySelectorAll('.filtr-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            updateActiveFilter(this);
            const filterValue = this.dataset.filter;
            const serviceId = this.dataset.id;
            filterAndRenderPublications(filterValue, serviceId);
        });
    });
}

function filterAndRenderPublications(filterValue, serviceId) {
    const container = document.querySelector('.bi-blog-content');
    if (!container) return;

    container.style.opacity = '0';
    
    setTimeout(() => {
        const filteredPubs = filterValue === 'all' 
            ? allPublications 
            : allPublications.filter(pub => pub.id_service === serviceId);

        renderPublications(filteredPubs, filterValue);
        updateUrlHash(filterValue);
        container.style.opacity = '1';
        
        if (typeof WOW === 'function') new WOW().init();
    }, 300);
}

function renderPublications(publications, filterValue = 'all') {
    const container = document.querySelector('.bi-blog-content');
    const service = allServices.find(s => s.service_id === filterValue);
    
    // Mise à jour du titre
    const titleElement = document.getElementById('dynamic-title');
    if(titleElement) {
        titleElement.innerHTML = service 
            ? `Réalisations ${service.nom_service}`
            : 'Toutes nos réalisations';
    }

    // Génération du contenu
    container.innerHTML = `
        <div class="bi-service-grid">
            ${publications.map(pub => `
                <div class="bi-service-scroll-item position-relative wow fadeInUp">
                    <div class="service-img">
                        <img src="${getImagePath(pub)}" alt="${pub.title}">
                    </div>
                    <div class="service-text headline d-flex position-absolute align-items-center justify-content-between">
                        <h3><a href="portfolio-single.html?id=${pub.id_publication}">${pub.title}</a></h3>
                        <a class="service_more" href="portfolio-single.html?id=${pub.id_publication}">
                            <i class="fas fa-long-arrow-right"></i>
                        </a>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Helper pour obtenir l'image principale
function getImagePath(publication) {
    if (publication.image_principale) {
        return `${BASE_IMAGE_URL}${publication.image_principale}`;
    }
    return 'assets/img/user/about.jpg';
}

// Gestion des erreurs
function handleError(error) {
    console.error(error);
    const container = document.querySelector('.bi-blog-content');
    if(container) {
        container.innerHTML = `
            <div class="error-message">
                <p>Erreur de chargement des données. Veuillez réessayer.</p>
            </div>
        `;
    }
}

// Add this function to handle URL hash filtering
function handleHashFilter() {
    const hash = window.location.hash;
    if (hash.startsWith('#service=')) {
        const filterValue = decodeURIComponent(hash.replace('#service=', ''));
        const filterButton = document.querySelector(`[data-filter="${filterValue}"]`);
        if (filterButton) {
            updateActiveFilter(filterButton);
            const serviceId = filterButton.dataset.id;
            filterAndRenderPublications(filterValue, serviceId);
        }
    } else {
        // If no hash, render all publications
        renderPublications(allPublications);
    }
}

// Add this function to update active filter state
function updateActiveFilter(button) {
    const filtersContainer = document.getElementById('filters');
    if (!filtersContainer) return;

    filtersContainer.querySelectorAll('.filtr-button').forEach(btn => 
        btn.classList.remove('filtr-active'));
    button.classList.add('filtr-active');
}

// Add this function to update URL hash
function updateUrlHash(filterValue) {
    const newUrl = filterValue === 'all' 
        ? window.location.pathname
        : `${window.location.pathname}#service=${encodeURIComponent(filterValue)}`;
    window.history.pushState({ filter: filterValue }, '', newUrl);
}

// Remove any Matter.js related code if you're not using it
document.addEventListener('DOMContentLoaded', () => {
    // Remove any Matter.js initialization if present
    initializePage();
});