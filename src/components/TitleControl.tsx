import React from "react";

const labels = {
  title: "Title"
};

type TitleControlProps = {
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
};

const TitleControl: React.FC<TitleControlProps> = ({
  title,
  setTitle
}) => {

  return (
    <section>
      <section>
        <label>
          {labels.title}
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="Title"
            maxLength={128}
            size={16}
          />
        </label>
      </section>
    </section>
  );
};

export default TitleControl;
