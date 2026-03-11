"use client";

interface Props {
  domains: any[];
  data: any;
}

export default function YearlyHeatmap({ domains, data }: Props) {

  const days = 365;

  const getDateKey = (offset:number) => {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    return d.toISOString().split("T")[0];
  };

  const getPercent = (date:string) => {

    let done = 0;

    domains.forEach((d:any)=>{
      if(data?.[d.name]?.[date]) done++;
    });

    if(domains.length === 0) return 0;

    return (done / domains.length) * 100;
  };

  const getColor = (percent:number) => {

    if(percent === 0) return "#1f2937";
    if(percent < 50) return "#ef4444";
    if(percent < 80) return "#fde047";
    return "#22c55e";
  };

  const squares = [];

  for(let i=0;i<days;i++){

    const date = getDateKey(i);
    const percent = getPercent(date);

    squares.push(
      <div
        key={i}
        style={{
          width:12,
          height:12,
          borderRadius:3,
          background:getColor(percent)
        }}
        title={`${date} — ${Math.round(percent)}%`}
      />
    );
  }

  return (
   <div className="overflow-x-auto">
  <div className="grid grid-cols-[repeat(52,12px)] gap-[3px] min-w-[800px]">
    {squares}
  </div>
</div>
  );
}