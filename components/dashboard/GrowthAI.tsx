"use client";

import { useState } from "react";

export default function GrowthAI() {

const [messages,setMessages]=useState([
 {role:"ai",text:"Hello. I am Growth AI. Ask anything about your discipline."}
])

const [input,setInput]=useState("")

const send=()=>{

 if(!input.trim()) return

 const newMessages=[...messages,{role:"user",text:input}]

 const reply={
   role:"ai",
   text:"Based on your data, consistency matters. Focus on completing your weakest domain."
 }

 setMessages([...newMessages,reply])
 setInput("")
}

return(

<div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4">

<h3 className="text-yellow-400 font-bold mb-3">
Growth AI
</h3>

<div className="h-48 overflow-y-auto text-sm space-y-2 mb-3">

{messages.map((m,i)=>(
<div key={i}
className={m.role==="ai"?"text-yellow-300":"text-gray-300"}>
{m.text}
</div>
))}

</div>

<div className="flex gap-2">

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Ask Growth AI..."
className="flex-1 bg-black text-white border border-gray-700 rounded px-3 py-2"
/>

<button
onClick={send}
className="bg-yellow-400 text-black px-4 rounded">
Send
</button>

</div>

</div>

)

}