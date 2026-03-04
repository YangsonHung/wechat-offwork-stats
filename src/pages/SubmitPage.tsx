import { useEffect, useState } from "react";
import {
  buildClientDateTimeFromClock,
  getDefaultSelectableClock,
  getStatDateNow,
  minutesToClock,
} from "../../shared/time";
import type { CheckoutEntry } from "../../shared/types";
import { QuickTimeButtons } from "../components/QuickTimeButtons";
import { fetchMyToday, submitCheckout } from "../lib/api";
import { getAliasCode, getClientId } from "../lib/client";
import type { FeedbackState } from "../types";

export function SubmitPage() {
  const [clock, setClock] = useState(getDefaultSelectableClock);
  const [records, setRecords] = useState<CheckoutEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "idle" });

  const clientId = getClientId();
  const aliasCode = getAliasCode();

  useEffect(() => {
    async function loadInitialRecords() {
      const response = await fetchMyToday(clientId);
      setRecords(response.entries);
    }

    void loadInitialRecords().catch((error) => {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "加载个人记录失败",
      });
    });
  }, [clientId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback({ type: "idle" });

    try {
      const response = await submitCheckout({
        offWorkTime: buildClientDateTimeFromClock(clock),
        clientId,
        aliasCode,
      });

      const latestRecords = await fetchMyToday(clientId);
      setRecords(latestRecords.entries);
      setFeedback({
        type: "success",
        message: `提交成功，已记入 ${response.statDate}。系统会同时统计你的首次和最终下班时间。`,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "提交失败",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">提交打卡</p>
            <h2>记录你今天真正收工的时间</h2>
          </div>
          <span className="pill highlight">{aliasCode}</span>
        </div>

        <form className="submit-form" onSubmit={handleSubmit}>
          <fieldset className="field">
            <legend>快捷选择</legend>
            <QuickTimeButtons value={clock} onSelect={setClock} />
          </fieldset>

          <label className="field">
            <span>手动微调（5 分钟粒度）</span>
            <input
              className="time-input"
              type="time"
              step={300}
              value={clock}
              onChange={(event) => setClock(event.target.value)}
            />
          </label>

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "提交中..." : "提交下班时间"}
          </button>
        </form>

        <div className="hint-box">
          <p>当前统计日：{getStatDateNow()}</p>
          <p>请提交“真正收工”的时间，不是暂时离开工位的时间。</p>
          <p>凌晨 5 点前的提交会自动计入前一个统计日。</p>
        </div>

        {feedback.type !== "idle" ? (
          <div className={feedback.type === "success" ? "flash success" : "flash error"}>
            {feedback.message}
          </div>
        ) : null}
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">我的记录</p>
            <h2>今日已提交</h2>
          </div>
          <span className="subtle">{records.length} 条</span>
        </div>

        {records.length === 0 ? (
          <p className="subtle">今天还没有提交记录。</p>
        ) : (
          <div className="records-list">
            {records.map((entry) => (
              <article key={entry.id} className="record-row">
                <div>
                  <p className="record-main">{minutesToClock(entry.offWorkMinutesExtended)}</p>
                  <p className="subtle">
                    提交于 {new Date(entry.submittedAt).toLocaleString("zh-CN")}
                  </p>
                </div>
                <span className="pill">{entry.aliasCode}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
