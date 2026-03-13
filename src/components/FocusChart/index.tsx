import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LabelList } from "recharts";
import type { DailyChartItem } from "../../services/progressService";
import styles from "./styles.module.css";

interface FocusChartProps {
  data: DailyChartItem[];
}

export default function FocusChart({ data }: FocusChartProps) {
  return (
    <article className={styles.chartCard}>
      <div className={styles.sectionHeader}>
        <h2>Foco nos últimos 7 dias</h2>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} width={30} />
            <Tooltip />
            <Bar dataKey="focusCount" radius={[8, 8, 0, 0]}>
              <LabelList
                dataKey="focusCount"
                position="top"
                formatter={(value: number) => (value === 0 ? "" : value)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}