import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyChartItem } from "../../services/progressService";
import styles from "./styles.module.css";

interface XPChartProps {
  data: DailyChartItem[];
}

export default function XPChart({ data }: XPChartProps) {
  return (
    <article className={styles.chartCard}>
      <div className={styles.sectionHeader}>
        <h2>XP nos últimos 7 dias</h2>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} width={30} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="xp"
              strokeWidth={2}
              fillOpacity={0.2}
              dot={{ r: 4 }}
              label={{ position: "top" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}