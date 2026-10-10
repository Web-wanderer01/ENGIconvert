const fs = require('fs');

function fixScrollAndSearch(file) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove scrollbar (max-height and overflow-y)
    content = content.replace(/max-height:\s*250px;\s*overflow-y:\s*auto;/g, '');

    // 2. Add filtering JS
    const filterJs = `
<script>
function filterDynamicChips() {
    const query = document.getElementById('formulaSearch').value.toLowerCase().trim();
    const block = document.getElementById('dynamicTopicsBlock');
    if (!block) return;
    const buttons = block.querySelectorAll('button.mini-btn');
    buttons.forEach(btn => {
        if (btn.innerText.toLowerCase().includes(query)) {
            btn.style.display = 'inline-block';
        } else {
            btn.style.display = 'none';
        }
    });
}
// Attach to the search input
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('formulaSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterDynamicChips);
    }
});
</script>
`;

    if (!content.includes('filterDynamicChips')) {
        content = content.replace('</body>', filterJs + '\n</body>');
    }

    fs.writeFileSync(file, content, 'utf8');
}

fixScrollAndSearch('physics/index.html');
fixScrollAndSearch('number-system/index.html');

console.log("Removed scrollbars and made chips searchable!");
