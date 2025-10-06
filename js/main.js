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

    // Observe animated elements
    document.querySelectorAll('.stat-card, .state-card, .director-card, .achievement-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const analysisLayout = document.querySelector('.analysis-layout');

    if (sidebarToggle && sidebar && analysisLayout) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('collapsed');
            analysisLayout.classList.toggle('sidebar-collapsed');

            // Store sidebar state in localStorage
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });

        // Restore sidebar state from localStorage
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
            sidebar.classList.add('collapsed');
            analysisLayout.classList.add('sidebar-collapsed');
        }
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
// Constituency table scroll enhancement
const constituencyTable = document.querySelector('.constituency-data-table');
if (constituencyTable) {
    // Add scroll indicators
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '<i class="fas fa-arrows-alt-h"></i> Scroll to view all columns';

    // Show/hide scroll indicator based on scroll position
    constituencyTable.addEventListener('scroll', function () {
        const isScrolledToEnd = this.scrollLeft >= (this.scrollWidth - this.clientWidth - 10);
        const isAtStart = this.scrollLeft <= 10;

        if (isScrolledToEnd) {
            scrollIndicator.style.opacity = '0.5';
            scrollIndicator.innerHTML = '<i class="fas fa-arrow-left"></i> Scroll back to see previous columns';
        } else if (isAtStart) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.innerHTML = '<i class="fas fa-arrow-right"></i> Scroll to view more columns';
        } else {
            scrollIndicator.style.opacity = '0.8';
            scrollIndicator.innerHTML = '<i class="fas fa-arrows-alt-h"></i> Scroll to view all columns';
        }
    });

    // Add smooth scrolling for better UX
    let isScrolling = false;
    constituencyTable.addEventListener('wheel', function (e) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            if (!isScrolling) {
                isScrolling = true;
                this.scrollLeft += e.deltaX;
                setTimeout(() => { isScrolling = false; }, 50);
            }
        }
    });

    // Touch scroll enhancement for mobile
    let startX = 0;
    let scrollLeft = 0;

    constituencyTable.addEventListener('touchstart', function (e) {
        startX = e.touches[0].pageX - this.offsetLeft;
        scrollLeft = this.scrollLeft;
    });

    constituencyTable.addEventListener('touchmove', function (e) {
        if (!startX) return;
        e.preventDefault();
        const x = e.touches[0].pageX - this.offsetLeft;
        const walk = (x - startX) * 2;
        this.scrollLeft = scrollLeft - walk;
    });

    constituencyTable.addEventListener('touchend', function () {
        startX = 0;
    });
}