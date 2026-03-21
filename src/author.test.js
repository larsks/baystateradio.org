import { resolveAuthor, formatAuthor } from "./author.js";
import { describe, it, expect } from "vitest";

const authors = {
	n1lks: { name: "Lars Kellogg-Stedman", callsign: "N1LKS", url: "https://n1lks.oddbit.com/" },
	nourl: { name: "Jane Smith", callsign: "W1ABC" },
	nocall: { name: "John Doe", url: "https://example.com/" },
	nameonly: { name: "Anonymous" },
};

describe("resolveAuthor", () => {
	it("returns the matching entry", () => {
		expect(resolveAuthor("n1lks", authors)).toBe(authors.n1lks);
	});

	it("returns null for unknown slug", () => {
		expect(resolveAuthor("unknown", authors)).toBeNull();
	});

	it("returns null for empty slug", () => {
		expect(resolveAuthor("", authors)).toBeNull();
	});

	it("returns null for undefined slug", () => {
		expect(resolveAuthor(undefined, authors)).toBeNull();
	});

	it("returns null for null slug", () => {
		expect(resolveAuthor(null, authors)).toBeNull();
	});

	it("returns null when authors is null", () => {
		expect(resolveAuthor("n1lks", null)).toBeNull();
	});

	it("returns null when authors is not an object", () => {
		expect(resolveAuthor("n1lks", "not-an-object")).toBeNull();
	});
});

describe("formatAuthor", () => {
	it("returns linked name and callsign when author has url and callsign", () => {
		expect(formatAuthor("n1lks", authors)).toBe(
			'<a href="https://n1lks.oddbit.com/">Lars Kellogg-Stedman (N1LKS)</a>',
		);
	});

	it("returns plain name and callsign when author has no url", () => {
		expect(formatAuthor("nourl", authors)).toBe("Jane Smith (W1ABC)");
	});

	it("returns linked name only when author has url but no callsign", () => {
		expect(formatAuthor("nocall", authors)).toBe(
			'<a href="https://example.com/">John Doe</a>',
		);
	});

	it("returns plain name only when author has no url or callsign", () => {
		expect(formatAuthor("nameonly", authors)).toBe("Anonymous");
	});

	it("returns verbatim slug when not found in registry", () => {
		expect(formatAuthor("Lars Kellogg-Stedman (N1LKS)", authors)).toBe(
			"Lars Kellogg-Stedman (N1LKS)",
		);
	});

	it("returns empty string for empty slug", () => {
		expect(formatAuthor("", authors)).toBe("");
	});

	it("returns empty string for undefined slug", () => {
		expect(formatAuthor(undefined, authors)).toBe("");
	});

	it("returns empty string for null slug", () => {
		expect(formatAuthor(null, authors)).toBe("");
	});

	it("escapes HTML in name", () => {
		const a = { "<script>": { name: "<script>alert('xss')</script>", callsign: "XSS" } };
		expect(formatAuthor("<script>", a)).toBe(
			"&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt; (XSS)",
		);
	});

	it("escapes HTML in callsign", () => {
		const a = { test: { name: "Test User", callsign: "<CALL>" } };
		expect(formatAuthor("test", a)).toBe("Test User (&lt;CALL&gt;)");
	});

	it("escapes HTML in url", () => {
		const a = { test: { name: "Test User", url: '/path/"onload="alert(1)' } };
		expect(formatAuthor("test", a)).toBe(
			'<a href="/path/&quot;onload=&quot;alert(1)">Test User</a>',
		);
	});
});
