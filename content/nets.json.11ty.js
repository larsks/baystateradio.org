export const data = {
	permalink: "nets.json",
	eleventyExcludeFromCollections: true,
	layout: false,
};

export default function render(data) {
	const nets = data.collections.net.map((net) => ({
		title: net.data.title,
		schedule: net.data.schedule,
		url: net.url,
		frequency: net.data.frequency,
	}));
	return JSON.stringify(nets, null, 2);
}
