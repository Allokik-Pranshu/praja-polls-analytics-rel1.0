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

    // No animation for state cards to avoid any display issues
    // Cards will display normally without any fade-in effects

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
        // Wait for the up-data.js to load with retry mechanism
        let retryCount = 0;
        const maxRetries = 10;
        
        function tryLoadUPData() {
            if (typeof upConstituencyData !== 'undefined' && upConstituencyData.length > 0) {
                console.log('UP data loaded successfully, rendering table...');
                loadUPConstituencyData();
            } else if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Waiting for UP data... Retry ${retryCount}/${maxRetries}`);
                setTimeout(tryLoadUPData, 150);
            } else {
                console.error('Failed to load UP data after multiple retries');
                const tbody = document.querySelector('.constituency-table tbody');
                if (tbody) {
                    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #dc2626;"><i class="fas fa-exclamation-triangle"></i> Error: Failed to load constituency data. Please refresh the page.</td></tr>';
                }
            }
        }
        
        // Start trying immediately
        tryLoadUPData();
    }
});

// UP Constituency data is loaded from up-data.js


// Pagination functionality
let currentPage = 1;
let recordsPerPage = 25;
let allConstituencyData = [];
let filteredConstituencyData = []; // For search results

// Function to load UP constituency data with pagination
function loadUPConstituencyData() {
    console.log('loadUPConstituencyData called');
    
    try {
        // Check if upConstituencyData is available (loaded from up-data.js)
        if (typeof upConstituencyData === 'undefined' || !upConstituencyData || upConstituencyData.length === 0) {
            console.error('upConstituencyData not found or empty. Make sure up-data.js is loaded.');
            const tbody = document.querySelector('.constituency-table tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #dc2626;"><i class="fas fa-exclamation-triangle"></i> Error: UP constituency data not loaded. Please refresh the page.</td></tr>';
            }
            return;
        }

        console.log(`Loading ${upConstituencyData.length} constituency records`);
        allConstituencyData = upConstituencyData;
        filteredConstituencyData = upConstituencyData; // Initialize filtered data

        // Create pagination controls at top
        createTopPaginationControls();

        // Load first page - this will clear the loading message
        loadPage(1);

        // Create pagination controls at bottom
        createBottomPaginationControls();

        // Update statistics
        updateConstituencyStats(allConstituencyData);
        
        console.log('UP constituency data loaded successfully');

    } catch (error) {
        console.error('Error loading UP constituency data:', error);
        // Fallback: show error message
        const tbody = document.querySelector('.constituency-table tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #dc2626;"><i class="fas fa-exclamation-triangle"></i> Error loading constituency data. Please try refreshing the page.</td></tr>';
        }
    }
}

// Function to filter UP constituencies based on search query
function filterUPConstituencies(searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
        // If search is empty, show all data
        filteredConstituencyData = allConstituencyData;
    } else {
        // Filter data based on search query
        filteredConstituencyData = allConstituencyData.filter(record => {
            return (
                (record.state && record.state.toLowerCase().includes(query)) ||
                (record.constituency && record.constituency.toLowerCase().includes(query)) ||
                (record.party && record.party.toLowerCase().includes(query))
            );
        });
    }
    
    // Reset to first page and reload
    currentPage = 1;
    loadPage(1);
}

// Function to load a specific page
function loadPage(pageNumber) {
    const tbody = document.querySelector('.constituency-table tbody');
    if (!tbody) {
        console.error('Table tbody not found');
        return;
    }

    // Clear existing content (including loading message)
    tbody.innerHTML = '';

    // Use filtered data instead of all data
    const dataToDisplay = filteredConstituencyData || allConstituencyData;

    // Validate data
    if (!dataToDisplay || dataToDisplay.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #dc2626;">No constituency data found</td></tr>';
        return;
    }

    // Calculate start and end indices
    const startIndex = (pageNumber - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, dataToDisplay.length);

    console.log(`Loading page ${pageNumber}: records ${startIndex + 1} to ${endIndex}`);

    // Generate table rows for current page
    for (let i = startIndex; i < endIndex; i++) {
        const record = dataToDisplay[i];
        const row = createConstituencyRow(record, i + 1);
        tbody.appendChild(row);
    }

    currentPage = pageNumber;
    updatePaginationControls();
    
    // Scroll to top of table
    const tableContainer = document.querySelector('.constituency-data-table');
    if (tableContainer && pageNumber > 1) {
        tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

    // Left side - Search and Records per page selector
    const leftControls = document.createElement('div');
    leftControls.style.cssText = 'display: flex; align-items: center; gap: 15px; flex-wrap: wrap;';

    // Search box
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = 'display: flex; align-items: center; gap: 8px;';
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search';
    searchIcon.style.cssText = 'color: #6b7280;';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search district, constituency, party...';
    searchInput.className = 'constituency-search-input';
    searchInput.style.cssText = `
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
        width: 280px;
        outline: none;
        transition: border-color 0.2s;
    `;
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#3b82f6';
    });
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = '#d1d5db';
    });
    searchInput.addEventListener('input', (e) => {
        filterUPConstituencies(e.target.value);
    });
    
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);

    // Records per page selector
    const recordsContainer = document.createElement('div');
    recordsContainer.style.cssText = 'display: flex; align-items: center; gap: 10px;';
    
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

    recordsContainer.appendChild(recordsLabel);
    recordsContainer.appendChild(recordsSelect);
    recordsContainer.appendChild(recordsPerPageLabel);

    leftControls.appendChild(searchContainer);
    leftControls.appendChild(recordsContainer);

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
    const dataToDisplay = filteredConstituencyData || allConstituencyData;
    const totalPages = Math.ceil(dataToDisplay.length / recordsPerPage);

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
        const endRecord = Math.min(currentPage * recordsPerPage, dataToDisplay.length);
        pageInfo.textContent = `${startRecord}-${endRecord} of ${dataToDisplay.length}`;

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
    const closeResults = data.filter(record => {
        const margin = parseInt(record.margin);
        return margin && Math.abs(margin) <= 1000;
    }).length;

    // Calculate accuracy (assuming correct predictions where margin exists and is reasonable)
    const accurateResults = data.filter(record => {
        const margin = parseInt(record.margin);
        return margin && Math.abs(margin) <= 5000; // Within 5000 votes considered accurate
    }).length;


}