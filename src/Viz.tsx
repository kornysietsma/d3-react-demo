import * as d3 from "d3";
import _ from "lodash";
import { useEffect, useRef } from "react";
import * as React from "react";

import { DefaultComponentProps } from "./ComponentProps";
import { DataEntry } from "./data.types";
import { Action, State } from "./State";
import { VizMetadata } from "./viz.types";

type Margins = { left: number; right: number; top: number; bottom: number };

const dimensions = (vizEl: SVGElement, margins: Margins) => {
  const width = vizEl.clientWidth - margins.left - margins.right;
  const height = vizEl.clientHeight - margins.top - margins.bottom;
  return { width, height };
};

/*
  redraws d3  based on cheap config changes 
*/
const redraw = (
  d3Container: React.RefObject<SVGSVGElement>,
  files: DataEntry[],
  metadata: VizMetadata,
  state: State,
  dispatch: React.Dispatch<Action>
) => {
  const {
    config,
    expensiveConfig: {
      dateRange: { earliest, latest },
    },
    constants: { margins },
  } = state;
  if (!d3Container.current) {
    // should be impossible
    throw new Error("Tried to redraw Viz before d3container created");
  }
  const vizEl = d3Container.current;
  const { width, height } = dimensions(vizEl, margins);

  const svg = d3.select(vizEl);
  const mainChartGroup = svg.select<SVGGElement>("g.main-chart");
  const xAxisGroup = svg.select<SVGGElement>("g.x-axis");
  const yAxisGroup = svg.select<SVGGElement>("g.y-axis");

  const x = d3.scaleTime().range([0, width]).domain([earliest, latest]);
  const y = d3
    .scaleLinear()
    .range([height, 0])
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .domain([0, d3.max(files, (d) => d.newCases)!]);

  const xAxis = d3.axisBottom(x);

  const yAxis = d3.axisLeft(y).ticks(10);

  const line = d3
    .line<DataEntry>()
    .x((d) => x(d.date))
    .y((d) => y(d.newCases));

  // the line
  mainChartGroup
    .selectAll("path.line")
    .data([files]) // note a single data point as line is built that way
    .join(
      (enter) => enter.append("path").attr("class", "line"),
      (update) => update,
      (exit) => exit.remove()
    )
    .attr("d", (d) => line(d))
    .style("stroke", config.colours.defaultLine)
    .style("fill", "none");

  // the dots
  mainChartGroup
    .selectAll("circle.dot")
    .data(files)
    .join(
      (enter) => enter.append("circle").attr("class", "dot"),
      (update) => update,
      (exit) => exit.remove()
    )
    // eslint-disable-next-line no-unused-vars
    .on("click", (_event, node) => {
      console.log("event ", _event);
      dispatch({ type: "selectData", payload: node.id });
    })
    .attr("cx", (d) => x(d.date))
    .attr("cy", (d) => y(d.newCases))
    .attr("r", 4)
    .style("stroke", "none")
    .style("fill", (d) =>
      d.id === config.selected
        ? config.colours.selectedDot
        : config.colours.defaultDot
    );

  xAxisGroup.call(xAxis.ticks(null));

  yAxisGroup.call(yAxis.ticks(null).tickSize(0));
};

/**
 * redraws d3 viz after expensive config changes (does nothing more in this simple demo)
 */
const draw = (
  d3Container: React.RefObject<SVGSVGElement>,
  files: DataEntry[],
  metadata: VizMetadata,
  state: State,
  dispatch: React.Dispatch<Action>
) => {
  // can do expensive data manipulation here
  redraw(d3Container, files, metadata, state, dispatch);
};

/**
 * initialize and draw d3 viz
 */
const initialize = (
  d3Container: React.RefObject<SVGSVGElement>,
  files: DataEntry[],
  metadata: VizMetadata,
  state: State,
  dispatch: React.Dispatch<Action>
) => {
  const { constants } = state;
  if (!d3Container.current) {
    // should be impossible
    throw new Error("Tried to initialize Viz before d3container created");
  }
  const { margins } = constants;
  const vizEl = d3Container.current;
  const { height } = dimensions(vizEl, margins);

  const svg = d3.select(vizEl);
  svg
    .append("g")
    .attr("class", "main-chart")
    .attr("transform", `translate(${margins.left},${margins.top})`);

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(${margins.left},${height + margins.top})`);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margins.left},${margins.top})`)
    .append("text")
    // .attr("y", 6)
    .style("text-anchor", "middle")
    .text("Value");
  draw(d3Container, files, metadata, state, dispatch);
};

// see https://stackoverflow.com/questions/53446020/how-to-compare-oldvalues-and-newvalues-on-react-hooks-useeffect
function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/*
  Viz component - shows a `<svg>` element holding a D3 visualization.
  Uses `useRef` to wrap the `<svg>` element so it doesn't get redrawn whenever the component is drawn,
  instead it bypasses the React logic and does drawing as needed.
*/
const Viz = (props: DefaultComponentProps) => {
  const d3Container = useRef<SVGSVGElement>(null);
  const { dataRef, state, dispatch } = props;

  // the previous state last time Viz was drawn (or undefined)
  const prevState = usePrevious(state);

  useEffect(() => {
    const { metadata, cases } = dataRef.current;
    const { config, expensiveConfig } = state;
    if (prevState === undefined) {
      console.log("No previous state - first draw");
      initialize(d3Container, cases, metadata, state, dispatch);
    } else if (!_.isEqual(prevState.expensiveConfig, expensiveConfig)) {
      console.log("expensive config change - redraw all");
      draw(d3Container, cases, metadata, state, dispatch);
    } else if (!_.isEqual(prevState.config, config)) {
      console.log("cheap config change - just redraw");
      redraw(d3Container, cases, metadata, state, dispatch);
    } else {
      console.log("no change in visible config - not doing nothin");
    }
  }, [dataRef, state, dispatch, prevState]);

  return (
    <aside className="Viz">
      <svg className="chart" ref={d3Container} />
    </aside>
  );
};

export default Viz;
