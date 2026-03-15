/**
 * Decode HTML entities (&#039;, &amp;, &#8211;, etc.) to their actual characters.
 * Uses a textarea element for safe, standards-compliant decoding.
 */
let textarea: HTMLTextAreaElement | null = null;

export function decodeHtmlEntities(text: string | null | undefined): string {
    if (!text) return '';
    // Quick check — if no & in the string, nothing to decode
    if (!text.includes('&')) return text;
    if (!textarea) {
        textarea = document.createElement('textarea');
    }
    textarea.innerHTML = text;
    return textarea.value;
}
