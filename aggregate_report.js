import fs from 'fs';

const report = JSON.parse(fs.readFileSync('C:\\Users\\1\\.gemini\\antigravity\\brain\\15c44735-dd5a-442b-bf30-f51a3992cf43\\database_issues_report.json', 'utf8'));

const summary = {};

for (const issue of report) {
    if (issue.issue === 'Empty field') continue; // Skip empty fields, focus on wrong language/duplicates
    
    if (!summary[issue.table]) {
        summary[issue.table] = {
            untranslatedGreek: [],
            untranslatedEnglish: [],
            mixedLanguages: []
        };
    }
    
    if (issue.issue.includes('no Greek characters')) {
        summary[issue.table].untranslatedGreek.push({
            id: issue.id,
            identifier: issue.identifier,
            column: issue.column,
            value: issue.value
        });
    } else if (issue.issue.includes('contains Turkish text') && issue.column.endsWith('_en')) {
        // Double check if it's truly untranslated (starts with Turkish words or matches TR identical)
        summary[issue.table].untranslatedEnglish.push({
            id: issue.id,
            identifier: issue.identifier,
            column: issue.column,
            value: issue.value
        });
    } else {
        summary[issue.table].mixedLanguages.push({
            id: issue.id,
            identifier: issue.identifier,
            column: issue.column,
            issue: issue.issue,
            value: issue.value
        });
    }
}

// Print out counts
console.log("=== TRANSLATION AUDIT SUMMARY ===\n");
for (const [table, data] of Object.entries(summary)) {
    console.log(`Table: ${table}`);
    console.log(`- Untranslated/Greeklish Greek Fields: ${data.untranslatedGreek.length}`);
    console.log(`- Untranslated English Fields: ${data.untranslatedEnglish.length}`);
    console.log(`- Duplicate/Mixed Language Fields: ${data.mixedLanguages.length}`);
    console.log("\nSample Issues:");
    
    const samples = [...data.untranslatedGreek, ...data.untranslatedEnglish, ...data.mixedLanguages].slice(0, 5);
    samples.forEach(s => {
        console.log(`  * Row: "${s.identifier}" | Column: ${s.column} | Value: "${s.value.substring(0, 80)}"`);
    });
    console.log("-------------------------------------------\n");
}
