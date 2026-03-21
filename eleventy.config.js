import esbuild from "esbuild";
import markdownPlugin from "@jgarber/eleventy-plugin-markdown";
import { formatSchedule, formatEventDate } from "./src/schedule.js";
import { resolveOrganization, formatOrganization } from "./src/org.js";
import { eventsByMonth } from "./src/events.js";
import pluginTOC from "eleventy-plugin-toc";
import anchorPlugin from "markdown-it-anchor";
import attrsPlugin from "markdown-it-attrs";
import markdownItContainer from "markdown-it-container";

// Helper function for configuring passthrough copy by extension
function passthroughCopyExtension(eleventyConfig, ext) {
	[ext, ext.toUpperCase()].forEach((item) => {
		eleventyConfig.addPassthroughCopy(`content/**/*.${item}`);
	});
}

// Define files that should be copied into the rendered content directory.
function setupPassthroughCopy(eleventyConfig) {
	const extensions = [
		"kmz",
		"kml",
		"png",
		"jpg",
		"pdf",
		"txt",
		"gpx",
		"js",
		"gif",
		"webp",
		"svg",
	];
	extensions.forEach((ext) => passthroughCopyExtension(eleventyConfig, ext));
}

function exposeRunMode(eleventyConfig) {
	let currentRunMode = "build";

	eleventyConfig.on("eleventy.before", ({ runMode }) => {
		currentRunMode = runMode;
	});

	// Make runMode available to templates
	eleventyConfig.addGlobalData("runMode", () => currentRunMode);
}

export default function (eleventyConfig) {
	exposeRunMode(eleventyConfig);

	eleventyConfig.on("eleventy.after", async () => {
		await esbuild.build({
			entryPoints: ["src/calendar.js"],
			bundle: true,
			outfile: "_site/js/calendar.js",
			platform: "browser",
			format: "iife",
			minify: true,
		});
	});

	eleventyConfig.addPlugin(markdownPlugin, {
		options: {
			preset: "commonmark",
			typographer: false,
			breaks: false,
		},
		plugins: [
			anchorPlugin,
			attrsPlugin,
			[markdownItContainer, "noprint"],
			[markdownItContainer, "hidden-sm", {
				render(tokens, idx) {
					return tokens[idx].nesting === 1
						? '<div class="hidden-sm noprint">\n'
						: '</div>\n';
				}
			}],
		],
	});
	eleventyConfig.addPlugin(pluginTOC, {
		ul: true,
	});
	eleventyConfig.setFrontMatterParsingOptions({
		excerpt: true,
	});

	setupPassthroughCopy(eleventyConfig);

	eleventyConfig.addFilter("eventsByMonth", eventsByMonth);
	eleventyConfig.addFilter("formatSchedule", formatSchedule);
	eleventyConfig.addFilter("formatEventDate", formatEventDate);
	eleventyConfig.addFilter("resolveOrganization", resolveOrganization);
	eleventyConfig.addFilter("formatOrganization", function (slug) {
		const orgs = this.context?.getAll()?.collections?.org ?? [];
		return formatOrganization(slug, orgs);
	});

	eleventyConfig.addFilter("firstParagraph", (html) => {
		const match = html.match(/<p>([\s\S]*?)<\/p>/);
		return match ? match[1].replace(/<[^>]+>/g, "") : "";
	});

	// This shortcode is used in the copyright notice to ensure it always shows
	// the current year.
	eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
	eleventyConfig.addShortcode(
		"qrz",
		(callsign) => `[${callsign}](https://www.qrz.com/db/${callsign})`,
	);

	// Custom filters for post date filtering
	eleventyConfig.addFilter("post_is_future", (posts) => {
		const now = new Date();
		return posts.filter((post) => post.date > now);
	});

	eleventyConfig.addFilter("post_is_past", (posts) => {
		const now = new Date();
		return posts.filter((post) => post.date <= now);
	});

	eleventyConfig.addFilter("monthName", (monthNum) => {
		const date = new Date(2000, parseInt(monthNum, 10) - 1, 1);
		return date.toLocaleString("en-US", { month: "long" });
	});

	// Filter to render shortcodes in excerpt text
	eleventyConfig.addFilter("renderTemplate", async function (content) {
		try {
			// Use the liquid engine available in the filter context
			const result = await this.liquid.parseAndRender(
				content,
				this.context.getAll(),
			);
			return result;
		} catch (e) {
			console.warn("Failed to render template content:", e);
			return content;
		}
	});

	return {
		dir: {
			input: "content",
		},
	};
}
