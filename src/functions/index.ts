import { EvaluationStatus } from "../types/evaluation.ts";
import type { PackageInfo } from "../types/api.ts";
import type { Color, ColorName } from "chalk";
import chalk from "chalk";
export * from "./package.ts"
export * from "./evaluation.ts"
export * from "./commands.ts"

export function getArgs(): string[] {
  const argv = process.argv;
  let args = argv.slice(2);
  return args;
}

export function showReason(reasons: string[]): void {
  reasons.length ?? console.log("Reasons to consider:");
  for (const reason in reasons) {
    console.log(`\t - ${reason}`);
  }
}

export function showVerdict(verdict: EvaluationStatus): void {
  show(`\n\rVerdict:`);
  switch (verdict) {
    case EvaluationStatus.OK:
      show(`\r\tPackage is safe to install.`, "green");
      break;
    case EvaluationStatus.SUSPICIOUS:
      show(`\r\tPackage looks reasonably suspicious.\r\n\tProceed with caution.`, "yellow");
      break;
    case EvaluationStatus.UNSAFE:
      show(`\r\tPackage is not safe.\r\nDo not install.`, "red");
      break;
  }
}

export function showDataSpent(data: number): void {
  let unit = "KB";
  if (data <= 1000) unit = " Bytes";
  let new_data = data <= 1000 ? data : Math.round(data / 1000);
  show(`\nSpent ~ ${new_data}${unit} for this operation.`, "green");
}

export function showDetails(target: PackageInfo, createdDate: number): void {
  show(`Package Name: ${chalk.bold(target.package.name)}`);
  show(`Package Repo: ${chalk.bold(target.package.links.repository)}`);
  show(`Package Published on: ${chalk.bold(new Date(createdDate).toLocaleString())}`);
  show(`Latest Version: ${chalk.bold(target.package.version)}`);
  show(`Publisher: \n\r\tName:\t${chalk.bold(target.package.publisher.username)}\n\r\tEmail:\t${chalk.bold(target.package.publisher.email)}`)
  show(`Weekly Downloads: ${chalk.bold(target.downloads.weekly)}`);
}

export function show(str: string, color?: ColorName): void {
  if (color && typeof chalk[color] === "function") {
    console.log(chalk[color](`> ${str}`));
  } else {
    console.log(`> ${str}`);
  }
}
