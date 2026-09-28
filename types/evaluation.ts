export enum EvaluationStatus {
  OK,
  SUSPICIOUS,
  UNSAFE
}

export type EvaluationResponse = {
  status: EvaluationStatus,
  message: string,
  reason: string[]
}
