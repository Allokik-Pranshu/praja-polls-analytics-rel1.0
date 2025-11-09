// Bihar Constituency data handling
// Pagination variables for Bihar data
let biharCurrentPage = 1;
let biharRecordsPerPage = 25;
let allBiharConstituencyData = [];

// Function to load Bihar constituency data with pagination
function loadBiharConstituencyData() {
    try {
        // Check if biharConstituencyData is available
        if (typeof biharConstituencyData === 'undefined') {
            console.error('biharConstituencyData not found. Make sure bihar-constituency-data.js is loaded.');
            const tbody = document.querySelector('.bihar-constituency-table .bihar-table tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Error: Bihar constituency data not loaded</td></tr>';
            }
            return;
        }

        allBiharConstituencyData = biharConstituencyData;

        // Create pagination controls at top
        createBiharTopPaginationControls();

        // Load first page
        loadBiharPage(1);

        // Create pagination controls at bottom
        createBiharBottomPaginationControls();

    } catch (error) {
        console.error('Error loading Bihar constituency data:', error);
        const tbody = document.querySelector('.bihar-constituency-table .bihar-table tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Error loading constituency data</td></tr>';
        }
    }
}

// Function to create a Bihar constituency table row
function createBiharConstituencyRow(record) {
    const row = document.createElement('tr');

    // Format numbers compactly (in thousands with K suffix)
    const formatNumber = (num) => {
        if (!num || num === '-' || num === null || num === undefined) return '-';
        if (typeof num === 'string' && num.trim() === '') return '-';
        const numValue = parseInt(num);
        if (numValue >= 1000) {
            return (numValue / 1000).toFixed(0) + 'K';
        }
        return numValue.toString();
    };

    // Determine party badge class
    const getPartyBadge = (party) => {
        const partyStr = party.toString().toLowerCase().trim();
        if (partyStr.includes('bjp')) return 'bjp';
        if (partyStr.includes('jdu') || partyStr.includes('jd(u)')) return 'jdu';
        if (partyStr.includes('rjd')) return 'rjd';
        if (partyStr.includes('congress')) return 'congress';
        return 'others';
    };

    row.innerHTML = `
        <td>${record.sno}</td>
        <td>${record.district}</td>
        <td>${record.constituency}</td>
        <td><span class="party-badge ${getPartyBadge(record.expectedWinningParty)}">${record.expectedWinningParty}</span></td>
        <td>${formatNumber(record.expectedVotes)}</td>
        <td>${formatNumber(record.winningMargin)}</td>
        <td><span class="party-badge ${getPartyBadge(record.runnerUpParty)}">${record.runnerUpParty}</span></td>
        <td>${formatNumber(record.runnerUpVotes)}</td>
    `;

    return row;
}

// Function to load a specific page for Bihar data
function loadBiharPage(pageNumber) {
    const tbody = document.querySelector('.bihar-constituency-table .bihar-table tbody');
    if (!tbody) return;

    // Clear existing content
    tbody.innerHTML = '';

    // Calculate start and end indices
    const startIndex = (pageNumber - 1) * biharRecordsPerPage;
    const endIndex = Math.min(startIndex + biharRecordsPerPage, allBiharConstituencyData.length);

    // Generate table rows for current page
    for (let i = startIndex; i < endIndex; i++) {
        const record = allBiharConstituencyData[i];
        const row = createBiharConstituencyRow(record);
        tbody.appendChild(row);
    }

    biharCurrentPage = pageNumber;
    updateBiharPaginationControls();
}

// Function to create top pagination controls for Bihar
function createBiharTopPaginationControls() {
    const tableContainer = document.querySelector('.bihar-constituency-table');
    if (!tableContainer) return;

    // Remove existing top pagination
    const existingTopPagination = tableContainer.querySelector('.bihar-top-pagination-controls');
    if (existingTopPagination) {
        existingTopPagination.remove();
    }

    // Create top pagination container
    const topPaginationDiv = document.createElement('div');
    topPaginationDiv.className = 'bihar-top-pagination-controls pagination-controls';
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
    recordsSelect.className = 'bihar-records-per-page-select';
    recordsSelect.innerHTML = `
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
    `;
    recordsSelect.value = biharRecordsPerPage;
    recordsSelect.onchange = (e) => {
        biharRecordsPerPage = parseInt(e.target.value);
        biharCurrentPage = 1;
        loadBiharPage(1);
        updateBiharPaginationControls();
    };

    const recordsPerPageLabel = document.createElement('span');
    recordsPerPageLabel.textContent = 'records per page';
    recordsPerPageLabel.style.cssText = 'color: #6b7280;';

    leftControls.appendChild(recordsLabel);
    leftControls.appendChild(recordsSelect);
    leftControls.appendChild(recordsPerPageLabel);

    // Right side - Page navigation
    const rightControls = document.createElement('div');
    rightControls.className = 'bihar-page-navigation';
    rightControls.style.cssText = 'display: flex; align-items: center; gap: 10px;';

    topPaginationDiv.appendChild(leftControls);
    topPaginationDiv.appendChild(rightControls);

    // Insert before the table
    const table = tableContainer.querySelector('table');
    tableContainer.insertBefore(topPaginationDiv, table);
}

// Function to create bottom pagination controls for Bihar
function createBiharBottomPaginationControls() {
    const tableContainer = document.querySelector('.bihar-constituency-table');
    if (!tableContainer) return;

    // Remove existing bottom pagination
    const existingBottomPagination = tableContainer.querySelector('.bihar-bottom-pagination-controls');
    if (existingBottomPagination) {
        existingBottomPagination.remove();
    }

    // Create bottom pagination container
    const bottomPaginationDiv = document.createElement('div');
    bottomPaginationDiv.className = 'bihar-bottom-pagination-controls pagination-controls';
    bottomPaginationDiv.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
        padding: 20px;
    `;

    const pageNavigation = document.createElement('div');
    pageNavigation.className = 'bihar-page-navigation';
    pageNavigation.style.cssText = 'display: flex; align-items: center; gap: 10px;';

    bottomPaginationDiv.appendChild(pageNavigation);
    tableContainer.appendChild(bottomPaginationDiv);
}

// Function to update pagination controls for Bihar
function updateBiharPaginationControls() {
    const totalPages = Math.ceil(allBiharConstituencyData.length / biharRecordsPerPage);

    // Update both top and bottom navigation
    const pageNavigations = document.querySelectorAll('.bihar-page-navigation');

    pageNavigations.forEach(nav => {
        nav.innerHTML = '';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Previous';
        prevBtn.className = 'pagination-btn';
        prevBtn.disabled = biharCurrentPage === 1;
        prevBtn.onclick = () => {
            if (biharCurrentPage > 1) {
                loadBiharPage(biharCurrentPage - 1);
            }
        };

        // Page numbers
        const pageNumbers = document.createElement('div');
        pageNumbers.className = 'page-numbers';
        pageNumbers.style.cssText = 'display: flex; gap: 5px;';

        // Show page numbers (with ellipsis for large ranges)
        const startPage = Math.max(1, biharCurrentPage - 2);
        const endPage = Math.min(totalPages, biharCurrentPage + 2);

        if (startPage > 1) {
            const firstPage = createBiharPageButton(1);
            pageNumbers.appendChild(firstPage);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.cssText = 'padding: 8px 4px; color: #6b7280;';
                pageNumbers.appendChild(ellipsis);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = createBiharPageButton(i);
            pageNumbers.appendChild(pageBtn);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.cssText = 'padding: 8px 4px; color: #6b7280;';
                pageNumbers.appendChild(ellipsis);
            }
            const lastPage = createBiharPageButton(totalPages);
            pageNumbers.appendChild(lastPage);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.className = 'pagination-btn';
        nextBtn.disabled = biharCurrentPage === totalPages;
        nextBtn.onclick = () => {
            if (biharCurrentPage < totalPages) {
                loadBiharPage(biharCurrentPage + 1);
            }
        };

        // Page info
        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        const startRecord = (biharCurrentPage - 1) * biharRecordsPerPage + 1;
        const endRecord = Math.min(biharCurrentPage * biharRecordsPerPage, allBiharConstituencyData.length);
        pageInfo.textContent = `${startRecord}-${endRecord} of ${allBiharConstituencyData.length}`;

        nav.appendChild(prevBtn);
        nav.appendChild(pageNumbers);
        nav.appendChild(nextBtn);
        nav.appendChild(pageInfo);
    });
}

// Helper function to create page number buttons for Bihar
function createBiharPageButton(pageNum) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = pageNum;
    pageBtn.className = `pagination-btn page-btn ${pageNum === biharCurrentPage ? 'active' : ''}`;
    pageBtn.onclick = () => loadBiharPage(pageNum);
    return pageBtn;
}

// Initialize Bihar data loading when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the Bihar page
    if (document.body.dataset.currentState === 'bihar') {
        // Wait a bit for the page to load, then load constituency data
        setTimeout(() => {
            loadBiharConstituencyData();
        }, 100);
    }
});
