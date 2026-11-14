import {
  checkMission,checkMentalEntry,addMentalEntry,getDaySchedule,explainMental,demoMentalEntries
} from "./mission-mental.mjs";

const el=id=>document.getElementById(id);
const STORE_CONFIG="orbit-m-fictional-mission-plan-v1",STORE_CHECKS="orbit-m-fictional-checkins-v1";
const DEFAULT={durationDays:180,missionDay:13};
let mission=DEFAULT;
try{const raw=JSON.parse(localStorage.getItem(STORE_CONFIG));mission=checkMission(raw);}
catch(_){mission=DEFAULT;}
let checks;
try{
  const raw=JSON.parse(localStorage.getItem(STORE_CHECKS));
  if(!Array.isArray(raw)||raw.length>240)throw Error("Invalid saved examples.");
  checks=raw.map(x=>checkMentalEntry(x,mission));
}catch(_){checks=demoMentalEntries().filter(x=>x.day<=mission.durationDays);}
function create(tag,text,cls){
  const x=document.createElement(tag);if(text!==undefined)x.textContent=String(text);if(cls)x.className=cls;return x;
}
function syncMissionInputs(){
  el("missionForm").elements.namedItem("durationDays").value=mission.durationDays;
  el("missionForm").elements.namedItem("missionDay").value=mission.missionDay;
  el("mentalDay").value=mission.missionDay;el("mentalDay").max=mission.durationDays;
}
function renderPlan(){
  const target=el("missionSummary");target.replaceChildren();
  for(const [label,value] of [
    ["MISSION LENGTH",mission.durationDays+" days"],
    ["CURRENT SIMULATED DAY","Day "+mission.missionDay+" of "+mission.durationDays],
    ["PLANNED CHECK-INS",(mission.durationDays*2).toLocaleString()+" (AM + PM)"],
    ["ADDITIONAL CHECK-INS","As needed"]]){
      const card=create("div",undefined,"mission-stat");
      card.append(create("span",label),create("strong",value));target.append(card);
  }
}
function renderSchedule(){
  const target=el("mentalSchedule");target.replaceChildren();
  const schedule=getDaySchedule(checks,mission.missionDay);
  for(const item of schedule){
    const n=create("div",undefined,"scheduled-slot");
    n.append(create("span",item.slot==="morning"?"☀ Morning":"☾ Evening"));
    n.append(create("strong",item.recorded?"Recorded":"Pending","slot-"+(item.recorded?"done":"pending")));
    target.append(n);
  }
  const extra=checks.filter(x=>x.day===mission.missionDay&&x.slot==="extra").length;
  target.append(create("p","Additional check-ins recorded today: "+extra,"footnote"));
}
function renderHistory(){
  const target=el("mentalHistory");target.replaceChildren();
  if(!checks.length){target.append(create("p","No fictional behavioral check-ins recorded yet.","subtle"));return;}
  for(const item of [...checks].reverse().slice(0,10)){
    const explanation=explainMental(item);
    const row=create("article",undefined,"mental-history-item");
    const head=create("div",undefined,"mental-history-head");
    head.append(create("strong","Day "+item.day+" · "+item.slot.toUpperCase()),create("span",explanation.attention?"DISCUSSION PROMPT":"DEMO LOG","mental-state"+(explanation.attention?" needs-review":"")));
    row.append(head);
    row.append(create("p",
      "Mood "+item.mood+"/5 · Stress "+item.stress+"/5 · Anxiety "+item.anxiety+"/5 · Focus "+item.focus+"/5 · Mental fatigue "+item.fatigue+"/5 · Connection "+item.connection+"/5 · Sleep quality "+item.sleepQuality+"/5 · Motivation "+item.motivation+"/5"));
    row.append(create("p",explanation.title+". "+explanation.message,"mental-explanation"));
    if(explanation.flagged.length)row.append(create("p","Discussion topics: "+explanation.flagged.join("; ")));
    target.append(row);
  }
}
function save(kind,rows){
  try{localStorage.setItem(kind,JSON.stringify(rows));return true;}
  catch(_){return false;}
}
el("missionForm").addEventListener("submit",ev=>{
  ev.preventDefault();
  try{
    mission=checkMission(Object.fromEntries(new FormData(ev.currentTarget)));
    checks=checks.filter(r=>r.day<=mission.durationDays);
    save(STORE_CONFIG,mission);save(STORE_CHECKS,checks);
    syncMissionInputs();renderPlan();renderSchedule();renderHistory();
    el("missionFeedback").textContent="Synthetic mission settings saved in this browser only.";
  }catch(e){el("missionFeedback").textContent=e.message;}
});
el("mentalForm").addEventListener("submit",ev=>{
  ev.preventDefault();
  const feedback=el("mentalFeedback");
  try{
    const form=ev.currentTarget;
    const row=checkMentalEntry(Object.fromEntries(new FormData(form)),mission);
    checks=addMentalEntry(checks,row,mission);
    const saved=save(STORE_CHECKS,checks);
    renderSchedule();renderHistory();
    const reason=explainMental(row);
    feedback.textContent=(saved?"Fictional check-in recorded. ":"Recorded in this tab only; storage unavailable. ")+
      reason.title+". No actual psychological-support request was sent.";
    document.dispatchEvent(new CustomEvent("orbitm:scheduled-checkin",{
      detail:{heartRate:row.heartRate,sleepHours:row.sleepHours,mood:row.mood,temperature:row.temperature,missionDay:row.day,slot:row.slot}
    }));
  }catch(e){feedback.textContent=e.message;}
});
el("mentalReset").addEventListener("click",()=>{
  checks=demoMentalEntries().filter(x=>x.day<=mission.durationDays);
  save(STORE_CHECKS,checks);renderSchedule();renderHistory();
  el("mentalFeedback").textContent="Fictional behavioral history restored.";
});
syncMissionInputs();renderPlan();renderSchedule();renderHistory();