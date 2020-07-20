/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import _ from "lodash";

const dimensions = (vizEl, margins) => {
  const width = vizEl.clientWidth - margins.left - margins.right;
  const height = vizEl.clientHeight - margins.top - margins.bottom;
  return { width, height };
};

const redraw = (d3Container, files, metadata, state, dispatch) => {
  const {
    config,
    expensiveConfig: {
      dateRange: { earliest, latest },
    },
    constants: { margins },
  } = state;
  const vizEl = d3Container.current;
  if (!d3Container.current) {
    console.warn("in draw but d3container not yet current");
    return;
  }
  const { width, height } = dimensions(vizEl, margins);

  const svg = d3.select(vizEl);
  const mainChartGroup = svg.select("g.main-chart");
  const xAxisGroup = svg.select("g.x-axis");
  const yAxisGroup = svg.select("g.y-axis");

  const x = d3.scaleTime().range([0, width]).domain([earliest, latest]);
  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(files, (d) => d.newCases)]);

  const xAxis = d3.axisBottom().scale(x);

  const yAxis = d3.axisLeft().scale(y).ticks(10);

  const line = d3
    .line()
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
    .on("click", (node, i, nodeList) => {
      // you need nodeList if you want the svg element clicked.
      // console.log("onClicked", node, i, nodeList[i]);
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

const draw = (d3Container, files, metadata, state, dispatch) => {
  // can do expensive data manipulation here
  redraw(d3Container, files, metadata, state, dispatch);
};

const initialize = (d3Container, files, metadata, state, dispatch) => {
  const { constants } = state;
  if (!d3Container.current) {
    console.warn("in draw but d3container not yet current");
    return;
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
    .attr("transform", `translate(0,${height})`);

  svg
    .append("g")
    .attr("class", "y-axis")
    .append("text")
    .attr("y", 6)
    .style("text-anchor", "middle")
    .text("Value");
  draw(d3Container, files, metadata, state, dispatch);
};

// see https://stackoverflow.com/questions/53446020/how-to-compare-oldvalues-and-newvalues-on-react-hooks-useeffect
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Viz = (props) => {
  const d3Container = useRef(null);
  const { dataRef, state, dispatch } = props;

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

Viz.propTypes = {
  dataRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  state: PropTypes.shape({
    config: PropTypes.any.isRequired,
    expensiveConfig: PropTypes.any.isRequired,
    constants: PropTypes.any.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Viz;
