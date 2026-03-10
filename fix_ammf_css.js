const fs = require('fs');
const file = 'src/pages/AmmfPage/AmmfPage.css';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\.dark /g, '[data-theme="dark"] ');
fs.writeFileSync(file, content);
console.log('Fixed CSS dark mode selectors in AmmfPage.css');
