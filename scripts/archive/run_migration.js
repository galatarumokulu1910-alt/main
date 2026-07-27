import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Get credentials from args or env
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://tvloakrlqazcadokliaf.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bG9ha3JscWF6Y2Fkb2tsaWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTMwODcsImV4cCI6MjA4ODUyOTA4N30.yU2-aCCeVG9nuSAYQba04LZjVBIHsL64Mae0HckzZRo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runMigration() {
    try {
        const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20250308000000_init.sql');
        const sqlString = fs.readFileSync(sqlPath, 'utf8');

        // Split into individual statements
        const queries = sqlString
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        console.log(`Prepared ${queries.length} queries to execute...`);

        for (const query of queries) {
            if (query.startsWith('--')) continue; // Skip pure comments
            console.log(`Executing: ${query.substring(0, 50)}...`);
            // Since anon key cannot typically execute raw SQL using standard RPC without a defined function
            // Let's first check if this works. If not, we fall back to suggesting user run it in SQL editor
            const { data, error } = await supabase.rpc('exec_sql', { sql: query });
            if (error) {
                console.warn(`Execution note (might require dashboard SQL editor):`, error.message);
            }
        }
        console.log("Migration script check complete.");
    } catch (err) {
        console.error(err);
    }
}

runMigration();
