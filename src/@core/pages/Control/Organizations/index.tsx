import dynamic from "next/dynamic";

export const ExecutersAsync = dynamic(() =>
  import("./ui").then((mod) => mod.Executer)
);
