import { existsSync, readdirSync } from "fs";
import { join, dirname } from "path";

export default {
	eleventyComputed: {
		coverImage: (data) => {
			const slug = data.page.fileSlug;
			const coverDir = dirname(data.page.inputPath);
			if (!existsSync(coverDir)) return null;
			const files = readdirSync(coverDir);
			const cover = files.find((f) => /^cover\./i.test(f));
			if (!cover) return null;
			return `/org/${slug}/${cover}`;
		},
	},
};
