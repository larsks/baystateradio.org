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
 * Returns "Name (Callsign)" linked to the author's URL if found,
 * plain "Name (Callsign)" if found but no URL,
 * or the raw slug verbatim as a fallback.
 *
 * @param {string} slug - the author identifier or verbatim author string
 * @param {object} authors - the authors global data object
 * @returns {string} formatted HTML or verbatim author string
 */
export function formatAuthor(slug, authors) {
	if (!slug) return "";
	const author = resolveAuthor(slug, authors);
	if (!author) return String(slug);
	const { name, callsign, url } = author;
	const label = callsign
		? `${escHtml(name)} (${escHtml(callsign)})`
		: escHtml(name);
	return url ? `<a href="${escHtml(url)}">${label}</a>` : label;
}
