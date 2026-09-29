import { defaultParse, type ParseSchema } from "../types";

export default function parseArgs(args: string[]): ParseSchema {
  const parseArgs: ParseSchema = defaultParse;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--install" || arg === "-i") {
      parseArgs.install = true;
      continue;
    } else if (arg === "--range" || arg === "-r") {
      const range = args[i + 1];
      if (!range) {
        console.error("Range not specified.");
        process.exit(1);
      }
      let rangeNum = Number(range);
      if (isNaN(rangeNum)) {
        console.error("Range should be a number.");
        process.exit(1);
      }
      parseArgs.range = rangeNum;
      i++;
      continue;
    } else if (["-", "/", ";", "0"].includes(arg!.at(0)!)) {
      console.log("Invalid Package name.");
      process.exit(1);
    } else {
      if (!arg) {
        console.error("Package name not specified.");
        process.exit(1);
      }
      parseArgs.name = arg;
    }
  }
  if (!parseArgs.name.length) {
    console.error("Package name not specified.");
    process.exit(1);
  }
  console.log("parse schema: ", parseArgs);
  return parseArgs;
}
