import React, { useReducer } from "react";
import "./App.css";
import Controller from "./Controller";
import Inspector from "./Inspector";
import Viz from "./Viz";
import { globalDispatchReducer, initialiseGlobalState } from "./State";
import { VizDataRef } from "./DataTypes";

const App = ({ dataRef }: { dataRef: VizDataRef }) => {
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
