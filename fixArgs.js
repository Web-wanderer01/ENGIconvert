const fs = require('fs');

function fix(file, subject) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/triggerAISearch\(\)/g, `triggerAISearch('${subject}')`);
    fs.writeFileSync(file, content, 'utf8');
}

fix('physics/index.html', 'Physics');
fix('number-system/index.html', 'Engineering Mathematics');
console.log('Fixed arguments!');
