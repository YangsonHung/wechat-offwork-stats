import "dotenv/config.js";
import crypto from "node:crypto";
import fastifyCors from "@fastify/cors";
import type { FastifyReply } from "fastify";
import Fastify from "fastify";
import { getTodayStats, getTrend } from "../shared/statistics.js";
import {
  generateAlias,
  getRecentStatDates,
  getStatDateNow,
  parseOffWorkInput,
} from "../shared/time.js";
import type {
  CheckoutEntry,
  CheckoutEntryInput,
  ErrorResponse,
  MeTodayResponse,
  RangeOption,
  SubmitCheckoutResponse,
} from "../shared/types.js";
import {
  initializeStore,
  insertEntry,
  readEntriesByClientAndStatDate,
  readEntriesByStatDate,
  readEntriesByStatDates,
} from "./store.js";

const app = Fastify({
  logger: false,
});
const port = Number(process.env.PORT ?? 8787);

const clientRate = new Map<string, number[]>();
const ipRate = new Map<string, number[]>();

function hashText(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 12);
}

function pruneWindow(values: number[], windowMs: number): number[] {
  const cutoff = Date.now() - windowMs;
  return values.filter((value) => value >= cutoff);
}

function assertRateLimit(
  key: string,
  bucket: Map<string, number[]>,
  limit: number,
  windowMs: number
): void {
  const existing = pruneWindow(bucket.get(key) ?? [], windowMs);

  if (existing.length >= limit) {
    throw new Error("提交过于频繁，请稍后再试");
  }

  existing.push(Date.now());
  bucket.set(key, existing);
}

function createEntry(
  input: CheckoutEntryInput,
  clientIp: string,
  userAgent: string
): CheckoutEntry {
  const { statDate, minutes, date } = parseOffWorkInput(input.offWorkTime);
  const clientId = input.clientId.trim();

  if (!clientId) {
    throw new Error("clientId 不能为空");
  }

  return {
    id: crypto.randomUUID(),
    statDate,
    offWorkAt: date.toISOString(),
    offWorkMinutesExtended: minutes,
    submittedAt: new Date().toISOString(),
    clientId,
    aliasCode: (input.aliasCode?.trim() || generateAlias(clientId)).slice(0, 20),
    ipHash: hashText(clientIp),
    userAgentHash: hashText(userAgent),
    source: "manual_web",
    timezone: "Asia/Shanghai",
  };
}

function sendError(response: FastifyReply, status: number, message: string): void {
  response.code(status).send({
    ok: false,
    error: message,
  });
}

app.get("/api/health", (_request, response) => {
  response.send({ ok: true });
});

app.post<{
  Body: CheckoutEntryInput;
  Reply: SubmitCheckoutResponse | ErrorResponse;
}>("/api/checkouts", async (request, response) => {
  try {
    const clientIp = request.ip || "unknown";
    const userAgentHeader = request.headers["user-agent"];
    const userAgent = Array.isArray(userAgentHeader)
      ? userAgentHeader[0] || "unknown"
      : userAgentHeader || "unknown";
    const clientId = request.body?.clientId?.trim();

    if (!clientId) {
      return sendError(response, 400, "clientId 不能为空");
    }

    assertRateLimit(clientId, clientRate, 3, 5 * 60 * 1000);
    assertRateLimit(hashText(clientIp), ipRate, 10, 60 * 1000);

    const entry = createEntry(request.body, clientIp, userAgent);
    await insertEntry(entry);
    const sameDayEntries = await readEntriesByClientAndStatDate(entry.clientId, entry.statDate);

    const firstOffWorkTime = sameDayEntries[0].offWorkAt;
    const finalOffWorkTime = sameDayEntries[sameDayEntries.length - 1].offWorkAt;

    return response.code(201).send({
      ok: true,
      statDate: entry.statDate,
      entryId: entry.id,
      firstOffWorkTime,
      finalOffWorkTime,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "提交失败";
    return sendError(response, 400, message);
  }
});

app.get("/api/stats/today", async (_request, response) => {
  const statDate = getStatDateNow();
  const entries = await readEntriesByStatDate(statDate);
  response.send(getTodayStats(entries, statDate));
});

app.get<{
  Querystring: { range?: RangeOption };
}>("/api/stats/trend", async (request, response) => {
  const range = request.query.range ?? "7d";
  const days = range === "30d" ? 30 : 7;
  const baseStatDate = getStatDateNow();
  const statDates = getRecentStatDates(days, baseStatDate);
  const entries = await readEntriesByStatDates(statDates);
  response.send(getTrend(entries, days, baseStatDate));
});

app.get<{
  Querystring: { clientId?: string };
  Reply: MeTodayResponse | ErrorResponse;
}>("/api/me/today", async (request, response) => {
  const clientId = `${request.query.clientId ?? ""}`.trim();

  if (!clientId) {
    return sendError(response, 400, "clientId 不能为空");
  }

  const statDate = getStatDateNow();
  const mine = await readEntriesByClientAndStatDate(clientId, statDate);

  return response.send({
    statDate,
    entries: mine,
  });
});

await app.register(fastifyCors, {
  origin: true,
});

try {
  await initializeStore();
} catch (error) {
  console.error("MySQL 初始化失败，请检查 .env 里的数据库配置。");
  console.error(error);
  process.exit(1);
}

try {
  await app.listen({
    port,
    host: "0.0.0.0",
  });
} catch (error) {
  console.error(`服务启动失败，端口 ${port} 可能已被占用。`);
  console.error(error);
  process.exit(1);
}

console.log(`Offwork stats server listening on http://localhost:${port}`);
