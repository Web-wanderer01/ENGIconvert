const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('theme.css', 'utf8');
const js = fs.readFileSync('theme.js', 'utf8');

html = html.replace('<link rel="stylesheet" href="./theme.css">', '<style>\n' + css + '\n</style>');
html = html.replace('<script src="./theme.js" defer></script>', '<script>\n' + js + '\n</script>');
html = html.replace('https://cdn.tailwindcss.com', 'https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js');

// Save to the artifact directory so it can be previewed in the generative UI
const outPath = 'C:\\Users\\jatin singh bisht\\.gemini\\antigravity\\brain\\c617a9ee-2e64-4df8-979e-0eca53050f9b\\engiconvert_preview.html';
fs.writeFileSync(outPath, html, 'utf8');
console.log('Preview generated successfully.');
