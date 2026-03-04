export type RangeOption = "7d" | "30d";

export interface CheckoutEntry {
  id: string;
  statDate: string;
  offWorkAt: string;
  offWorkMinutesExtended: number;
  submittedAt: string;
  clientId: string;
  aliasCode: string;
  ipHash: string;
  userAgentHash: string;
  source: "manual_web";
  timezone: "Asia/Shanghai";
}

export interface CheckoutEntryInput {
  offWorkTime: string;
  clientId: string;
  aliasCode?: string;
}

export interface DistributionBucket {
  bucket: string;
  count: number;
}

export interface TodayStats {
  statDate: string;
  participantCount: number;
  avgFirstOffWork: string;
  avgFinalOffWork: string;
  medianFinalOffWork: string;
  p90FinalOffWork: string;
  avgOvertimeMinutes: number;
  distribution: DistributionBucket[];
  latestAliases: string[];
}

export interface TrendPoint {
  statDate: string;
  participantCount: number;
  medianFinalOffWorkMinutes: number;
  avgOvertimeMinutes: number;
}

export interface SubmitCheckoutResponse {
  ok: true;
  statDate: string;
  entryId: string;
  firstOffWorkTime: string;
  finalOffWorkTime: string;
}

export interface MeTodayResponse {
  statDate: string;
  entries: CheckoutEntry[];
}

export interface ErrorResponse {
  ok: false;
  error: string;
}
