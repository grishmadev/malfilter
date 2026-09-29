import { EvaluationStatus } from "../types/evaluation.ts";
import type { PackageInfo } from "../types/api.ts";
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
  console.log(`\n\rVerdict:`);
  switch (verdict) {
    case EvaluationStatus.OK:
      console.log(`\r\tPackage is Safe to install.`);
      break;
    case EvaluationStatus.SUSPICIOUS:
      console.log(`\r\tPackage looks reasonably suspicious.\r\n\tProceed with caution.`);
      break;
    case EvaluationStatus.UNSAFE:
      console.log(`\r\tPackage is not safe.\r\nDo not install.`);
      break;
  }
}

export function showDataSpent(data: number): void {
  let unit = "KB";
  if (data <= 1000) unit = " Bytes";
  let new_data = data <= 1000 ? data : Math.round(data / 1000);
  console.log(`\nSpent ~ ${new_data}${unit} for this operation.`);
}

export function showDetails(target: PackageInfo, createdDate: number): void {
  show(`Package Name: ${target.package.name}`);
  show(`Package Repo: ${target.package.links.repository}`);
  show(`Package Published on: ${new Date(createdDate).toLocaleString()}`);
  show(`Latest Version: ${target.package.version}`);
  show(`Publisher: \n\r\tName:\t${target.package.publisher.username}\n\r\tEmail:\t${target.package.publisher.email}`)
  show(`Weekly Downloads: ${target.downloads.weekly}`);
}

export function show(str: string): void {
  console.log(`> ${str}`);
}
