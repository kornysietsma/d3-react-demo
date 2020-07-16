/* eslint react/prop-types: 0 */
import React from "react";

const Inspector = props => {
  const { state, dispatch, dataRef } = props;
  const { cases, metadata } = dataRef.current;
  const { selectedDate } = state.config;
  const hasSelection = selectedDate != null;
  const selectedData = hasSelection
    ? cases.find(d => d.date === selectedDate)
    : null;
  return (
    <aside className="Inspector">
      {hasSelection ? (
        <div>
          <h4>Selected: {selectedDate.toString()}</h4>
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
