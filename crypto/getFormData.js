import FormData from "form-data";

/**
 * Supply an SVG string as contents in formData
 * @param {string} art - The file to be to be appended
 * @returns formData
 */
const getFormData = (art) => {
  const formData = new FormData();
  formData.append("file", Buffer.from(art), "aaarto.svg");
  formData.append(
    "pinataMetadata",
    JSON.stringify({
      name: "Aaarto",
    })
  );
  formData.append(
    "pinataOptions",
    JSON.stringify({
      cidVersion: 0,
    })
  );
  return formData;
};

export default getFormData;
