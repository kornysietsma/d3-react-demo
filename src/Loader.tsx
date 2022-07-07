import { parseISO } from "date-fns/fp";
import { useEffect, useRef, useState } from "react";

import App from "./App";
import { DataEntry, VizData, VizDataRefMaybe } from "./DataTypes";

type JsonEntry = {
  areaType: string;
  areaName: string;
  date: string;
  newCasesByPublishDate: number;
  cumCasesByPublishDate: number;
};

/**
 * Fetches data from a URL asynchronously via useEffect
 */
const useFetch = (url: string) => {
  const [data, setData] = useState<VizData>();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(url);
      const json = await response.json();
      // Note I'm just asserting data types here - if you don't control the data file, you might want to validate it and use a type guard; or use a schema on the way in.
      const cleanData: Array<DataEntry> = json.data.map(
        (rawData: JsonEntry, index: number) => {
          return {
            id: index,
            date: parseISO(rawData.date),
            newCases: rawData.newCasesByPublishDate,
            cumCases: rawData.cumCasesByPublishDate,
          };
        }
      );
      if (cleanData.length === 0) {
        throw new Error("Empty data returned from json file");
      }
      const dates: Array<Date> = cleanData.map((d) => d.date);
      const earliest = dates.reduce((a, b) => (a < b ? a : b));
      const latest = dates.reduce((a, b) => (a > b ? a : b));

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

/**
 * The main Loader component - loads data and renders the `<App>` component when the data has been loaded.
 */
const Loader = () => {
  const url = `${process.env.PUBLIC_URL}/data.json`;

  const dataRefEventually: VizDataRefMaybe = useRef<VizData>();

  const data = useFetch(url);
  dataRefEventually.current = data;

  return dataRefEventually.current === undefined ? (
    <div>Loading...</div>
  ) : (
    <App dataRefMaybe={dataRefEventually} />
  );
};

export default Loader;
