// Bihar Constituency data handling
// Pagination variables for Bihar data
let biharCurrentPage = 1;
let biharRecordsPerPage = 25;
let allBiharConstituencyData = [];
let filteredBiharConstituencyData = []; // For search results

// Function to load Bihar constituency data with pagination
function loadBiharConstituencyData() {
    try {
        // Check if biharConstituencyData is available
        if (typeof biharConstituencyData === 'undefined') {
            console.error('biharConstituencyData not found. Make sure bihar-constituency-data.js is loaded.');
            const tbody = document.querySelector('.bihar-constituency-table .constituency-table tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">Error: Bihar constituency data not loaded</td></tr>';
            }
            return;
        }

        // Filter out the header row and process data with district grouping
        const rawData = biharConstituencyData.filter(record => 
            record.Sno !== "Sno" && record.Constituency && record.Constituency.trim() !== ""
        );

        // Process data to fill in missing district/sno values and track grouping
        let currentSno = '';
        let currentDistrict = '';
        let districtGroups = {};
        
        allBiharConstituencyData = rawData.map((record, index) => {
            // Update current district and sno if present
            if (record.Sno && record.Sno.trim() !== '') {
                currentSno = record.Sno.trim();
            }
            if (record.Distrinct && record.Distrinct.trim() !== '') {
                currentDistrict = record.Distrinct.trim();
                if (!districtGroups[currentDistrict]) {
                    districtGroups[currentDistrict] = [];
                }
            }
            
            const processedRecord = {
                sno: currentSno,
                district: currentDistrict,
                constituency: record.Constituency || '',
                expectedWinningParty: record.WinningParty || '-',
                expectedVotes: record.ExpectedWinningVotes || '-',
                runnerUpParty: record.RunnerUpParty || '-',
                runnerUpVotes: record.RunnerUpVotes || '-',
                winningMargin: record.WinningMargin || '-',
                errorMargin: record.ErrorMargin || '±5000',
                isFirstInDistrict: record.Distrinct && record.Distrinct.trim() !== '',
                originalIndex: index
            };
            
            if (currentDistrict) {
                districtGroups[currentDistrict].push(processedRecord);
            }
            
            return processedRecord;
        });

        // Calculate rowspan for each district group
        allBiharConstituencyData.forEach(record => {
            if (record.isFirstInDistrict && districtGroups[record.district]) {
                record.districtRowspan = districtGroups[record.district].length;
            }
        });

        // Initialize filtered data
        filteredBiharConstituencyData = allBiharConstituencyData;

        // Create pagination controls at top
        createBiharTopPaginationControls();

        // Load first page
        loadBiharPage(1);

        // Create pagination controls at bottom
        createBiharBottomPaginationControls();

    } catch (error) {
        console.error('Error loading Bihar constituency data:', error);
        const tbody = document.querySelector('.bihar-constituency-table .constituency-table tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">Error loading constituency data</td></tr>';
        }
    }
}

// Function to create a Bihar constituency table row with district grouping
function createBiharConstituencyRow(record) {
    const row = document.createElement('tr');

    // Format numbers with commas
    const formatNumber = (num) => {
        if (!num || num === '-' || num === null || num === undefined) return '-';
        if (typeof num === 'string' && num.trim() === '') return '-';
        const numValue = parseInt(num);
        if (isNaN(numValue)) return '-';
        return numValue.toLocaleString('en-IN');
    };

    // Format text to separate English and Hindi names
    const formatBilingualText = (text) => {
        if (!text || text === '-') return '-';
        // Split by newline character
        const parts = text.split('\n');
        if (parts.length === 2) {
            // English on first line, Hindi on second line
            return `<div class="bilingual-text"><span class="english-text">${parts[0].trim()}</span><span class="hindi-text">${parts[1].trim()}</span></div>`;
        }
        return text;
    };

    // Determine party badge class and alliance
    const getPartyBadge = (party) => {
        const partyStr = party.toString().toLowerCase().trim();
        if (partyStr.includes('bjp')) return 'bjp';
        if (partyStr.includes('jdu') || partyStr.includes('jd(u)')) return 'jdu';
        if (partyStr.includes('rjd')) return 'rjd';
        if (partyStr.includes('congress') || partyStr.includes('inc')) return 'inc';
        if (partyStr.includes('ljp')) return 'ljp';
        if (partyStr.includes('nda')) return 'nda';
        if (partyStr.includes('mgb')) return 'mgb';
        if (partyStr.includes('aimim')) return 'aimim';
        if (partyStr.includes('cpiml')) return 'cpiml';
        if (partyStr.includes('cpim')) return 'cpim';
        if (partyStr.includes('vip') || partyStr.includes('vsip')) return 'vip';
        if (partyStr.includes('rlm')) return 'rlm';
        if (partyStr.includes('jjd')) return 'jjd';
        if (partyStr.includes('hams')) return 'hams';
        return 'others';
    };

    // Determine alliance based on party
    const getAlliance = (party) => {
        const partyStr = party.toString().toLowerCase().trim();
        if (partyStr.includes('bjp') || partyStr.includes('jdu') || partyStr.includes('jd(u)') || partyStr.includes('ljp') || partyStr.includes('nda')) {
            return 'NDA';
        }
        if (partyStr.includes('rjd') || partyStr.includes('congress') || partyStr.includes('inc') || partyStr.includes('mgb') || partyStr.includes('cpiml') || partyStr.includes('cpim')) {
            return 'MGB';
        }
        return '';
    };

    const winningParty = record.expectedWinningParty || '-';
    const runnerUpParty = record.runnerUpParty || '-';
    const winningAlliance = getAlliance(winningParty);
    const runnerUpAlliance = getAlliance(runnerUpParty);

    // Build row HTML with conditional rowspan for district grouping
    let rowHTML = '';
    
    // Only show S.No. and District cells if this is the first row in the district group
    if (record.isFirstInDistrict) {
        rowHTML += `<td rowspan="${record.districtRowspan}" class="district-group-cell">${record.sno || '-'}</td>`;
        rowHTML += `<td rowspan="${record.districtRowspan}" class="district-group-cell">${formatBilingualText(record.district)}</td>`;
    }
    
    rowHTML += `
        <td class="constituency-cell">${formatBilingualText(record.constituency)}</td>
        <td class="party-cell">
            <span class="party-badge ${getPartyBadge(winningParty)}">${winningParty}</span>
            ${winningAlliance ? `<br><small style="color: #6b7280;">(${winningAlliance})</small>` : ''}
        </td>
        <td class="votes-cell">${formatNumber(record.expectedVotes)}</td>
        <td class="party-cell">
            <span class="party-badge ${getPartyBadge(runnerUpParty)}">${runnerUpParty}</span>
            ${runnerUpAlliance ? `<br><small style="color: #6b7280;">(${runnerUpAlliance})</small>` : ''}
        </td>
        <td class="votes-cell">${formatNumber(record.runnerUpVotes)}</td>
        <td class="votes-cell">${formatNumber(record.winningMargin)}</td>
        <td class="error-cell">${record.errorMargin || '±5000'}</td>
    `;

    row.innerHTML = rowHTML;
    
    // Add class to indicate if this is part of a district group
    if (record.isFirstInDistrict) {
        row.classList.add('district-group-start');
    }

    return row;
}

// Function to filter Bihar constituencies based on search query
function filterBiharConstituencies(searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
        // If search is empty, show all data
        filteredBiharConstituencyData = allBiharConstituencyData;
    } else {
        // Filter data based on search query
        filteredBiharConstituencyData = allBiharConstituencyData.filter(record => {
            return (
                (record.district && record.district.toLowerCase().includes(query)) ||
                (record.constituency && record.constituency.toLowerCase().includes(query)) ||
                (record.expectedWinningParty && record.expectedWinningParty.toLowerCase().includes(query)) ||
                (record.runnerUpParty && record.runnerUpParty.toLowerCase().includes(query))
            );
        });
    }
    
    // Reset to first page and reload
    biharCurrentPage = 1;
    loadBiharPage(1);
}

// Function to load a specific page for Bihar data
function loadBiharPage(pageNumber) {
    const tbody = document.querySelector('.bihar-constituency-table .constituency-table tbody');
    if (!tbody) return;

    // Clear existing content
    tbody.innerHTML = '';

    // Use filtered data instead of all data
    const dataToDisplay = filteredBiharConstituencyData || allBiharConstituencyData;

    // Validate data
    if (!dataToDisplay || dataToDisplay.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px; color: #dc2626;">No constituency data found</td></tr>';
        return;
    }

    // Calculate start and end indices
    const startIndex = (pageNumber - 1) * biharRecordsPerPage;
    const endIndex = Math.min(startIndex + biharRecordsPerPage, dataToDisplay.length);

    // Get records for current page
    const pageRecords = dataToDisplay.slice(startIndex, endIndex);

    // Recalculate rowspan for this page only
    // Track which districts appear on this page and count their rows
    const districtCountsOnPage = {};
    const districtFirstIndexOnPage = {};
    
    pageRecords.forEach((record, pageIndex) => {
        const districtKey = record.district;
        if (!districtCountsOnPage[districtKey]) {
            districtCountsOnPage[districtKey] = 0;
            districtFirstIndexOnPage[districtKey] = pageIndex;
        }
        districtCountsOnPage[districtKey]++;
    });

    // Generate table rows for current page with adjusted rowspan
    pageRecords.forEach((record, pageIndex) => {
        const districtKey = record.district;
        const isFirstOnPage = districtFirstIndexOnPage[districtKey] === pageIndex;
        
        // Create a modified record for this page
        const pageRecord = {
            ...record,
            isFirstInDistrict: isFirstOnPage,
            districtRowspan: districtCountsOnPage[districtKey]
        };
        
        const row = createBiharConstituencyRow(pageRecord);
        tbody.appendChild(row);
    });

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
    searchInput.className = 'bihar-constituency-search-input';
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
        filterBiharConstituencies(e.target.value);
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

    recordsContainer.appendChild(recordsLabel);
    recordsContainer.appendChild(recordsSelect);
    recordsContainer.appendChild(recordsPerPageLabel);

    leftControls.appendChild(searchContainer);
    leftControls.appendChild(recordsContainer);

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
    const dataToDisplay = filteredBiharConstituencyData || allBiharConstituencyData;
    const totalPages = Math.ceil(dataToDisplay.length / biharRecordsPerPage);

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
        const endRecord = Math.min(biharCurrentPage * biharRecordsPerPage, dataToDisplay.length);
        pageInfo.textContent = `${startRecord}-${endRecord} of ${dataToDisplay.length}`;

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
