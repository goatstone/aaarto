/*
validateUpload.js
Server-side checks for POST /server. The browser limits (maxLength, a title
being required) do not bind a script that posts to the endpoint directly.

The SVG is checked against what src/components/Canvas.tsx produces: an <svg>
holding <rect> and <circle> elements with numeric attributes and a plain
fill, at least one of them drawn (the full-size white background <rect> does
not count, so an empty canvas is rejected). Anything else (scripts, event handlers, links, text, comments, CDATA,
DOCTYPE, entities) is rejected, because gateways serve pinned SVGs as
image/svg+xml and run any script in them.
*/
const LIMITS = {
  name: 128,
  description: 256,
  artistName: 256,
  svgString: 150000,
};

const NUMBER = /^-?\d+(\.\d+)?(e-?\d+)?$/i;
const NUMBER_OR_PERCENT = /^(-?\d+(\.\d+)?(e-?\d+)?|100%)$/i;
const FILL = /^(#[0-9a-f]{3}|#[0-9a-f]{6}|white)$/i;
const ID = /^\d{1,20}$/;

const exact = (value) => (v) => v === value;
const matches = (re) => (v) => re.test(v);

const ALLOWED = {
  svg: {
    xmlns: exact("http://www.w3.org/2000/svg"),
    version: exact("1.1"),
    width: matches(NUMBER),
    height: matches(NUMBER),
  },
  rect: {
    x: matches(NUMBER),
    y: matches(NUMBER),
    width: matches(NUMBER_OR_PERCENT),
    height: matches(NUMBER_OR_PERCENT),
    fill: matches(FILL),
    id: matches(ID),
  },
  circle: {
    cx: matches(NUMBER),
    cy: matches(NUMBER),
    r: matches(NUMBER),
    fill: matches(FILL),
    id: matches(ID),
  },
};

// name="value" pairs, double quotes only, separated by single spaces
const ATTRIBUTES = /^(?: ([a-zA-Z]+)="([^"<>&]*)")*$/;
const ATTRIBUTE = / ([a-zA-Z]+)="([^"<>&]*)"/g;

const attributesAreAllowed = (tag, source) => {
  if (!ATTRIBUTES.test(source)) return false;
  const seen = new Set();
  for (const [, key, value] of source.matchAll(ATTRIBUTE)) {
    const check = ALLOWED[tag][key];
    if (!check || seen.has(key) || !check(value)) return false;
    seen.add(key);
  }
  return true;
};

const svgIsAllowed = (svg) => {
  // Only the three tags below may appear; no text, comments or entities
  const tags = svg.match(/<[^>]*>|[^<]+/g);
  if (!tags || tags.length < 2) return false;
  let open = false;
  let closed = false;
  let shapes = 0;
  for (const token of tags) {
    if (!token.startsWith("<")) {
      if (token.trim() !== "") return false; // stray text
      continue;
    }
    if (closed) return false; // nothing after </svg>
    if (token === "</svg>") {
      if (!open) return false;
      closed = true;
      continue;
    }
    const match = /^<(svg|rect|circle)([^>]*?)(\/?)>$/.exec(token);
    if (!match) return false;
    const [, tag, attributes, selfClosing] = match;
    if (tag === "svg") {
      if (open || selfClosing) return false;
      open = true;
    } else if (!open || !selfClosing) {
      return false; // shapes sit inside <svg> and have no children
    }
    if (!attributesAreAllowed(tag, attributes)) return false;
    // The full-size white <rect> is the canvas background, not art
    if (tag !== "svg" && !(tag === "rect" && / width="100%"/.test(attributes))) {
      shapes += 1;
    }
  }
  return open && closed && shapes > 0;
};

const isText = (value, max) => typeof value === "string" && value.length <= max;

/**
 * @returns {{ ok: true } | { ok: false, reason: string }} reason is for the
 *   server log only; do not send it to the client.
 */
const validateUpload = (body) => {
  if (!body || typeof body !== "object") {
    return { ok: false, reason: "body is not an object" };
  }
  const { name, svgString, description, artistName } = body;
  if (!isText(name, LIMITS.name) || name.trim() === "") {
    return { ok: false, reason: "name is missing or too long" };
  }
  if (!isText(description, LIMITS.description)) {
    return { ok: false, reason: "description is missing or too long" };
  }
  if (!isText(artistName, LIMITS.artistName)) {
    return { ok: false, reason: "artistName is missing or too long" };
  }
  if (!isText(svgString, LIMITS.svgString) || svgString.trim() === "") {
    return { ok: false, reason: "svgString is missing or too long" };
  }
  if (!svgIsAllowed(svgString.trim())) {
    return { ok: false, reason: "svgString is not an allowed SVG (content not allowed, or no drawn shape)" };
  }
  return { ok: true };
};

module.exports = { validateUpload, LIMITS };
