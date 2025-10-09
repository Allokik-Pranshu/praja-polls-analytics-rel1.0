// State Filter Functionality with Enhanced Mobile Support
document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const stateCards = document.querySelectorAll('.state-card-detailed');
    const statesGrid = document.querySelector('.all-states-grid');

    // Filter functionality
    if (filterButtons.length > 0 && stateCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                // Add loading animation
                if (statesGrid) {
                    statesGrid.style.opacity = '0.7';
                }

                setTimeout(() => {
                    stateCards.forEach((card, index) => {
                        if (filter === 'all') {
                            card.style.display = 'flex';
                            // Stagger animation for visible cards
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, index * 100);
                        } else {
                            const cardStatus = card.getAttribute('data-status');
                            if (cardStatus === filter) {
                                card.style.display = 'flex';
                                setTimeout(() => {
                                    card.style.opacity = '1';
                                    card.style.transform = 'translateY(0)';
                                }, index * 100);
                            } else {
                                card.style.opacity = '0';
                                card.style.transform = 'translateY(20px)';
                                setTimeout(() => {
                                    card.style.display = 'none';
                                }, 300);
                            }
                        }
                    });

                    // Restore grid opacity
                    if (statesGrid) {
                        statesGrid.style.opacity = '1';
                    }
                }, 100);
            });
        });
    }

    // Enhanced animation for state cards with mobile optimization
    const stateCardsDetailed = document.querySelectorAll('.state-card-detailed');
    const isMobile = window.innerWidth <= 768;

    stateCardsDetailed.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        // Reduce animation delay on mobile for better performance
        const delay = isMobile ? index * 50 : index * 100;
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + delay);
    });

    // Add touch feedback for mobile devices
    if ('ontouchstart' in window) {
        filterButtons.forEach(button => {
            button.addEventListener('touchstart', function () {
                this.style.transform = 'scale(0.95)';
            });

            button.addEventListener('touchend', function () {
                this.style.transform = 'scale(1)';
            });
        });

        stateCardsDetailed.forEach(card => {
            const button = card.querySelector('.btn');
            if (button) {
                button.addEventListener('touchstart', function () {
                    this.style.transform = 'scale(0.95)';
                });

                button.addEventListener('touchend', function () {
                    this.style.transform = 'scale(1)';
                });
            }
        });
    }

    // Responsive grid adjustment on window resize
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate animations for new screen size
            const newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== isMobile) {
                location.reload(); // Simple solution for major layout changes
            }
        }, 250);
    });

    // Intersection Observer for scroll animations (performance optimized)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe coming soon section
        const comingSoonSection = document.querySelector('.coming-soon-section');
        if (comingSoonSection) {
            observer.observe(comingSoonSection);
        }
    }

    // Add keyboard navigation support
    filterButtons.forEach((button, index) => {
        button.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft' && index > 0) {
                filterButtons[index - 1].focus();
            } else if (e.key === 'ArrowRight' && index < filterButtons.length - 1) {
                filterButtons[index + 1].focus();
            }
        });
    });

    // Performance optimization: Debounce scroll events
    let ticking = false;
    function updateScrollPosition() {
        // Add any scroll-based animations here
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    });

    // Load UP constituency data if on UP page
    if (document.body.dataset.currentState === 'uttar-pradesh') {
        // Wait a bit for the up-data.js to load, then load constituency data
        setTimeout(loadUPConstituencyData, 100);
    }
});

// UP Constituency data is loaded from up-data.js


// Pagination functionality
let currentPage = 1;
let recordsPerPage = 25;
let allConstituencyData = [];

// Function to load UP constituency data with pagination
function loadUPConstituencyData() {
    console.log('Loading UP constituency data...');
    try {
        // Check if upConstituencyData is available (loaded from up-data.js)
        if (typeof upConstituencyData === 'undefined') {
            console.error('upConstituencyData not found. Make sure up-data.js is loaded.');
            return;
        }

        allConstituencyData = upConstituencyData;
        console.log('Data loaded successfully, records:', allConstituencyData.length);

        // Create pagination controls at top
        createTopPaginationControls();

        // Load first page
        loadPage(1);

        // Create pagination controls at bottom
        createBottomPaginationControls();

        // Update statistics
        updateConstituencyStats(allConstituencyData);

    } catch (error) {
        console.error('Error loading UP constituency data:', error);
        // Fallback: show error message
        const tbody = document.querySelector('.constituency-table tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Error loading constituency data</td></tr>';
        }
    }
}

// Function to load a specific page
function loadPage(pageNumber) {
    const tbody = document.querySelector('.constituency-table tbody');
    if (!tbody) return;

    // Clear existing content
    tbody.innerHTML = '';

    // Calculate start and end indices
    const startIndex = (pageNumber - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, allConstituencyData.length);

    // Generate table rows for current page
    for (let i = startIndex; i < endIndex; i++) {
        const record = allConstituencyData[i];
        const row = createConstituencyRow(record, i + 1);
        tbody.appendChild(row);
    }

    currentPage = pageNumber;
    updatePaginationControls();
}

// Function to create top pagination controls
function createTopPaginationControls() {
    const tableContainer = document.querySelector('.constituency-data-table');
    if (!tableContainer) return;

    // Remove existing top pagination
    const existingTopPagination = tableContainer.querySelector('.top-pagination-controls');
    if (existingTopPagination) {
        existingTopPagination.remove();
    }

    // Create top pagination container
    const topPaginationDiv = document.createElement('div');
    topPaginationDiv.className = 'top-pagination-controls pagination-controls';
    topPaginationDiv.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 15px;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
    `;

    // Left side - Records per page selector
    const leftControls = document.createElement('div');
    leftControls.style.cssText = 'display: flex; align-items: center; gap: 10px;';

    const recordsLabel = document.createElement('span');
    recordsLabel.textContent = 'Show:';
    recordsLabel.style.cssText = 'font-weight: 500; color: #374151;';

    const recordsSelect = document.createElement('select');
    recordsSelect.className = 'records-per-page-select';
    recordsSelect.innerHTML = `
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
    `;
    recordsSelect.value = recordsPerPage;
    recordsSelect.onchange = (e) => {
        recordsPerPage = parseInt(e.target.value);
        currentPage = 1;
        loadPage(1);
        updatePaginationControls();
    };

    const recordsPerPageLabel = document.createElement('span');
    recordsPerPageLabel.textContent = 'records per page';
    recordsPerPageLabel.style.cssText = 'color: #6b7280;';

    leftControls.appendChild(recordsLabel);
    leftControls.appendChild(recordsSelect);
    leftControls.appendChild(recordsPerPageLabel);

    // Right side - Page navigation
    const rightControls = document.createElement('div');
    rightControls.className = 'page-navigation';
    rightControls.style.cssText = 'display: flex; align-items: center; gap: 10px;';

    topPaginationDiv.appendChild(leftControls);
    topPaginationDiv.appendChild(rightControls);

    // Insert before the table
    const table = tableContainer.querySelector('table');
    tableContainer.insertBefore(topPaginationDiv, table);
}

// Function to create bottom pagination controls
function createBottomPaginationControls() {
    const tableContainer = document.querySelector('.constituency-data-table');
    if (!tableContainer) return;

    // Remove existing bottom pagination
    const existingBottomPagination = tableContainer.querySelector('.bottom-pagination-controls');
    if (existingBottomPagination) {
        existingBottomPagination.remove();
    }

    // Create bottom pagination container
    const bottomPaginationDiv = document.createElement('div');
    bottomPaginationDiv.className = 'bottom-pagination-controls pagination-controls';
    bottomPaginationDiv.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
        padding: 20px;
    `;

    const pageNavigation = document.createElement('div');
    pageNavigation.className = 'page-navigation';
    pageNavigation.style.cssText = 'display: flex; align-items: center; gap: 10px;';

    bottomPaginationDiv.appendChild(pageNavigation);
    tableContainer.appendChild(bottomPaginationDiv);
}

// Function to update pagination controls
function updatePaginationControls() {
    const totalPages = Math.ceil(allConstituencyData.length / recordsPerPage);

    // Update both top and bottom navigation
    const pageNavigations = document.querySelectorAll('.page-navigation');

    pageNavigations.forEach(nav => {
        nav.innerHTML = '';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Previous';
        prevBtn.className = 'pagination-btn';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                loadPage(currentPage - 1);
            }
        };

        // Page numbers
        const pageNumbers = document.createElement('div');
        pageNumbers.className = 'page-numbers';
        pageNumbers.style.cssText = 'display: flex; gap: 5px;';

        // Show page numbers (with ellipsis for large ranges)
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            const firstPage = createPageButton(1);
            pageNumbers.appendChild(firstPage);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.cssText = 'padding: 8px 4px; color: #6b7280;';
                pageNumbers.appendChild(ellipsis);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = createPageButton(i);
            pageNumbers.appendChild(pageBtn);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.cssText = 'padding: 8px 4px; color: #6b7280;';
                pageNumbers.appendChild(ellipsis);
            }
            const lastPage = createPageButton(totalPages);
            pageNumbers.appendChild(lastPage);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.className = 'pagination-btn';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                loadPage(currentPage + 1);
            }
        };

        // Page info
        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        const startRecord = (currentPage - 1) * recordsPerPage + 1;
        const endRecord = Math.min(currentPage * recordsPerPage, allConstituencyData.length);
        pageInfo.textContent = `${startRecord}-${endRecord} of ${allConstituencyData.length}`;

        nav.appendChild(prevBtn);
        nav.appendChild(pageNumbers);
        nav.appendChild(nextBtn);
        nav.appendChild(pageInfo);
    });
}

// Helper function to create page number buttons
function createPageButton(pageNum) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = pageNum;
    pageBtn.className = `pagination-btn page-btn ${pageNum === currentPage ? 'active' : ''}`;
    pageBtn.onclick = () => loadPage(pageNum);
    return pageBtn;
}

// Function to create a constituency table row
function createConstituencyRow(record, serialNo) {
    const row = document.createElement('tr');

    // Calculate margin and determine if positive/negative
    const votes1 = parseInt(record.votes1) || 0;
    const votes2 = parseInt(record.votes2) || 0;
    const margin = record.margin && record.margin !== '-' ? parseInt(record.margin) : null;

    // Format numbers with commas
    const formatNumber = (num) => {
        if (!num || num === '-') return '-';
        return parseInt(num).toLocaleString('en-IN');
    };

    // Determine party badge class
    const getPartyBadge = (party) => {
        const partyLower = party.toLowerCase();
        if (partyLower.includes('bjp')) return 'bjp'; // This covers both "BJP" and "BJP-Apana Dal"
        if (partyLower.includes('sp')) return 'sp';
        if (partyLower.includes('bsp')) return 'bsp';
        if (partyLower.includes('congress')) return 'congress';
        if (partyLower.includes('rld')) return 'rld';
        return 'others';
    };

    // Format margin display
    const formatMargin = (margin, votes2) => {
        if (!margin || margin === '-' || !votes2 || votes2 === '-') {
            return '<td>-</td>';
        }
        const marginNum = parseInt(margin);
        const sign = marginNum >= 0 ? '+' : '';
        const className = marginNum >= 0 ? 'positive' : 'negative';
        return `<td class="${className}">${sign}${marginNum.toLocaleString('en-IN')}</td>`;
    };

    row.innerHTML = `
        <td>${serialNo}</td>
        <td>${record.state}</td>
        <td>${record.constituency}</td>
        <td><span class="party-badge ${getPartyBadge(record.party)}">${record.party}</span></td>
        <td>${formatNumber(record.votes1)}</td>
        <td>${formatNumber(record.votes2)}</td>
        ${formatMargin(record.margin, record.votes2)}
    `;

    return row;
}

// Function to update constituency statistics
function updateConstituencyStats(data) {
    const totalConstituencies = data.length;
    const validResults = data.filter(record => record.votes2 && record.votes2 !== '-').length;
    const closeResults = data.filter(record => {
        const margin = parseInt(record.margin);
        return margin && Math.abs(margin) <= 1000;
    }).length;

    // Calculate accuracy (assuming correct predictions where margin exists and is reasonable)
    const accurateResults = data.filter(record => {
        const margin = parseInt(record.margin);
        return margin && Math.abs(margin) <= 5000; // Within 5000 votes considered accurate
    }).length;

    // Update stat cards
    const statCards = document.querySelectorAll('.constituency-stats .stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('.stat-number').textContent = totalConstituencies;
        statCards[1].querySelector('.stat-number').textContent = accurateResults;
        statCards[2].querySelector('.stat-number').textContent = `${((accurateResults / totalConstituencies) * 100).toFixed(1)}%`;
        statCards[3].querySelector('.stat-number').textContent = closeResults;
    }
}