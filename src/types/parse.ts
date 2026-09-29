export type Manager = "npm" | "bun" | "yarn" | "pnpm";

export const defaultParse: ParseSchema = {
  name: "",
  range: 20,
  install: false
}

export interface ParseSchema {
  name: string,
  range: number,
  install: boolean,
}
