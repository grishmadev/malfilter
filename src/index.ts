#!/usr/bin/env node
import parseArgs from "@functions/parse";
import { execAsyncCmd, getArgs, getConfirmation, getPkgMngr, show, showDataSpent, showReason, showVerdict, verifyPackage } from "./functions";
import { EvaluationStatus } from "./types";
import chalk from "chalk";
async function main() {
  const { range, name: packageName, install } = parseArgs(getArgs());

  show("Fetching details", "green");

  const { reason, message, status, dataSpent } = await verifyPackage(packageName, range);


  switch (status) {
    case EvaluationStatus.OK:
      show(`\rReasoning: ${chalk.green(message)}`);
      break;
    default:
      show(`\rReasoning: ${chalk.red(message)}`);
  }

  showReason(reason);
  showVerdict(status);
  showDataSpent(dataSpent);

  if (!install) {
    if (status == EvaluationStatus.OK) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  }

  if ([EvaluationStatus.SUSPICIOUS, EvaluationStatus.UNSAFE].includes(status)) {
    const answer = await getConfirmation("Package is not safe. Do you still want to install it?", true);
    if (!answer) {
      process.exit(0);
    }
  }

  const mngr = getPkgMngr();
  show(`Installing package through ${mngr}.`, "greenBright");

  const success = await execAsyncCmd(packageName);
  if (success != 0) {
    console.error("Error while installing package.");
    process.exit(1);
  }
  process.exit(0);
}

await main();
