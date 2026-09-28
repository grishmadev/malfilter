#!/usr/bin/env node
import { getArgs, showDataSpent, showReason, showVerdict, verifyPackage } from "./functions";
import { EvaluationStatus } from "./types";
async function main() {
  const args = getArgs();
  let packageName: string | undefined;
  let range: number | undefined;
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (arg === "--range") {
      range = Number(args[i + 1]);
      i++;
    } else {
      packageName = arg;
    }
  }
  if (range && isNaN(range)) {
    console.log("Range not a number");
    return;
  }
  if (!packageName) {
    console.log("Please enter a package name.");
    return;
  }
  console.log("Fetching details...");
  const { reason, message, status, dataSpent } = await verifyPackage(packageName, range);
  console.log(`\rReasoning: ${message}`);
  switch (status) {
    case EvaluationStatus.OK:
      break;
    case EvaluationStatus.SUSPICIOUS:
      showReason(reason);
      break;
    case EvaluationStatus.UNSAFE:
      showReason(reason);
      break;
  }
  showVerdict(status);
  showDataSpent(dataSpent);
  if (status == EvaluationStatus.OK) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}
await main();
