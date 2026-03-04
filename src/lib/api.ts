import type {
  CheckoutEntryInput,
  MeTodayResponse,
  RangeOption,
  SubmitCheckoutResponse,
  TodayStats,
  TrendPoint,
} from "../../shared/types";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });

  const payload = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error || "请求失败");
  }

  return payload;
}

export function submitCheckout(input: CheckoutEntryInput): Promise<SubmitCheckoutResponse> {
  return requestJson("/api/checkouts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchTodayStats(): Promise<TodayStats> {
  return requestJson("/api/stats/today");
}

export function fetchTrend(range: RangeOption): Promise<TrendPoint[]> {
  return requestJson(`/api/stats/trend?range=${range}`);
}

export function fetchMyToday(clientId: string): Promise<MeTodayResponse> {
  return requestJson(`/api/me/today?clientId=${encodeURIComponent(clientId)}`);
}
