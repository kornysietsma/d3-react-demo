import React, { Dispatch, useRef } from "react";
import _uniqueId from "lodash/uniqueId";
import { VizDataRef } from "./DataTypes";
import { Action, State } from "./State";
import { DefaultComponentProps } from "./ComponentProps";

const Controller = (props: DefaultComponentProps) => {
  const { dataRef, state, dispatch } = props;
  // eslint-disable-next-line no-unused-vars
  const { metadata } = dataRef.current!;
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
            onChange={(evt) =>
              dispatch({
                type: "setLineColour",
                payload: evt.target.value,
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
            onChange={(evt) =>
              dispatch({
                type: "setDotColour",
                payload: evt.target.value,
              })
            }
          />
          Select dot colour
        </label>
      </div>
    </aside>
  );
};

export default Controller;
