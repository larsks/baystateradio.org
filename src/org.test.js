import { resolveOrganization, formatOrganization, escHtml } from "./org.js";
import { describe, it, expect } from "vitest";

const orgs = [
	{ fileSlug: "caara", data: { title: "Cape Ann Amateur Radio Assocation", acronym: "CAARA" }, url: "/org/caara/" },
	{ fileSlug: "barc", data: { title: "Billerica Amateur Radio Club", acronym: "BARC" }, url: "/org/barc/" },
];

describe("resolveOrganization", () => {
	it("returns the matching org", () => {
		const result = resolveOrganization("caara", orgs);
		expect(result).toBe(orgs[0]);
	});

	it("returns null for unknown slug", () => {
		expect(resolveOrganization("unknown", orgs)).toBeNull();
	});

	it("returns null for empty slug", () => {
		expect(resolveOrganization("", orgs)).toBeNull();
	});

	it("returns null for undefined slug", () => {
		expect(resolveOrganization(undefined, orgs)).toBeNull();
	});

	it("returns null when orgs is not an array", () => {
		expect(resolveOrganization("caara", null)).toBeNull();
		expect(resolveOrganization("caara", undefined)).toBeNull();
	});
});

describe("formatOrganization", () => {
	it("returns linked title and acronym when org has a url", () => {
		expect(formatOrganization("caara", orgs)).toBe(
			'<a href="/org/caara/">Cape Ann Amateur Radio Assocation (CAARA)</a>',
		);
	});

	it("returns plain title and acronym when org has no url", () => {
		const orgsNoUrl = [{ fileSlug: "caara", data: { title: "Cape Ann Amateur Radio Assocation", acronym: "CAARA" } }];
		expect(formatOrganization("caara", orgsNoUrl)).toBe(
			"Cape Ann Amateur Radio Assocation (CAARA)",
		);
	});

	it("returns the raw slug when org is not found", () => {
		expect(formatOrganization("unknown", orgs)).toBe("unknown");
	});

	it("returns empty string for empty slug", () => {
		expect(formatOrganization("", orgs)).toBe("");
	});

	it("returns empty string for undefined slug", () => {
		expect(formatOrganization(undefined, orgs)).toBe("");
	});

	it("returns linked title only when org has a url but no acronym", () => {
		const orgsNoAcronym = [{ fileSlug: "hamb", data: { title: "Ham Radio Boston" }, url: "/org/hamb/" }];
		expect(formatOrganization("hamb", orgsNoAcronym)).toBe(
			'<a href="/org/hamb/">Ham Radio Boston</a>',
		);
	});

	it("returns plain title only when org has no url and no acronym", () => {
		const orgsNoAcronym = [{ fileSlug: "hamb", data: { title: "Ham Radio Boston" } }];
		expect(formatOrganization("hamb", orgsNoAcronym)).toBe("Ham Radio Boston");
	});

	it("escapes HTML characters in title", () => {
		const orgsWithHtml = [{ fileSlug: "test", data: { title: "<script>alert('xss')</script>", acronym: "TEST" }, url: "/org/test/" }];
		expect(formatOrganization("test", orgsWithHtml)).toBe(
			'<a href="/org/test/">&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt; (TEST)</a>',
		);
	});

	it("escapes HTML characters in acronym", () => {
		const orgsWithHtml = [{ fileSlug: "test", data: { title: "Test Org", acronym: "<TEST>" }, url: "/org/test/" }];
		expect(formatOrganization("test", orgsWithHtml)).toBe(
			'<a href="/org/test/">Test Org (&lt;TEST&gt;)</a>',
		);
	});

	it("escapes HTML characters in url", () => {
		const orgsWithHtml = [{ fileSlug: "test", data: { title: "Test Org", acronym: "TEST" }, url: "/org/test/\"onload=\"alert('xss')" }];
		expect(formatOrganization("test", orgsWithHtml)).toBe(
			'<a href="/org/test/&quot;onload=&quot;alert(&#39;xss&#39;)">Test Org (TEST)</a>',
		);
	});
});

describe("escHtml", () => {
	it("escapes ampersands", () => {
		expect(escHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
	});

	it("escapes less-than signs", () => {
		expect(escHtml("5 < 10")).toBe("5 &lt; 10");
	});

	it("escapes greater-than signs", () => {
		expect(escHtml("10 > 5")).toBe("10 &gt; 5");
	});

	it("escapes double quotes", () => {
		expect(escHtml('Say "hello"')).toBe("Say &quot;hello&quot;");
	});

	it("escapes single quotes", () => {
		expect(escHtml("It's working")).toBe("It&#39;s working");
	});

	it("escapes all special characters together", () => {
		expect(escHtml(`<script>alert("XSS & 'attack'")</script>`)).toBe(
			"&lt;script&gt;alert(&quot;XSS &amp; &#39;attack&#39;&quot;)&lt;/script&gt;",
		);
	});

	it("returns empty string for empty input", () => {
		expect(escHtml("")).toBe("");
	});

	it("returns empty string for null input", () => {
		expect(escHtml(null)).toBe("");
	});

	it("returns empty string for undefined input", () => {
		expect(escHtml(undefined)).toBe("");
	});
});
