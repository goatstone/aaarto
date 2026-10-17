import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Canvas from "@components/Canvas";

const { validateUpload, LIMITS } = require("../backend/validateUpload");

const SVG_OPEN =
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" version="1.1">';
const WHITE = '<rect width="100%" height="100%" fill="white"/>';
const wrap = (inner: string) => `${SVG_OPEN}${WHITE}${inner}</svg>`;
const valid = {
  name: "My art",
  description: "A description",
  artistName: "An artist",
  svgString: wrap('<circle cx="10" cy="20" r="35" fill="#cccccc" id="1760000000000"/>'),
};
const check = (overrides: object) => validateUpload({ ...valid, ...overrides });

describe("validateUpload fields", () => {
  test("accepts a complete upload, with an empty description and artist", () => {
    expect(validateUpload(valid).ok).toBe(true);
    expect(check({ description: "", artistName: "" }).ok).toBe(true);
  });

  test.each([
    ["no body", undefined],
    ["a string body", "text"],
    ["a null body", null],
  ])("rejects %s", (_label, body) => {
    expect(validateUpload(body).ok).toBe(false);
  });

  test.each([
    ["missing name", { name: undefined }],
    ["blank name", { name: "   " }],
    ["non-string name", { name: { toString: "x" } }],
    ["name over the limit", { name: "a".repeat(LIMITS.name + 1) }],
    ["description over the limit", { description: "a".repeat(LIMITS.description + 1) }],
    ["non-string description", { description: 5 }],
    ["missing artistName", { artistName: undefined }],
    ["artistName over the limit", { artistName: "a".repeat(LIMITS.artistName + 1) }],
    ["empty svgString", { svgString: "" }],
    ["non-string svgString", { svgString: ["<svg/>"] }],
    ["svgString over the limit", { svgString: wrap(" ".repeat(LIMITS.svgString)) }],
  ])("rejects %s", (_label, overrides) => {
    expect(check(overrides).ok).toBe(false);
  });

  test("accepts values at the limits", () => {
    expect(
      check({
        name: "a".repeat(LIMITS.name),
        description: "a".repeat(LIMITS.description),
        artistName: "a".repeat(LIMITS.artistName),
      }).ok
    ).toBe(true);
  });
});

describe("validateUpload svgString", () => {
  const bad = (svgString: string) => check({ svgString }).ok;

  test.each([
    ["a script element", wrap("<script>alert(1)</script>")],
    ["an onload handler on svg", SVG_OPEN.replace(">", ' onload="alert(1)">') + "</svg>"],
    ["an onclick handler on a shape", wrap('<circle cx="1" cy="1" r="1" fill="#000" onclick="alert(1)"/>')],
    ["a foreignObject", wrap("<foreignObject><div/></foreignObject>")],
    ["an image with a link", wrap('<image href="https://example.com/x.png"/>')],
    ["an anchor", wrap('<a href="javascript:alert(1)"><circle cx="1" cy="1" r="1"/></a>')],
    ["a style element", wrap("<style>circle{}</style>")],
    ["a text node", wrap("hello")],
    ["a comment", wrap("<!-- x -->")],
    ["CDATA", wrap("<![CDATA[x]]>")],
    ["a DOCTYPE", "<!DOCTYPE svg>" + wrap("")],
    ["an XML declaration", '<?xml version="1.0"?>' + wrap("")],
    ["an entity", wrap('<circle cx="&#49;" cy="1" r="1" fill="#000"/>')],
    ["a url() fill", wrap('<circle cx="1" cy="1" r="1" fill="url(#a)"/>')],
    ["a javascript: fill", wrap('<circle cx="1" cy="1" r="1" fill="javascript:alert(1)"/>')],
    ["a non-numeric radius", wrap('<circle cx="1" cy="1" r="1px" fill="#000"/>')],
    ["a duplicated attribute", wrap('<circle cx="1" cx="2" cy="1" r="1" fill="#000"/>')],
    ["a single-quoted attribute", wrap("<circle cx='1' cy=\"1\" r=\"1\" fill=\"#000\"/>")],
    ["a shape with children", wrap('<circle cx="1" cy="1" r="1" fill="#000"></circle>')],
    ["a nested svg", wrap(SVG_OPEN + "</svg>")],
    ["a second root", valid.svgString + valid.svgString],
    ["content after </svg>", valid.svgString + "<script/>"],
    ["an unclosed svg", SVG_OPEN + WHITE],
    ["a different xmlns", valid.svgString.replace("2000/svg", "1999/xhtml")],
    ["a plain string", "not an svg"],
    ["a bare shape", '<circle cx="1" cy="1" r="1" fill="#000"/>'],
  ])("rejects %s", (_label, svg) => {
    expect(bad(svg as string)).toBe(false);
  });

  test("accepts negative, decimal and exponent coordinates and short hex fills", () => {
    expect(
      bad(wrap('<rect x="-12.5" y="3e-7" fill="#fff" width="70" height="70" id="5"/>'))
    ).toBe(true);
  });

  test("rejects an empty canvas: only the white background, or nothing at all", () => {
    expect(bad(wrap(""))).toBe(false);
    expect(bad(`${SVG_OPEN}</svg>`)).toBe(false);
    expect(bad(`${SVG_OPEN}${WHITE}${WHITE}</svg>`)).toBe(false);
  });

  test("accepts a single drawn shape, with or without the background", () => {
    const circle = '<circle cx="1" cy="1" r="1" fill="#000" id="1"/>';
    expect(bad(wrap(circle))).toBe(true);
    expect(bad(`${SVG_OPEN}${circle}</svg>`)).toBe(true);
    expect(bad(wrap('<rect x="1" y="1" fill="#000" width="5" height="5" id="2"/>'))).toBe(true);
  });
});

describe("validateUpload with the real Canvas output", () => {
  test("accepts what Canvas serializes, for circles and squares", () => {
    let serialized = "";
    const { container, rerender } = render(
      <Canvas shape="circle" size={70} color="#a1b2c3" setSvgString={(s) => { serialized = s as string; }} />
    );
    const svg = container.querySelector("svg") as SVGSVGElement;
    fireEvent.click(svg, { clientX: 10.5, clientY: 20.25 });
    rerender(
      <Canvas shape="square" size={55} color="#00ff7f" setSvgString={(s) => { serialized = s as string; }} />
    );
    fireEvent.click(svg, { clientX: 3, clientY: 4 });

    expect(serialized).toContain("<circle");
    expect(serialized).toContain("<rect x=");
    // jsdom writes xmlns twice; browsers write it once (see the fixture below)
    let seen = 0;
    const once = serialized.replace(/ xmlns="[^"]*"/g, (m) => (++seen > 1 ? "" : m));
    expect(check({ svgString: once }).ok).toBe(true);
  });

  test("accepts the output of Chrome's XMLSerializer for the same DOM", () => {
    // Captured from headless Chrome building the Canvas DOM with setAttribute
    const chrome =
      '<svg width="400" height="400" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="100%" height="100%" fill="white"/>' +
      '<circle cx="10.5" cy="20.25" r="35" fill="#a1b2c3" id="1791816093654"/>' +
      '<rect x="-5.5" y="4" fill="#00ff7f" width="55" height="55" id="1791816093655"/>' +
      "</svg>";
    expect(check({ svgString: chrome }).ok).toBe(true);
  });
});
