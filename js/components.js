// Component templates (embedded for file:// protocol compatibility)
const ComponentTemplates = {
    header: `
<nav class="navbar">
    <div class="nav-container">
        <div class="nav-logo">
            <img src="../images/ppalogo.svg" alt="Praja Poll Analytics Logo">
            <h2>Praja Poll Analytics</h2>
        </div>
        <ul class="nav-menu">
            <li class="nav-item">
                <a href="home.html" class="nav-link" data-page="home">Home</a>
            </li>
            <li class="nav-item">
                <a href="states.html" class="nav-link" data-page="states">States</a>
            </li>
            <li class="nav-item">
                <a href="about.html" class="nav-link" data-page="about">About Us</a>
            </li>
            <li class="nav-item">
                <a href="contact.html" class="nav-link" data-page="contact">Contact</a>
            </li>
        </ul>
        <div class="hamburger">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
    </div>
</nav>`,

    headerStates: `
<nav class="navbar">
    <div class="nav-container">
        <div class="nav-logo">
            <img src="../images/ppalogo.svg" alt="Praja Poll Analytics Logo">
            <h2>Praja Poll Analytics</h2>
        </div>
        <ul class="nav-menu">
            <li class="nav-item">
                <a href="../pages/home.html" class="nav-link" data-page="home">Home</a>
            </li>
            <li class="nav-item">
                <a href="../pages/states.html" class="nav-link" data-page="states">States</a>
            </li>
            <li class="nav-item">
                <a href="../pages/about.html" class="nav-link" data-page="about">About Us</a>
            </li>
            <li class="nav-item">
                <a href="../pages/contact.html" class="nav-link" data-page="contact">Contact</a>
            </li>
        </ul>
        <div class="hamburger">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
    </div>
</nav>`,

    footer: `
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                    <div class="footer-logo-container">
                        <img src="../images/ppalogo.svg" alt="Praja Poll Analytics Logo" class="logo-medium">
                    </div>
                    <h3>Praja Poll Analytics</h3>
                </div>
                <p>Decoding Democracy with Data</p>
                <div class="social-links">
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-linkedin"></i></a>
                    <a href="#"><i class="fab fa-facebook"></i></a>
                </div>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="../pages/home.html">Home</a></li>
                    <li><a href="../pages/states.html">States</a></li>
                    <li><a href="../pages/about.html">About Us</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
            <div class="footer-section" id="contact">
                <h4>Contact Info</h4>
                <p><i class="fas fa-envelope"></i> info@prajapollsanalytics.com</p>
                <p><i class="fas fa-phone"></i> +91 99811 92939</p>
                <p><i class="fas fa-map-marker-alt"></i> 126, SLV Green Meadows, Near IRR, Ramavarappadu, Vijayawada, NTR District, Andhra Pradesh, India</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Praja Poll Analytics. All rights reserved.</p>
            <p class="disclaimer">Disclaimer: All predictions are based on statistical analysis and may vary from actual results.</p>
        </div>
    </div>
</footer>`,

    stateSidebar: `
<aside class="sidebar">
    <h3>Select State</h3>
    <ul class="state-nav">
        <li><a href="uttar-pradesh.html" data-state="uttar-pradesh">Uttar Pradesh</a></li>
        <li><a href="andhra-pradesh.html" data-state="andhra-pradesh">Andhra Pradesh</a></li>
        <li><a href="bihar.html" data-state="bihar">Bihar</a></li>
    </ul>
    
    <div class="sidebar-note">
        <h4><i class="fas fa-info-circle"></i> Available States</h4>
        <p>Currently showing detailed election analysis for states where we have comprehensive survey data.</p>
        <p class="coming-soon">More states coming soon...</p>
    </div>
</aside>`
};

// Component loader utility
class ComponentLoader {
    static async loadComponent(componentPath, targetSelector, fallbackTemplate = null) {
        const targetElement = document.querySelector(targetSelector);
        if (!targetElement) {
            console.error(`Target element not found: ${targetSelector}`);
            return;
        }

        // Try to load from file first (for web server)
        try {
            const response = await fetch(componentPath);
            if (response.ok) {
                const html = await response.text();
                targetElement.innerHTML = html;
                return;
            }
        } catch (error) {
            // Silently fall back to embedded template
        }

        // Fallback to embedded template
        if (fallbackTemplate) {
            targetElement.innerHTML = fallbackTemplate;
        }
    }

    static async loadHeader(targetSelector = '#header-placeholder') {
        const isStatePage = window.location.pathname.includes('/states/');

        if (isStatePage) {
            await this.loadComponent('../components/header-states.html', targetSelector, ComponentTemplates.headerStates);
        } else {
            await this.loadComponent('../components/header.html', targetSelector, ComponentTemplates.header);
        }

        this.setActiveNavItem();
    }

    static async loadFooter(targetSelector = '#footer-placeholder') {
        await this.loadComponent('../components/footer.html', targetSelector, ComponentTemplates.footer);
    }

    static async loadStateSidebar(targetSelector = '#sidebar-placeholder', currentState = '') {
        await this.loadComponent('../components/state-sidebar.html', targetSelector, ComponentTemplates.stateSidebar);
        this.setActiveStateItem(currentState);
    }

    static setActiveNavItem() {
        setTimeout(() => {
            const currentPage = document.body.getAttribute('data-page');
            if (currentPage) {
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-page') === currentPage) {
                        link.classList.add('active');
                    }
                });
            }
        }, 100);
    }

    static setActiveStateItem(currentState) {
        setTimeout(() => {
            if (currentState) {
                const stateLinks = document.querySelectorAll('.state-nav a');
                stateLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-state') === currentState) {
                        link.classList.add('active');
                    }
                });
            }
        }, 100);
    }

    // Initialize all components for a page
    static async initializePage(pageType = 'default', currentState = '') {
        await this.loadHeader();
        await this.loadFooter();

        if (pageType === 'state') {
            await this.loadStateSidebar('#sidebar-placeholder', currentState);
        }

        // Load main.js functionality after components are loaded
        setTimeout(() => {
            if (window.initializeMainJS) {
                window.initializeMainJS();
            }
        }, 200);
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const pageType = document.body.getAttribute('data-page-type') || 'default';
    const currentState = document.body.getAttribute('data-current-state') || '';

    ComponentLoader.initializePage(pageType, currentState);
});