import { getArgs, showDataSpent, showReason, showVerdict, verifyPackage } from "./functions";
import { EvaluationStatus } from "./types";
async function main() {
  const args = getArgs();
  const packageName = args.at(0);
  if (!packageName) {
    console.log("Please enter a package name.");
    return;
  }
  console.log("Fetching details...");
  const { reason, message, status, dataSpent } = await verifyPackage(packageName);
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
}
await main();

