import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = "https://tvloakrlqazcadokliaf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bG9ha3JscWF6Y2Fkb2tsaWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTMwODcsImV4cCI6MjA4ODUyOTA4N30.yU2-aCCeVG9nuSAYQba04LZjVBIHsL64Mae0HckzZRo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const COMMON_TR_WORDS = ['ve', 'bir', 'bu', 'da', 'de', 'için', 'olan', 'olarak', 'ile', 'tarihi', 'okulu', 'rum'];
const COMMON_EN_WORDS = ['the', 'and', 'of', 'to', 'a', 'in', 'is', 'that', 'for', 'on', 'with', 'as', 'school', 'greek'];

function detectLanguage(text) {
    if (!text) return 'empty';
    // Check if it contains Greek characters
    if (/[\u0370-\u03ff\u1f00-\u1fff]/g.test(text)) {
        return 'el';
    }
    
    const words = text.toLowerCase().split(/\s+/);
    let trCount = 0;
    let enCount = 0;
    
    for (const word of words) {
        // Strip punctuation
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
        if (COMMON_TR_WORDS.includes(cleanWord) || /[ışğöçüİŞĞÖÇÜ]/.test(word)) {
            trCount++;
        }
        if (COMMON_EN_WORDS.includes(cleanWord)) {
            enCount++;
        }
    }
    
    if (trCount > enCount && trCount > 0) return 'tr';
    if (enCount > trCount && enCount > 0) return 'en';
    return 'unknown';
}

async function scanTable(tableName, columns) {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
        console.error(`Error fetching from ${tableName}:`, error.message);
        return [];
    }
    
    const issues = [];
    
    for (const row of data) {
        // 1. Check for untranslated fields (e.g. Greek column is identical to English or Turkish, and doesn't contain Greek letters)
        for (const col of columns) {
            const val = row[col];
            const baseLang = col.substring(col.length - 2); // 'tr', 'en', 'el'
            
            if (!val || val.trim() === '') {
                issues.push({
                    table: tableName,
                    id: row.id,
                    identifier: row.title_tr || row.name_tr || row.page_key || row.id,
                    issue: 'Empty field',
                    column: col,
                    value: val
                });
                continue;
            }
            
            const detected = detectLanguage(val);
            
            // Check mismatch
            if (baseLang === 'el' && detected !== 'el' && detected !== 'empty') {
                // If Greek column doesn't contain Greek characters, check if it's untranslated English or Turkish
                issues.push({
                    table: tableName,
                    id: row.id,
                    identifier: row.title_tr || row.name_tr || row.page_key || row.id,
                    issue: 'Greek field has no Greek characters (possibly untranslated or Greeklish)',
                    column: col,
                    value: val
                });
            } else if (baseLang === 'tr' && detected === 'en') {
                issues.push({
                    table: tableName,
                    id: row.id,
                    identifier: row.title_tr || row.name_tr || row.page_key || row.id,
                    issue: 'Turkish field contains English text',
                    column: col,
                    value: val
                });
            } else if (baseLang === 'en' && detected === 'tr') {
                issues.push({
                    table: tableName,
                    id: row.id,
                    identifier: row.title_tr || row.name_tr || row.page_key || row.id,
                    issue: 'English field contains Turkish text',
                    column: col,
                    value: val
                });
            }
            
            // 2. Check for duplicate text across languages (indicating untranslated copy-pastes)
            for (const otherCol of columns) {
                if (col !== otherCol) {
                    const otherVal = row[otherCol];
                    const otherLang = otherCol.substring(otherCol.length - 2);
                    
                    if (val === otherVal && val.trim() !== '' && baseLang !== otherLang) {
                        issues.push({
                            table: tableName,
                            id: row.id,
                            identifier: row.title_tr || row.name_tr || row.page_key || row.id,
                            issue: `Duplicate content across languages (${baseLang} and ${otherLang} are identical)`,
                            column: `${col} vs ${otherCol}`,
                            value: val
                        });
                    }
                }
            }
        }
    }
    
    return issues;
}

async function runScan() {
    console.log("=== STARTING DATABASE TRANSLATION SCAN ===");
    
    const allIssues = [];
    
    // 1. past_events
    const pastEventsIssues = await scanTable('past_events', ['title_tr', 'title_en', 'title_el', 'type_tr', 'type_en', 'type_el']);
    allIssues.push(...pastEventsIssues);
    
    // 2. history_timeline
    const historyTimelineIssues = await scanTable('history_timeline', ['title_tr', 'title_en', 'title_el', 'description_tr', 'description_en', 'description_el']);
    allIssues.push(...historyTimelineIssues);
    
    // 3. artifacts
    const artifactsIssues = await scanTable('artifacts', ['title_tr', 'title_en', 'title_el', 'description_tr', 'description_en', 'description_el', 'provenance_tr', 'provenance_en', 'provenance_el']);
    allIssues.push(...artifactsIssues);
    
    // 4. venue_events
    const venueEventsIssues = await scanTable('venue_events', ['title_tr', 'title_en', 'title_el', 'description_tr', 'description_en', 'description_el']);
    allIssues.push(...venueEventsIssues);
    
    // 5. page_content
    const pageContentIssues = await scanTable('page_content', ['content_tr', 'content_en', 'content_el']);
    allIssues.push(...pageContentIssues);
    
    // 6. archive_categories
    const catIssues = await scanTable('archive_categories', ['name_tr', 'name_en', 'name_el']);
    allIssues.push(...catIssues);
    
    // 7. archive_subcategories
    const subCatIssues = await scanTable('archive_subcategories', ['name_tr', 'name_en', 'name_el']);
    allIssues.push(...subCatIssues);

    console.log(`Scan complete! Found ${allIssues.length} potential issues.\n`);
    
    // De-duplicate issues on the same row and column comparison
    const uniqueIssues = [];
    const seen = new Set();
    
    for (const issue of allIssues) {
        const key = `${issue.table}_${issue.id}_${issue.column}_${issue.issue}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueIssues.push(issue);
        }
    }
    
    console.log(`Found ${uniqueIssues.length} unique translation issues.`);
    const reportPath = 'C:\\Users\\1\\.gemini\\antigravity\\brain\\15c44735-dd5a-442b-bf30-f51a3992cf43\\database_issues_report.json';
    fs.writeFileSync(reportPath, JSON.stringify(uniqueIssues, null, 2), 'utf8');
    console.log(`Saved detailed report to ${reportPath}`);
}

runScan();
