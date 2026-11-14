import {calculateBp,bpBaseline,checkCardioEntry,addCardioEntry,plannedReturn,
  evaluateCardio,gravityReturnMessage,demoCardioHistory,CARDIO_MAX_HISTORY}
  from "./cardiovascular.mjs";

const el=id=>document.getElementById(id);
const K_LOG="orbit-m-fictional-cardiovascular-v1";
const K_RETURN="orbit-m-fictional-gravity-return-v1";
const K_MISSION="orbit-m-fictional-mission-plan-v1";
const FALLBACK_MISSION={durationDays:180,missionDay:13};
const BASELINE=bpBaseline();
function missionConfig(){
  try{
    const r=JSON.parse(localStorage.getItem(K_MISSION));
    const n=Number(r?.durationDays),day=Number(r?.missionDay);
    if(Number.isInteger(n)&&n>=1&&n<=1095&&Number.isInteger(day)&&day>=1&&day<=n)
      return {durationDays:n,missionDay:day};
  }catch(_){}
  return {...FALLBACK_MISSION};
}
let mission=missionConfig(),rows,returnDay=null;
try{
  const raw=JSON.parse(localStorage.getItem(K_LOG));
  if(!Array.isArray(raw)||raw.length>CARDIO_MAX_HISTORY)throw Error("Invalid synthetic history");
  rows=raw.map(x=>checkCardioEntry(x,mission));
}catch(_){rows=demoCardioHistory(mission);}
try{returnDay=plannedReturn(localStorage.getItem(K_RETURN)||"",mission);}
catch(_){returnDay=null;}
function put(id,text){el(id).textContent=String(text);}
function add(tag,text,cls){
  const item=document.createElement(tag);
  if(text!==undefined)item.textContent=String(text);
  if(cls)item.className=cls;
  return item;
}
function fmt(number,precision=1){return Number(number).toFixed(precision);}
function signed(number){
  const n=Number(number);
  return (n>0?"+":"")+fmt(n,1);
}
function linePoints(values,min,max){
  const width=538,left=32,top=30,usable=155;
  if(!values.length)return "";
  return values.map((v,i)=>{
    const x=values.length===1?left+width/2:left+(i/(values.length-1))*width;
    const y=top+(max-min>0?(max-v)/(max-min):.5)*usable;
    return fmt(x,1)+","+fmt(y,1);
  }).join(" ");
}
function graph(){
  const last=rows.slice(-14),pp=last.map(x=>x.pp),map=last.map(x=>x.map);
  const all=[...pp,...map],min=Math.min(...all,BASELINE.pp,BASELINE.map)-8,
    max=Math.max(...all,BASELINE.pp,BASELINE.map)+8;
  el("cardioPpLine").setAttribute("points",linePoints(pp,min,max));
  el("cardioMapLine").setAttribute("points",linePoints(map,min,max));
  put("cardioChartCaption",last.length+" fictional reading(s) · PP / MAP estimate (mmHg)");
}
function renderOutcome(report){
  const root=el("cardioInterpretation");
  root.className="cardio-interpretation"+(report.category==="URGENT"?" is-urgent":report.category==="REVIEW"?" is-review":"");
  root.replaceChildren();
  root.append(add("strong",report.title),add("p",report.reason));
  root.append(add("p","Compared with synthetic preflight: SBP "+signed(report.delta.systolic)+" · DBP "+signed(report.delta.diastolic)+" · PP "+signed(report.delta.pp)+" · estimated MAP "+signed(report.delta.map)+" mmHg"));
  root.append(add("p",report.contextNote),add("p",report.action));
}
function renderHistory(){
  const root=el("cardioHistory");
  root.replaceChildren();
  if(!rows.length){root.append(add("p","No fictional blood-pressure readings recorded.","subtle"));return;}
  for(const row of [...rows].reverse().slice(0,12)){
    const report=evaluateCardio(row,BASELINE);
    const item=add("article",undefined,"cardio-row");
    item.append(add("strong","Day "+row.day+" · "+row.slot.toUpperCase()),
      add("span",row.systolic+"/"+row.diastolic+" mmHg · "+row.context),
      add("span","PP "+fmt(row.pp,0)+" · MAP ≈ "+fmt(row.map,1)));
    const badge=add("span",report.category,"cardio-row-status"+
      (report.category==="URGENT"?" urgent":report.category==="REVIEW"?" review":""));
    item.append(badge);root.append(item);
  }
}
function render(){
  const latest=rows.at(-1),comparison=latest?evaluateCardio(latest,BASELINE):null;
  put("cardioBp",latest?latest.systolic+"/"+latest.diastolic:"—");
  put("cardioPp",latest?fmt(latest.pp,0):"—");
  put("cardioMap",latest?fmt(latest.map,1):"—");
  put("cardioPpChange",comparison?
    "Δ "+signed(comparison.delta.pp)+" mmHg vs fictional median PP "+BASELINE.pp:"Fictional preflight median PP "+BASELINE.pp);
  put("cardioMapChange",comparison?
    "Δ "+signed(comparison.delta.map)+" mmHg vs fictional preflight MAP ≈ "+fmt(BASELINE.map):"Approximation, not direct MAP");
  if(comparison)renderOutcome(comparison);
  else el("cardioInterpretation").replaceChildren(add("p","Add a fictional sample to see a transparent comparison."));
  graph();renderHistory();
  put("cardioReturnMessage",gravityReturnMessage(returnDay,mission.missionDay));
  el("cardioDay").max=mission.durationDays;
  el("cardioReturnDay").max=mission.durationDays;
  el("cardioDay").value=mission.missionDay;
  el("cardioReturnDay").value=returnDay??"";
}
function persist(){
  try{localStorage.setItem(K_LOG,JSON.stringify(rows));return true;}catch(_){return false;}
}
el("cardioForm").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    mission=missionConfig();
    const values=Object.fromEntries(new FormData(event.currentTarget));
    rows=addCardioEntry(rows,values,mission);
    const ok=persist();
    render();
    put("cardioFeedback",ok?"Fictional measurement added to this browser only.":"Measurement added in this tab; persistent storage unavailable.");
  }catch(error){put("cardioFeedback",error.message);}
});
el("cardioReturnForm").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    mission=missionConfig();
    const candidate=plannedReturn(event.currentTarget.elements.namedItem("returnDay").value,mission);
    returnDay=candidate;
    try{
      if(returnDay===null)localStorage.removeItem(K_RETURN);
      else localStorage.setItem(K_RETURN,String(returnDay));
    }catch(_){}
    render();
    put("cardioFeedback","Fictional gravity-return milestone updated. No exercise plan or medical clearance is generated.");
  }catch(error){put("cardioFeedback",error.message);}
});
el("cardioReset").addEventListener("click",()=>{
  mission=missionConfig();rows=demoCardioHistory(mission);
  persist();render();put("cardioFeedback","Fictional cardiovascular examples restored.");
});
document.addEventListener("orbitm:mission-config-changed",event=>{
  const config=event.detail;
  const days=Number(config?.durationDays),today=Number(config?.missionDay);
  if(!Number.isInteger(days)||days<1||!Number.isInteger(today)||today<1||today>days)return;
  mission={durationDays:days,missionDay:today};
  rows=rows.filter(row=>row.day<=days);
  if(returnDay!==null&&returnDay>days){
    returnDay=null;
    try{localStorage.removeItem(K_RETURN);}catch(_){}
  }
  persist();render();
});
render();
