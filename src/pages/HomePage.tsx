import { useEffect, useState } from "react";
import type { TodayStats, TrendPoint } from "../../shared/types";
import { DistributionChart } from "../components/DistributionChart";
import { StatCard } from "../components/StatCard";
import { TrendChart } from "../components/TrendChart";
import { fetchTodayStats, fetchTrend } from "../lib/api";

export function HomePage() {
  const [today, setToday] = useState<TodayStats | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<"7d" | "30d">("7d");

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [todayStats, trendStats] = await Promise.all([fetchTodayStats(), fetchTrend(range)]);

        if (!active) {
          return;
        }

        setToday(todayStats);
        setTrend(trendStats);
      } catch (loadError) {
        if (!active) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "加载失败");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      active = false;
    };
  }, [range]);

  if (loading) {
    return <section className="panel">正在加载统计数据...</section>;
  }

  if (error || !today) {
    return <section className="panel">加载失败：{error || "未知错误"}</section>;
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">今日概览</p>
            <h2>{today.statDate} 统计日</h2>
          </div>
          <div className="pill-row">
            <span className="pill">凌晨 5 点切日</span>
            <span className="pill">标准下班 18:30</span>
          </div>
        </div>

        <div className="cards-grid">
          <StatCard
            label="参与人数"
            value={`${today.participantCount}`}
            helper="去重后按匿名用户计算"
          />
          <StatCard label="首次报下班均值" value={today.avgFirstOffWork} />
          <StatCard label="最终下班均值" value={today.avgFinalOffWork} />
          <StatCard label="最终下班中位数" value={today.medianFinalOffWork} />
          <StatCard label="90 分位下班" value={today.p90FinalOffWork} />
          <StatCard label="平均加班时长" value={`${today.avgOvertimeMinutes} 分钟`} />
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">时间分布</p>
            <h2>今日最终下班分布</h2>
          </div>
          <p className="subtle">更适合看整体节奏，不鼓励卷王排名。</p>
        </div>
        <DistributionChart data={today.distribution} />
        <div className="latest-row">
          <span className="subtle">今日较晚下班：</span>
          {today.latestAliases.length > 0 ? (
            today.latestAliases.map((alias) => (
              <span key={alias} className="pill highlight">
                {alias}
              </span>
            ))
          ) : (
            <span className="subtle">暂无数据</span>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">趋势</p>
            <h2>最近 {range === "7d" ? "7" : "30"} 天</h2>
          </div>
          <div className="pill-row">
            <button
              type="button"
              className={range === "7d" ? "pill-button active" : "pill-button"}
              onClick={() => setRange("7d")}
            >
              7 天
            </button>
            <button
              type="button"
              className={range === "30d" ? "pill-button active" : "pill-button"}
              onClick={() => setRange("30d")}
            >
              30 天
            </button>
          </div>
        </div>
        <TrendChart data={trend} />
        <p className="subtle">
          说明：左轴是参与人数，右轴是平均加班分钟数。中位下班时间在服务端参与计算，当前图里未单独绘制。
        </p>
      </section>

      <section className="panel rules-panel">
        <p className="eyebrow">统计规则</p>
        <ul className="rules-list">
          <li>支持同一用户一天多次提交，系统会分别计算首次和最终下班时间。</li>
          <li>允许选择 17:00 到次日 02:00 的下班时间，时间粒度为 5 分钟。</li>
          <li>凌晨 00:00 到 04:59 的下班时间会归入前一个统计日。</li>
          <li>加班时长按“最终下班时间 - 18:30”计算，早于 18:30 按 0 处理。</li>
          <li>当前使用本地文件存储，适合先做规则验证，后续可替换为数据库。</li>
        </ul>
      </section>
    </div>
  );
}
