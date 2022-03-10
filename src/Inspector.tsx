import React from "react";

import { DefaultComponentProps } from "./ComponentProps";

const Inspector = (props: DefaultComponentProps) => {
  const { state, dataRef } = props;
  const { cases } = dataRef.current!;
  const { selected } = state.config;
  const hasSelection = selected != null;
  const selectedData = hasSelection
    ? cases.find((d) => d.id === selected)
    : undefined;
  return (
    <aside className="Inspector">
      {selectedData ? (
        <div>
          <h4>Selected: {selectedData.date.toString()}</h4>
          <p>New cases: {selectedData.newCases}</p>
          <p>Cumulative cases: {selectedData.cumCases}</p>
        </div>
      ) : (
        <p>Please click on the chart to select a day</p>
      )}
    </aside>
  );
};

export default Inspector;
