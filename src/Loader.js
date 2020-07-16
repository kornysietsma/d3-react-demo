import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import moment from "moment";
import App from "./App";

const useFetch = url => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(url);
      const json = await response.json();
      console.log("postprocessing data");
      const cleanData = json.data.map((rawData, index) => {
        return {
          id: index,
          date: moment(rawData.date).toDate(),
          newCases: rawData.newCasesByPublishDate,
          cumCases: rawData.cumCasesByPublishDate
        };
      });
      const dates = cleanData.map(d => d.date);
      const earliest = _.min(dates);
      const latest = _.max(dates);

      const metadata = {
        earliest,
        latest
      };
      setData({ cases: cleanData, metadata });
    }
    fetchData();
  }, [url]);

  return data;
};

const Loader = () => {
  const url = `${process.env.PUBLIC_URL}/data.json`;

  const dataRef = useRef(null);

  const data = useFetch(url);
  dataRef.current = data;

  return data == null ? <div>Loading...</div> : <App dataRef={dataRef} />;
};

export default Loader;
