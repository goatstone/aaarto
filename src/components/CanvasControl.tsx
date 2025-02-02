import React from "react";

type CanvasControlProps = {
  shape: string,
  setShape: React.Dispatch<React.SetStateAction<string>>,
  size: number,
  setSize: React.Dispatch<React.SetStateAction<number>>,
  color: string,
  setColor: React.Dispatch<React.SetStateAction<string>>,
};

const labels = {
  circle: "Circle",
  square: "Square",
  erase: "Erase"
};

const ControlPanel: React.FC<CanvasControlProps> = ({
  shape,
  setShape,
  size,
  setSize,
  color,
  setColor,
}) => {

  return (
    <section>
      <section>
        <label>
          {labels.circle}
          <input
            type="radio"
            name="shape"
            value="circle"
            checked={shape === 'circle'}
            onChange={({ target }) => setShape(target.value)}
          />
        </label>
        <label>
          {labels.square}
          <input
            type="radio"
            name="shape"
            value="square"
            checked={shape === 'square'}
            onChange={({ target }) => setShape(target.value)}
          />
        </label>
        <label>
          {labels.erase}
          <input
            type="radio"
            name="shape"
            value="erase"
            checked={shape === 'erase'}
            onChange={({ target }) => setShape(target.value)}
          />
        </label>
      </section>
      <section>
        <label>
          Size
          <input
            type="range"
            value={size}
            min="10"
            max="300"
            onChange={({ target }) => setSize(Number(target.value))}
          />
        </label>
      </section>
      <section>
        <label>
          Color
          <input
            type="color"
            value={color}
            onChange={({ target }) => setColor(target.value)}
          />
        </label>
      </section>
    </section>
  );
};

export default ControlPanel;
