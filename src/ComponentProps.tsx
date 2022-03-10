import { Dispatch } from "react";

import { VizDataRef } from "./DataTypes";
import { Action, State } from "./State";

export type DefaultComponentProps = {
  dataRef: VizDataRef;
  state: State;
  dispatch: Dispatch<Action>;
};
