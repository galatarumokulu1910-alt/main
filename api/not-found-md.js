const buildNotFoundMarkdown = (pathname) =>
    [
        '# 404 — Page Not Found',
        '',
        `The requested URL \`${pathname}\` does not exist on **galatarumokulu.org** (Galata Rum Okulu Vakfı - Kültür Merkezi / Galata Greek School Foundation - Cultural Center / Αστική Σχολή Γαλατά – Πολιτιστικό Κέντρο).`,
        '',
        '## Machine-Readable Discovery & Key Resources',
        '',
        '- [llms.txt — AI Agent Index & When to Use](https://galatarumokulu.org/llms.txt)',
        '- [llms-full.txt — Complete Venue, Capacity & Cultural Center Reference](https://galatarumokulu.org/llms-full.txt)',
        '- [index.md — Homepage Markdown Summary](https://galatarumokulu.org/index.md)',
        '- [mekan-kiralama.md — MICE & Historic Venue Hire Specifications](https://galatarumokulu.org/mekan-kiralama.md)',
        '- [sitemap.xml — Full Multilingual XML Sitemap (327 URLs)](https://galatarumokulu.org/sitemap.xml)',
        '- [Contact & Venue Inquiry](https://galatarumokulu.org/bize-ulasin)',
        '',
    ].join('\n');

const NOT_FOUND_HEADERS = {
    'Content-Type': 'text/markdown; charset=utf-8',
    Vary: 'Accept',
    'X-Robots-Tag': 'noindex, nofollow',
    'Cache-Control': 'public, max-age=0, must-revalidate',
};

export function GET(request) {
    const url = new URL(request.url);
    return new Response(buildNotFoundMarkdown(url.pathname), {
        status: 404,
        headers: NOT_FOUND_HEADERS,
    });
}

export function HEAD() {
    return new Response(null, {
        status: 404,
        headers: NOT_FOUND_HEADERS,
    });
}
