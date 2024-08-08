import dynamic from "next/dynamic";

export const PerformersAsync = dynamic(() =>
  import("./ui").then((mod) => mod.Performer)
);
