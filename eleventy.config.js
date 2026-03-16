import markdownPlugin from "@jgarber/eleventy-plugin-markdown";
import pluginTOC from "eleventy-plugin-toc";
import anchorPlugin from "markdown-it-anchor";

// Helper function for configuring passthrough copy by extension
function passthroughCopyExtension(eleventyConfig, ext) {
	[ext, ext.toUpperCase()].forEach((item, _) => {
		eleventyConfig.addPassthroughCopy(`content/**/*.${item}`);
	});
}

// Define files that should be copied into the rendered content directory.
function setupPassthroughCopy(eleventyConfig) {
	passthroughCopyExtension(eleventyConfig, "kmz");
	passthroughCopyExtension(eleventyConfig, "kml");
	passthroughCopyExtension(eleventyConfig, "png");
	passthroughCopyExtension(eleventyConfig, "jpg");
	passthroughCopyExtension(eleventyConfig, "pdf");
	passthroughCopyExtension(eleventyConfig, "txt");
	passthroughCopyExtension(eleventyConfig, "gpx");
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

	eleventyConfig.addPlugin(markdownPlugin, {
		options: {
			preset: "commonmark",
			typographer: false,
			breaks: false,
		},
		plugins: [anchorPlugin],
	});
	eleventyConfig.addPlugin(pluginTOC, {
		ul: true,
	});
	eleventyConfig.setFrontMatterParsingOptions({
		excerpt: true,
	});

	setupPassthroughCopy(eleventyConfig);

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
