import _ from "lodash";

import { VizDataRef } from "./DataTypes";

interface DateRangeAction {
  type: "dateRange";
  payload: [Date, Date];
}

interface LineColourAction {
  type: "setLineColour";
  payload: string;
}
interface DotColourAction {
  type: "setDotColour";
  payload: string;
}
interface SelectDataAction {
  type: "selectData";
  payload: number; // the id of the point selected (id inside VizData not html ID!)
}

/** Every valid kind of Action, and their associated payloads */
export type Action =
  | DateRangeAction
  | LineColourAction
  | DotColourAction
  | SelectDataAction;

export type State = {
  config: {
    colours: {
      defaultLine: string;
      defaultDot: string;
      selectedDot: string;
    };
    selected: number | null;
  };
  expensiveConfig: {
    dateRange: {
      earliest: Date;
      latest: Date;
    };
  };
  constants: {
    margins: { top: number; right: number; bottom: number; left: number };
  };
};

function initialiseGlobalState(initialData: VizDataRef) {
  const {
    metadata: { earliest, latest },
  } = initialData.current;

  return {
    config: {
      colours: {
        defaultLine: "#00fdff",
        defaultDot: "#b743ff",
        selectedDot: "#eeff2b",
      },
      selected: null,
    },
    expensiveConfig: {
      dateRange: {
        earliest,
        latest,
      },
    },
    // Constants won't trigger an update - if these need to change, move them to config or expensiveConfig
    constants: {
      margins: { top: 20, right: 20, bottom: 70, left: 40 },
    },
  };
}

/** The heart of the state management.
 * Takes an Action, and updates the State.
 * Components will be redrawn with the new state.
 * The Viz component will do it's own magic to work out what needs to be redrawn
 */
function globalDispatchReducer(state: State, action: Action): State {
  switch (action.type) {
    case "dateRange": {
      const [early, late] = action.payload;
      const result = _.cloneDeep(state);
      result.expensiveConfig.dateRange.earliest = early;
      result.expensiveConfig.dateRange.latest = late;
      return result;
    }
    case "setLineColour": {
      const result = _.cloneDeep(state);
      result.config.colours.defaultLine = action.payload;
      return result;
    }
    case "setDotColour": {
      const result = _.cloneDeep(state);
      result.config.colours.defaultDot = action.payload;
      return result;
    }
    case "selectData": {
      const result = _.cloneDeep(state);
      result.config.selected = action.payload;
      return result;
    }
    default: {
      // Typescript check - this can't be called unless we missed an Action type
      const _exhaustive: never = action;
      return action;
    }
  }
}

export { globalDispatchReducer, initialiseGlobalState };
