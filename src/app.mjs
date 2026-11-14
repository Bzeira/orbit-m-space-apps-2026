import {analyze,makeScenario,addEntry} from "./engine.mjs";

const byId = id => document.getElementById(id);
const STORE = "orbit-m-synthetic-demo-2026";
let entries=makeScenario("stable");
let scenario="stable";

try {
  const stored=JSON.parse(localStorage.getItem(STORE));
  if (Array.isArray(stored) && stored.length>=5) {
    analyze(stored);
    entries=stored;
    scenario="custom";
  }
} catch (_) { /* Ignore malformed local demo data. */ }

function put(id,text) { byId(id).textContent=String(text); }
function syncInputs(reading) {
  const form=byId("readingForm");
  for(const field of ["heartRate","sleepHours","mood","temperature"]) form.elements.namedItem(field).value=reading[field];
}
function paintHeartChart(rows) {
  const values=rows.map(e=>e.heartRate);
  const min=Math.min(...values)-5;
  const max=Math.max(...values)+5;
  const diff=max-min||1;
  const points=values.map((v,i)=>{
    const x=20+(i*640/Math.max(1,values.length-1));
    const y=136-((v-min)/diff)*110;
    return x.toFixed(1)+","+y.toFixed(1);
  }).join(" ");
  byId("hrPolyline").setAttribute("points",points);
  byId("hrChart").setAttribute("aria-label","Resting pulse trend over "+values.length+" simulated days. Most recent "+values.at(-1)+" beats per minute.");
}

function showSignals(flags) {
  const parent=byId("alerts");
  parent.replaceChildren();
  if(flags.length===0) {
    const item=document.createElement("p");
    item.className="clear-alert";
    item.textContent="No change flags under our illustrative rules. This does NOT confirm that an astronaut is medically healthy.";
    parent.append(item);
    return;
  }
  for(const flag of flags){
    const article=document.createElement("article");article.className="alert";
    const strong=document.createElement("strong");strong.textContent=flag.title;
    const p=document.createElement("p");p.textContent=flag.detail;
    const a=document.createElement("a");a.textContent="NASA background ↗";
    a.href=flag.source;a.target="_blank";a.rel="noopener";
    article.append(strong,p,a);parent.append(article);
  }
  const note=document.createElement("p");
  note.className="subtle";
  note.textContent="Suggested non-clinical next step: verify measurements, note any symptoms, and consult the appropriate mission medical officer according to established procedures.";
  parent.append(note);
}
function render() {
  const result=analyze(entries);
  const c=result.current,b=result.baseline;
  const needsReview=result.flags.length>0;
  put("statusText",result.status);
  byId("statusText").className="big-status "+(needsReview?"review":"normal");
  put("statusDescription",needsReview?result.flags.length+" illustrative change signal(s). Verify readings; escalate according to mission procedures.":"No flags in this demo rule set. Continue routine checks.");
  put("observations",result.counts.observations+" synthetic daily records");
  put("hrCurrent",c.heartRate);put("hrBase",b.heartRate);
  put("sleepCurrent",c.sleepHours);put("sleepBase",b.sleepHours);
  put("moodCurrent",c.mood);put("moodBase",b.mood);
  put("tempCurrent",c.temperature);put("tempBase",b.temperature);
  showSignals(result.flags);paintHeartChart(entries);
  for(const button of document.querySelectorAll("[data-scenario]"))button.setAttribute("aria-pressed",String(button.dataset.scenario===scenario));
}
for(const button of document.querySelectorAll("[data-scenario]")){
  button.addEventListener("click",()=>{
    scenario=button.dataset.scenario;
    entries=makeScenario(scenario);
    try{localStorage.removeItem(STORE);}catch(_){}
    put("formFeedback","Loaded a new synthetic scenario.");
    syncInputs(entries.at(-1));render();
  });
}
byId("clearBtn").addEventListener("click",()=>{
  scenario="stable";entries=makeScenario("stable");
  try{localStorage.removeItem(STORE);}catch(_){}
  syncInputs(entries.at(-1));
  put("formFeedback","Demo entries reset.");
  render();
});
byId("readingForm").addEventListener("submit",event=>{
  event.preventDefault();
  const form=event.currentTarget;
  try {
    const values=Object.fromEntries(new FormData(form).entries());
    entries=addEntry(entries,values);
    scenario="custom";
    try{localStorage.setItem(STORE,JSON.stringify(entries));}catch(_){}
    put("formFeedback","Added synthetic day "+entries.length+". Stored locally only.");
    syncInputs(entries.at(-1));render();
  } catch(error) {
    put("formFeedback",error.message || "Invalid values.");
  }
});
syncInputs(entries.at(-1));
render();