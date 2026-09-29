import { executeCmd } from "@functions/commands";
import parseArgs from "@functions/parse";

function main(): void {
  testArgs();
  console.log("Passed.");
  testManager();
  console.log("Passed.");
}

main();

function testArgs(): void {
  const param4 = ["--help"];
  const args4 = parseArgs(param4);
  if (args4) {
    throw new Error("Failed.");
  }

  const param1 = ["express", "--range", "30"];
  const args1 = parseArgs(param1);
  if (args1.install || args1.name !== "express" || args1.range !== 30) {
    throw new Error("Failed.");
  }

  const param2 = ["--range", "25", "elysia"];
  const args2 = parseArgs(param2);
  if (args2.install || args2.name !== "elysia" || args2.range !== 25) {
    throw new Error("Failed.");
  }

  const param3 = ["--range", "25", "--install", "axios"];
  const args3 = parseArgs(param3);
  if (!args3.install || args3.name !== "axios" || args3.range !== 25) {
    throw new Error("Failed.");
  }
}

function testManager(): void {
  let config = process.env.npm_config_user_agent;
  if (!config) {
    throw new Error("User Config not found.");
  }

  let manager = config.split("/")[0];
  if (!config) {
    throw new Error("Manager not found.");
  }

  let success = executeCmd(`${manager} --version`);
  if (success != 0) {
    throw new Error("Manager not installed.");
  }
}
