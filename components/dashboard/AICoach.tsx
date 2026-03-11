"use client";

interface Props {
  domains: any[];
  data: any;
}

export default function AICoach({ domains, data }: Props) {

  const today = new Date();

  const getLast7Days = () => {
    const arr:string[] = [];

    for(let i=0;i<7;i++){
      const d = new Date();
      d.setDate(today.getDate() - i);
      arr.push(d.toISOString().split("T")[0]);
    }

    return arr;
  };

  const analyze = () => {

    const last7 = getLast7Days();

    const messages:string[] = [];

    domains.forEach((d:any)=>{

      let completed = 0;

      last7.forEach(day=>{
        if(data?.[d.name]?.[day]) completed++;
      });

      const percent = (completed / 7) * 100;

      if(percent === 0){
        messages.push(`You completely skipped ${d.name} this week.`);
      }
      else if(percent < 40){
        messages.push(`${d.name} is struggling. Try adjusting your routine.`);
      }
      else if(percent < 70){
        messages.push(`${d.name} is improving but consistency can be better.`);
      }
      else{
        messages.push(`${d.name} looks very consistent. Keep pushing.`);
      }

    });

    return messages;
  };

  const insights = analyze();

  return (

    <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6">

      <p className="text-yellow-400 font-semibold mb-3">
        AI Coach 🤖
      </p>

      <div className="space-y-2">

        {insights.slice(0,3).map((msg,i)=>(
          <p key={i} className="text-gray-400 text-sm">
            {msg}
          </p>
        ))}

      </div>

    </div>

  );
}