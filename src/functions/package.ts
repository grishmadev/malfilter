import type { SearchPackageErr, SearchPackageInfo } from "../types";
// import { npmToken } from "./env";

export async function packageExists(name: string, version?: string): Promise<{
  exists: boolean,
  dataSpent: number
}> {
  const versionStr = version ? `/${version}` : "";
  const url = `https://registry.npmjs.org/${name}${versionStr}`;
  const response = await fetch(url, {
    // headers: { 'Authorization': `Bearer ${npmToken}` },
    method: "HEAD"
  });
  const arrayBuffer = await response.arrayBuffer();
  const dataSpent = arrayBuffer.byteLength;

  const result = response.headers.get("cache-control");
  return {
    exists: !!result,
    dataSpent
  };
}

export async function searchPackages(term: string, size = 250, from = 0): Promise<(SearchPackageInfo | SearchPackageErr) & { dataSpent: number }> {
  const url = `https://registry.npmjs.org/-/v1/search?text=${term}&size=${size}&from=${from}`;
  const response = await fetch(url);

  const arrayBuffer = await response.arrayBuffer();
  const dataSpent = arrayBuffer.byteLength;

  const text = new TextDecoder().decode(arrayBuffer);
  const result = JSON.parse(text) as SearchPackageInfo | SearchPackageErr;

  return {
    ...result,
    dataSpent
  };
}

export function isError(packInfo: SearchPackageInfo | SearchPackageErr): packInfo is SearchPackageErr {
  return typeof packInfo === "object" && "error" in packInfo;
}

export async function extractPackageCreationDate(name: string): Promise<{ date: number, dataSpent: number }> {
  const controller = new AbortController();
  const response = await fetch(`https://registry.npmjs.org/${name}`, {
    signal: controller.signal
  });
  const reader = response.body!.getReader();
  const decoder = new TextDecoder("utf8");
  let buffer = "";

  const pattern = /"created"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/;

  let dataSpent = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      dataSpent += value.byteLength;
      buffer += decoder.decode(value, { stream: true });

      const match = buffer.match(pattern);
      if (match) {
        const creationTime = match[1];
        if (!creationTime) {
          continue;
        }
        controller.abort();
        return {
          date: Date.parse(creationTime),
          dataSpent
        };
      }

      if (buffer.length > 1000) {
        buffer = buffer.slice(-500);
      }

    }
  } catch (e) {
    throw new Error("Failed to extract creation date.");
  }
  return {
    date: 0,
    dataSpent
  };
}

export function getLevenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  const dp = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i]![0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0]![j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1];
      } else {
        dp[i]![j] = 1 + Math.min(
          dp[i]![j - 1],
          Math.min(
            dp[i - 1]![j],
            dp[i - 1]![j - 1]
          )
        );
      }
    }
  }
  return dp[m]![n];
}
