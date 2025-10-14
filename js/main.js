// Initialize main functionality (called after components are loaded)
function initializeMainJS() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe animated elements (exclude state-card on states page to avoid conflicts)
    const isStatesPage = document.body.getAttribute('data-page') === 'states';
    const selector = isStatesPage ? '.stat-card, .director-card, .achievement-card' : '.stat-card, .state-card, .director-card, .achievement-card';
    
    document.querySelectorAll(selector).forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Modern Sidebar functionality
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const modernSidebar = document.getElementById('modernSidebar');
    const analysisLayout = document.querySelector('.analysis-layout');
    const sidebarOverlay = document.getElementById('sidebarOverlay');



    if (sidebarToggleBtn && modernSidebar && analysisLayout) {
        // Check if we're on mobile
        function isMobile() {
            return window.innerWidth <= 1024;
        }

        // Toggle function
        function toggleSidebar() {
            if (isMobile()) {
                // Mobile behavior - show/hide sidebar
                const isActive = modernSidebar.classList.contains('active');
                
                if (isActive) {
                    modernSidebar.classList.remove('active');
                    if (sidebarOverlay) {
                        sidebarOverlay.classList.remove('active');
                    }
                } else {
                    modernSidebar.classList.add('active');
                    if (sidebarOverlay) {
                        sidebarOverlay.classList.add('active');
                    }
                }
            } else {
                // Desktop behavior - collapse/expand sidebar
                const isCollapsed = modernSidebar.classList.contains('collapsed');
                
                if (isCollapsed) {
                    modernSidebar.classList.remove('collapsed');
                    analysisLayout.classList.remove('sidebar-collapsed');
                } else {
                    modernSidebar.classList.add('collapsed');
                    analysisLayout.classList.add('sidebar-collapsed');
                }
                
                // Store sidebar state
                localStorage.setItem('modernSidebarCollapsed', !isCollapsed);
            }
            
            // Update toggle button icon
            updateToggleIcon();
        }

        // Update toggle button icon
        function updateToggleIcon() {
            const icon = sidebarToggleBtn.querySelector('i');
            if (icon) {
                if (isMobile()) {
                    const isActive = modernSidebar.classList.contains('active');
                    icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
                } else {
                    const isCollapsed = modernSidebar.classList.contains('collapsed');
                    icon.className = isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
                }
            }
            
            // Ensure button is visible
            sidebarToggleBtn.style.display = 'flex';
        }

        // Add click event listener
        sidebarToggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });

        // Overlay click to close sidebar on mobile
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', function () {
                if (isMobile()) {
                    modernSidebar.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                    updateToggleIcon();
                }
            });
        }

        // Handle window resize
        window.addEventListener('resize', function () {
            if (isMobile()) {
                // Switch to mobile mode
                modernSidebar.classList.remove('collapsed');
                analysisLayout.classList.remove('sidebar-collapsed');
                if (!modernSidebar.classList.contains('active')) {
                    if (sidebarOverlay) {
                        sidebarOverlay.classList.remove('active');
                    }
                }
            } else {
                // Switch to desktop mode
                modernSidebar.classList.remove('active');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove('active');
                }
                
                // Restore saved state
                const savedState = localStorage.getItem('modernSidebarCollapsed');
                if (savedState === 'true') {
                    modernSidebar.classList.add('collapsed');
                    analysisLayout.classList.add('sidebar-collapsed');
                }
            }
            updateToggleIcon();
        });

        // Restore sidebar state on desktop
        if (!isMobile()) {
            const savedState = localStorage.getItem('modernSidebarCollapsed');
            if (savedState === 'true') {
                modernSidebar.classList.add('collapsed');
                analysisLayout.classList.add('sidebar-collapsed');
            }
        }

        // Set active nav link
        function setActiveNavLink() {
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('.nav-link');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && currentPath.includes(href.replace('../', '').replace('.html', ''))) {
                    link.classList.add('active');
                }
            });
        }

        // Initialize
        updateToggleIcon();
        setActiveNavLink();

        // Add keyboard support
        sidebarToggleBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSidebar();
            }
        });

        // Close sidebar on escape key (mobile)
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isMobile() && modernSidebar.classList.contains('active')) {
                modernSidebar.classList.remove('active');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove('active');
                }
                updateToggleIcon();
            }
        });
    }

    // Add hover effects for interactive elements
    document.addEventListener('mouseover', function (e) {
        if (e.target.classList.contains('btn')) {
            e.target.style.transform = 'translateY(-2px)';
        }
    });

    document.addEventListener('mouseout', function (e) {
        if (e.target.classList.contains('btn')) {
            e.target.style.transform = 'translateY(0)';
        }
    });
}

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function () {
    // If components.js is not loaded, initialize directly
    if (!window.ComponentLoader) {
        initializeMainJS();
    }
});
// Video Modal Functionality
function initializeVideoModal() {
    // Create video modal HTML
    const modalHTML = `
        <div id="videoModal" class="video-modal">
            <div class="video-modal-content">
                <span class="video-modal-close">&times;</span>
                <iframe id="videoFrame" src="" allowfullscreen></iframe>
            </div>
        </div>
    `;
    
    // Add modal to body if it doesn't exist
    if (!document.getElementById('videoModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    const closeBtn = document.querySelector('.video-modal-close');
    
    // Add click event to all video thumbnails
    document.querySelectorAll('.video-thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            if (videoId) {
                const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                iframe.src = embedUrl;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal functionality
    function closeModal() {
        modal.style.display = 'none';
        iframe.src = '';
        document.body.style.overflow = 'auto';
    }
    
    // Close modal when clicking X
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Initialize video modal when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the page to fully load
    setTimeout(initializeVideoModal, 500);
});