import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DistributionBucket } from "../../shared/types";

interface DistributionChartProps {
  data: DistributionBucket[];
}

export function DistributionChart({ data }: DistributionChartProps) {
  return (
    <div className="chart-shell">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="bucket" stroke="#aab9d6" fontSize={12} />
          <YAxis allowDecimals={false} stroke="#aab9d6" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "#0f1a2d",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
            }}
          />
          <Bar dataKey="count" fill="#58f0b1" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
