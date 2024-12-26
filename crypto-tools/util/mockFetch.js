/**
 * Mock the fetch function to prevent server calls
 */
const mockFetch = () => {
    global.fetch = () => {
        console.log("mock fetch");
        return { ok: true, json: () => ({ a: 1 }) };
      };      
}

export default mockFetch;
