import { escHtml } from "./org.js";

/**
 * Resolve an author slug to its registry entry.
 *
 * @param {string} slug - the author identifier (e.g. "n1lks")
 * @param {object} authors - the authors global data object
 * @returns {object|null} the matching author entry, or null
 */
export function resolveAuthor(slug, authors) {
	if (!slug || !authors || typeof authors !== "object") return null;
	return authors[slug] ?? null;
}

/**
 * Format an author slug as a display string.
 *
 * If a registry entry is found and has a name:
 *   - The name is linked to the author's URL (if present)
 *   - The callsign is linked to https://hamdb.org/CALLSIGN (if present)
 *   - Format: "Name (Callsign)" with each part independently linked
 * Falls back to the raw slug verbatim if no matching entry or no name.
 *
 * @param {string} slug - the author identifier or verbatim author string
 * @param {object} authors - the authors global data object
 * @returns {string} formatted HTML or verbatim author string
 */
export function formatAuthor(slug, authors) {
	if (!slug) return "";
	const author = resolveAuthor(slug, authors);
	if (!author || !author.name) return String(slug);
	const { name, callsign, url } = author;
	const namePart = url
		? `<a href="${escHtml(url)}">${escHtml(name)}</a>`
		: escHtml(name);
	if (!callsign) return namePart;
	const callsignUrl = `https://hamdb.org/${encodeURIComponent(callsign.toLowerCase())}`;
	const callsignPart = `<a href="${escHtml(callsignUrl)}">${escHtml(callsign.toUpperCase())}</a>`;
	return `${namePart} (${callsignPart})`;
}
