import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "../../shared/types";

interface TrendChartProps {
  data: TrendPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="chart-shell">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="statDate" stroke="#aab9d6" fontSize={12} />
          <YAxis yAxisId="left" stroke="#aab9d6" fontSize={12} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#ffcc7a"
            fontSize={12}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "#0f1a2d",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
            }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="participantCount"
            name="人数"
            stroke="#58f0b1"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgOvertimeMinutes"
            name="平均加班分钟"
            stroke="#ffcc7a"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
