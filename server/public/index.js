const makeCircle = (x, y, brushSize, color) => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  path.setAttribute("r", brushSize / 2);
  path.setAttribute("cx", x);
  path.setAttribute("cy", y);
  path.setAttribute("fill", color);

  return path;
};
const makeSquare = (x, y, brushSize, color) => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  path.setAttribute("width", brushSize);
  path.setAttribute("height", brushSize);
  path.setAttribute("x", x - brushSize / 2);
  path.setAttribute("y", y - brushSize / 2);
  path.setAttribute("fill", color);

  return path;
};
const erase = (targetEl) => {
  if (targetEl.id === "canvas") return;
  targetEl.parentElement.removeChild(targetEl);
};
const makeCanvas = () => {
  const canvas = document.querySelector("#art");
  canvas.addEventListener("click", (event) => {
    let brush = "";
    const { clientX, clientY } = event;
    const { top, left } = document
      .querySelector("svg#art")
      .getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    const brushType = document.querySelector("#shape input:checked").value;
    const brushSize = document.querySelector("#size input").value;
    const brushColor = document.querySelector("#color input").value;
    if (brushType === "circle") {
      canvas.append(makeCircle(x, y, brushSize, brushColor));
    } else if (brushType === "square") {
      canvas.append(makeSquare(x, y, brushSize, brushColor));
    } else {
      erase(event.target);
    }
  });
};
/**
 * Initialize the application
 */
const init = () => {
  makeCanvas();
};
window.addEventListener("load", init);
