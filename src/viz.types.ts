import { MutableRefObject } from "react";

import { DataEntry } from "./data.types";

export type VizMetadata = {
  earliest: Date;
  latest: Date;
};

export type VizData = {
  cases: DataEntry[];
  metadata: VizMetadata;
};

// While we are loading the data, it's value might be undefined
export type VizDataRefMaybe = MutableRefObject<VizData | undefined>;
// once Loader.tsx loads `<App>` the value must be defined
export type VizDataRef = MutableRefObject<VizData>;
