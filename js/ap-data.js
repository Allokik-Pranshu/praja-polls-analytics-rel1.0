// AP Constituency data from APSurvey.json
// This will be loaded dynamically from the JSON file

// Pagination variables for AP data
let apCurrentPage = 1;
let apRecordsPerPage = 25;
let allAPConstituencyData = [];

// Function to load AP constituency data with pagination
function loadAPConstituencyData() {

    try {
        // Check if apConstituencyData is available (loaded from ap-constituency-data.js)
        if (typeof apConstituencyData === 'undefined') {
            console.error('apConstituencyData not found. Make sure ap-constituency-data.js is loaded.');
            const tbody = document.querySelector('.ap-constituency-table .constituency-table tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="29" style="text-align: center; padding: 20px;">Error: AP constituency data not loaded</td></tr>';
            }
            return;
        }



        // Skip the first row as it contains headers
        allAPConstituencyData = apConstituencyData.slice(1);


        // Create pagination controls at top
        createAPTopPaginationControls();

        // Load first page
        loadAPPage(1);

        // Create pagination controls at bottom
        createAPBottomPaginationControls();



    } catch (error) {
        console.error('Error loading AP constituency data:', error);
        // Fallback: show error message
        const tbody = document.querySelector('.ap-constituency-table .constituency-table tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="29" style="text-align: center; padding: 20px;">Error loading constituency data</td></tr>';
        }
    }
}

// Function to create an AP constituency table row
function createAPConstituencyRow(record, serialNo) {
    const row = document.createElement('tr');

    // Format numbers with commas
    const formatNumber = (num) => {
        if (!num || num === '-' || num === null || num === undefined) return '-';
        if (typeof num === 'string' && num.trim() === '') return '-';
        return parseInt(num).toLocaleString('en-IN');
    };

    // Format percentage
    const formatPercentage = (num) => {
        if (!num || num === '-' || num === null || num === undefined) return '-';
        if (typeof num === 'string' && num.trim() === '') return '-';
        return parseFloat(num).toFixed(1) + '%';
    };

    // Clean party name
    const cleanPartyName = (party) => {
        if (!party) return '-';
        return party.toString().trim();
    };

    // Determine party badge class
    const getPartyBadge = (party) => {
        const partyStr = party.toString().toLowerCase().trim();
        if (partyStr.includes('ysrcp') || partyStr.includes('ysr')) return 'ysrcp';
        if (partyStr.includes('tdp')) return 'tdp';
        if (partyStr.includes('jsp') || partyStr.includes('janasena')) return 'jsp';
        if (partyStr.includes('bjp')) return 'bjp';
        if (partyStr.includes('congress')) return 'congress';
        return 'others';
    };

    // Map the JSON columns to table columns based on the actual structure
    row.innerHTML = `
        <td>${record["Column2"] || serialNo}</td>
        <td style="text-align: left;">${record["Column3"] || '-'}</td>
        <td>${formatNumber(record["Column4"])}</td>
        <td>${formatNumber(record["Column5"])}</td>
        <td>${formatPercentage(record["Column6"])}</td>
        <td>${formatNumber(record["Column7"])}</td>
        <td>${formatPercentage(record["Column8"])}</td>
        <td>${formatNumber(record["Column9"])}</td>
        <td>${formatNumber(record["Column10"])}</td>
        <td>${formatNumber(record["Column11"])}</td>
        <td>${formatNumber(record["Column12"])}</td>
        <td>${formatNumber(record["Column13"])}</td>
        <td>${formatNumber(record["Column14"])}</td>
        <td>${formatNumber(record["Column15"])}</td>
        <td>${formatNumber(record["Column16"])}</td>
        <td>${formatNumber(record["Column17"])}</td>
        <td>${formatNumber(record["Column18"])}</td>
        <td>${formatNumber(record["Column19"])}</td>
        <td>${formatNumber(record["Column20"])}</td>
        <td>${formatNumber(record["Column21"])}</td>
        <td>${formatNumber(record["Column22"])}</td>
        <td>${formatNumber(record["Column23"])}</td>
        <td>${formatNumber(record["Column24"])}</td>
        <td>${formatNumber(record["Column25"])}</td>
        <td style="text-align: left;">${record["Column26"] || '-'}</td>
        <td><span class="party-badge ${getPartyBadge(record["Column27"])}">${cleanPartyName(record["Column27"])}</span></td>
        <td><span class="party-badge ${getPartyBadge(record["Column28"])}">${cleanPartyName(record["Column28"])}</span></td>
        <td>${formatNumber(record["Column29"])}</td>
        <td>${record["Column30"] || '-'}</td>
        <td>${formatNumber(record["Column31"])}</td>
        <td>${formatPercentage(record["Column32"])}</td>
        <td>${formatNumber(record["Column33"])}</td>
        <td>${formatNumber(record["Column34"])}</td>
    `;

    return row;
}

// Function to load a specific page for AP data
function loadAPPage(pageNumber) {
    const tbody = document.querySelector('.ap-constituency-table .constituency-table tbody');
    if (!tbody) return;

    // Clear existing content
    tbody.innerHTML = '';

    // Calculate start and end indices
    const startIndex = (pageNumber - 1) * apRecordsPerPage;
    const endIndex = Math.min(startIndex + apRecordsPerPage, allAPConstituencyData.length);

    // Generate table rows for current page
    for (let i = startIndex; i < endIndex; i++) {
        const record = allAPConstituencyData[i];
        const row = createAPConstituencyRow(record, i + 1);
        tbody.appendChild(row);
    }

    apCurrentPage = pageNumber;
    updateAPPaginationControls();
}

// Function to create top pagination controls for AP
function createAPTopPaginationControls() {
    const tableContainer = document.querySelector('.ap-constituency-table');
    if (!tableContainer) return;

    // Remove existing top pagination
    const existingTopPagination = tableContainer.querySelector('.ap-top-pagination-controls');
    if (existingTopPagination) {
        existingTopPagination.remove();
    }

    // Create top pagination container
    const topPaginationDiv = document.createElement('div');
    topPaginationDiv.className = 'ap-top-pagination-controls pagination-controls';
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
    recordsSelect.className = 'ap-records-per-page-select';
    recordsSelect.innerHTML = `
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
    `;
    recordsSelect.value = apRecordsPerPage;
    recordsSelect.onchange = (e) => {
        apRecordsPerPage = parseInt(e.target.value);
        apCurrentPage = 1;
        loadAPPage(1);
        updateAPPaginationControls();
    };

    const recordsPerPageLabel = document.createElement('span');
    recordsPerPageLabel.textContent = 'records per page';
    recordsPerPageLabel.style.cssText = 'color: #6b7280;';

    leftControls.appendChild(recordsLabel);
    leftControls.appendChild(recordsSelect);
    leftControls.appendChild(recordsPerPageLabel);

    // Right side - Page navigation
    const rightControls = document.createElement('div');
    rightControls.className = 'ap-page-navigation';
    rightControls.style.cssText = 'display: flex; align-items: center; gap: 10px;';

    topPaginationDiv.appendChild(leftControls);
    topPaginationDiv.appendChild(rightControls);

    // Insert before the table
    const table = tableContainer.querySelector('table');
    tableContainer.insertBefore(topPaginationDiv, table);
}

// Function to create bottom pagination controls for AP
function createAPBottomPaginationControls() {
    const tableContainer = document.querySelector('.ap-constituency-table');
    if (!tableContainer) return;

    // Remove existing bottom pagination
    const existingBottomPagination = tableContainer.querySelector('.ap-bottom-pagination-controls');
    if (existingBottomPagination) {
        existingBottomPagination.remove();
    }

    // Create bottom pagination container
    const bottomPaginationDiv = document.createElement('div');
    bottomPaginationDiv.className = 'ap-bottom-pagination-controls pagination-controls';
    bottomPaginationDiv.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
        padding: 20px;
    `;

    const pageNavigation = document.createElement('div');
    pageNavigation.className = 'ap-page-navigation';
    pageNavigation.style.cssText = 'display: flex; align-items: center; gap: 10px;';

    bottomPaginationDiv.appendChild(pageNavigation);
    tableContainer.appendChild(bottomPaginationDiv);
}

// Function to update pagination controls for AP
function updateAPPaginationControls() {
    const totalPages = Math.ceil(allAPConstituencyData.length / apRecordsPerPage);

    // Update both top and bottom navigation
    const pageNavigations = document.querySelectorAll('.ap-page-navigation');

    pageNavigations.forEach(nav => {
        nav.innerHTML = '';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Previous';
        prevBtn.className = 'pagination-btn';
        prevBtn.disabled = apCurrentPage === 1;
        prevBtn.onclick = () => {
            if (apCurrentPage > 1) {
                loadAPPage(apCurrentPage - 1);
            }
        };

        // Page numbers
        const pageNumbers = document.createElement('div');
        pageNumbers.className = 'page-numbers';
        pageNumbers.style.cssText = 'display: flex; gap: 5px;';

        // Show page numbers (with ellipsis for large ranges)
        const startPage = Math.max(1, apCurrentPage - 2);
        const endPage = Math.min(totalPages, apCurrentPage + 2);

        if (startPage > 1) {
            const firstPage = createAPPageButton(1);
            pageNumbers.appendChild(firstPage);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.cssText = 'padding: 8px 4px; color: #6b7280;';
                pageNumbers.appendChild(ellipsis);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = createAPPageButton(i);
            pageNumbers.appendChild(pageBtn);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.cssText = 'padding: 8px 4px; color: #6b7280;';
                pageNumbers.appendChild(ellipsis);
            }
            const lastPage = createAPPageButton(totalPages);
            pageNumbers.appendChild(lastPage);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.className = 'pagination-btn';
        nextBtn.disabled = apCurrentPage === totalPages;
        nextBtn.onclick = () => {
            if (apCurrentPage < totalPages) {
                loadAPPage(apCurrentPage + 1);
            }
        };

        // Page info
        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        const startRecord = (apCurrentPage - 1) * apRecordsPerPage + 1;
        const endRecord = Math.min(apCurrentPage * apRecordsPerPage, allAPConstituencyData.length);
        pageInfo.textContent = `${startRecord}-${endRecord} of ${allAPConstituencyData.length}`;

        nav.appendChild(prevBtn);
        nav.appendChild(pageNumbers);
        nav.appendChild(nextBtn);
        nav.appendChild(pageInfo);
    });
}

// Helper function to create page number buttons for AP
function createAPPageButton(pageNum) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = pageNum;
    pageBtn.className = `pagination-btn page-btn ${pageNum === apCurrentPage ? 'active' : ''}`;
    pageBtn.onclick = () => loadAPPage(pageNum);
    return pageBtn;
}

// Initialize AP data loading when DOM is ready
document.addEventListener('DOMContentLoaded', function () {

    
    // Check if we're on the AP page
    if (document.body.dataset.currentState === 'andhra-pradesh') {

        // Wait a bit for the page to load, then load constituency data
        setTimeout(() => {

            loadAPConstituencyData();
        }, 100);
    } else {

    }
});