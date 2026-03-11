"use client";

const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function TrackerGrid({ domains, data, toggle, deleteDomain }: any) {

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  return (
    <div className="mt-10">

<div className="grid grid-cols-8 gap-2 text-center font-semibold mb-3 text-gray-300">
        <div>Subject</div>
        {days.map(d=><div key={d}>{d}</div>)}
      </div>

      {domains.map((domain:any)=>(
        <div key={domain.name} className="grid grid-cols-8 gap-2 items-center mb-2">

          <div className="flex items-center gap-2">
<span className="text-white font-medium">
  {domain.name}
</span>
            <button
              onClick={()=>deleteDomain(domain.name)}
              className="text-red-400 hover:text-red-500 text-sm font-bold hover:scale-110 transition"
            >
              ✕
            </button>
          </div>

          {days.map((_, i) => {

            const cellDate = new Date(startOfWeek);
            cellDate.setDate(startOfWeek.getDate() + i);
            const dateKey = cellDate.toISOString().split("T")[0];

            const isDone = data?.[domain.name]?.[dateKey] || false;

            return (
              <div
                key={i}
                onClick={()=>toggle(domain.name,i)}
                className={`h-8 w-8 mx-auto rounded cursor-pointer transition-all duration-200
                  ${isDone ? "bg-green-500 scale-110" : "bg-red-400 hover:scale-105"}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}