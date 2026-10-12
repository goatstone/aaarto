/**
 * @jest-environment node
 */
import http from "http";
import { AddressInfo } from "net";
import express from "express";
import axios from "axios";

jest.mock("axios");

const SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" version="1.1"><circle cx="1" cy="1" r="1" fill="#cccccc" id="1"/></svg>';
const upload = { name: "A", description: "", artistName: "", svgString: SVG };

describe("backend hardening", () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    process.env.UPLOAD_RATE_MAX = "3";
    delete process.env.CORS_ORIGINS;
    let app: any;
    jest
      .spyOn(express.application, "listen")
      .mockImplementation(function (this: any) {
        app = this;
        return {} as any;
      });
    require("../backend/expressServer");
    server = http.createServer(app);
    await new Promise<void>((r) => server.listen(0, r));
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });
  afterAll(async () => {
    await new Promise((r) => server.close(r));
    jest.restoreAllMocks();
  });
  beforeEach(() => {
    (axios.post as jest.Mock).mockReset();
    (axios.post as jest.Mock).mockResolvedValue({ data: { IpfsHash: "cid" } });
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  const post = (body: string, headers: Record<string, string> = {}) =>
    fetch(`${baseUrl}/server`, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body,
    });

  test("sets helmet's security headers", async () => {
    const res = await fetch(`${baseUrl}/server_status`);
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-powered-by")).toBeNull();
  });

  test.each([
    ["https://aaarto.art", "https://aaarto.art"],
    ["http://localhost:9000", "http://localhost:9000"],
    ["https://evil.example", null],
  ])("CORS for origin %s answers %s", async (origin, expected) => {
    const res = await fetch(`${baseUrl}/server_status`, { headers: { origin } });
    expect(res.headers.get("access-control-allow-origin")).toBe(expected);
  });

  test("answers 413 with a generic message for a body over 200 KB", async () => {
    const res = await post(JSON.stringify({ ...upload, description: "a".repeat(250000) }));
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: "Upload too large." });
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("answers 400 with a generic message for malformed JSON", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid request." });
  });

  // Last: it uses up the limit for this client
  test("sets a timeout on both Pinata calls, then rate-limits with a 429", async () => {
    const first = await post(JSON.stringify(upload));
    expect(first.status).toBe(200);
    expect((axios.post as jest.Mock).mock.calls).toHaveLength(2);
    for (const call of (axios.post as jest.Mock).mock.calls) {
      expect(call[2].timeout).toBe(30000);
    }

    // The limit is 3. Requests the body parser rejects never reach it.
    expect((await post(JSON.stringify(upload))).status).toBe(200);
    expect((await post(JSON.stringify(upload))).status).toBe(200);
    const fourth = await post(JSON.stringify(upload));
    expect(fourth.status).toBe(429);
    expect(await fourth.json()).toEqual({ error: "Too many uploads, please try again later." });
  });
});
