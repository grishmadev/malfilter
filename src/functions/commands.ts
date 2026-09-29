import { exec } from "child_process";
import fs from "fs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { show } from ".";
import type { Manager } from "../types";
import { promisify } from "util";

export async function execAsyncCmd(pkg: string): Promise<number> {
  const aexec = promisify(exec);
  const manager = getPkgMngr() as Manager;
  const cmd = getInstallCmd(manager, pkg);
  show(cmd);
  let { stderr, stdout } = await aexec(cmd);
  show(stderr);
  show(stdout);
  return 0;
}

export function executeCmd(cmd: string): number {
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error("Error in execution: ", err.message);
      return 1;
    }
    if (stderr) {
      console.log("Std Err: ", stderr);
      return 1;
    }
    show(stdout);
  })
  show(cmd);
  return 0;
}

export function installPkg(name: string): number {
  const manager = getPkgMngr() as Manager;
  const cmd = getInstallCmd(manager, name);
  const success = executeCmd(cmd);
  return success;
}


export async function getConfirmation(prompt: string, def: boolean = true): Promise<boolean> {
  const rl = readline.createInterface({ input, output });
  const hint = def ? "[Y/n]" : "[y/N]";

  const answer = (await rl.question(`${prompt} ${hint} `)).trim().toLowerCase();
  rl.close();

  if (!answer) return def;
  return answer === "y" || answer === "yes";
}

export function getPkgMngr(): Manager {
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent?.startsWith("bun")) return "bun";
  if (userAgent?.startsWith("pnpm")) return "pnpm";
  if (userAgent?.startsWith("yarn")) return "yarn";
  if (userAgent?.startsWith("npm")) return "npm";

  if (fs.existsSync("bun.lock") || fs.existsSync("bun.lockb")) return "bun";
  if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
  if (fs.existsSync("yarn.lock")) return "yarn";

  return "npm";
}

function getInstallCmd(mng: Manager, pkg: string): string {
  switch (mng) {
    case "npm":
      return `npm i ${pkg}`
    case "bun":
      return `bun a ${pkg}`
    case "yarn":
      return `yarn add ${pkg}`
    case "pnpm":
      return `pnpm add ${pkg}`
  }
}
