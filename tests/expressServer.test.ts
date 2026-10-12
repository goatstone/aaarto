/**
 * @jest-environment node
 */
import http from "http";
import { AddressInfo } from "net";
import { Writable } from "stream";
import express from "express";
import axios from "axios";

jest.mock("axios");

type Pin = { kind: "svg" | "metadata"; name: string; metadata?: any };

const readForm = async (form: NodeJS.ReadableStream): Promise<string> => {
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve) => {
    form.pipe(
      new Writable({
        write(chunk, _enc, cb) {
          chunks.push(chunk);
          cb();
        },
        final(cb) {
          cb();
          resolve();
        },
      })
    );
  });
  return Buffer.concat(chunks).toString();
};

const deferred = () => {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => (resolve = r));
  return { promise, resolve };
};

describe("POST /server", () => {
  let server: http.Server;
  let baseUrl: string;
  let pins: Pin[];
  let svgStarted: Record<string, ReturnType<typeof deferred>>;
  let svgRelease: Record<string, ReturnType<typeof deferred>>;

  beforeAll(async () => {
    // The server calls app.listen() on import; capture the app instead.
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
    pins = [];
    svgStarted = { A: deferred(), B: deferred() };
    svgRelease = { A: deferred(), B: deferred() };
    let cid = 0;
    (axios.post as jest.Mock).mockImplementation(async (_url, form) => {
      const body = await readForm(form);
      const name = /"name":"Aaarto: ([^"]*?)(?: metaData)?"/.exec(body)![1];
      if (body.includes('filename="image.svg"')) {
        pins.push({ kind: "svg", name });
        svgStarted[name].resolve();
        // Hold the image pin so the other request can start meanwhile.
        await svgRelease[name].promise;
      } else {
        const json = /\{"name".*\]\}/s.exec(body)![0];
        pins.push({ kind: "metadata", name, metadata: JSON.parse(json) });
      }
      return { data: { IpfsHash: `cid${++cid}` } };
    });
  });

  const post = (name: string) =>
    fetch(`${baseUrl}/server`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        svgString: "<svg/>",
        description: `description ${name}`,
        artistName: `artist ${name}`,
      }),
    });

  test("pins each request's own name, description and artist when requests overlap", async () => {
    const a = post("A");
    await svgStarted.A.promise; // A is waiting on Pinata
    const b = post("B");
    await svgStarted.B.promise; // B started while A is still waiting
    svgRelease.A.resolve();
    svgRelease.B.resolve();
    const [resA, resB] = await Promise.all([a, b]);

    expect(resA.status).toBe(200);
    expect(resB.status).toBe(200);
    const metadata = (name: string) =>
      pins.find((p) => p.kind === "metadata" && p.name === name)!.metadata;
    for (const name of ["A", "B"]) {
      const m = metadata(name);
      expect(m.name).toBe(name);
      expect(m.description).toBe(`description ${name}`);
      expect(m.attributes[1].value).toBe(`artist ${name}`);
    }
  });

  test("points each metadata image at that request's own image CID", async () => {
    const a = post("A");
    await svgStarted.A.promise;
    const b = post("B");
    await svgStarted.B.promise;
    svgRelease.B.resolve(); // B's image is pinned first
    const bodyB = await (await b).json();
    svgRelease.A.resolve();
    const bodyA = await (await a).json();

    const metadata = (name: string) =>
      pins.find((p) => p.kind === "metadata" && p.name === name)!.metadata;
    expect(metadata("A").image).toBe(`ipfs://${bodyA.ipfsHash}`);
    expect(metadata("B").image).toBe(`ipfs://${bodyB.ipfsHash}`);
    expect(bodyA.ipfsHash).not.toBe(bodyB.ipfsHash);
  });
});
