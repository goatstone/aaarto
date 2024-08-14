import getFormData from '../getFormData';

describe("getFormData", () => {
    it("should return FormData", () => {
        const r = getFormData('XXX')
        expect(typeof r).toBe('object');
    });
  });
  
