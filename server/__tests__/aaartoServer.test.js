import aaartoServer from "../aaartoServer";

describe("aaartoServer", () => {
  const mock ={
    set:jest.fn(),
    use:jest.fn(),
    get:jest.fn(),
    post:jest.fn(),
    listen:jest.fn()
  }

  it("should call expected methods", () => {
    aaartoServer(mock, 8000)
    expect(mock.post.mock.calls.length).toBe(2);
  });
});
