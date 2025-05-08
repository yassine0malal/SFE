// Configuration
const BASE_IMAGE_URL = 'http://localhost/SFE-Project/backend/public/uploads/';

// Fetch and display publications
function fetchAndDisplayPublications() {
    console.log('Fetching publications...');
    
    // Get the container
    const container = document.querySelector('.bi-blog-content');
    if (!container) {
        console.error('Blog content container not found');
        return;
    }
    
    // Show loading state
    container.innerHTML = '<div class="col-12 text-center py-5"><p>Loading publications...</p></div>';
    
    // Fetch the data
    fetch('/SFE-Project/backend/public/api/client/publications')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.json();
        })
        .then(publications => {
            console.log('Publications fetched successfully:', publications.length);
            
            // Clear container
            container.innerHTML = '';
            
            if (publications.length === 0) {
                container.innerHTML = '<div class="col-12 text-center py-5"><p>No publications found.</p></div>';
                return;
            }
            
            // Render each publication
            publications.forEach((publication, idx) => {
                const publicationHTML = renderPublicationItem(publication, idx);
                container.insertAdjacentHTML('beforeend', publicationHTML);
            });
        })
        .catch(error => {
            console.error('Error fetching publications:', error);
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-danger">Failed to load publications. Please refresh the page or try again later.</p>
                </div>
            `;
        });
}

// Render a single publication item
function renderPublicationItem(publication, index) {
    console.log('Rendering publication:', publication.title || 'Untitled');
    
    // Safety check for publication object
    if (!publication || typeof publication !== 'object') {
        console.error('Invalid publication data:', publication);
        return '';
    }
    
    const rowClass = index % 2 === 0 ? '' : 'right_align_content';
    
    // Handle image path with robust checks
    let imagePath = 'assets/img/user/about.jpg'; // Default image
    if (publication.images) {
        if (typeof publication.images === 'string') {
            // Handle case where images might be a JSON string
            try {
                const parsedImages = JSON.parse(publication.images);
                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                    let img = parsedImages[0].startsWith('/') ? parsedImages[0].substring(1) : parsedImages[0];
                    imagePath = BASE_IMAGE_URL + img;
                }
            } catch (e) {
                // If not valid JSON, treat as a single image path
                let img = publication.images.startsWith('/') ? publication.images.substring(1) : publication.images;
                imagePath = BASE_IMAGE_URL + img;
            }
        } else if (Array.isArray(publication.images) && publication.images.length > 0) {
            let img = publication.images[0].startsWith('/') ? publication.images[0].substring(1) : publication.images[0];
            imagePath = BASE_IMAGE_URL + img;
        }
    }
    
    // Create short description with safety checks
    const description = publication.description || '';
    const shortDesc = description.length > 80 ? description.substring(0, 200) + '...' : description;
    
    // Create image column
    const imageCol = `
        <div class="col-lg-6 d-flex align-items-center justify-content-center">
            <div class="bi-blog-img blog-img-large">
                <img src="${imagePath}" alt="${publication.title || 'Publication image'}" onerror="this.src='assets/img/user/about.jpg';">
            </div>
        </div>
    `;
    
    // Create text column
    const textCol = `
        <div class="col-lg-6 d-flex align-items-center">
            <div class="bi-blog-text-area headline pera-content w-100">
                <div class="bi-blog-meta text-uppercase position-relative">
                    <a href="#"><i class="fal fa-calendar-alt"></i> ${publication.nom_service || ''}</a>
                </div>
                <div class="bi-blog-text">
                    <h3 class="tx-split-text split-in-right">${publication.title || 'Untitled'}</h3>
                    <div class="bins-text">
                        <p>${shortDesc}</p>
                    </div>
                    <div class="bi-btn-1 bi-btn-area text-uppercase">
                        <a class="bi-btn-main bi-btn-hover bi-btn-item" href="portfolio-single.html?id=${publication.id_publication || ''}"><span></span> Read More</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Combine columns based on index
    return `
        <div class="bi-blog-item bi-img-animation ${rowClass}">
            <div class="row">
                ${index % 2 === 0 ? imageCol + textCol : textCol + imageCol}
            </div>
        </div>
    `;
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing publications display...');
    fetchAndDisplayPublications();
});

// Export function for external use if needed
window.displayPublications = fetchAndDisplayPublications;







    