import { useId } from "react";

import { DefaultComponentProps } from "./ComponentProps";

/**
 * The left-hand Controller panel - contains user interactivity stuff
 */
const Controller = (props: DefaultComponentProps) => {
  const { state, dispatch } = props;

  const { config } = state;
  // ID logic from https://stackoverflow.com/a/71681435/196463 updated for react 18!
  const strokeColourId = useId();
  const dotColourId = useId();

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
