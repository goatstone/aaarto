import React from "react";
import { render, screen } from "@testing-library/react";
import AboutInfo from "@components/AboutInfo";

const RARIBLE =
  "https://rarible.com/polygon/collections/0x03a9423e9aac42e9f991d292f8e074808d9abe7f";

describe("AboutInfo", () => {
  test("links to the collection on Rarible, not OpenSea", () => {
    const { container } = render(<AboutInfo />);
    expect(screen.getByRole("link", { name: "Aaarto on Rarible" }).getAttribute("href")).toBe(RARIBLE);
    expect(container.textContent).not.toMatch(/opensea/i);
    expect(container.innerHTML).not.toMatch(/opensea/i);
  });

  test("every link that opens a new tab has rel=noopener noreferrer", () => {
    const { container } = render(<AboutInfo />);
    const blank = container.querySelectorAll('a[target="_blank"]');
    expect(blank.length).toBeGreaterThan(0);
    blank.forEach((a) => expect(a.getAttribute("rel")).toBe("noopener noreferrer"));
  });

  test("has a Contact button that opens contact.html in a new tab", () => {
    render(<AboutInfo />);
    const contact = screen.getByRole("link", { name: "Contact" });
    expect(contact.getAttribute("href")).toBe("contact.html");
    expect(contact.getAttribute("target")).toBe("_blank");
  });
});
