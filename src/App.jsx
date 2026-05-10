import { useState } from "react";
const GOALS = ["Lose Weight", "Build Muscle", "Maintain & Tone", "Improve Endurance", "Bulk Up"];
const DIETS = ["No Restriction", "Vegetarian", "Vegan", "Keto", "Gluten-Free", "Dairy-Free"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const EQUIPMENT = ["No Equipment", "Home Gym", "Full Gym", "Resistance Bands Only"];
const DAYS = ["3 days", "4 days", "5 days", "6 days"];
export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({goal:"",age:25,weight:70,height:170,gender:"Male",diet:"",level:"",equipment:"",days:""});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [done, setDone] = useState(false);
  const generate = async () => {
    setLoading(true);
    const profile = Object.entries(form).map(([k,v]) => k+":"+v).join(" | ");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"You are a nutritionist and personal trainer. Create a 7-day meal plan AND workout schedule for this person: "+profile+". Be detailed and specific.",messages:[{role:"user",content:"Generate my complete plan"}]})});
      const data = await res.json();
      setResult(data.content?.map(b=>b.text||"").join("
")||"");
      setDone(true);
    } catch(e) { setResult("Error. Try again."); setDone(true); }
    setLoading(false);
  };
  return (
    <div style={{minHeight:"100vh",background:"#07070a",color:"#fff",fontFamily:"sans-serif",padding:"24px",maxWidth:"600px",margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:"32px"}}><div style={{fontSize:"48px"}}>🔥</div><h1 style={{color:"#ff6b35",fontSize:"28px"}}>FitGen AI</h1><p style={{color:"#666"}}>AI Meal Plan & Workout Generator</p></div>
        <div>
          {step===0 && <div><h2 style={{marginBottom:"16px"}}>Your Goal?</h2>{GOALS.map(g=><button key={g} onClick={()=>setForm(f=>({...f,goal:g}))} style={{margin:"6px",padding:"10px 20px",borderRadius:"30px",border:"1.5px solid "+(form.goal===g?"#ff6b35":"rgba(255,255,255,0.1)"),background:form.goal===g?"rgba(255,107,53,0.1)":"transparent",color:form.goal===g?"#ff6b35":"#888",cursor:"pointer"}}>{g}</button>)}</div>}
          {step===1 && <div><h2 style={{marginBottom:"16px"}}>Diet Type?</h2>{DIETS.map(d=><button key={d} onClick={()=>setForm(f=>({...f,diet:d}))} style={{margin:"6px",padding:"10px 20px",borderRadius:"30px",border:"1.5px solid "+(form.diet===d?"#ff6b35":"rgba(255,255,255,0.1)"),background:form.diet===d?"rgba(255,107,53,0.1)":"transparent",color:form.diet===d?"#ff6b35":"#888",cursor:"pointer"}}>{d}</button>)}</div>}
          {step===2 && <div><h2 style={{marginBottom:"16px"}}>Fitness Level?</h2>{LEVELS.map(l=><button key={l} onClick={()=>setForm(f=>({...f,level:l}))} style={{margin:"6px",padding:"10px 20px",borderRadius:"30px",border:"1.5px solid "+(form.level===l?"#ff6b35":"rgba(255,255,255,0.1)"),background:form.level===l?"rgba(255,107,53,0.1)":"transparent",color:form.level===l?"#ff6b35":"#888",cursor:"pointer"}}>{l}</button>)}</div>}
          {step===3 && <div><h2 style={{marginBottom:"16px"}}>Equipment?</h2>{EQUIPMENT.map(e=><button key={e} onClick={()=>setForm(f=>({...f,equipment:e}))} style={{margin:"6px",padding:"10px 20px",borderRadius:"30px",border:"1.5px solid "+(form.equipment===e?"#ff6b35":"rgba(255,255,255,0.1)"),background:form.equipment===e?"rgba(255,107,53,0.1)":"transparent",color:form.equipment===e?"#ff6b35":"#888",cursor:"pointer"}}>{e}</button>)}</div>}
          {step===4 && <div><h2 style={{marginBottom:"16px"}}>Training Days?</h2>{DAYS.map(d=><button key={d} onClick={()=>setForm(f=>({...f,days:d}))} style={{margin:"6px",padding:"10px 20px",borderRadius:"30px",border:"1.5px solid "+(form.days===d?"#ff6b35":"rgba(255,255,255,0.1)"),background:form.days===d?"rgba(255,107,53,0.1)":"transparent",color:form.days===d?"#ff6b35":"#888",cursor:"pointer"}}>{d}</button>)}</div>}
          <div style={{display:"flex",gap:"12px",marginTop:"32px"}}>
            {step>0 && <button onClick={()=>setStep(s=>s-1)} style={{padding:"14px 24px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",color:"#666",cursor:"pointer"}}>← Back</button>}
            {step<4 ? <button onClick={()=>setStep(s=>s+1)} style={{flex:1,padding:"14px",background:"#ff6b35",border:"none",borderRadius:"12px",color:"#fff",fontSize:"15px",fontWeight:"700",cursor:"pointer"}}>Continue →</button> : <button onClick={generate} style={{flex:1,padding:"16px",background:"#ff6b35",border:"none",borderRadius:"12px",color:"#fff",fontSize:"16px",fontWeight:"800",cursor:"pointer"}}>⚡ GENERATE MY PLAN</button>}
          </div>
        </div>
      )}
      {loading && <div style={{textAlign:"center",paddingTop:"60px"}}><h2>Building your plan...</h2><p style={{color:"#ff6b35",marginTop:"8px"}}>This takes 15-20 seconds ⏳</p></div>}
    </div>
  );
}