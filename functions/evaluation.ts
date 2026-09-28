import { EvaluationStatus, type EvaluationResponse, type PackageInfo } from "../types";
import { extractPackageCreationDate, getLevenshteinDistance, isError, packageExists, searchPackages } from "./package";

export async function verifyPackage(name: string): Promise<EvaluationResponse & { dataSpent: number }> {
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

  const searchRes = await searchPackages(name, 20);
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
  if (!target) return {
    status: EvaluationStatus.SUSPICIOUS,
    message: "Cannot find target package.",
    reason,
    dataSpent: ds
  }

  const { success, reason: evalAgeReason, dataSpent: dsAge } = await evaluateByAge(target);
  if (success) {
    ds += dsAge;
    return {
      message: evalAgeReason[0]!,
      status: EvaluationStatus.OK,
      reason,
      dataSpent: ds
    }
  }
  reason.push(...evalAgeReason);

  const possibleTypos: string[] = [];

  for (const item of searchRes.objects) {
    const candidate = item.package.name;
    const dist = getLevenshteinDistance(name, candidate);
    if (dist > 0 && dist <= 2 && item.score.detail.popularity > 0.8) {
      possibleTypos.push(candidate);
    }
  }
  if (possibleTypos.length) reason.push(`Possible Typosquatting: ${possibleTypos.join(",\n")}`);

  return {
    status: EvaluationStatus.SUSPICIOUS,
    message: "Found Typosquatting.",
    reason,
    dataSpent: ds
  }
}

async function evaluateByAge(target: PackageInfo): Promise<{ success: boolean, reason: string[], dataSpent: number }> {
  const { weekly } = target.downloads;
  let name = target.package.name;

  let { date, dataSpent } = await extractPackageCreationDate(name);
  const createdDaysAgo = Math.floor((Date.now() - date) / (1000 * 3600 * 24));
  if (!createdDaysAgo) return {
    success: false,
    reason: ["Could not extract creation date of " + name],
    dataSpent
  };

  if (createdDaysAgo > 365 || weekly > 5000) {
    return {
      success: true,
      reason: [`Package is ${createdDaysAgo} days old with ${weekly} weekly downloads. safe. probably.`],
      dataSpent
    };
  }
  return {
    success: false,
    reason: [
      `Package was created only ${createdDaysAgo} days ago.`,
      `Package has less than 5000 weekly downloads`
    ],
    dataSpent
  }
}
