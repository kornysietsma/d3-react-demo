/* eslint-disable react/forbid-prop-types */
import React from "react";
import PropTypes from "prop-types";

const Inspector = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { state, dispatch, dataRef } = props;
  const { cases } = dataRef.current;
  const { selected } = state.config;
  const hasSelection = selected != null;
  const selectedData = hasSelection
    ? cases.find((d) => d.id === selected)
    : undefined;
  return (
    <aside className="Inspector">
      {hasSelection ? (
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

Inspector.propTypes = {
  dataRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  state: PropTypes.shape({
    config: PropTypes.any.isRequired,
    expensiveConfig: PropTypes.any.isRequired,
    constants: PropTypes.any.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Inspector;
