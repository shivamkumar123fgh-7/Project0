"use client";

interface Props {
  domains: any[];
  data: any;
}

export default function Heatmap({ domains, data }: Props) {

  // 🔥 Generate 4 weeks of activity
  const generateHeatData = () => {
    const weeks = [];

    for (let w = 0; w < 4; w++) {
      const week = [];

      for (let d = 0; d < 7; d++) {
        let count = 0;

        domains.forEach((domain: any) => {
          const arr = data[domain.name] || [];
          if (arr[d]) count++;
        });

        week.push(count);
      }

      weeks.push(week);
    }

    return weeks;
  };

  const heatData = generateHeatData();

  const getColor = (value: number) => {
    if (value === 0) return "bg-[#2A2A2A]";
    if (value === 1) return "bg-green-600";
    if (value === 2) return "bg-green-500";
    return "bg-green-400";
  };

  return (
    <div className="mt-16">
      <h2 className="text-xl font-semibold text-yellow-400 mb-4">
        Activity Heatmap (Last 4 Weeks)
      </h2>

      <div className="flex gap-2">
        {heatData.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-2">
            {week.map((dayValue, di) => (
              <div
                key={di}
                className={`h-6 w-6 rounded transition-all duration-200 hover:scale-110 ${getColor(dayValue)}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}