class RouteValidator {
    constructor() {
        this.basePath = '/SFE-Project/client-frontend';
        this.validRoutes = {
            'index-4.html': [],
            'about.html': [],
            'service.html': ['id'],
            'produit-details.html': ['id_galerie'],
            'portfolio-single.html': ['id'],
            'blog-1.html': [],
            'blog-2.html': [],
            '404.html': []
        };
    }

    validateRoute() {
        const currentPath = window.location.pathname
            .replace(this.basePath, '')
            .replace(/^\//, '');
            
        // Check if page exists in valid routes
        if (!this.validRoutes.hasOwnProperty(currentPath)) {
            this.redirect404();
            return false;
        }

        // Check required parameters
        const requiredParams = this.validRoutes[currentPath];
        if (requiredParams.length > 0) {
            const urlParams = new URLSearchParams(window.location.search);
            for (const param of requiredParams) {
                if (!urlParams.has(param) || !urlParams.get(param)) {
                    this.redirect404();
                    return false;
                }
            }
        }

        return true;
    }

    redirect404() {
        window.location.href = `${this.basePath}/404.html`;
    }
}