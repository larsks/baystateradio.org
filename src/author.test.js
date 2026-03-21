import { resolveAuthor, formatAuthor } from "./author.js";
import { describe, it, expect } from "vitest";

const authors = {
	n1lks: { name: "Lars Kellogg-Stedman", callsign: "N1LKS", url: "https://n1lks.oddbit.com/" },
	nourl: { name: "Jane Smith", callsign: "W1ABC" },
	nocall: { name: "John Doe", url: "https://example.com/" },
	nameonly: { name: "Anonymous" },
	noname: { callsign: "W1XYZ", url: "https://example.com/" },
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
	it("returns separately linked name and callsign when author has url and callsign", () => {
		expect(formatAuthor("n1lks", authors)).toBe(
			'<a href="https://n1lks.oddbit.com/">Lars Kellogg-Stedman</a> (<a href="https://hamdb.org/n1lks">N1LKS</a>)',
		);
	});

	it("returns plain linked name and linked callsign when author has no url", () => {
		expect(formatAuthor("nourl", authors)).toBe(
			'Jane Smith (<a href="https://hamdb.org/w1abc">W1ABC</a>)',
		);
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

	it("returns verbatim slug when registry entry has no name", () => {
		expect(formatAuthor("noname", authors)).toBe("noname");
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
		const a = { test: { name: "<b>Bad</b>", callsign: "W1TST" } };
		expect(formatAuthor("test", a)).toBe(
			'&lt;b&gt;Bad&lt;/b&gt; (<a href="https://hamdb.org/w1tst">W1TST</a>)',
		);
	});

	it("escapes HTML in callsign display", () => {
		const a = { test: { name: "Test User", callsign: "<call>" } };
		expect(formatAuthor("test", a)).toBe(
			'Test User (<a href="https://hamdb.org/%3Ccall%3E">&lt;CALL&gt;</a>)',
		);
	});

	it("escapes HTML in url", () => {
		const a = { test: { name: "Test User", url: '/path/"onload="alert(1)' } };
		expect(formatAuthor("test", a)).toBe(
			'<a href="/path/&quot;onload=&quot;alert(1)">Test User</a>',
		);
	});

	it("lowercases callsign in hamdb url", () => {
		const a = { test: { name: "Test User", callsign: "W1ABC" } };
		expect(formatAuthor("test", a)).toBe(
			'Test User (<a href="https://hamdb.org/w1abc">W1ABC</a>)',
		);
	});

	it("uppercases callsign in display regardless of registry case", () => {
		const a = { test: { name: "Test User", callsign: "w1abc" } };
		expect(formatAuthor("test", a)).toBe(
			'Test User (<a href="https://hamdb.org/w1abc">W1ABC</a>)',
		);
	});
});
