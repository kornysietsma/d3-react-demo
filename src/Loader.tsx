import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import moment from "moment";
import App from "./App";
import { VizData, DataEntry, VizDataRef } from "./DataTypes";

type JsonEntry = {
  areaType: string;
  areaName: string;
  date: string;
  newCasesByPublishDate: number;
  cumCasesByPublishDate: number;
};

const useFetch = (url: string) => {
  const [data, setData] = useState<VizData>();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(url);
      const json = await response.json();
      console.log("postprocessing data");
      // Note I'm just type asserting here - if you don't control the data file, might want to validate it and use a type guard!
      const cleanData: Array<DataEntry> = json.data.map(
        (rawData: JsonEntry, index: number) => {
          return {
            id: index,
            date: moment(rawData.date).toDate(),
            newCases: rawData.newCasesByPublishDate,
            cumCases: rawData.cumCasesByPublishDate,
          };
        }
      );
      if (cleanData.length === 0) {
        throw new Error("Empty data returned from json file");
      }
      const dates: Array<Date> = cleanData.map((d) => d.date);
      const earliest = _.min(dates) as Date;
      const latest: Date = _.max(dates) as Date;

      const metadata = {
        earliest,
        latest,
      };
      setData({ cases: cleanData, metadata });
    }
    fetchData();
  }, [url]);

  return data;
};

const Loader = () => {
  const url = `${process.env.PUBLIC_URL}/data.json`;

  const dataRef: VizDataRef = useRef<VizData>();

  const data = useFetch(url);
  dataRef.current = data;

  return dataRef.current === undefined ? ( // TODO - this used to be null check?
    <div>Loading...</div>
  ) : (
    <App dataRef={dataRef} />
  );
};

export default Loader;
