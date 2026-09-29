import chalk from "chalk";
import { show } from ".";
import { defaultParse, type ParseSchema } from "../types";

export default function parseArgs(args: string[]): ParseSchema {
  const parseArgs: ParseSchema = defaultParse;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--help") {
      show(`--install\t\t\tInstall a Package after determining its safe.`);
      show(`--range <number>\t\tPut Range of packages to search to increase discovery. [default = 20]`)
      process.exit(null);
    }
    if (arg === "--install" || arg === "-i") {
      parseArgs.install = true;
      continue;
    } else if (arg === "--range" || arg === "-r") {
      const range = args[i + 1];
      if (!range) {
        chalk.red("Range not specified.");
        process.exit(1);
      }
      let rangeNum = Number(range);
      if (isNaN(rangeNum)) {
        chalk.red("Range should be a number.");
        process.exit(1);
      }
      parseArgs.range = rangeNum;
      i++;
      continue;
    } else if (["-", "/", ";", "0"].includes(arg!.at(0)!)) {
      chalk.red("Invalid Package name.");
      process.exit(1);
    } else {
      if (!arg) {
        chalk.red("Package name not specified.");
        process.exit(1);
      }
      parseArgs.name = arg;
    }
  }
  if (!parseArgs.name.length) {
    chalk.red("Package name not specified.");
    process.exit(1);
  }
  return parseArgs;
}
