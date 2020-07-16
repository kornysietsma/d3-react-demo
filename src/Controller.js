/* eslint-disable jsx-a11y/no-onchange */
import React, { useRef } from "react";
import PropTypes from "prop-types";
import _uniqueId from "lodash/uniqueId";

const Controller = props => {
  const { dataRef, state, dispatch } = props;
  // eslint-disable-next-line no-unused-vars
  const { metadata } = dataRef.current;
  const { config } = state;
  // ID logic from https://stackoverflow.com/questions/29420835/how-to-generate-unique-ids-for-form-labels-in-react
  const { current: strokeColourId } = useRef(_uniqueId("controller-"));
  const { current: dotColourId } = useRef(_uniqueId("controller-"));

  return (
    <aside className="Controller">
      <div>
        <label htmlFor={strokeColourId}>
          <input
            type="color"
            id={strokeColourId}
            name="stroke colour"
            value={config.colours.defaultLine}
            onChange={evt =>
              dispatch({
                type: "setLineColour",
                payload: evt.target.value
              })
            }
          />
          Select line colour
        </label>
      </div>
      <div>
        <label htmlFor={dotColourId}>
          <input
            type="color"
            id={dotColourId}
            name="dot colour"
            value={config.colours.defaultDot}
            onChange={evt =>
              dispatch({
                type: "setDotColour",
                payload: evt.target.value
              })
            }
          />
          Select dot colour
        </label>
      </div>
    </aside>
  );
};

Controller.propTypes = {
  dataRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  state: PropTypes.shape({
    config: PropTypes.any.isRequired,
    expensiveConfig: PropTypes.any.isRequired,
    constants: PropTypes.any.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired
};

export default Controller;
