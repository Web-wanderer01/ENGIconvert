const fs = require('fs');
let content = fs.readFileSync('unit-converter/index.html', 'utf8');
const match = content.match(/<nav class="navlinks">[\s\S]*?<\/nav>/);
console.log("Match:", match !== null);
