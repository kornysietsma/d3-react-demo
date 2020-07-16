import _ from "lodash";

function initialiseGlobalState(initialData) {
  const {
    metadata: { earliest, latest }
  } = initialData.current;

  return {
    config: {
      colours: {
        defaultLine: "#00fdff",
        defaultDot: "#b743ff",
        selectedDot: "#eeff2b"
      },
      selected: null
    },
    expensiveConfig: {
      dateRange: {
        earliest,
        latest
      }
    },
    // Constants won't trigger an update - if these need to change, move them to config or expensiveConfig
    constants: {
      margins: { top: 20, right: 20, bottom: 70, left: 40 }
    }
  };
}

function globalDispatchReducer(state, action) {
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
    default:
      throw new Error(`Invalid dispatch type ${action.type}`);
  }
}

export { initialiseGlobalState, globalDispatchReducer };
