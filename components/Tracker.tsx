"use client";

import { db } from "../firebase";
import {
  loginWithGoogle,
  logoutUser,
  listenAuth,
} from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const CATEGORY_MAP:any = {
  Health:["run","running","gym","walk","yoga","exercise","workout","sleep"],
  Academics:["study","coding","math","assignment","project","class","lecture"],
  "Self Development":["read","reading","write","writing","journal","meditate","meditation"],
  Productivity:["plan","planning","todo","organize"],
  Finance:["invest","saving","budget"]
};

function categorize(domain:string){
  const d=domain.toLowerCase();
  for(const k in CATEGORY_MAP){
    if(CATEGORY_MAP[k].some((w:string)=>d.includes(w))) return k;
  }
  return "Others";
}

export default function Tracker(){

  const [domains,setDomains]=useState<any[]>([]);
  const [newDomain,setNewDomain]=useState("");
  const [data,setData]=useState<any>({});
  const [user,setUser]=useState<any>(null);
  const [dark,setDark]=useState(false);
  const [loaded,setLoaded]=useState(false);

  // Detect system theme
  useEffect(()=>{
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(prefersDark);
  },[]);

  // Auth listener
  useEffect(()=>{
    listenAuth((u:any)=>{
      setUser(u);
    });
  },[]);

  // Load data
  useEffect(()=>{
    if(!user) return;

    async function load(){
      const snap = await getDoc(doc(db,"users",user.uid));
      if(snap.exists()){
        const saved = snap.data();
        setDomains(saved.domains || []);
        setData(saved.data || {});
      }
      setLoaded(true);
    }

    load();
  },[user]);

  // Save data (only after first load)
  useEffect(()=>{
    if(!user || !loaded) return;

    async function save(){
      await setDoc(doc(db,"users",user.uid),{
        domains,
        data
      });
    }

    save();
  },[domains,data,user,loaded]);

  const toggle=(domain:string,day:number)=>{
    setData((prev:any)=>{
      const week=prev[domain]||Array(7).fill(false);
      const copy=[...week];
      copy[day]=!copy[day];
      return {...prev,[domain]:copy};
    });
  };

  const addDomain=()=>{
    if(!newDomain) return;
    setDomains([...domains,{name:newDomain,cat:categorize(newDomain)}]);
    setNewDomain("");
  };

  const weeklyProgress=useMemo(()=>{
    let total=0,done=0;
    domains.forEach((d:any)=>{
      const arr=data[d.name]||[];
      arr.forEach((v:any)=>{ total++; if(v) done++; });
    });
    return total?Math.round((done/total)*100):0;
  },[domains,data]);

  return (
    <div className={`${dark ? "bg-black text-white" : "bg-gray-100 text-black"} min-h-screen p-6 transition-all`}>

      <div className="max-w-5xl mx-auto bg-opacity-80 backdrop-blur-md rounded-xl p-6 shadow-lg">

        {/* Dark Mode Toggle */}
        <div className="flex justify-between mb-4">
          {!user ? (
            <button onClick={loginWithGoogle} className="bg-blue-500 px-4 py-2 rounded text-white">
              Login with Google
            </button>
          ) : (
            <button onClick={logoutUser} className="bg-red-500 px-4 py-2 rounded text-white">
              Logout
            </button>
          )}

          <button
            onClick={()=>setDark(!dark)}
            className="bg-gray-500 px-4 py-2 rounded text-white"
          >
            Toggle Theme
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">
          Daily Growth Tracker
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            className="border p-2 rounded w-full text-black"
            placeholder="Add Domain"
            value={newDomain}
            onChange={e=>setNewDomain(e.target.value)}
          />
          <button
            className="bg-green-500 px-4 py-2 rounded text-white"
            onClick={addDomain}
          >
            Add
          </button>
        </div>

        <div className="grid grid-cols-8 gap-2 text-center font-semibold mb-3">
          <div>Subject</div>
          {days.map(d=><div key={d}>{d}</div>)}
        </div>

        {domains.map((domain:any)=>(
          <div key={domain.name} className="grid grid-cols-8 gap-2 items-center mb-2">
            <div>
              {domain.name}
              <span className="text-xs opacity-60 ml-1">
                ({domain.cat})
              </span>
            </div>

            {(data[domain.name]||Array(7).fill(false)).map((v:any,i:number)=>(
              <div
                key={i}
                onClick={()=>toggle(domain.name,i)}
                className={`h-8 w-8 mx-auto rounded cursor-pointer 
                ${v ? "bg-green-500" : "bg-red-400"}`}
              />
            ))}
          </div>
        ))}

        <div className="mt-6">
          <p className="font-semibold">
            Weekly Progress: {weeklyProgress}%
          </p>
        </div>

      </div>
    </div>
  );
}