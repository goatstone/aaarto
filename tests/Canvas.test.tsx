import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Canvas from "@components/Canvas";

const setup = (shape = "circle") => {
  let serialized = "";
  const utils = render(
    <>
      <svg data-testid="other" width="10" height="10"><path d="M0 0" /></svg>
      <Canvas shape={shape} size={40} color="#112233" setSvgString={(s) => { serialized = s as string; }} />
    </>
  );
  const canvas = utils.container.querySelectorAll("svg")[1];
  return { canvas, getSvg: () => serialized, ...utils };
};

describe("Canvas", () => {
  test("serializes its own svg even when another svg comes first on the page", () => {
    const { canvas, getSvg } = setup();
    fireEvent.click(canvas, { clientX: 20, clientY: 20 });
    expect(getSvg()).toContain("<circle");
    expect(getSvg()).not.toContain("<path");
  });

  test("clicks in the same millisecond get distinct numeric ids", () => {
    jest.spyOn(Date, "now").mockReturnValue(1700000000000);
    const { canvas } = setup();
    fireEvent.click(canvas, { clientX: 10, clientY: 10 });
    fireEvent.click(canvas, { clientX: 30, clientY: 30 });
    const ids = Array.from(canvas.querySelectorAll("circle")).map((c) => c.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    ids.forEach((id) => expect(id).toMatch(/^\d+$/));
    (Date.now as jest.Mock).mockRestore();
  });

  test("renders the shapes without a React key warning", () => {
    const errors = jest.spyOn(console, "error").mockImplementation(() => {});
    const { canvas } = setup();
    fireEvent.click(canvas, { clientX: 10, clientY: 10 });
    fireEvent.click(canvas, { clientX: 30, clientY: 30 });
    expect(errors.mock.calls.flat().join(" ")).not.toMatch(/unique "key"/);
    errors.mockRestore();
  });
});
