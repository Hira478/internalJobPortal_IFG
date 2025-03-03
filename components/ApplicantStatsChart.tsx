"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ApplicantStatsChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

export default function ApplicantStatsChart({
  data,
}: ApplicantStatsChartProps) {
  const chartData = useMemo(() => {
    return data
      .filter((item) => item.name !== "Diterima")
      .map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length],
      }));
  }, [data]);

  const maxValue = Math.max(...chartData.map((item) => item.value));
  const yAxisMax = Math.ceil(maxValue / 5) * 5;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Statistik Pelamar</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              domain={[0, yAxisMax]}
              tickCount={6}
              allowDataOverflow={true}
            />
            <Tooltip
              formatter={(value, name, props) => [
                `${value} pelamar`,
                props.payload.name,
              ]}
              labelFormatter={() => ""}
            />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
