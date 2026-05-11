import { useState } from "react";
const GOALS = ["Lose Weight", "Build Muscle", "Maintain & Tone", "Improve Endurance", "Bulk Up"];
const DIETS = ["No Restriction", "Vegetarian", "Vegan", "Keto", "Gluten-Free", "Dairy-Free"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const EQUIPMENT = ["No Equipment", "Home Gym", "Full Gym", "Resistance Bands Only"];
const DAYS = ["3 days", "4 days", "5 days", "6 days"];
export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({goal:"",diet:"",level:"",equipment:"",days:""});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [done, setDone] = useState(false);
  const generate = async () => {
    setLoading(true);
    const profile = JSON.stringify(form);
    const res = await fetch("https://api.anthropic.com/v1/messages", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"You are a nutritionist and personal trainer. Create a 7-day meal plan AND workout schedule for: "+profile,messages:[{role:"user",content:"Generate my complete fitness plan"}]})});
    const data = await res.json();
    setResult(data.content[0].text);
    setDone(true);
    setLoading(false);
  };
  const opts = [GOALS, DIETS, LEVELS, EQUIPMENT, DAYS];
  const keys = ["goal", "diet", "level", "equipment", "days"];
  const labels = ["Your Goal", "Diet Type", "Fitness Level", "Equipment", "Training Days"];
  return (
    <div style={{minHeight:"100vh",background:"#07070a",color:"#fff",fontFamily:"sans-serif",padding:"24px",maxWidth:"600px",margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:"32px"}}>
        <div style={{fontSize:"48px"}}>🔥</div>
        <h1 style={{color:"#ff6b35",fontSize:"28px"}}>FitGen AI</h1>
        <p style={{color:"#666"}}>AI Meal Plan and Workout Generator</p>
      </div>
      {!done && !loading && (
        <div>
          <h2 style={{marginBottom:"16px"}}>{labels[step]}</h2>
          <div style={{display:"flex",flexWrap:"wrap",gap:"10px",marginBottom:"32px"}}>
            {opts[step].map(o => (
              <button key={o} onClick={() => setForm(f => ({...f,[keys[step]]:o}))} style={{padding:"10px 20px",borderRadius:"30px",border:"1.5px solid "+(form[keys[step]]===o?"#ff6b35":"rgba(255,255,255,0.1)"),background:form[keys[step]]===o?"rgba(255,107,53,0.1)":"transparent",color:form[keys[step]]===o?"#ff6b35":"#888",cursor:"pointer"}}>{o}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:"12px"}}>
            {step > 0 && <button onClick={() => setStep(s => s-1)} style={{padding:"14px 24px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",color:"#666",cursor:"pointer"}}>Back</button>}
            {step < 4 ? <button onClick={() => setStep(s => s+1)} style={{flex:1,padding:"14px",background:"#ff6b35",border:"none",borderRadius:"12px",color:"#fff",fontSize:"15px",fontWeight:"700",cursor:"pointer"}}>Continue</button> : <button onClick={generate} style={{flex:1,padding:"16px",background:"#ff6b35",border:"none",borderRadius:"12px",color:"#fff",fontSize:"16px",fontWeight:"800",cursor:"pointer"}}>Generate My Plan</button>}
          </div>
        </div>
      )}
      {loading && <div style={{textAlign:"center",paddingTop:"60px"}}><h2>Building your plan...</h2><p style={{color:"#ff6b35",marginTop:"8px"}}>This takes 15-20 seconds</p></div>}
      {done && (
        <div>
          <h2 style={{color:"#ff6b35",marginBottom:"16px"}}>Your Plan is Ready!</h2>
          <pre style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,107,53,0.2)",borderRadius:"12px",padding:"16px",whiteSpace:"pre-wrap",color:"#bbb",fontSize:"13px",lineHeight:1.7}}>{result}</pre>
          <button onClick={() => {setDone(false);setStep(0);setResult("");setForm({goal:"",diet:"",level:"",equipment:"",days:""});}} style={{marginTop:"16px",padding:"12px 24px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",color:"#666",cursor:"pointer"}}>New Plan</button>
        </div>
      )}
    </div>
  );
}
