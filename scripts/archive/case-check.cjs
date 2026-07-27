const fs = require('fs');
const path = require('path');

function checkCasing(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
        const fullPath = path.join(dir, dirent.name);
        if (dirent.isDirectory()) checkCasing(fullPath);
        else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                const importPath = match[1];
                if (importPath.startsWith('.')) {
                    const resolvedPath = path.resolve(dir, importPath);
                    const dirname = path.dirname(resolvedPath);
                    if (fs.existsSync(dirname)) {
                        const files = fs.readdirSync(dirname);
                        const basename = path.basename(resolvedPath);
                        // check for exact match or with extensions
                        const exactMatch = files.find(f => f === basename || f === basename + '.tsx' || f === basename + '.ts' || f === basename + '.css');
                        if (!exactMatch) {
                            const caseInsensitiveMatch = files.find(f => f.toLowerCase() === basename.toLowerCase() || f.toLowerCase() === basename.toLowerCase() + '.tsx' || f.toLowerCase() === basename.toLowerCase() + '.ts' || f.toLowerCase() === basename.toLowerCase() + '.css');
                            if (caseInsensitiveMatch) {
                                console.log(`Mismatch in ${fullPath}`);
                                console.log(`  Imported: ${importPath}`);
                                console.log(`  Actual file: ${caseInsensitiveMatch}`);
                            } else {
                                // Check if directory
                                const dirMatch = files.find(f => f.toLowerCase() === basename.toLowerCase());
                                if (dirMatch && dirMatch !== basename) {
                                    console.log(`Directory mismatch in ${fullPath}`);
                                    console.log(`  Imported dir: ${basename}`);
                                    console.log(`  Actual dir: ${dirMatch}`);
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}

checkCasing('./src');
console.log('Done checking case matches');
