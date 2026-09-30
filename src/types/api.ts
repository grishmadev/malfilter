export interface SearchPackageInfo {
  objects: PackageInfo[],
  time: Date,
  total: number
}

export interface SearchPackageErr {
  error: string,
  code: string
}


interface PackageDownload {
  monthly: number,
  weekly: number
}

interface PackagePublisher {
  email: string,
  trustedPublisher: {
    oidcConfigId: string,
    id: string
  },
  username: string
}

interface PackageMaintainers {
  email: string,
  username: string
}

interface PackageLinks {
  homepage: string,
  repository: string,
  bugs: string,
  npm: string
}

interface PackageScoreDetails {
  popularity: number,
  quality: number,
  maintenance: number
}

interface Package {
  name: string,
  keywords: string[],
  version: string,
  description: string,
  sanitized_name: string,
  publisher: PackagePublisher,
  maintainers: PackageMaintainers[],
  license: string | null,
  date: Date,
  links: PackageLinks,
}

export interface PackageInfo {
  downloads: PackageDownload,
  dependents: string,
  updated: Date,
  searchScore: number,
  package: Package,
  score: {
    final: number,
    detail: PackageScoreDetails
  },
  flags: {
    insecure: number
  }
}


export interface CandidateSchema {
  name: string,
  weeklyDownloads: number
}
