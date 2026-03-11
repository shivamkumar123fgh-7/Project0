"use client";

import { useState, useEffect } from "react";

interface Props {
  domains: any[];
  data: any;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export default function MonthlyCalendar({
  domains,
  data,
  selectedDate,
  setSelectedDate
}: Props) {

  const [current, setCurrent] = useState(new Date());
  // Sync calendar month with selectedDate
useEffect(() => {
  if (!selectedDate) return;
  const d = new Date(selectedDate);
  setCurrent(new Date(d.getFullYear(), d.getMonth(), 1));
}, [selectedDate]);

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthName = current.toLocaleString("default", { month: "long" });

  const changeMonth = (dir: number) => {
    setCurrent(new Date(year, month + dir, 1));
  };

  const getKey = (day: number) => {
  const d = new Date(year, month, day);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

  const getPercent = (day: number) => {
    const key = getKey(day);
    let completed = 0;

    domains.forEach((d: any) => {
      if (data?.[d.name]?.[key]) completed++;
    });

    return domains.length
      ? (completed / domains.length) * 100
      : 0;
  };

  const getStyle = (percent: number) => {
    if (percent === 0)
      return "background:#7f1d1d;color:white;font-weight:700;";
    if (percent < 50)
      return "background:#ef4444;color:white;";
    if (percent < 80)
      return "background:#86efac;color:black;";
    if (percent < 100)
      return "background:#22c55e;color:white;";
    return "background:#16a34a;color:white;";
  };

  const getFire = (percent: number) => {
    if (percent >= 100) return "🔥🔥";
    if (percent >= 80) return "🔥";
    return "";
  };

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(
      <div key={`empty-${i}`} style={{ height: 40 }} />
    );
  }

  for (let d = 1; d <= totalDays; d++) {

  const key = getKey(d);
  const percent = getPercent(d);

  const isSelected = selectedDate === key;

    cells.push(
  <div
  key={d}
  onClick={() => setSelectedDate(key)}
  style={{
    height: 40,
    borderRadius: 6,
    fontSize: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
    cursor: "pointer",
    border: isSelected ? "2px solid #FACC15" : "none",
    backgroundColor:
      percent === 0
        ? "#7f1d1d"
        : percent < 50
        ? "#ef4444"
        : percent < 80
        ? "#86efac"
        : percent < 100
        ? "#22c55e"
        : "#15803d",
    color: percent < 50 ? "white" : "black",
    fontWeight: percent === 0 ? "bold" : "normal",
  }}
>
  <span>{d}</span>
  <span style={{ fontSize: 10 }}>{getFire(percent)}</span>
</div>
    );
  }

  return (
    <div
      style={{
        width: 360,
        background: "#1E1E1E",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#FACC15",
          color: "black",
          padding: "10px 15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 700,
          textTransform: "uppercase",
          fontSize: 14,
        }}
      >
        <button onClick={() => changeMonth(-1)}>◀</button>
        <div style={{ textAlign: "center" }}>
  <div>
    {monthName} {year}
  </div>

  <button
    onClick={() =>
      setSelectedDate(new Date().toISOString().split("T")[0])
    }
    style={{
      fontSize: 10,
      marginTop: 2,
      textDecoration: "underline",
      cursor: "pointer",
    }}
  >
    Today
  </button>
</div>
        <button onClick={() => changeMonth(1)}>▶</button>
      </div>

      {/* Calendar Grid */}
      <div style={{ padding: 12 }}>
        {/* Weekdays */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 6,
            marginBottom: 8,
            fontSize: 11,
            color: "#9ca3af",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 6,
          }}
        >
          {cells}
        </div>
      </div>
    </div>
  );
}