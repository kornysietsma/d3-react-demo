import { MutableRefObject } from "react";

export type DataEntry = {
  id: number;
  date: Date;
  newCases: number;
  cumCases: number;
};

export type VizMetadata = {
  earliest: Date;
  latest: Date;
};

export type VizData = {
  cases: DataEntry[];
  metadata: VizMetadata;
};

export type VizDataRef = MutableRefObject<VizData | undefined>;
