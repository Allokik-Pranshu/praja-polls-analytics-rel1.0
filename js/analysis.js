// State Analysis Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Table sorting functionality
    const tableHeaders = document.querySelectorAll('.constituency-table th');
    tableHeaders.forEach((header, index) => {
        if (index > 0) { // Skip first column (constituency name)
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                sortTable(index);
            });
        }
    });

    // Animate sections on load
    const sections = document.querySelectorAll('.section-card');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 200 + (index * 200));
    });
});

// Table sorting function
function sortTable(columnIndex) {
    const table = document.querySelector('.constituency-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    const isNumeric = columnIndex === 1 || columnIndex === 3 || columnIndex === 4; // Sample Size, Margin, Confidence
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        if (isNumeric) {
            const aNum = parseFloat(aValue.replace(/[^\d.-]/g, ''));
            const bNum = parseFloat(bValue.replace(/[^\d.-]/g, ''));
            return bNum - aNum; // Descending order for numbers
        } else {
            return aValue.localeCompare(bValue); // Ascending order for text
        }
    });
    
    // Clear tbody and append sorted rows
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}