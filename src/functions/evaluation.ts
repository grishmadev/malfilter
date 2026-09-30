import { showDetails } from ".";
import { EvaluationStatus, type EvaluationResponse, type PackageInfo } from "../types";
import { extractPackageCreationDate, getLevenshteinDistance, isError, packageExists, searchPackages } from "./package";

export async function verifyPackage(name: string, range = 20): Promise<EvaluationResponse & { dataSpent: number }> {
  let success = false;
  let ds = 0;
  const { exists, dataSpent: dsExists } = await packageExists(name);
  const reason: string[] = [];
  ds += dsExists;
  if (!exists) return {
    status: EvaluationStatus.UNSAFE,
    message: "Package does not exist",
    reason,
    dataSpent: ds
  };

  const searchRes = await searchPackages(name, range);
  if (isError(searchRes)) {
    ds += searchRes.dataSpent;
    return {
      status: EvaluationStatus.UNSAFE,
      message: searchRes.error,
      reason: ["Error while searching for Package."],
      dataSpent: ds
    }
  };

  const target = searchRes.objects.find(obj => obj.package.name === name);
  if (!target) {
    const similarPacks = searchRes.objects.map(p => p.package.name);
    return {
      status: EvaluationStatus.SUSPICIOUS,
      message: `Cannot find target package.\nSimilar packages include: ${similarPacks.join(", ")}`,
      reason,
      dataSpent: ds
    }
  }

  console.log("Getting Package Lineage...");
  const { success: successAge, reason: evalAgeReason, dataSpent: dsAge, date: createdDate } = await evaluateByAge(target);

  showDetails(target, createdDate);
  ds += dsAge;
  if (successAge) {
    success = true;
  }
  reason.push(...evalAgeReason);

  const { success: tSsuccess, reason: tSreason, dataSpent: tSds } = await measureTsquat(target, new Date(createdDate), searchRes.objects);
  ds += tSds;
  if (!tSsuccess) {
    reason.push(...tSreason);
    return {
      status: EvaluationStatus.UNSAFE,
      message: "Package looks like a typosquat of another package",
      reason,
      dataSpent: ds
    }
  }
  return {
    status: success ? EvaluationStatus.OK : EvaluationStatus.SUSPICIOUS,
    message: success ? "Package is safe to install." : "Package is suspicious for below reasons",
    reason,
    dataSpent: ds
  }
}

export async function measureTsquat(
  item: PackageInfo,
  created: Date,
  candidates: PackageInfo[]
): Promise<{ success: boolean, dataSpent: number, reason: string[] }> {
  const reason: string[] = [];
  const possibleTypos: string[] = [];
  let dataSpent = 0;

  for (const pkg of candidates) {
    const targetName = item.package.name;
    const candidateName = pkg.package.name;

    if (targetName === candidateName) continue;

    const dist = getLevenshteinDistance(targetName, candidateName);

    const isPopularCandidate = (pkg.downloads.weekly > item.downloads.weekly * 10) || (pkg.score.detail.popularity > 0.8);

    if (dist <= 3 && isPopularCandidate) {
      const { date, dataSpent: ds } = await extractPackageCreationDate(candidateName);
      dataSpent += ds;

      // target created AFTER candidate
      if (created.getTime() > date) {
        possibleTypos.push(`${candidateName} (${pkg.downloads.weekly.toLocaleString()} weekly downloads)`);
      }
    }
  }

  if (possibleTypos.length > 0) {
    reason.push(`Suspected typosquat of established package(s): ${possibleTypos.join(", ")}`);
  }

  return {
    success: possibleTypos.length === 0,
    dataSpent,
    reason
  };
}

async function evaluateByAge(target: PackageInfo): Promise<{ success: boolean, reason: string[], date: number, dataSpent: number }> {
  const { weekly } = target.downloads;
  let name = target.package.name;

  let { date, dataSpent } = await extractPackageCreationDate(name);
  const createdDaysAgo = Math.floor((Date.now() - date) / (1000 * 3600 * 24));
  if (!createdDaysAgo) return {
    success: false,
    reason: ["Could not extract creation date of " + name],
    date,
    dataSpent
  };
  if (date === 0) return { success: false, reason: ["Could not extract creation date of " + name], date, dataSpent };
  let reason = [];
  if (createdDaysAgo <= 365) reason.push(`Package was created only ${createdDaysAgo} days ago.`);
  if (weekly <= 5000) reason.push(`Package has less than 5000 weekly downloads`);

  return {
    success: reason.length === 0,
    reason,
    date,
    dataSpent
  };
}
