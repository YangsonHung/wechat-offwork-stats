import type { CheckoutEntry, DistributionBucket, TodayStats, TrendPoint } from "./types.js";
import { getRecentStatDates, minutesToClock } from "./time.js";

const BASELINE_MINUTES = 18 * 60 + 30;

interface UserAggregate {
  aliasCode: string;
  firstMinutes: number;
  finalMinutes: number;
}

function average(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0;
  }
  const total = numbers.reduce((sum, value) => sum + value, 0);
  return Math.round(total / numbers.length);
}

function median(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0;
  }

  const sorted = [...numbers].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  }

  return sorted[middle];
}

function percentile(numbers: number[], percentileValue: number): number {
  if (numbers.length === 0) {
    return 0;
  }

  const sorted = [...numbers].sort((left, right) => left - right);
  const index = Math.ceil((percentileValue / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
}

function buildDistribution(finalMinutesList: number[]): DistributionBucket[] {
  const buckets = [
    { key: "17:00-18:29", min: 17 * 60, max: 18 * 60 + 29 },
    { key: "18:30-19:59", min: 18 * 60 + 30, max: 19 * 60 + 59 },
    { key: "20:00-21:59", min: 20 * 60, max: 21 * 60 + 59 },
    { key: "22:00-23:59", min: 22 * 60, max: 23 * 60 + 59 },
    { key: "00:00-02:00", min: 24 * 60, max: 26 * 60 }
  ];

  return buckets.map((bucket) => ({
    bucket: bucket.key,
    count: finalMinutesList.filter(
      (minutes) => minutes >= bucket.min && minutes <= bucket.max
    ).length
  }));
}

export function aggregateUsers(entries: CheckoutEntry[]): UserAggregate[] {
  const byClient = new Map<string, UserAggregate>();

  for (const entry of entries) {
    const existing = byClient.get(entry.clientId);
    if (!existing) {
      byClient.set(entry.clientId, {
        aliasCode: entry.aliasCode,
        firstMinutes: entry.offWorkMinutesExtended,
        finalMinutes: entry.offWorkMinutesExtended
      });
      continue;
    }

    existing.firstMinutes = Math.min(existing.firstMinutes, entry.offWorkMinutesExtended);
    existing.finalMinutes = Math.max(existing.finalMinutes, entry.offWorkMinutesExtended);
    existing.aliasCode = entry.aliasCode;
  }

  return [...byClient.values()];
}

export function getTodayStats(entries: CheckoutEntry[], statDate: string): TodayStats {
  const dayEntries = entries.filter((entry) => entry.statDate === statDate);
  const users = aggregateUsers(dayEntries);

  if (users.length === 0) {
    return {
      statDate,
      participantCount: 0,
      avgFirstOffWork: "--:--",
      avgFinalOffWork: "--:--",
      medianFinalOffWork: "--:--",
      p90FinalOffWork: "--:--",
      avgOvertimeMinutes: 0,
      distribution: buildDistribution([]),
      latestAliases: []
    };
  }

  const firstMinutesList = users.map((user) => user.firstMinutes);
  const finalMinutesList = users.map((user) => user.finalMinutes);
  const overtimeList = finalMinutesList.map((minutes) => Math.max(0, minutes - BASELINE_MINUTES));

  const latestAliases = [...users]
    .sort((left, right) => right.finalMinutes - left.finalMinutes)
    .slice(0, 5)
    .map((user) => user.aliasCode);

  return {
    statDate,
    participantCount: users.length,
    avgFirstOffWork: minutesToClock(average(firstMinutesList)),
    avgFinalOffWork: minutesToClock(average(finalMinutesList)),
    medianFinalOffWork: minutesToClock(median(finalMinutesList)),
    p90FinalOffWork: minutesToClock(percentile(finalMinutesList, 90)),
    avgOvertimeMinutes: average(overtimeList),
    distribution: buildDistribution(finalMinutesList),
    latestAliases
  };
}

export function getTrend(entries: CheckoutEntry[], range: number, baseStatDate: string): TrendPoint[] {
  const dates = getRecentStatDates(range, baseStatDate);

  return dates.map((statDate) => {
    const dayEntries = entries.filter((entry) => entry.statDate === statDate);
    const users = aggregateUsers(dayEntries);
    const finals = users.map((user) => user.finalMinutes);
    const overtime = finals.map((minutes) => Math.max(0, minutes - BASELINE_MINUTES));

    return {
      statDate,
      participantCount: users.length,
      medianFinalOffWorkMinutes: users.length === 0 ? 0 : median(finals),
      avgOvertimeMinutes: users.length === 0 ? 0 : average(overtime)
    };
  });
}
