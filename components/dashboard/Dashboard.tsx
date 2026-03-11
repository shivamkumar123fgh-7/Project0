"use client";

import GrowthAI from "./GrowthAI";
import AICoach from "./AICoach";
import YearlyHeatmap from "./YearlyHeatmap";
import Topbar from "../layout/Topbar";
import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, listenAuth, loginWithGoogle } from "@/firebase";
import ProgressRing from "./ProgressRing";
import TrackerGrid from "./TrackerGrid";
import ChartsSection from "./ChartsSection";
import MonthlyCalendar from "./MonthlyCalendar";

export default function Dashboard() {

  const [authLoading, setAuthLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [domains, setDomains] = useState<any[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [data, setData] = useState<any>({});

 const getTodayLocal = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const [selectedDate, setSelectedDate] = useState(getTodayLocal());
  


  console.log("USER:", user);

  // AUTH LISTENER
  useEffect(() => {

    const unsubscribe = listenAuth((u: any) => {
      setUser(u);
      setAuthLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };

  }, []);

  // LOAD DATA
  useEffect(() => {

    if (!user) return;

    const loadData = async () => {

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {

        const saved = snap.data();

        if (saved.domains) setDomains(saved.domains);
        if (saved.data) setData(saved.data);

      }

      setIsLoaded(true);

    };

    loadData();

  }, [user]);

  // SAVE DATA
  useEffect(() => {

    if (!user) return;
    if (!isLoaded) return;

    const saveData = async () => {

      try {

        await setDoc(
          doc(db, "users", user.uid),
          {
            domains,
            data
          },
          { merge: true }
        );

      } catch (err) {

        console.error("Firestore save error:", err);

      }

    };

    saveData();

  }, [domains, data, user, isLoaded]);

  // ADD DOMAIN
  const addDomain = () => {

    if (!newDomain.trim()) return;
    if (domains.find(d => d.name === newDomain.trim())) return;

    setDomains([...domains, { name: newDomain.trim() }]);
    setNewDomain("");

  };

  // DELETE DOMAIN
  const deleteDomain = (name: string) => {

    setDomains(domains.filter(d => d.name !== name));

    setData((prev: any) => {

      const updated = { ...prev };
      delete updated[name];
      return updated;

    });

  };

  // TOGGLE
  const toggle = (domain: string, dayIndex: number) => {

    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    const cellDate = new Date(startOfWeek);
    cellDate.setDate(startOfWeek.getDate() + dayIndex);

    const yyyy = cellDate.getFullYear();
const mm = String(cellDate.getMonth() + 1).padStart(2, "0");
const dd = String(cellDate.getDate()).padStart(2, "0");
const key = `${yyyy}-${mm}-${dd}`;
    setData((prev: any) => {

      const domainData = prev[domain] || {};

      return {
        ...prev,
        [domain]: {
          ...domainData,
          [key]: !domainData?.[key]
        }
      };

    });

  };

  const todayKey = selectedDate;

  const todayCompleted = useMemo(() => {

    let count = 0;

    domains.forEach(d => {

      if (data?.[d.name]?.[todayKey]) count++;

    });

    return count;

  }, [domains, data, todayKey]);

  const todayPercent = domains.length
    ? Math.round((todayCompleted / domains.length) * 100)
    : 0;

  const previousDate = new Date(selectedDate);
  previousDate.setDate(previousDate.getDate() - 1);

const yyyyPrev = previousDate.getFullYear();
const mmPrev = String(previousDate.getMonth() + 1).padStart(2, "0");
const ddPrev = String(previousDate.getDate()).padStart(2, "0");
const prevKey = `${yyyyPrev}-${mmPrev}-${ddPrev}`;

  let prevCompleted = 0;

  domains.forEach((d) => {

    if (data?.[d.name]?.[prevKey]) prevCompleted++;

  });

  const prevPercent = domains.length
    ? Math.round((prevCompleted / domains.length) * 100)
    : 0;

  const diff = todayPercent - prevPercent;

  const streak = useMemo(() => {

    let count = 0;
    let current = new Date();

    while (true) {

      const yyyyCur = current.getFullYear();
const mmCur = String(current.getMonth() + 1).padStart(2, "0");
const ddCur = String(current.getDate()).padStart(2, "0");
const key = `${yyyyCur}-${mmCur}-${ddCur}`;

      let done = 0;

      domains.forEach(d => {

        if (data?.[d.name]?.[key]) done++;

      });

      const percent = domains.length
        ? (done / domains.length) * 100
        : 0;

      if (percent >= 80) {

        count++;
        current.setDate(current.getDate() - 1);

      } else {

        break;

      }

    }

    return count;

  }, [domains, data]);

  // AUTH LOADING SCREEN
  if (authLoading) {

    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );

  }

  // LOGIN SCREEN
if (!user) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
      <button
        onClick={loginWithGoogle}
        className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:scale-105 transition"
      >
        Login with Google
      </button>
    </div>
  );
}

  const getBadge = () => {

    if (streak >= 30) return "🏆 Gold Discipline";
    if (streak >= 14) return "🚀 Silver Consistency";
    if (streak >= 7) return "🔥 Bronze Momentum";

    return null;

  };

  return (
    <>
      <Topbar user={user} />

      <div className="w-full text-whitesmoke">

        <div className="mb-8 flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold text-yellow-400">
              Welcome back {user?.displayName || "Warrior"} 🚀
            </h1>

            <p className="text-gray-400 mt-2">

              {streak > 0 ? (
                <span className="text-yellow-400 font-semibold">
                  {streak} day streak 🔥
                </span>
              ) : (
                <span className="text-gray-500 font-semibold">
                  Start your streak today.🔥
                </span>
              )}

            </p>

            <p className="text-sm text-gray-400 mt-2">
              Viewing: <span className="text-yellow-400">{selectedDate}</span>
            </p>

            <p className="text-sm text-gray-400">

              Compared to previous day:

              <span className={diff >= 0 ? "text-green-400" : "text-red-400"}>

                {" "}
                {diff >= 0 ? "+" : ""}
                {diff}%

              </span>

            </p>

            {getBadge() && (

              <div className="mt-3 px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg inline-block">
                {getBadge()}
              </div>

            )}

            <p
              className="mt-4 font-black uppercase tracking-widest text-sm drop-shadow-lg"
              style={{ color: "#ef4444" }}
            >
              BE HONEST TO YOU !
            </p>

          </div>

        </div>

        <div className="flex gap-3 mb-10">

          <input
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                addDomain();

              }

            }}
            placeholder="Add new domain..."
            className="flex-1 bg-[#1E1E1E] text-white placeholder-gray-400 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            onClick={addDomain}
            className="
              min-w-[300px]
              h-[44px]
              px-6
              rounded-lg
              bg-gradient-to-r from-yellow-400 to-yellow-500
              text-black
              font-semibold
              shadow-lg shadow-yellow-500/20
              border border-yellow-300/40
              transition-all duration-200
              hover:shadow-yellow-400/40
              hover:scale-105
              active:scale-95
              flex items-center justify-center
              hover:-translate-y-0.5
            "
          >
            Add
          </button>

        </div>

        <div className="grid grid-cols-12 gap-8">

          <div className="col-span-8 space-y-12">

            <ProgressRing progress={todayPercent} />

            <TrackerGrid
              domains={domains}
              data={data}
              toggle={toggle}
              deleteDomain={deleteDomain}
            />

            <ChartsSection
              domains={domains}
              data={data}
              selectedDate={selectedDate}
            />

          </div>

          <div className="col-span-4 space-y-6">

            <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 shadow-lg">

              <p className="text-gray-400 text-sm">
                Remaining Domains Today
              </p>

              <p className="text-yellow-400 text-3xl font-bold mt-2">
                {domains.length - todayCompleted}
              </p>

              <p className="text-gray-500 text-xs mt-2">
                Out of {domains.length} total domains
              </p>

            </div>

            <AICoach domains={domains} data={data} />

            <GrowthAI />

            <YearlyHeatmap domains={domains} data={data} />

            <MonthlyCalendar
              domains={domains}
              data={data}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

          </div>

        </div>

      </div>
    </>
  );
}