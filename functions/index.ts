import { argv } from "bun"
import { EvaluationStatus } from "../types/evaluation.ts";
export * from "./package.ts"
export * from "./evaluation.ts"

export function getArgs(): string[] {
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
  console.log(`Verdict:`);
  switch (verdict) {
    case EvaluationStatus.OK:
      console.log(`\r\tPackage is Safe to install. Probably.`);
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
  console.log(`Spent ~${new_data}${unit} for this operation.`);
}
