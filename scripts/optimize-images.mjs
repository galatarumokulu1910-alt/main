#!/usr/bin/env node
/**
 * Batch PNG → WebP converter for Galata School
 * Converts all PNGs in src/assets to WebP, then updates code references.
 */
import { execSync } from 'child_process';
import { readdirSync, statSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join, relative, basename, dirname } from 'path';

const ASSETS_DIR = join(process.cwd(), 'src', 'assets');
const SRC_DIR = join(process.cwd(), 'src');

// 1. Find all PNGs recursively
function findPngs(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPngs(fullPath));
    } else if (entry.name.endsWith('.png') && !entry.name.startsWith('Screenshot')) {
      results.push(fullPath);
    }
  }
  return results;
}

// 2. Find all source files
function findSourceFiles(dir, exts = ['.tsx', '.jsx', '.ts', '.js', '.css', '.html']) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
      results.push(...findSourceFiles(fullPath, exts));
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  const pngs = findPngs(ASSETS_DIR);
  console.log(`Found ${pngs.length} PNG files to convert\n`);

  const conversions = [];

  for (const pngPath of pngs) {
    const webpPath = pngPath.replace(/\.png$/, '.webp');
    const origSize = statSync(pngPath).size;
    
    try {
      // Convert with sharp: quality 80 for great quality + massive size reduction
      execSync(`npx -y sharp-cli -i "${pngPath}" -o "${webpPath}" --format webp --quality 80`, {
        stdio: 'pipe'
      });
      
      const newSize = statSync(webpPath).size;
      const savings = ((1 - newSize / origSize) * 100).toFixed(1);
      
      conversions.push({
        name: basename(pngPath),
        origKB: Math.round(origSize / 1024),
        newKB: Math.round(newSize / 1024),
        savings
      });
      
      console.log(`✅ ${basename(pngPath)}: ${Math.round(origSize/1024)}KB → ${Math.round(newSize/1024)}KB (${savings}% smaller)`);
    } catch (err) {
      console.error(`❌ Failed: ${basename(pngPath)} - ${err.message}`);
    }
  }

  // 3. Update source code references
  console.log('\n--- Updating source code references ---\n');
  
  const sourceFiles = findSourceFiles(SRC_DIR);
  // Also check index.html and public
  const rootFiles = ['index.html'].map(f => join(process.cwd(), f)).filter(f => {
    try { statSync(f); return true; } catch { return false; }
  });
  
  const allFiles = [...sourceFiles, ...rootFiles];
  let updatedFiles = 0;

  for (const filePath of allFiles) {
    let content = readFileSync(filePath, 'utf8');
    let modified = false;

    for (const { name } of conversions) {
      const pngName = name;
      const webpName = name.replace(/\.png$/, '.webp');
      
      if (content.includes(pngName)) {
        content = content.replaceAll(pngName, webpName);
        modified = true;
      }
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf8');
      console.log(`📝 Updated references in: ${relative(process.cwd(), filePath)}`);
      updatedFiles++;
    }
  }

  // 4. Summary
  const totalOrigKB = conversions.reduce((s, c) => s + c.origKB, 0);
  const totalNewKB = conversions.reduce((s, c) => s + c.newKB, 0);
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Converted: ${conversions.length} images`);
  console.log(`Total before: ${(totalOrigKB/1024).toFixed(1)} MB`);
  console.log(`Total after:  ${(totalNewKB/1024).toFixed(1)} MB`);
  console.log(`Total saved:  ${((totalOrigKB-totalNewKB)/1024).toFixed(1)} MB (${((1-totalNewKB/totalOrigKB)*100).toFixed(1)}%)`);
  console.log(`Updated files: ${updatedFiles}`);
  console.log(`\n⚠️  Old PNG files are kept. Delete them manually after verifying.`);
}

main();
