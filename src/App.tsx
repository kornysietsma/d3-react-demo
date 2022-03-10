import "./App.css";

import { useReducer, useRef } from "react";

import Controller from "./Controller";
import { VizDataRef, VizDataRefMaybe } from "./DataTypes";
import Inspector from "./Inspector";
import { globalDispatchReducer, initialiseGlobalState } from "./State";
import Viz from "./Viz";

const App = ({ dataRefMaybe }: { dataRefMaybe: VizDataRefMaybe }) => {
  // The App can only be shown if the data ref has been loaded - see Loader.tsx
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const dataRef: VizDataRef = useRef(dataRefMaybe.current!);

  const [vizState, dispatch] = useReducer(
    globalDispatchReducer,
    dataRef,
    initialiseGlobalState
  );
  return (
    <div className="App">
      <header className="App-header">
        <h1>Korny&apos;s D3 React Demo</h1>
      </header>
      <Viz dataRef={dataRef} state={vizState} dispatch={dispatch} />
      <Controller dataRef={dataRef} state={vizState} dispatch={dispatch} />
      <Inspector dataRef={dataRef} state={vizState} dispatch={dispatch} />
    </div>
  );
};

export default App;
