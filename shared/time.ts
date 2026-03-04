const SHANGHAI_TIME_ZONE = "Asia/Shanghai";
const MINUTES_PER_DAY = 24 * 60;

const shanghaiFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: SHANGHAI_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export interface ShanghaiParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export function getShanghaiParts(date: Date): ShanghaiParts {
  const parts = shanghaiFormatter.formatToParts(date);
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)])
  ) as Record<string, number>;

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
  };
}

export function formatDateKey(parts: Pick<ShanghaiParts, "year" | "month" | "day">): string {
  const month = `${parts.month}`.padStart(2, "0");
  const day = `${parts.day}`.padStart(2, "0");
  return `${parts.year}-${month}-${day}`;
}

function shiftDateKey(dateKey: string, dayDelta: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const pivot = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  pivot.setUTCDate(pivot.getUTCDate() + dayDelta);
  return [
    pivot.getUTCFullYear(),
    `${pivot.getUTCMonth() + 1}`.padStart(2, "0"),
    `${pivot.getUTCDate()}`.padStart(2, "0"),
  ].join("-");
}

export function getStatDateFromDate(date: Date): string {
  const parts = getShanghaiParts(date);
  const dateKey = formatDateKey(parts);
  return parts.hour < 5 ? shiftDateKey(dateKey, -1) : dateKey;
}

export function getStatDateNow(): string {
  return getStatDateFromDate(new Date());
}

export function getExtendedMinutes(date: Date): number {
  const parts = getShanghaiParts(date);
  const baseMinutes = parts.hour * 60 + parts.minute;
  return parts.hour < 5 ? baseMinutes + MINUTES_PER_DAY : baseMinutes;
}

export function isValidOffWorkMinutes(minutes: number): boolean {
  const min = 17 * 60;
  const max = 26 * 60;
  return minutes >= min && minutes <= max;
}

export function minutesToClock(minutes: number): string {
  const normalized = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${`${hour}`.padStart(2, "0")}:${`${minute}`.padStart(2, "0")}`;
}

export function clockToExtendedMinutes(clock: string): number {
  const [hourText, minuteText] = clock.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const base = hour * 60 + minute;
  return hour < 5 ? base + MINUTES_PER_DAY : base;
}

export function getDefaultSelectableClock(now = new Date()): string {
  const minutes = Math.round(getExtendedMinutes(now) / 5) * 5;
  if (isValidOffWorkMinutes(minutes)) {
    return minutesToClock(minutes);
  }
  return "18:30";
}

export function parseOffWorkInput(isoString: string): {
  statDate: string;
  minutes: number;
  date: Date;
} {
  const date = new Date(isoString);
  if (Number.isNaN(date.valueOf())) {
    throw new Error("时间格式无效");
  }
  const minutes = getExtendedMinutes(date);
  if (!isValidOffWorkMinutes(minutes)) {
    throw new Error("下班时间必须在 17:00 到次日 02:00 之间");
  }
  if (date.getTime() > Date.now()) {
    throw new Error("不能提交未来时间");
  }

  return {
    statDate: getStatDateFromDate(date),
    minutes,
    date,
  };
}

export function buildClientDateTimeFromClock(clock: string): string {
  const [hour, minute] = clock.split(":").map(Number);
  const now = new Date();
  const statDate = getStatDateNow();
  const [year, month, day] = statDate.split("-").map(Number);
  const clientDate = new Date(year, month - 1, day, hour, minute, 0, 0);

  if (hour < 5) {
    clientDate.setDate(clientDate.getDate() + 1);
  }

  if (clientDate.getTime() > now.getTime()) {
    return now.toISOString();
  }

  return clientDate.toISOString();
}

export function generateAlias(clientId: string): string {
  const compact = clientId.replace(/-/g, "").slice(0, 4).toUpperCase();
  return `匿名-${compact || "USER"}`;
}

export function getRecentStatDates(range: number, baseStatDate = getStatDateNow()): string[] {
  const dates: string[] = [];
  let current = baseStatDate;

  for (let index = 0; index < range; index += 1) {
    dates.unshift(current);
    current = shiftDateKey(current, -1);
  }

  return dates;
}
