"use client";

import { useState } from "react";
import { logoutUser } from "@/firebase";

export default function Topbar({ user }: any) {

  const [open,setOpen] = useState(false);

  if(!user) return null;

  return (
    <div className="w-full flex items-center justify-end mb-6">

      <div className="relative">

        {/* PROFILE PHOTO */}
        {/* <img
          src={user.photoURL}
          alt="profile"
          onClick={()=>setOpen(!open)}
          className="
            w-9
            h-9
            rounded-full
            cursor-pointer
            border
            border-yellow-400
            hover:scale-105
            transition
          "
        /> */}

        <img
  src={user?.photoURL || "/default-avatar.png"}
  alt="profile"
  className="w-9 h-9 rounded-full border-2 border-yellow-400"
/>

        {/* DROPDOWN */}
        {open && (

          <div className="
            absolute
            right-0
            mt-3
            w-56
            bg-[#1e1e1e]
            border
            border-gray-700
            rounded-xl
            shadow-xl
            overflow-hidden
          ">

            {/* USER INFO */}
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-sm text-white font-semibold">
                {user.displayName}
              </p>

              <p className="text-xs text-gray-400">
                {user.email}
              </p>
            </div>

            {/* MENU */}
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-800 text-sm"
            >
              Profile
            </button>

            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-800 text-sm"
            >
              Reports
            </button>

            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-800 text-sm"
            >
              Switch Account
            </button>

            <button
              onClick={logoutUser}
              className="
                w-full
                text-left
                px-4
                py-2
                text-red-400
                hover:bg-red-500/20
                text-sm
              "
            >
              Logout
            </button>

          </div>

        )}

      </div>

    </div>
  );
}