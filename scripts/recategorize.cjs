// Run re-categorization against Supabase
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tvloakrlqazcadokliaf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bG9ha3JscWF6Y2Fkb2tsaWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTMwODcsImV4cCI6MjA4ODUyOTA4N30.yU2-aCCeVG9nuSAYQba04LZjVBIHsL64Mae0HckzZRo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const updates = [
  { match: ['Okuma', 'Kitap tan\u0131t\u0131m\u0131', 'Kitap tan\u0131t\u0131m\u0131, Konu\u015fma'], tr: 'Okuma', en: 'Reading', el: '\u0391\u03bd\u03ac\u03b3\u03bd\u03c9\u03c3\u03b7' },
  { match: ['Konu\u015fma', 'S\u00f6yle\u015fi', 'Konu\u015fma, S\u00f6yle\u015fi'], tr: 'Konu\u015fma', en: 'Talk', el: '\u039f\u03bc\u03b9\u03bb\u03af\u03b1' },
  { match: ['Sergi'], tr: 'Sergi', en: 'Exhibition', el: '\u0388\u03ba\u03b8\u03b5\u03c3\u03b7' },
  { match: ['Bulu\u015fma'], tr: 'Bulu\u015fma', en: 'Gathering', el: '\u03a3\u03c5\u03bd\u03ac\u03bd\u03c4\u03b7\u03c3\u03b7' },
  { match: ['Konser'], tr: 'Konser', en: 'Concert', el: '\u03a3\u03c5\u03bd\u03b1\u03c5\u03bb\u03af\u03b1' },
  { match: ['Konferans', 'Konfrens'], tr: 'Konferans', en: 'Conference', el: '\u03a3\u03c5\u03bd\u03ad\u03b4\u03c1\u03b9\u03bf' },
  { match: ['Film g\u00f6sterimi', 'Film g\u00f6sterimi, Konu\u015fma'], tr: 'Film G\u00f6sterimi', en: 'Screening', el: '\u03a0\u03c1\u03bf\u03b2\u03bf\u03bb\u03ae' },
  { match: ['Performans', 'Tiyatro'], tr: 'Performans', en: 'Performance', el: '\u03a0\u03b1\u03c1\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7' },
  { match: ['Etkinlik', 'Event', 'Event / Yemek', 'Gala', 'At\u00f6lye'], tr: 'Etkinlik', en: 'Event', el: '\u0395\u03ba\u03b4\u03ae\u03bb\u03c9\u03c3\u03b7' },
];

async function run() {
  for (const u of updates) {
    for (const m of u.match) {
      const { data, error } = await supabase
        .from('past_events')
        .update({ type_tr: u.tr, type_en: u.en, type_el: u.el, sub_tag: null })
        .or('type_tr.eq.' + m + ',sub_tag.eq.' + m)
        .select('id');
      
      if (error) {
        console.log('  ERR "' + m + '" -> "' + u.tr + '":', error.message);
      } else {
        console.log('  OK "' + m + '" -> "' + u.tr + '" (' + (data ? data.length : 0) + ' rows)');
      }
    }
  }

  // Clear any remaining sub_tags
  const { data: remaining } = await supabase
    .from('past_events')
    .update({ sub_tag: null })
    .not('sub_tag', 'is', null)
    .select('id');
  
  if (remaining && remaining.length > 0) {
    console.log('\nCleared ' + remaining.length + ' remaining sub_tags');
  }

  // Verify final state
  const { data: all } = await supabase
    .from('past_events')
    .select('type_tr, type_en, type_el');
  
  const counts = {};
  all.forEach(function(e) {
    var k = e.type_tr || '(empty)';
    counts[k] = (counts[k] || 0) + 1;
  });
  
  console.log('\n=== Final Categories ===');
  Object.entries(counts)
    .sort(function(a, b) { return b[1] - a[1]; })
    .forEach(function(pair) { console.log('  ' + pair[0] + ': ' + pair[1]); });
  console.log('  TOTAL: ' + all.length);
}

run().catch(function(e) { console.error(e); });
