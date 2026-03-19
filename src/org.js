/**
 * Resolve an organization slug to its collection entry.
 *
 * @param {string} slug - the organization slug (e.g. "caara")
 * @param {Array} orgs - the collections.org array from Eleventy
 * @returns {object|null} the matching org collection item, or null
 */
export function resolveOrganization(slug, orgs) {
	if (!slug || !Array.isArray(orgs)) return null;
	return orgs.find((o) => o.fileSlug === slug) ?? null;
}

/**
 * Format an organization slug as a display string.
 * Returns "Title (ACRONYM)" linked to the org's URL if found,
 * plain "Title (ACRONYM)" if found but no URL,
 * or the raw slug as a fallback.
 *
 * @param {string} slug - the organization slug (e.g. "caara")
 * @param {Array} orgs - the collections.org array from Eleventy
 * @returns {string} formatted HTML or raw slug
 */
export function formatOrganization(slug, orgs) {
	if (!slug) return "";
	const org = resolveOrganization(slug, orgs);
	if (!org) return slug;
	const { title, acronym } = org.data;
	const label = acronym ? `${title} (${acronym})` : title;
	return org.url ? `<a href="${org.url}">${label}</a>` : label;
}
