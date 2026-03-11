"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Props {
  domains: any[];
  data: any;
  selectedDate: string; // ✅ FIXED
}

export default function ChartsSection({ domains, data }: Props) {

  const chartData = domains.map((d) => {

    const domainData = data?.[d.name] || {};

    const totalDays = Object.keys(domainData).length;
    const completed = Object.values(domainData).filter(Boolean).length;

    const percent =
      totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;

    return {
      name: d.name,
      progress: percent,
    };

  });

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-xl h-[300px]">

      <h2 className="text-yellow-400 font-bold mb-4">
        Performance Overview
      </h2>

      <div style={{ width: "100%", height: "240px" }}>
        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={chartData}>

            <XAxis dataKey="name" stroke="#888" />

            <YAxis stroke="#888" />

            <Tooltip />

            <Bar
              dataKey="progress"
              fill="#facc15"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>
      </div>

    </div>
  );
}