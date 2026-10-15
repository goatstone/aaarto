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
});
