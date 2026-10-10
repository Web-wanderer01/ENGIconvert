const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        if (file === 'node_modules' || file === 'scratch' || file === '.git' || file === 'backend') return;
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('index.html')) results.push(file);
        }
    });
    return results;
}

const files = walk('.');
if (!files.includes('index.html')) { files.push('index.html'); }

let updated = 0;
for (const file of files) {
    try {
        let content = fs.readFileSync(file, 'utf8');
        const pattern = /<li><a href="https:\/\/github\.com\/Web-wanderer01\/GARUD-The_Geo-Rakshak"[\s\S]*?<\/a><\/li>\n?\s*/;
        const updatedContent = content.replace(pattern, '');
        if (content !== updatedContent) {
            fs.writeFileSync(file, updatedContent, 'utf8');
            updated++;
        }
    } catch (e) {
        console.log("Error processing", file, e.message);
    }
}
console.log('Removed GARUD link from ' + updated + ' files successfully.');
