import { Dispatch } from "react";

import { VizDataRef } from "./viz.types";
import { Action, State } from "./State";

/**
 * All my main components use the same properties - this isn't really mandatory, it's just convienient
 */
export type DefaultComponentProps = {
  dataRef: VizDataRef;
  state: State;
  dispatch: Dispatch<Action>;
};
